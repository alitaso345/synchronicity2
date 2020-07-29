FROM node:12 as builder

WORKDIR /client
COPY ./client .
RUN yarn install
RUN yarn build
ENTRYPOINT ["yarn"]
CMD ["start", "-p", "3000"]