/* global describe, beforeEach, it*/

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator Docker', () => {
    describe('Automated build', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/01-h2-mysql'), dir);
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

        it('generates Dockerfile', () => {
            assert.file([
                'Dockerfile'
            ]);
            assert.fileContent('Dockerfile', 'FROM openjdk:8');
        });
    });

    describe('Additional docker-compose services', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/01-h2-mysql'), dir);
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

        it('generates smtp.yml', () => {
            assert.file([
                'src/main/docker/smtp.yml'
            ]);
        });
    });
});
