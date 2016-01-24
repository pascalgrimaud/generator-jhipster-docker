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
        dockerELK: true,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube 4.5.6', function () {
      assert.file([
        'src/main/docker/sonar.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
    });

    it('generate elk.yml', function () {
      assert.file([
        'src/main/docker/elk.yml',
        'src/main/docker/logstash/logstash.conf'
      ]);
    });

    it('not generate dev.yml', function () {
      assert.noFile([
        'src/main/docker/dev.yml'
      ]);
    });

    it('generate prod.yml with MySQL 5.7.9', function () {
      assert.file([
            'src/main/docker/prod.yml'
      ]);
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
        dockerELK: false,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube latest', function () {
      assert.file([
        'src/main/docker/sonar.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:latest');
    });

    it('generate dev.yml with MySQL 5.7.10', function () {
      assert.file([
        'src/main/docker/dev.yml'
      ]);
      assert.fileContent('src/main/docker/dev.yml','mysql:5.7.10');
    });

    it('generate prod.yml with MySQL 5.7.10', function () {
      assert.file([
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/prod.yml','mysql:5.7.10');
    });
  });

  describe('mysql/mysql 5.7.10, sonar latest, elasticsearch 1.7.3', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/03-mysql-mysql-es'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '5.7.10',
        dockerVersionSE: '1.7.3',
        dockerVersionSonar: 'latest',
        dockerELK: false,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube latest', function () {
      assert.file([
        'src/main/docker/sonar.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:latest');
    });

    it('generate dev.yml with MySQL 5.7.10', function () {
      assert.file([
        'src/main/docker/dev.yml'
      ]);
      assert.fileContent('src/main/docker/dev.yml','mysql:5.7.10');
    });

    it('generate prod.yml with MySQL 5.7.10 and ElasticSearch 1.7.3', function () {
      assert.file([
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/prod.yml','elasticsearch:1.7.3');
      assert.fileContent('src/main/docker/prod.yml','mysql:5.7.10');
    });
  });

  describe('h2/psql 9.3.10, sonar 4.5.6', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/04-h2-psql'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '9.3.10',
        dockerVersionSonar: '4.5.6',
        dockerELK: false,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube 4.5.6', function () {
      assert.file([
        'src/main/docker/sonar.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
    });

    it('not generate dev.yml', function () {
      assert.noFile([
        'src/main/docker/dev.yml'
      ]);
    });

    it('generate prod.yml with PostgreSQL 9.3.10', function () {
      assert.file([
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/prod.yml','postgres:9.3.10');
    });
  });

  describe('psql/psql 9.4.5, sonar 4.5.6', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/05-psql-psql'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '9.4.5',
        dockerVersionSonar: '4.5.6',
        dockerELK: false,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube 4.5.6', function () {
      assert.file([
        'src/main/docker/sonar.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
    });

    it('generate dev.yml with PostgreSQL 9.4.5', function () {
      assert.file([
        'src/main/docker/dev.yml'
      ]);
      assert.fileContent('src/main/docker/dev.yml','postgres:9.4.5');
    });

    it('generate prod.yml with PostgreSQL 9.4.5', function () {
      assert.file([
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/prod.yml','postgres:9.4.5');
    });
  });

  describe('psql/psql 9.4.5, sonar 4.5.6, elasticsearch 1.7.4', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/06-psql-psql-es'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '9.4.5',
        dockerVersionSE: '1.7.4',
        dockerVersionSonar: '4.5.6',
        dockerELK: false,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube 4.5.6', function () {
      assert.file([
        'src/main/docker/sonar.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
    });

    it('generate dev.yml with PostgreSQL 9.4.5', function () {
      assert.file([
        'src/main/docker/dev.yml'
      ]);
      assert.fileContent('src/main/docker/dev.yml','postgres:9.4.5');
    });

    it('generate prod.yml with PostgreSQL 9.4.5 and ElasticSearch 1.7.4', function () {
      assert.file([
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/prod.yml','elasticsearch:1.7.4');
      assert.fileContent('src/main/docker/prod.yml','postgres:9.4.5');
    });
  });

  describe('mongo 3.0.7, sonar 4.5.6', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/07-mongo'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '3.0.7',
        dockerVersionSonar: '4.5.6',
        dockerELK: false,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube 4.5.6', function () {
      assert.file([
        'src/main/docker/sonar.yml'
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
    });

    it('generate dev.yml with MongoDB 3.0.7', function () {
      assert.file([
        'src/main/docker/dev.yml'
      ]);
      assert.fileContent('src/main/docker/dev.yml','mongo:3.0.7');
    });

    it('generate prod.yml with MongoDB 3.0.7', function () {
      assert.file([
        'src/main/docker/prod.yml'
      ]);
      assert.fileContent('src/main/docker/prod.yml','mongo:3.0.7');
    });
  });

  describe('cassandra 2.2.3, sonar 4.5.6', function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fse.copySync(path.join(__dirname, '../test/templates/08-cassandra'), dir)
      })
      .withOptions({
        testmode: true
      })
      .withPrompts({
        dockerType: 'dockercompose',
        dockerVersionDB: '2.2.3',
        dockerVersionSonar: '4.5.6',
        dockerELK: false,
        dockerVolume: false
      })
      .withGenerators(deps)
      .on('end', done);
    });

    it('generate sonar.yml with SonarQube 4.5.6', function () {
      assert.file([
        'src/main/docker/sonar.yml',
      ]);
      assert.fileContent('src/main/docker/sonar.yml','sonarqube:4.5.6');
    });

    it('generate scripts sh need by Cassandra image', function () {
      assert.file([
        'src/main/docker/cassandra/scripts/cassandra.sh',
        'src/main/docker/cassandra/scripts/entities.sh',
        'src/main/docker/cassandra/scripts/init-dev.sh',
        'src/main/docker/cassandra/scripts/init-prod.sh',
      ]);
    });

    it('generate dev.yml, Cassandra-Dev.Dockerfile with Cassandra 2.2.3', function () {
      assert.file([
        'src/main/docker/dev.yml',
        'src/main/docker/cassandra/Cassandra-Dev.Dockerfile'
      ]);
      assert.fileContent('src/main/docker/cassandra/Cassandra-Dev.Dockerfile','FROM cassandra:2.2.3');
    });

    it('generate prod.yml, Cassandra-Prod.Dockerfile with Cassandra 2.2.3', function () {
      assert.file([
        'src/main/docker/prod.yml',
        'src/main/docker/cassandra/Cassandra-Prod.Dockerfile',
      ]);
      assert.fileContent('src/main/docker/cassandra/Cassandra-Prod.Dockerfile','FROM cassandra:2.2.3');
    });

    it('generate opscenter', function () {
      assert.file([
        'src/main/docker/opscenter/Dockerfile'
      ]);
    });
  });
});
