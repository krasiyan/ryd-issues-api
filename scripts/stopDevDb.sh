#!/bin/bash

set -o errexit
set -o pipefail

CONTAINER_NAME="ryd-issues-api-dev-postgres"
EXISTING_CONTAINER_ID="$(docker ps -aqf "name=${CONTAINER_NAME}")"

if [ -z "${EXISTING_CONTAINER_ID}" ]; then
  echo "Dev DB not running. Please start it with npm run devdb:start"
  exit 1
fi

docker rm $(docker stop ${EXISTING_CONTAINER_ID}) > /dev/null
echo "Stopped dev DB (Docker container ID ${EXISTING_CONTAINER_ID}). You can start it again via npm run devdb:start"
