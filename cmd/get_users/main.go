package main

import (
	"context"
	"log"
	"os"
	"time"

	pb "github.com/alitaso345/synchronicity2/proto"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
)

const defaultTarget = "localhost:8080"

func main() {
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
	res, err := client.GetUsers(ctx, &empty.Empty{})
	errorHandler(err, "failed to create user")

	for _, user := range res.Users {
		log.Printf(
			"ID: %d, NAME: %s, TWITTER_HASH_TAG: %s, TWITCH_CHANNEL: %s, TEXT_SIZE: %s, TEXT_COLOR: %s, ICON_SIZE: %s\n",
			user.Id, user.Name, user.TwitterHashTag, user.TwitchChannel, user.TextSize, user.TextColor, user.IconSize,
		)
	}
}

func errorHandler(err error, msg string) {
	if err != nil {
		log.Fatalln(msg)
	}
}
