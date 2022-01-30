#!/bin/bash

echo "[<>] population pre init"

echo "whoami:"; whoami;
echo "ls -l /home/bin:"; ls -l /home/bin;
echo "mod?:"; stat --format '%a' src/database/populate/init-trigger-population.sh;

# run script 
# - as detached (nohup) to prevent being terminated via parent shell 
# - in background (&) to prevent blocking the container execution
nohup /home/bin/trigger-population.sh &

echo "[<>] population post init"