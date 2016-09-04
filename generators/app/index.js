'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var exec = require('child_process').exec;
var githubUrl = require('remote-origin-url');
var packagejs = require(__dirname + '/../../package.json');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'docker'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.Base.extend({

    initializing: {
        templates: function (args) {
            this.composeWith('jhipster:modules',
                {
                    options: {
                        jhipsterVar: jhipsterVar,
                        jhipsterFunc: jhipsterFunc
                    }
                },
                this.options.testmode ? {local: require.resolve('generator-jhipster/generators/modules')} : null
            );
            if (args === 'default' || args === 'automated') {
                this.dockerDefault = 'automated';
            }
        },

        displayLogo: function () {
            console.log(' \n' +
            chalk.cyan.bold('        _ _   _ _           _              ____             _             \n') +
            chalk.cyan.bold('       | | | | (_)_ __  ___| |_ ___ _ __  |  _ \\  ___   ___| | _____ _ __ \n') +
            chalk.cyan.bold('    _  | | |_| | | \'_ \\/ __| __/ _ \\ \'__| | | | |/ _ \\ / __| |/ / _ \\ \'__|\n') +
            chalk.cyan.bold('   | |_| |  _  | | |_) \\__ \\ ||  __/ |    | |_| | (_) | (__|   <  __/ |   \n') +
            chalk.cyan.bold('    \\___/|_| |_|_| .__/|___/\\__\\___|_|    |____/ \\___/ \\___|_|\\_\\___|_|   \n') +
            chalk.cyan.bold('                 |_|                                                      \n') +
            chalk.cyan.bold('                                      ##        .\n') +
            chalk.cyan.bold('                                ## ## ##       ==\n') +
            chalk.cyan.bold('                             ## ## ## ##      ===\n') +
            chalk.cyan.bold('                         /""""""""""""""""\\___/ ===\n') +
            chalk.cyan.bold('                    ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~\n') +
            chalk.cyan.bold('                         \\______ o          __/\n') +
            chalk.cyan.bold('                           \\    \\        __/\n') +
            chalk.cyan.bold('                            \\____\\______/\n'));
            console.log(chalk.white.bold('                        http://jhipster.github.io\n'));
            console.log(chalk.white('Welcome to the ' + chalk.bold('JHipster Docker') + ' Generator! ' + chalk.yellow('v' + packagejs.version + '\n')));
        },

        checkOracle: function () {
            if (jhipsterVar.prodDatabaseType === 'oracle') {
                this.env.error(chalk.red.bold('ERROR!') + ' Oracle isn\'t on the boat...\n');
            }
        },

        checkDocker: function () {
            var done = this.async();
            exec('docker --version', function (err) {
                if (err) {
                    console.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker installed.\n'
                    + '         Read http://docs.docker.com/engine/installation/#installation\n');
                }
                done();
            }.bind(this));
        },

        checkDockerCompose: function () {
            var done = this.async();
            exec('docker-compose --version', function (err) {
                if (err) {
                    console.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker-compose installed.\n'
                    + '         Read https://docs.docker.com/compose/install/\n');
                }
                done();
            }.bind(this));
        },

        checkGithubUrl: function () {
            this.defaultGithubUrl = githubUrl.sync();
            if (!this.defaultGithubUrl) {
                this.defaultGithubUrl = 'https://github.com/username/' + jhipsterVar.baseName + '.git';
                console.log(chalk.yellow.bold('WARNING!') + ' This project doesn\'t have a remote-origin GitHub.\n'
                + '         The option Automated build won\'t work correctly.\n');
            } else {
                this.defaultGithubUrl = this.defaultGithubUrl.replace(/git@github.com:/g, 'https:\/\/github.com\/');
            }
        }
    },

    prompting: function () {
        var done = this.async();
        var prompts = [{
            type: 'list',
            name: 'dockerType',
            message: 'Please choose what you want to do:',
            choices: [
                {name: 'Generate files for Automated build at ' + chalk.bold('https://hub.docker.com/'), value: 'automated'},
                {name: 'Generate additional docker-compose services', value: 'dockercompose'},
                {name: 'Change the default Dockerfile', value: 'dockerbuild'}
            ],
            default: 'automated'
        },{
            when: function (response) {
                return response.dockerType === 'dockercompose';
            },
            type: 'checkbox',
            name: 'chosenDockerCompose',
            message: 'Select additional docker-compose services',
            choices: [
                {name: 'Local SMTP (https://github.com/djfarrelly/MailDev/)', value: 'maildev'}
            ]
        },{
            when: function (response) {
                return response.dockerType === 'dockerbuild';
            },
            type: 'list',
            name: 'dockerBaseImage',
            message: 'Choose the base image',
            choices: [
                {name: 'tomcat:8.0.36-jre8-alpine', value: 'tomcat'},
                // {name: 'jboss/wildfly:10.1.0.Final', value: 'wildfly'},
            ],
            default: 'tomcat'
        },{
            when: function (response) {
                return response.dockerType === 'dockerbuild';
            },
            validate: function (input) {
                if (/^([a-zA-Z0-9_]*)$/.test(input) && input !== '') return true;
                return 'The base domain url is mandatory, cannot contain special characters or a blank space';
            },
            name: 'dockerBaseUrl',
            message: 'Choose the base domain url',
            default: jhipsterVar.baseName
        },{
            when: function (response) {
                return response.dockerType === 'automated';
            },
            validate: function (input) {
                if (/^([a-zA-Z0-9_]*)$/.test(input) && input !== '') return true;
                return 'Your username is mandatory, cannot contain special characters or a blank space';
            },
            name: 'dockerID',
            message: this.dockerType === 'automated' ? 'Docker Hub: what is your Docker ID?' : 'What should we use for the base Docker repository name?',
            store: true,
        }];

        if (this.dockerDefault === 'automated') {
            this.dockerType = 'automated';
            done();
        } else {
            this.prompt(prompts, function (props) {
                this.props = props;
                // To access props later use this.props.someOption;

                this.dockerType = props.dockerType;
                this.dockerVersionDB = props.dockerVersionDB;
                this.dockerVersionSE = props.dockerVersionSE;
                this.dockerELK = props.dockerELK;
                this.dockerVersionSonar = props.dockerVersionSonar;
                this.dockerRepoGithub = props.dockerRepoGithub;

                this.dockerBaseUrl = props.dockerBaseUrl;

                this.dockerID = props.dockerID;
                this.dockerTag = props.dockerTag;
                this.dockerbuildToHub = props.dockerbuildToHub;

                if (this.dockerType === "automated") {
                    this.dockerBaseImage = 'java:openjdk-8u66-jre';
                    this.dockerTypeImage = 'java';
                } else if (this.dockerType === 'dockerbuild') {
                    this.dockerBaseImage = props.dockerBaseImage;
                    switch (this.dockerBaseImage) {
                        case 'tomcat:8.0.36-jre8-alpine': {
                            this.dockerTypeImage = 'tomcat';
                            break;
                        }
                        case 'jboss/wildfly:10.1.0.Final': {
                            this.dockerTypeImage = 'wildfly';
                            break;
                        }
                    }
                }

                done();
            }.bind(this));
        }
    },

    writing: function () {
        var done = this.async();

        this.baseName = jhipsterVar.baseName;
        this.packageName = jhipsterVar.packageName;
        this.devDatabaseType = jhipsterVar.devDatabaseType;
        this.prodDatabaseType = jhipsterVar.prodDatabaseType;
        this.searchEngine = jhipsterVar.searchEngine;
        this.buildTool = jhipsterVar.buildTool;
        this.serverPort = jhipsterVar.serverPort;
        this.hibernateCache = jhipsterVar.hibernateCache;

        var dockerDir = 'src/main/docker/';

        // Create docker-compose files
        if (this.dockerType === "dockercompose") {
            // put additional docker-compose file here
        }

        // Create Dockerfile for automated build at docker-hub
        if (this.dockerType === "automated") {
            this.template('_Dockerfile', 'Dockerfile', this, {});
        }

        // Create Dockerfile for pushing to docker-hub
        if (this.dockerType === "dockerbuild") {
            if (this.dockerBaseImage === 'tomcat') {
                this.template(dockerDir + '_Tomcat.Dockerfile', dockerDir + 'Dockerfile', this, {});
            } else if (this.dockerBaseImage === 'wildfly') {
                this.template(dockerDir + '_Wildfly.Dockerfile', dockerDir + 'Dockerfile', this, {});
            }
        }
        done();
    },

    end: function () {
        console.log('\n' + chalk.bold.green('##### USAGE #####'));
        switch (this.dockerType) {
            case 'dockercompose': {
                console.log('Nothing...');
                break;
            }
            case 'automated': {
                console.log('To param your project as Automated build:');
                console.log('- go to https://hub.docker.com/r/' + this.dockerID + '/');
                console.log('- menu Create: Create Automated Build');
                if (this.dockerRepoGithub === undefined) {
                    console.log('    - select the repository of your project');
                } else {
                    console.log('    - select the repository ' + chalk.cyan.bold(this.dockerRepoGithub));
                }
                console.log('    - put a description, then click on create');
                console.log('- go to Build Settings');
                console.log('    - choose your branch or let master by default');
                // console.log('    - put this Dockerfile location: ' + chalk.cyan.bold('src/main/docker/hub/'));
                console.log('    - click on Save Changes');
                console.log('- return to this project: git commit and push these changes!\n');
                console.log('- go to Build details: it should be a new line with ' + chalk.cyan.bold('Building'));
                break;
            }
            case 'dockerbuild': {
                if (this.abort) break;
                if (this.dockerbuildToHub) {
                    console.log('Your image should now be live at:\n- ' + chalk.cyan.bold('https://hub.docker.com/r/' + this.dockerImage + '/tags/\n'));
                    console.log('- go to Repo info and copy/paste in Full description the ' + chalk.cyan.bold('src/main/docker/app.yml\n'));
                }
                console.log('You can test your local image ' + chalk.cyan.bold(this.dockerImageTag));
                if (this.prodDatabaseType === 'cassandra') {
                    console.log('- docker-compose -f docker-compose-prod.yml up -d');
                    console.log('- wait at least 30sec to let docker up');
                    console.log('- docker exec -it ' + this.baseName.toLowerCase() + '-cassandra init');
                }
                console.log('- docker-compose -f src/main/docker/app.yml up');
                if (this.dockerBaseImage === 'java:openjdk-8u66-jre') {
                    console.log('- Access URL: http://localhost:8080/\n');
                } else if (this.dockerBaseImage === 'tomcat:8.0.30-jre8') {
                    console.log('- Admin Tomcat URL (with tomcat/JH!pst3r): http://localhost:8080/');
                    console.log('- Access URL: http://localhost:8080/' + this.dockerBaseUrl + '/\n');
                } else if (this.dockerBaseImage === 'jboss/wildfly:9.0.1.Final') {
                    console.log('- Admin WildFly URL (with admin/JH!pst3r): http://localhost:9990/');
                    console.log('- Access URL: http://localhost:8080/' + this.dockerBaseUrl + '/\n');
                }
                break;
            }
        }
    }
});
