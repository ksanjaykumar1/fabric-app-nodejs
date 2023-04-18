FROM node:16.13-slim as base

WORKDIR /app

RUN apt-get update && apt-get install -y vim 


COPY ["package.json", "package-lock.json*", "./"]

FROM base as development

RUN npm install

COPY ./ .

CMD ["npm", "start" ]