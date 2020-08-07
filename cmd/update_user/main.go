package main

import (
	"context"
	"flag"
	"log"
	"os"
	"time"

	pb "github.com/alitaso345/synchronicity2/proto"
	"google.golang.org/grpc"
)

const defaultTarget = "localhost:8080"

func main() {
	var id int64
	var name string
	var twitterHashTag string
	var twitchChannel string
	var textSize string
	var textColor string
	var iconSize string
	flag.Int64Var(&id, "i", 1, "User ID")
	flag.StringVar(&name, "n", "alitaso346", "User Name")
	flag.StringVar(&twitterHashTag, "h", "#某isNight", "Twitter HashTag")
	flag.StringVar(&twitchChannel, "c", "#bou_is_twitch", "Twitch Channel")
	flag.StringVar(&textSize, "ts", "M", "Text Size")
	flag.StringVar(&textColor, "tc", "BLACK", "Text Color")
	flag.StringVar(&iconSize, "is", "BLACK", "Text Color")
	flag.Parse()

	target := defaultTarget
	if len(os.Args) > 1 {
		target = os.Args[1]
	}
	conn, err := grpc.Dial(target, grpc.WithInsecure(), grpc.WithBlock())
	errorHandler(err, "failed connection")
	defer conn.Close()

	client := pb.NewSynchronicityServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	user := pb.User{Id: id, Name: name, TwitterHashTag: twitterHashTag, TwitchChannel: twitchChannel, TextSize: textSize, TextColor: textColor, IconSize: iconSize}
	res, err := client.UpdateUser(ctx, &pb.UpdateUserRequest{User: &user})
	errorHandler(err, "failed to create user")

	log.Printf("ID: %d, NAME: %s\n", res.User.Id, res.User.Name)
}

func errorHandler(err error, msg string) {
	if err != nil {
		log.Fatalln(msg)
	}
}
