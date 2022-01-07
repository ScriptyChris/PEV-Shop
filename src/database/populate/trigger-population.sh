#!/bin/bash

echo "[<>] preparing to trigger population"

call_api() {
  return $(curl -sw '%{http_code}' -o /dev/null http://pev-app:$APP_PORT/api/populate-db)
}

readonly max_attempts=15
readonly sleep_time=1
attempt=1

while [ $attempt -le $max_attempts ]
do
  echo "[<>] Attempt number $attempt to populate database..."
  
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
    echo "[<>] Some error occured during population! API might have logged more info. Exiting..."
    exit 1
  else
    echo "[<>] Population not done yet..."
  fi

  attempt=$(($attempt + 1))
done