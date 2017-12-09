#!/bin/bash

wget https://github.com/dulibanarkadiusz/eLaborant/archive/master.zip

unzip master.zip
rm master.zip

cd eLaborant-master

docker stop elaborant
docker rm elaborant
npm install
docker build -t elaborant . 

cd ..
rm -R eLaborant-master

docker run -p 8080:80 -d --name elaborant elaborant
