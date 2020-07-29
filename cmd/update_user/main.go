package main

import (
	"context"
	"flag"
	"log"
	"time"

	pb "github.com/alitaso345/synchronicity2/proto"
	"google.golang.org/grpc"
)

func main() {
	var id int64
	var name string
	var twitterHashTag string
	var twitchChannel string
	flag.Int64Var(&id, "i", 1, "User ID")
	flag.StringVar(&name, "n", "alitaso346", "User Name")
	flag.StringVar(&twitterHashTag, "h", "#某isNight", "Twitter HashTag")
	flag.StringVar(&twitchChannel, "c", "#bou_is_twitch", "Twitch Channel")
	flag.Parse()

	conn, err := grpc.Dial("localhost:8080", grpc.WithInsecure(), grpc.WithBlock())
	errorHandler(err, "failed connection")
	defer conn.Close()

	client := pb.NewSynchronicityServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	user := pb.User{Id: id, Name: name, TwitterHashTag: twitterHashTag, TwitchChannel: twitchChannel}
	res, err := client.UpdateUser(ctx, &pb.UpdateUserRequest{User: &user})
	errorHandler(err, "failed to create user")

	log.Printf("ID: %d, NAME: %s\n", res.User.Id, res.User.Name)
}

func errorHandler(err error, msg string) {
	if err != nil {
		log.Fatalln(msg)
	}
}
