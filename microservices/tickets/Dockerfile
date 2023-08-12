FROM node:alpine

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn --production
COPY . .
CMD ["yarn", "dev"]
