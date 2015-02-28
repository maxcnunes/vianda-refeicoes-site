FROM node:0.12.0

WORKDIR /src
ADD . /src

RUN npm install --unsafe-perm

EXPOSE 3000

CMD ["node", "/src"]