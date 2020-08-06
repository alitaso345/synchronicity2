package main

import (
	"context"
	"crypto/tls"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	"github.com/golang/protobuf/ptypes/empty"

	irc "github.com/thoj/go-ircevent"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"github.com/kelseyhightower/envconfig"

	pb "github.com/alitaso345/synchronicity2/proto"
	_ "github.com/mattn/go-sqlite3"
	"google.golang.org/grpc"
	"gopkg.in/gorp.v2"
)

var dbmap *gorp.DbMap

const defaultTwitterHashTag = "#某isNight"
const defaultTwitchChannel = "#bou_is_twitch"
const defaultTextSize Size = M
const defaultTextColor Color = BLACK
const defaultIconSize Size = M

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

type Size int

const (
	XS Size = iota
	S
	M
	L
	XL
	XXL
)

func (s Size) String() string {
	switch s {
	case XS:
		return "XS"
	case S:
		return "S"
	case M:
		return "M"
	case L:
		return "L"
	case XL:
		return "XL"
	case XXL:
		return "XXL"
	default:
		return "M"
	}
}

func ToSize(s string) Size {
	switch s {
	case "XS":
		return XS
	case "S":
		return S
	case "M":
		return M
	case "L":
		return L
	case "XL":
		return XL
	case "XXL":
		return XXL
	default:
		return M
	}
}

type Color int

const (
	BLACK Color = iota
	WHITE
	GRAY
	RED
	ORANGE
	YELLOW
	GREEN
	TEAL
	BLUE
	INDIGO
	PURPLE
	PINK
)

func (c Color) String() string {
	switch c {
	case BLACK:
		return "BLACK"
	case WHITE:
		return "WHITE"
	case GRAY:
		return "GRAY"
	case RED:
		return "RED"
	case ORANGE:
		return "ORANGE"
	case YELLOW:
		return "YELLOW"
	case GREEN:
		return "GREEN"
	case TEAL:
		return "TEAL"
	case BLUE:
		return "BLUE"
	case INDIGO:
		return "INDIGO"
	case PURPLE:
		return "PURPLE"
	case PINK:
		return "PINK"
	default:
		return "BLACK"
	}
}

type SynchronicityService struct {
	pb.UnimplementedSynchronicityServiceServer
}

func (service *SynchronicityService) CreateUser(ctx context.Context, request *pb.NewUserRequest) (*pb.UserResponse, error) {
	new := newUser(request.Name)
	err := dbmap.Insert(&new)
	errorHandler(err, "Insert failed")

	user := pb.User{Id: new.Id, Name: new.Name, TwitterHashTag: new.TwitterHashTag, TwitchChannel: new.TwitchChannel, TextSize: new.TextSize, TextColor: new.TextColor, IconSize: new.IconSize}
	return &pb.UserResponse{User: &user}, nil
}

func (service *SynchronicityService) GetUser(ctx context.Context, request *pb.GetUserRequest) (*pb.UserResponse, error) {
	var user User
	err := dbmap.SelectOne(&user, "select * from users where name = ? order by user_id desc", request.Name)
	errorHandler(err, "SelectOne failed")
	if err != nil {
		log.Printf("Not Found %s", request.Name)
		return &pb.UserResponse{User: nil}, fmt.Errorf("Not Found %s", request.Name)
	}

	pbUser := pb.User{Id: user.Id, Name: user.Name, TwitterHashTag: user.TwitterHashTag, TwitchChannel: user.TwitchChannel, TextSize: user.TextSize, TextColor: user.TextColor, IconSize: user.IconSize}
	return &pb.UserResponse{User: &pbUser}, nil
}

func (service *SynchronicityService) GetUsers(ctx context.Context, empty *empty.Empty) (*pb.UsersResponse, error) {
	var users []User
	_, err := dbmap.Select(&users, "select * from users order by user_id")
	errorHandler(err, "Select failed")

	var pbUsers []*pb.User
	for _, u := range users {
		user := pb.User{Id: u.Id, Name: u.Name, TwitterHashTag: u.TwitterHashTag, TwitchChannel: u.TwitchChannel, TextSize: u.TextSize, TextColor: u.TextColor, IconSize: u.IconSize}
		pbUsers = append(pbUsers, &user)
	}
	return &pb.UsersResponse{Users: pbUsers}, nil
}

