#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Start the application
#-------------------------------------------------------------------------------
cd $HOME/$JHIPSTER
if [ $RUNTASK == 1 ]; then
  if [ $JHIPSTER != "app-gradle" ]; then
    mvn -P$PROFILE &
    if [ $PROFILE == "dev" ]; then
      sleep 60
    else
      sleep 120
    fi
    # curl --retry 10 --retry-delay 5 -I http://localhost:8080/ | grep "HTTP/1.1 200 OK"
  else
    ./gradlew -P$PROFILE &
    sleep 300
    # curl --retry 10 --retry-delay 5 -I http://localhost:8080/ | grep "HTTP/1.1 200 OK"
  fi
fi

#-------------------------------------------------------------------------------
# Launch protractor tests
#-------------------------------------------------------------------------------
if [ $PROTRACTOR == 1 ]; then
  grunt itest
fi
