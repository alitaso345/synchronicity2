package main

import (
	"context"
	"log"
	"os"
	"time"

	pb "github.com/alitaso345/synchronicity2/proto"
	"google.golang.org/grpc"
)

const (
	defaultName = "alitaso345"
	defaultTarget = "localhost:8080"
)

func main() {
	target := defaultTarget
	if len(os.Args) > 1 {
		target = os.Args[1]
	}
	conn, err := grpc.Dial(target, grpc.WithInsecure(), grpc.WithBlock())
	errorHandler(err, "failed connection")
	defer conn.Close()

	client := pb.NewSynchronicityServiceClient(conn)

	name := defaultName
	if len(os.Args) > 1 {
		name = os.Args[1]
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	res, err := client.CreateUser(ctx, &pb.NewUserRequest{Name: name})
	errorHandler(err, "failed to create user")

	log.Printf("ID: %d, NAME: %s, TWITTER_HASH_TAG: %s, TWITCH_CHANNEL: %s\n", res.User.Id, res.User.Name, res.User.TwitterHashTag, res.User.TwitchChannel)
}

func errorHandler(err error, msg string) {
	if err != nil {
		log.Fatalln(msg)
	}
}
