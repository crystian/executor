# This dockerfile was written in order by layers, try to don't change the order

FROM node:8.11-alpine AS base

# Linux setup
RUN apk update \
  && apk add --update --no-cache alpine-sdk curl \
  && apk del alpine-sdk \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache verify \
  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd

# variables
ENV HOME=/home/node \
	MAIN_FOLDER=/usr/src \
	NPM_CONFIG_PREFIX=$HOME/npm-global \
	PATH=$PATH:$HOME/npm-global/bin

WORKDIR $MAIN_FOLDER

# main folder and cache
RUN mkdir $MAIN_FOLDER -p \
	&& npm c set cache $HOME/npm-cache -g

COPY ./ ./source
COPY ./test/fixture ./test

RUN cd source && \
		npm pack && \
		mv executor*.tgz e.tgz && \
		npm i -g e.tgz && \
		mv /npm-global/bin/e.js /npm-global/bin/e
