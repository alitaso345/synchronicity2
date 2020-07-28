FROM golang:1.14 as builder
ENV GO11MODULE=on
WORKDIR /app
COPY . .
RUN go get github.com/pilu/fresh
WORKDIR /app/server
CMD ["fresh"]
EXPOSE 9000