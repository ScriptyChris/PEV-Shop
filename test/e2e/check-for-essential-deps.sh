#!/bin/bash

set -e; # exits on any error and returns non-zero value

uiSeparator="------------------------------"

if [ ! -e "package.json" ]; then
  echo "$uiSeparator";
  echo "Are you trying to run the script from non-root path? If yes, then please go to root path first. 
If you are at the root level and still see this message \
then 'package.json' file may be unavailable, which is also bad news.
  ";
  echo "$uiSeparator";

  false;
fi

returnValue=0;

if [ ! -e "node_modules" ]; then
  echo "$uiSeparator";
  echo "Essential dependency 'node_modules/' not found! Have you ran 'npm ci'?";
  
  returnValue=1;
fi
if [ ! -e "dist" ]; then
  echo "$uiSeparator";
  echo "Essential dependency 'dist/' not found! Have you ran 'npm run build'?";
  
  returnValue=1;
fi

if [ "$returnValue" = 1 ]; then
  echo "$uiSeparator";
  
  false;
fi