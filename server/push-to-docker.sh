#!/bin/bash
if [[ -z $1 ]] ; then
    echo 'Argument 1 must be the docker image tag'
    exit 1
fi

docker build -t lavhe/co-portal:$1 .
docker push lavhe/co-portal:$1