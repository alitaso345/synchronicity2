FROM node:12 as builder

WORKDIR /client/
COPY . .
RUN yarn install
RUN yarn build

FROM python:2.7
WORKDIR /client/
COPY --from=builder /client/dist/ ./
COPY --from=builder /client/putlic/ ./
ENTRYPOINT [ "python" ]
CMD [ "-m", "SimpleHTTPServer", "3000" ]
EXPOSE 3000