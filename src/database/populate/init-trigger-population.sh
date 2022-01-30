#!/bin/bash

echo "[<>] population pre init"

function run_script_with_shebang_without_execute_permissions_pollutes_argv {
    $(head -n1 $1 | grep -oP '#!\K.+') $1;
}

echo "whoami -->:"; whoami;
echo "ls -l /home/bin -->:"; ls -l /home/bin;
echo "[0] mod? -->:"; stat --format '%a' /home/bin/trigger-population.sh;

chmod +x /home/bin/trigger-population.sh;

echo "[1] mod? -->:"; stat --format '%a' /home/bin/trigger-population.sh;

# run script 
# - as detached (nohup) to prevent being terminated via parent shell 
# - in background (&) to prevent blocking the container execution
##nohup /home/bin/trigger-population.sh &
nohup run_script_with_shebang_without_execute_permissions_pollutes_argv /home/bin/trigger-population.sh &

echo "[<>] population post init"