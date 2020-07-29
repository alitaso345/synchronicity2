package main

import (
	"context"
	pb "github.com/alitaso345/synchronicity2/proto"
	"google.golang.org/grpc"
	"log"
	"time"
)

func main() {
	conn, err := grpc.Dial("localhost:8080", grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Println("failed connection")
		defer conn.Close()
	}

	client := pb.NewSynchronicityServiceClient(conn)

	boys := []string{"Muxek_06E", "zawaziro", "R29_D2", "9c5s", "stepjump_hazumu", "beatrooper", "kehatorunka", "loveimasforever", "cryptpsy", "kazami_akira", "shiriajp", "neri_25", "Crouton_RTLIA", "kicodadada", "alitaso"}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	for _, name := range boys {
		res, err := client.CreateUser(ctx, &pb.NewUserRequest{Name: name})
		if err != nil {
			log.Printf("error: %s\n", name)
		}

		log.Printf("ID: %d, NAME: %s, TWITTER_HASH_TAG: %s, TWITCH_CHANNEL: %s\n", res.User.Id, res.User.Name, res.User.TwitterHashTag, res.User.TwitchChannel)
	}
}