#!/bin/sh

CLIENT_OUTPUT_DIR=client/src/timeline
SERVER_OUTPUT_DIR=server/timeline

mkdir -p ${CLIENT_OUTPUT_DIR} ${SERVER_OUTPUT_DIR}

protoc --proto_path=./proto ./proto/timeline.proto \
       --js_out=import_style=commonjs:${CLIENT_OUTPUT_DIR} \
       --grpc-web_out=import_style=typescript,mode=grpcwebtext:${CLIENT_OUTPUT_DIR} \
       --go_out=plugins=grpc:${SERVER_OUTPUT_DIR}
