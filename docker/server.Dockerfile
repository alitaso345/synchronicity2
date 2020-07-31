FROM golang:1.14 as builder
ENV GO11MODULE=on
WORKDIR /app
COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix netgo --ldflags '-extldflags "-static"' -v -o user-server server/main.go

FROM alpine:3
COPY --from=builder /app/user-server ./server/
COPY --from=builder /app/server/user_db.bin ./server/

WORKDIR ./server/
ENTRYPOINT ["./user-server"]
EXPOSE 9000