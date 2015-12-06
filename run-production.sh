#!/bin/bash

cd
APP="vianda-refeicoes-site"
if [[ -d "$APP" ]]; then
  echo "==> pulling project"
  cd $APP
  git pull -r
else
  echo "==> cloning project"
  git clone https://github.com/maxcnunes/$APP.git
  cd $APP
fi

echo "==> building docker image"
docker build -t $APP:latest .

echo "==> installing node dependencies"
docker run --rm $APP:latest npm install


echo "==> removing previous running container"
if /usr/bin/docker ps -a | grep --quiet "vianda-refeicoes-site" ; then
  /usr/bin/docker rm -f $APP
fi

echo "==> starting container"
docker run \
    --restart=always \
    -d \
    --name $APP \
    -v $(pwd):/src  \
    -v /data/$APP/certs:/src/certs  \
    -e SPREADSHEET_ID="xxxxx" \
    -e WORKSHEET_ID="xxxxx" \
    -e OAUTH_EMAIL="xxxxx" \
    -e OAUTH_KEYFILE="xxxxx" \
    -e VIRTUAL_HOST="viandarefeicoes.com.br,www.viandarefeicoes.com.br" \
    -e VIRTUAL_PORT="3000"  \
    -p 3000  \
    $APP:latest

echo "==> finished"
cd -
