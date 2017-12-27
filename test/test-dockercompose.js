/* global describe, beforeEach, it */

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('JHipster generator Docker', () => {
    describe('Maven, ngx', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/ngx-maven'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    dockerOptions: [
                        'automated:true',
                        'maildev:true',
                        'nginx:true'
                    ]
                })
                .on('end', done);
        });
        it('generates Dockerfile', () => {
            assert.file([
                'Dockerfile'
            ]);
            assert.fileContent('Dockerfile', 'FROM openjdk:8');
            assert.noFileContent('Dockerfile', '5701');
        });
        it('generates smtp.yml', () => {
            assert.file([
                'src/main/docker/smtp.yml'
            ]);
        });
        it('generates NGiNX configuration', () => {
            assert.file([
                'src/main/docker/nginx.yml',
                'src/main/docker/nginx/site.conf'
            ]);
            assert.fileContent('src/main/docker/nginx.yml', 'target/');
            assert.noFileContent('src/main/docker/nginx.yml', 'build/');
        });
    });

    describe('Gradle, ng1', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/ng1-gradle'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    dockerOptions: [
                        'automated:true',
                        'maildev:true',
                        'nginx:true'
                    ]
                })
                .on('end', done);
        });
        it('generates Dockerfile', () => {
            assert.file([
                'Dockerfile'
            ]);
            assert.fileContent('Dockerfile', 'FROM openjdk:8');
            assert.noFileContent('Dockerfile', '5701');
        });
        it('generates smtp.yml', () => {
            assert.file([
                'src/main/docker/smtp.yml'
            ]);
        });
        it('generates NGiNX configuration', () => {
            assert.file([
                'src/main/docker/nginx.yml',
                'src/main/docker/nginx/site.conf'
            ]);
            assert.noFileContent('src/main/docker/nginx.yml', 'target/');
            assert.fileContent('src/main/docker/nginx.yml', 'build/');
        });
    });

    describe('Maven, ngx, Hazelcast', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/ngx-maven-hazelcast'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    dockerOptions: [
                        'automated:true',
                        'maildev:true'
                    ]
                })
                .on('end', done);
        });
        it('generates Dockerfile', () => {
            assert.file([
                'Dockerfile'
            ]);
            assert.fileContent('Dockerfile', 'FROM openjdk:8');
            assert.fileContent('Dockerfile', '5701/udp');
        });
        it('generates smtp.yml', () => {
            assert.file([
                'src/main/docker/smtp.yml'
            ]);
        });
    });

    describe('Old config with hibernateCache: Dockerfile', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/old-config'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    dockerOptions: [
                        'automated:true'
                    ]
                })
                .on('end', done);
        });
        it('generates Dockerfile', () => {
            assert.file([
                'Dockerfile'
            ]);
            assert.fileContent('Dockerfile', 'FROM openjdk:8');
            assert.fileContent('Dockerfile', 'FROM openjdk:8');
        });
        it('doesn\'t generate other file', () => {
            assert.noFile([
                'src/main/docker/smtp.yml'
            ]);
        });
    });

    describe('Old config with hibernateCache: Local SMTP Server', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/old-config'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    dockerOptions: [
                        'maildev:true'
                    ]
                })
                .on('end', done);
        });
        it('generates smtp.yml', () => {
            assert.file([
                'src/main/docker/smtp.yml'
            ]);
        });
        it('doesn\'t generate other file', () => {
            assert.noFile([
                'Dockerfile'
            ]);
        });
    });
});
