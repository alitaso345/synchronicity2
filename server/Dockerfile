FROM golang:1.14

ENV GO111MODULE=on

WORKDIR /go/src/github.com/alitaso345/synchronicity2/server
COPY . .
RUN go get github.com/pilu/fresh
CMD ["fresh"]
EXPOSE 9090