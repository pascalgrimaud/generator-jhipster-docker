'use strict';
var util = require('util');
var path = require('path');
var fse = require('fs-extra');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator Docker', function () {
    describe('Automated build', function () {
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
                dockerType: 'automated'
            })
            .withGenerators(deps)
            .on('end', done);
        });

        it('generates Dockerfile', function () {
            assert.file([
                'Dockerfile'
            ]);
            assert.fileContent('Dockerfile','FROM java:8');
        });
    });

    describe('Additional docker-compose services', function () {
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
                chosenDockerCompose: ['maildev']
            })
            .withGenerators(deps)
            .on('end', done);
        });

        it('generates smtp.yml', function () {
            assert.file([
                'src/main/docker/smtp.yml'
            ]);
        });
    });
});
