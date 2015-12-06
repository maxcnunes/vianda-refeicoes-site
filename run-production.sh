#!/bin/bash

cd
APP="vianda-refeicoes-site"

echo "==> pulling project"
cd $APP
git pull -r

echo "==> building docker image"
docker build -t $APP:latest .

echo "==> installing node dependencies"
docker run --rm -v $(pwd):/src $APP:latest npm install


echo "==> removing previous running container"
if docker ps -a | grep --quiet "vianda-refeicoes-site" ; then
  docker rm -f $APP
fi

echo "==> starting container"
docker run \
    --restart=always \
    -d \
    --name $APP \
    -v $(pwd):/src  \
    -v /data/$APP/certs:/src/certs  \
    -e SPREADSHEET_ID \
    -e WORKSHEET_ID \
    -e OAUTH_EMAIL \
    -e OAUTH_KEYFILE \
    -e VIRTUAL_HOST="viandarefeicoes.com.br,www.viandarefeicoes.com.br" \
    -e VIRTUAL_PORT="3000"  \
    -p 3000  \
    $APP:latest

echo "==> finished"
