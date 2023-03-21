#!/bin/bash

echo "[<>] Preparing to trigger population via API through port: $APP_PORT"

call_api() {
  return $(curl -sw '%{http_code}' -o /dev/null http://pev-app:$APP_PORT/api/config/populate-db)
}

readonly max_attempts=30
readonly sleep_time=1
attempt=1

while [ true ]
do
  echo "[<>] Attempt number $attempt (out of $max_attempts) to populate database..."
  
  sleep $sleep_time
  call_api
  api_response_code=$?

  echo "[<>] Population response at attempt $attempt: $api_response_code"

  if [ $api_response_code -eq 204 ]
  then
    echo "[<>] Completed database population!"
    break
  elif [ $api_response_code -ge 300 ]
  then
    echo "[<>] Some error occured during population! API might have logged more info! Exiting."
    exit 1
  else
    echo "[<>] Population not done yet..."
  fi

  if [ $attempt -ge $max_attempts ]
  then
    echo "[<>] Reached population maximum attempts $max_attempts without success! Exiting."
    exit 1
  fi
  
  attempt=$(($attempt + 1))
done