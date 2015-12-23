#!/bin/bash
set -ev
#--------------------------------------------------
# Install docker-compose
#--------------------------------------------------
curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` > docker-compose
sudo mv docker-compose /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
#-------------------------------------------------------------------------------
# Install yeoman, bower, grunt and gulp
#-------------------------------------------------------------------------------
npm install -g yo
npm install -g bower
npm install -g grunt-cli
npm install -g gulp
npm install -g generator-jhipster
#-------------------------------------------------------------------------------
# Install the latest version of generator-jhipster-docker
#-------------------------------------------------------------------------------
cd $TRAVIS_BUILD_DIR/
npm install
npm link
