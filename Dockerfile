FROM node:21
MAINTAINER  chywoo@gmail.com

RUN mkdir /autobuy.ca
WORKDIR /autobuy.ca/
COPY apiserver/ /autobuy.ca/
RUN npm install

CMD ["npm", "start"]

