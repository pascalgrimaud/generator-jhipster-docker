'use strict';
var util = require('util');
var path = require('path');
var fse = require('fs-extra');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var deps = [
  [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator Docker: docker-compose with configuration:', function () {
  describe('h2/mysql 5.7.9, sonar 4.5.6', function () {
    before(function (done) {
      helpers
      .run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/01-h2-mysql'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '5.7.9',
        dockerVersionSonar: '4.5.6',
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml, prod.yml', function () {
      assert.file([
        'src/main/docker/sonar.yml',
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
      assert.fileContent('src/main/docker/prod.yml','mysql:5.7.9');
    });
  });

  describe('mysql/mysql 5.7.10, sonar latest', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/02-mysql-mysql'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '5.7.10',
        dockerVersionSonar: 'latest',
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml, dev.yml, prod.yml', function () {
      assert.file([
        'src/main/docker/sonar.yml',
        'src/main/docker/dev.yml',
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:latest');
      assert.fileContent('src/main/docker/dev.yml','mysql:5.7.10');
      assert.fileContent('src/main/docker/prod.yml','mysql:5.7.10');
    });
  });

  describe('h2/psql 9.3.10', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/03-h2-psql'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '9.3.10',
        dockerVersionSonar: '4.5.6',
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml, prod.yml', function () {
      assert.file([
        'src/main/docker/sonar.yml',
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
      assert.fileContent('src/main/docker/prod.yml','postgres:9.3.10');
    });
  });

  describe('psql/psql 9.4.5', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/04-psql-psql'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '9.4.5',
        dockerVersionSonar: '4.5.6',
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml, dev.yml, prod.yml', function () {
      assert.file([
        'src/main/docker/sonar.yml',
        'src/main/docker/dev.yml',
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
      assert.fileContent('src/main/docker/dev.yml','postgres:9.4.5');
      assert.fileContent('src/main/docker/prod.yml','postgres:9.4.5');
    });
  });

  describe('mongo 3.0.7', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/05-mongo'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '3.0.7',
        dockerVersionSonar: '4.5.6',
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml, dev.yml, prod.yml', function () {
      assert.file([
        'src/main/docker/sonar.yml',
        'src/main/docker/dev.yml',
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
      assert.fileContent('src/main/docker/dev.yml','mongo:3.0.7');
      assert.fileContent('src/main/docker/prod.yml','mongo:3.0.7');
    });
  });

  describe('cassandra 2.2.3', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/06-cassandra'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '2.2.3',
        dockerVersionSonar: '4.5.6',
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml, dev.yml, prod.yml and some Dockerfiles', function () {
      assert.file([
        'src/main/docker/sonar.yml',
        'src/main/docker/dev.yml',
        'src/main/docker/prod.yml',
        'src/main/docker/cassandra/Cassandra-Dev.Dockerfile',
        'src/main/docker/cassandra/Cassandra-Prod.Dockerfile',
        'src/main/docker/cassandra/scripts/cassandra.sh',
        'src/main/docker/cassandra/scripts/entities.sh',
        'src/main/docker/cassandra/scripts/init-dev.sh',
        'src/main/docker/cassandra/scripts/init-prod.sh',
        'src/main/docker/opscenter/Dockerfile'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
      assert.fileContent('src/main/docker/cassandra/Cassandra-Dev.Dockerfile','FROM cassandra:2.2.3');
      assert.fileContent('src/main/docker/cassandra/Cassandra-Prod.Dockerfile','FROM cassandra:2.2.3');
    });
  });

});
