#!/bin/bash
errcho() { printf "%s\n" "$*" >&2; }

if ! [ -x "$(command -v npm)" ]
then
  errcho "npm not found"
  exit 1
fi

if $! [ -x "(command -v docker)" ]
then
  errcho "docker not found"
  exit 2
fi

if $! [ -x "(command -v docker-compose)" ]
then
  errcho "docker-compose not found"
  exit 3
fi

echo "building JS"
npm run build > /dev/null

if [ $? -ne 0 ]
then
  (>&2 echo "Failed to build: \n$ERR")
  exit 4
fi

echo "building docker image"
docker build -t ging0044/shorturl . > /dev/null

if [ $? -ne 0 ]
then
  (>&2 echo "Failed to build: \n$ERR")
  exit 5
fi

echo "updating docker-compose"
docker-compose up -d > /dev/null

if [ $? -ne 0 ]
then
  (>&2 echo "Failed to build: \n$ERR")
  exit 6
fi

echo "done"
exit 0
