#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Install yeoman, bower, grunt and gulp
#-------------------------------------------------------------------------------
npm install -g yo
npm install -g bower
npm install -g grunt-cli
npm install -g gulp
#-------------------------------------------------------------------------------
# Install the latest version of generator-jhipster
#-------------------------------------------------------------------------------
cd $HOME/
git clone https://github.com/jhipster/generator-jhipster.git
cd generator-jhipster/
npm install . -g
#-------------------------------------------------------------------------------
# Install the latest version of generator-jhipster-docker
#-------------------------------------------------------------------------------
cd $TRAVIS_BUILD_DIR/
npm install
npm link
npm link generator-jhipster
npm test
