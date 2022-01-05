#!/bin/bash

echo "[<>] population pre init"

# run script 
# - as detached (nohup) to prevent being terminated via parent shell 
# - in background (&) to prevent blocking the container execution
nohup /home/bin/trigger-population.sh &

echo "[<>] population post init"