#!/bin/bash
if [[ -z $1 ]] ; then
    echo 'Argument 1 must be the docker image tag'
    exit 1
fi

if [[ -z $2 ]] ; then
    echo 'Argument 2 must be the location where the docker file is'
    exit 1
fi

docker build -t lavhe/co-portal:$1 $2
docker push lavhe/co-portal:$1
