FROM node:12-alpine as builder
ENV API_ENDPOINT http://34.82.76.245:8080
WORKDIR /build
COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install
COPY ./client .
RUN yarn build

FROM node:12-alpine
WORKDIR /client
COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install --production
COPY ./client/public/ ./public
COPY ./client/tailwind.config.js ./tailwind.config.js
COPY --from=builder /build/.next ./.next
ENTRYPOINT ["yarn"]
CMD ["start", "-p", "3000"]