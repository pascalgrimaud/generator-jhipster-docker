#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Generate the project with yo jhipster
#-------------------------------------------------------------------------------
mv -f $JHIPSTER_SAMPLES/$JHIPSTER $HOME/
cd $HOME/$JHIPSTER
if [ $GRUNT == 1 ]; then
  rm -Rf $HOME/$JHIPSTER/node_modules/.bin/*gulp*
  rm -Rf $HOME/$JHIPSTER/node_modules/*gulp*
else
  rm -Rf $HOME/$JHIPSTER/node_modules/.bin/*grunt*
  rm -Rf $HOME/$JHIPSTER/node_modules/*grunt*
fi
npm link generator-jhipster
yo jhipster --force --no-insight
yo jhipster-docker default --force --no-insight
ls -al $HOME/$JHIPSTER
ls -al $HOME/$JHIPSTER/node_modules/
ls -al $HOME/$JHIPSTER/node_modules/generator-jhipster/generators/
ls -al $HOME/$JHIPSTER/node_modules/generator-jhipster/generators/entity/
#-------------------------------------------------------------------------------
# Display the docker-compose files
#-------------------------------------------------------------------------------
if [ -a src/main/docker/dev.yml ]; then
  cat src/main/docker/dev.yml
fi
if [ -a src/main/docker/prod.yml ]; then
  cat src/main/docker/prod.yml
fi
