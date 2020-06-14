package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"

	irc "github.com/thoj/go-ircevent"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"github.com/kelseyhightower/envconfig"

	pb "github.com/alitaso345/synchronicity2/server/timeline"
	"google.golang.org/grpc"
)

const serverssl = "irc.chat.twitch.tv:6697"

type TwitterConfig struct {
	ConsumerKey       string `envconfig:"CONSUMER_KEY"`
	ConsumerSecret    string `envconfig:"CONSUMER_SECRET"`
	AccessToken       string `envconfig:"ACCESS_TOKEN"`
	AccessTokenSecret string `envconfig:"ACCESS_TOKEN_SECRET"`
}

type TwitchConfig struct {
	Nick     string
	Password string
}

type timelineService struct{}

func (s *timelineService) Connect(req *pb.Setting, stream pb.Timeline_ConnectServer) error {
	twitterDone := make(chan interface{})
	defer close(twitterDone)
	twitterCh := generateTwitterCh(twitterDone, req)

	twitchDone := make(chan interface{})
	defer close(twitchDone)
	twitchCh := generateTwitchCh(twitchDone, req)

loop:
	for {
		select {
		case tweet := <-twitterCh:
			err := stream.Send(&pb.Comment{Name: tweet.User.ScreenName, Message: tweet.Text, PlatformType: pb.PlatformType_TWITTER})
			if err != nil {
				log.Println("twitter stream error")
				break loop
			}
		case chat := <-twitchCh:
			err := stream.Send(&pb.Comment{Name: chat.User, Message: chat.Arguments[1], PlatformType: pb.PlatformType_TWITCH})
			if err != nil {
				log.Println("twitch stream error")
				break loop
			}
		}
	}

	log.Println("disconnection...")
	return nil
}

func generateTwitterCh(done <-chan interface{}, req *pb.Setting) <-chan *twitter.Tweet {
	log.Println("new twitter connection...")
	ch := make(chan *twitter.Tweet)
	go func() {
		defer func() {
			log.Println("close twitter ch")
			close(ch)
		}()
		var c TwitterConfig
		envconfig.Process("TWITTER", &c)
		config := oauth1.NewConfig(c.ConsumerKey, c.ConsumerSecret)
		token := oauth1.NewToken(c.AccessToken, c.AccessTokenSecret)
		httpClient := config.Client(oauth1.NoContext, token)

		client := twitter.NewClient(httpClient)

		demux := twitter.NewSwitchDemux()
		demux.Tweet = func(tweet *twitter.Tweet) {
			if tweet.RetweetedStatus != nil {
				return
			}
			fmt.Println(fmt.Sprintf("%s\n", tweet.Text))
			ch <- tweet
		}

		filterParams := &twitter.StreamFilterParams{Track: []string{req.GetHashTag()}}
		twitterStream, err := client.Streams.Filter(filterParams)
		if err != nil {
			log.Fatalf("can not connect to twitter: %s", err)
		}
		defer twitterStream.Stop()

		go demux.HandleChan(twitterStream.Messages)
		<-done
		return
	}()

	return ch
}

func generateTwitchCh(done <-chan interface{}, req *pb.Setting) <-chan *irc.Event {
	ch := make(chan *irc.Event)
	go func() {
		defer func() {
			log.Println("close twitch ch")
			close(ch)
		}()

		var config TwitchConfig
		envconfig.Process("TWITCH", &config)

		nick := config.Nick
		con := irc.IRC(nick, nick)

		con.Password = config.Password
		con.UseTLS = true
		con.TLSConfig = &tls.Config{InsecureSkipVerify: true}

		con.AddCallback("001", func(e *irc.Event) { con.Join(req.ChannelName) })
		con.AddCallback("PRIVMSG", func(e *irc.Event) {
			fmt.Println(fmt.Sprintf("%s\n", e.Message()))
			ch <- e
		})
		err := con.Connect(serverssl)
		if err != nil {
			log.Fatalf("can not connect to twitch: %s", err)
		}
		defer con.Disconnect()

		go con.Loop()
		<-done
		return
	}()

	return ch
}

func main() {
	port := ":9090"
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen port %v", port)
	}
	server := grpc.NewServer()
	pb.RegisterTimelineServer(server, &timelineService{})
	log.Printf("start server on port %s\n", port)
	server.Serve(lis)
}
