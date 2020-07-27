package main

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/golang/protobuf/ptypes/empty"
	"log"
	"net"
	"os"
	"time"

	pb "github.com/alitaso345/synchronicity2/proto"
	_ "github.com/mattn/go-sqlite3"
	"google.golang.org/grpc"
	"gopkg.in/gorp.v2"
)

var dbmap *gorp.DbMap

const defaultTwitterHashTag = "#某isNight"
const defaultTwitchChannel = "#bou_is_twitch"

type UserService struct {
	pb.UnimplementedSynchronicityServiceServer
}

func (service *UserService) CreateUser(ctx context.Context, request *pb.NewUserRequest) (*pb.UserResponse, error) {
	new := newUser(request.Name)
	err := dbmap.Insert(&new)
	errorHandler(err, "Insert failed")

	user := pb.User{Id: 1, Name: new.Name, TwitterHashTag: new.TwitterHashTag, TwitchChannel: new.TwitchChannel}
	return &pb.UserResponse{User: &user}, nil
}

func (service *UserService) GetUser(ctx context.Context, request *pb.GetUserRequest) (*pb.UserResponse, error) {
	var user User
	err := dbmap.SelectOne(&user, "select * from users where name = ? order by user_id desc", request.Name)
	errorHandler(err, "SelectOne failed")
	if err != nil {
		log.Printf("Not Found %s", request.Name)
		return &pb.UserResponse{User: nil}, fmt.Errorf("Not Found %s", request.Name)
	}

	pbUser := pb.User{Id: user.Id, Name: user.Name, TwitterHashTag: user.TwitterHashTag, TwitchChannel: user.TwitchChannel}
	return &pb.UserResponse{User: &pbUser}, nil
}

func (service *UserService) GetUsers(ctx context.Context, empty *empty.Empty) (*pb.UsersResponse, error) {
	var users []User
	_, err := dbmap.Select(&users, "select * from users order by user_id")
	errorHandler(err, "Select failed")

	var pbUsers []*pb.User
	for _, u := range users {
		user := pb.User{Id: u.Id, Name: u.Name, TwitterHashTag: u.TwitterHashTag, TwitchChannel: u.TwitchChannel}
		pbUsers = append(pbUsers, &user)
	}
	return &pb.UsersResponse{Users: pbUsers}, nil
}

func (service *UserService) UpdateUser(ctx context.Context, request *pb.UpdateUserRequest) (*pb.UserResponse, error) {
	var user User
	user = User{Id: request.User.Id, Name: request.User.Name, TwitterHashTag: request.User.TwitterHashTag, TwitchChannel: request.User.TwitchChannel}
	_, err := dbmap.Update(&user)
	if err != nil {
		log.Printf("Update failed %s", request.User.Name)
		return &pb.UserResponse{User: nil}, fmt.Errorf("Update failed %s", request.User.Name)
	}

	pbUser := pb.User{Id: user.Id, Name: user.Name, TwitterHashTag: user.TwitterHashTag, TwitchChannel: user.TwitchChannel}
	return &pb.UserResponse{User: &pbUser}, nil
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
	pb.RegisterSynchronicityServiceServer(server, &UserService{})
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
	Created        int64
}

func newUser(name string) User {
	return User{
		Name:           name,
		TwitterHashTag: defaultTwitterHashTag,
		TwitchChannel:  defaultTwitchChannel,
		Created:        time.Now().UnixNano(),
	}
}

func errorHandler(err error, msg string) {
	if err != nil {
		log.Println(err, msg)
	}
}
