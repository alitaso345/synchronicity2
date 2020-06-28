FROM golang:1.14 as builder

ENV GO111MODULE=on

WORKDIR /app

COPY server/ ./
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -mod=readonly -v -o server

FROM alpine:3
RUN apk add --no-cache ca-certificates

COPY --from=builder /app/server /server

CMD ["/server"]
EXPOSE 9090