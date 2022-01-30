#!/bin/bash

echo "[<>] population pre init"

echo "whoami -->:"; whoami;
echo "ls -l /home/bin -->:"; ls -l /home/bin;
echo "[0] mod? -->:"; stat --format '%a' /home/bin/trigger-population.sh;

chmod +x /home/bin/trigger-population.sh;

echo "[1] mod? -->:"; stat --format '%a' /home/bin/trigger-population.sh;

# run script 
# - as detached (nohup) to prevent being terminated via parent shell 
# - in background (&) to prevent blocking the container execution
nohup /home/bin/trigger-population.sh &

echo "[<>] population post init"