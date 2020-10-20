#!/bin/bash

set -o errexit
set -o pipefail

USERNAME="devuser"
PASSWORD="devpassword"
PORT=5432
DB_NAME="ryd_issues"
CONTAINER_NAME="ryd-issues-api-dev-postgres"

EXISTING_CONTAINER_ID="$(docker ps -aqf "name=${CONTAINER_NAME}")"

if [ -n "${EXISTING_CONTAINER_ID}" ]; then
  echo "Dev DB already running (Docker container ID ${EXISTING_CONTAINER_ID}). Please stop it via
npm run devdb:stop"
  exit 1
fi

CONTAINER_ID="$(docker run --name $CONTAINER_NAME -e PGPASSWORD=${PASSWORD} -e POSTGRES_USER=${USERNAME} -e POSTGRES_PASSWORD=${PASSWORD} -e POSTGRES_DB=${DB_NAME} -p ${PORT}:5432 -d postgres)"

echo "Dev DB running:
port ${PORT}
username: ${USERNAME}
password: ${PASSWORD}

you can connect via:

PGPASSWORD=${PASSWORD} psql -hlocalhost -p${PORT} -U${USERNAME} ${DB_NAME}
"