func (service *SynchronicityService) UpdateUser(ctx context.Context, request *pb.UpdateUserRequest) (*pb.UserResponse, error) {
	var user User
	user = User{
		Id:             request.User.Id,
		Name:           request.User.Name,
		TwitterHashTag: request.User.TwitterHashTag,
		TwitchChannel:  request.User.TwitchChannel,
		TextSize:       request.User.TextSize,
		TextColor:      request.User.TextColor,
		IconSize:       request.User.IconSize,
	}
	_, err := dbmap.Update(&user)
	if err != nil {
		log.Printf("Update failed %s", request.User.Name)
		return &pb.UserResponse{User: nil}, fmt.Errorf("Update failed %s", request.User.Name)
	}

	pbUser := pb.User{Id: user.Id, Name: user.Name, TwitterHashTag: user.TwitterHashTag, TwitchChannel: user.TwitchChannel, TextSize: user.TextSize, TextColor: user.TextColor, IconSize: user.IconSize}
	return &pb.UserResponse{User: &pbUser}, nil
}

func (service *SynchronicityService) GetTimeline(req *pb.GetTimelineRequest, stream pb.SynchronicityService_GetTimelineServer) error {
	done := make(chan interface{})
	defer close(done)

	var user User
	err := dbmap.SelectOne(&user, "select * from users where name = ? order by user_id desc", req.UserName)
	if err != nil {
		log.Printf("err: %v\nGet timeline faild for %s\n", err, req.UserName)
		return fmt.Errorf("Get timeline faild for %s\n", req.UserName)
	}
	twitterCh := generateTwitterCh(done, user.TwitterHashTag)
	twitchCh := generateTwitchCh(done, user.TwitchChannel)

	ctx := stream.Context()

loop:
	for {
		select {
		case <-ctx.Done():
			log.Println("done!!!")
			break loop
		case tweet := <-twitterCh:
			err := stream.Send(&pb.TimelineResponse{Name: tweet.User.ScreenName, Message: tweet.Text, PlatformType: pb.PlatformType_TWITTER})
			if err != nil {
				log.Println("send twitter stream error")

			}
		case chat := <-twitchCh:
			err := stream.Send(&pb.TimelineResponse{Name: chat.User, Message: chat.Arguments[1], PlatformType: pb.PlatformType_TWITCH})
			if err != nil {
				log.Println("send twitch stream error")
			}
		}
	}

	log.Println("disconnection...")
	return nil
}

func generateTwitterCh(done <-chan interface{}, twitterHashTag string) <-chan *twitter.Tweet {
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
			ch <- tweet
		}

		filterParams := &twitter.StreamFilterParams{Track: []string{twitterHashTag}}
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

func generateTwitchCh(done <-chan interface{}, twitchChannel string) <-chan *irc.Event {
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

		con.AddCallback("001", func(e *irc.Event) { con.Join(twitchChannel) })
		con.AddCallback("PRIVMSG", func(e *irc.Event) {
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
	log.Println("start server...")
	dbmap = initDb()
	defer dbmap.Db.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = "9000"
	}
	lis, err := net.Listen("tcp", ":"+port)
	errorHandler(err, "failed to listen")

	server := grpc.NewServer()
	pb.RegisterSynchronicityServiceServer(server, &SynchronicityService{})
	err = server.Serve(lis)
	errorHandler(err, "failed to serve")
}

func initDb() *gorp.DbMap {
	db, err := sql.Open("sqlite3", "./user_db.bin")
	errorHandler(err, "sql.Open failed")

	dbmap := &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}
	dbmap.AddTableWithName(User{}, "users").SetKeys(true, "Id")
	err = dbmap.CreateTablesIfNotExists()
	errorHandler(err, "Crate table failed")

	return dbmap
}

type User struct {
	Id             int64  `db:"user_id"`
	Name           string `db:",size:50"`
	TwitterHashTag string `db:",size:50"`
	TwitchChannel  string `db:",size:50"`
	TextSize       string
	TextColor      string
	IconSize       string
	Created        int64
}

func newUser(name string) User {
	return User{
		Name:           name,
		TwitterHashTag: defaultTwitterHashTag,
		TwitchChannel:  defaultTwitchChannel,
		TextSize:       defaultTextSize.String(),
		TextColor:      defaultTextColor.String(),
		IconSize:       defaultIconSize.String(),
		Created:        time.Now().UnixNano(),
	}
}

func errorHandler(err error, msg string) {
	if err != nil {
		log.Println(err, msg)
	}
}
