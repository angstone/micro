#!/bin/bash

EVENT_STORE_SERVER_NAME="microservice-eventstore-test-server"

if [ ! "$(docker ps -q -f name=$EVENT_STORE_SERVER_NAME)" ]; then
  echo "{ \"status\":\"NOT RUNNING\" }"
else
  echo "{ \"status\":\"RUNNING\" }"
fi
