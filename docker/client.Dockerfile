FROM node:12 as builder

WORKDIR /client/
COPY client/ ./
RUN yarn install
RUN yarn build

FROM python:2.7
WORKDIR /client/
COPY --from=builder /client/dist/ ./
ENTRYPOINT [ "python" ]
CMD [ "-m", "SimpleHTTPServer", "3000" ]
EXPOSE 3000