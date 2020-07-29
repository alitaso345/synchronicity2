package main

import (
	"context"
	"log"
	"os"
	"time"

	pb "github.com/alitaso345/synchronicity2/proto"
	"google.golang.org/grpc"
)

func main() {
	conn, err := grpc.Dial("localhost:8080", grpc.WithInsecure(), grpc.WithBlock())
	errorHandler(err, "failed connection")
	defer conn.Close()

	client := pb.NewSynchronicityServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	if len(os.Args) < 2 {
		log.Fatalln("Input user name")
	}
	name := os.Args[1]
	res, err := client.GetUser(ctx, &pb.GetUserRequest{Name: name})
	errorHandler(err, "failed to create user")

	log.Printf("ID: %d, NAME: %s, TWITTER_HASH_TAG: %s, TWITCH_CHANNEL: %s\n", res.User.Id, res.User.Name, res.User.TwitterHashTag, res.User.TwitchChannel)

}

func errorHandler(err error, msg string) {
	if err != nil {
		log.Fatalln(msg)
	}
}
