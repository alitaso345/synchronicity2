SHELL := /bin/bash

.PHONY: generate-go
generate-go:
	protoc -I./proto/ ./proto/synchronicity.proto --go_out=plugins=grpc:./proto

.PHONY: generate-ts
generate-ts:
	protoc -I./proto/ ./proto/synchronicity.proto --js_out=import_style=commonjs:./proto \
		   --grpc-web_out=import_style=typescript,mode=grpcwebtext:./proto
	cp ./proto/*.js ./client/proto/
	cp ./proto/*.ts ./client/proto/

VERSION = latest

.PHONY: deploy-client
deploy-client:
	docker build --file=./docker/client.Dockerfile --tag=gcr.io/synchronicity2/synchronicity2-client:${VERSION} .;\
	docker push gcr.io/synchronicity2/synchronicity2-client:${VERSION};\
	kubectl set image deployment/client client=gcr.io/synchronicity2/synchronicity2-client:${VERSION};

.PHONY: deploy-server
deploy-server:
	docker build --file=./docker/server.Dockerfile --tag=gcr.io/synchronicity2/synchronicity2-server:${VERSION} .;\
	docker push gcr.io/synchronicity2/synchronicity2-server:${VERSION};\
	kubectl set image deployment/server server=gcr.io/synchronicity2/synchronicity2-server:${VERSION};