const util = require('util');
const chalk = require('chalk');
const generator = require('yeoman-generator');
const packagejs = require('../../package.json');
const exec = require('child_process').exec;
const githubUrl = require('remote-origin-url');

const BaseGenerator = require('generator-jhipster/generators/generator-base');

const JhipsterGenerator = generator.extend({});
util.inherits(JhipsterGenerator, BaseGenerator);

module.exports = JhipsterGenerator.extend({
    constructor: function (...args) { // eslint-disable-line object-shorthand
        generator.apply(this, args);

        this.option('default', {
            type: String,
            required: false,
            description: 'default option'
        });

        this.dockerDefault = this.options.default;
    },

    initializing: {
        readConfig() {
            this.jhipsterAppConfig = this.getJhipsterAppConfig();
            if (!this.jhipsterAppConfig) {
                this.error('Can\'t read .yo-rc.json');
            }
        },
        displayLogo() {
            this.log('');
            this.log(`${chalk.cyan.bold('        _ _   _ _           _              ____             _             ')}`);
            this.log(`${chalk.cyan.bold('       | | | | (_)_ __  ___| |_ ___ _ __  |  _ \\  ___   ___| | _____ _ __ ')}`);
            this.log(`${chalk.cyan.bold('    _  | | |_| | | \'_ \\/ __| __/ _ \\ \'__| | | | |/ _ \\ / __| |/ / _ \\ \'__|')}`);
            this.log(`${chalk.cyan.bold('   | |_| |  _  | | |_) \\__ \\ ||  __/ |    | |_| | (_) | (__|   <  __/ |   ')}`);
            this.log(`${chalk.cyan.bold('    \\___/|_| |_|_| .__/|___/\\__\\___|_|    |____/ \\___/ \\___|_|\\_\\___|_|   ')}`);
            this.log(`${chalk.cyan.bold('                 |_|                                                      ')}`);
            this.log(`${chalk.cyan.bold('                                      ##        .')}`);
            this.log(`${chalk.cyan.bold('                                ## ## ##       ==')}`);
            this.log(`${chalk.cyan.bold('                             ## ## ## ##      ===')}`);
            this.log(`${chalk.cyan.bold('                         /""""""""""""""""\\___/ ===')}`);
            this.log(`${chalk.cyan.bold('                    ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~')}`);
            this.log(`${chalk.cyan.bold('                         \\______ o          __/')}`);
            this.log(`${chalk.cyan.bold('                           \\    \\        __/')}`);
            this.log(`${chalk.cyan.bold('                            \\____\\______/')}\n`);
            this.log(`${chalk.white.bold('                        http://jhipster.github.io')}`);
            this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster Docker')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
        },

        checkOracle() {
            if (this.jhipsterAppConfig.prodDatabaseType === 'oracle') {
                this.env.error(`${chalk.red.bold('ERROR!')} Oracle isn't on the boat...`);
            }
        },

        checkDocker() {
            const done = this.async();
            exec('docker --version', (err) => {
                if (err) {
                    this.log(`${chalk.yellow.bold('WARNING!')} You don't have docker installed.`);
                    this.log('    Read http://docs.docker.com/engine/installation/#installation');
                }
                done();
            });
        },

        checkDockerCompose() {
            const done = this.async();
            exec('docker-compose --version', (err) => {
                if (err) {
                    this.log(`${chalk.yellow.bold('WARNING!')} You don't have docker-compose installed.`);
                    this.log('    Read https://docs.docker.com/compose/install/\n');
                }
                done();
            });
        },

        checkGithubUrl() {
            this.defaultGithubUrl = githubUrl.sync();
            if (!this.defaultGithubUrl) {
                this.log(`${chalk.yellow.bold('WARNING!')} This project doesn't have a remote-origin GitHub.`);
                this.log('    The option Automated build won\'t work correctly.\n');
            } else {
                this.defaultGithubUrl = this.defaultGithubUrl.replace(/git@github.com:/g, 'https://github.com/');
            }
        }
    },

    prompting() {
        const done = this.async();
        const prompts = [{
            type: 'list',
            name: 'dockerType',
            message: 'Please choose what you want to do:',
            choices: [
                { name: `Generate Dockerfile for Automated build at ${chalk.bold('https://hub.docker.com/')}`, value: 'automated' },
                { name: 'Generate additional docker-compose services', value: 'dockercompose' },
                { name: 'Change the default Dockerfile', value: 'dockerbuild' }
            ],
            default: 'automated'
        }, {
            when: response => response.dockerType === 'dockercompose',
            type: 'checkbox',
            name: 'chosenDockerCompose',
            message: 'Select additional docker-compose services',
            choices: [
                { name: 'Local SMTP (https://github.com/djfarrelly/MailDev/)', value: 'maildev' }
            ]
        }, {
            when: response => response.dockerType === 'dockerbuild',
            type: 'list',
            name: 'dockerBaseImage',
            message: 'Choose the base image',
            choices: [
                { name: 'tomcat:8-jre8-alpine', value: 'tomcat' },
            ],
            default: 'tomcat'
        }, {
            when: response => response.dockerType === 'dockerbuild',
            validate: (input) => {
                if (/^([a-zA-Z0-9_]*)$/.test(input) && input !== '') return true;
                return 'The base domain url is mandatory, cannot contain special characters or a blank space';
            },
            name: 'dockerBaseUrl',
            message: 'Choose the base domain url',
            default: this.jhipsterAppConfig.baseName
        }, {
            when: response => response.dockerType === 'automated',
            validate: (input) => {
                if (/^([a-zA-Z0-9_]*)$/.test(input) && input !== '') return true;
                return 'Your username is mandatory, cannot contain special characters or a blank space';
            },
            name: 'dockerID',
            message: 'Docker Hub: what is your Docker ID?',
            store: true,
        }];

        if (this.dockerDefault) {
            this.dockerType = 'automated';
            done();
        } else {
            this.prompt(prompts).then((props) => {
                this.props = props;
                // To access props later use this.props.someOption;
                this.dockerType = props.dockerType;
                this.dockerBaseUrl = props.dockerBaseUrl;
                this.dockerID = props.dockerID;

                if (this.dockerType === 'dockercompose') {
                    this.chosenDockerCompose = props.chosenDockerCompose;
                }
                if (this.dockerType === 'dockerbuild') {
                    this.dockerBaseImage = props.dockerBaseImage;
                }
                done();
            });
        }
    },

    writing() {
        const done = this.async();

        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.devDatabaseType = this.jhipsterAppConfig.devDatabaseType;
        this.prodDatabaseType = this.jhipsterAppConfig.prodDatabaseType;
        this.searchEngine = this.jhipsterAppConfig.searchEngine;
        this.buildTool = this.jhipsterAppConfig.buildTool;
        this.serverPort = this.jhipsterAppConfig.serverPort;
        this.hibernateCache = this.jhipsterAppConfig.hibernateCache;

        const dockerDir = 'src/main/docker/';

        // Create Dockerfile for automated build at docker-hub
        if (this.dockerType === 'automated') {
            this.template('_Dockerfile', 'Dockerfile');
        }

        // Create docker-compose files
        if (this.dockerType === 'dockercompose') {
            this.chosenDockerCompose.forEach((chosenDockerCompose) => {
                switch (chosenDockerCompose) {
                case 'maildev':
                    this.template(`${dockerDir}_smtp.yml`, `${dockerDir}smtp.yml`);
                    break;
                default:
                }
            });
        }

        // Create Dockerfile for pushing to docker-hub
        if (this.dockerType === 'dockerbuild') {
            if (this.dockerBaseImage === 'tomcat') {
                this.template(`${dockerDir}_Tomcat.Dockerfile`, `${dockerDir}Dockerfile`);
                if (this.buildTool === 'maven') {
                    /* eslint-disable no-template-curly-in-string */
                    this.replaceContent(
                        'pom.xml',
                        '<include>${project.build.finalName}.war</include>',
                        '<include>${project.build.finalName}.war*</include>');
                }
            } else if (this.dockerBaseImage === 'wildfly') {
                this.template(`${dockerDir}_Wildfly.Dockerfile`, `${dockerDir}Dockerfile`);
            }
        }
        done();
    },

    end() {
        this.log(`\n${chalk.bold.green('##### USAGE #####\n')}`);
        switch (this.dockerType) {
        case 'automated': {
            this.log('To param your project as Automated build:\n');

            this.log('Go to your github project');
            this.log('- Go to settings > Intégrations & services');
            this.log('- Add service and select Docker');
            this.log('- Click [x] active');
            this.log('- Click on update service');
            this.log('- Then, made a commit+push');
            this.log(`- Back to Services, Docker must be: ${chalk.bold.green('✓')} Docker\n`);

            this.log(`Go to https://hub.docker.com/r/ ${this.dockerID}/`);
            this.log('- menu Create: Create Automated Build');
            if (this.defaultGithubUrl === undefined) {
                this.log('    - select the repository of your project');
            } else {
                this.log(`    - select the repository ${chalk.cyan.bold(this.defaultGithubUrl)}`);
            }
            this.log('    - put a description, then click on create');
            this.log('- go to Build Settings');
            this.log('    - choose your branch or let master by default');
            this.log('    - click on Save Changes');
            this.log('- return to this project: git commit and push these changes!');
            this.log(`- go to Build details: it should be a new line with ${chalk.cyan.bold('Building\n')}`);
            break;
        }
        case 'dockercompose': {
            this.chosenDockerCompose.forEach((chosenDockerCompose) => {
                switch (chosenDockerCompose) {
                case 'maildev':
                    this.log('Start local smtp server:');
                    this.log('- docker-compose -f src/main/docker/smtp.yml up');
                    break;
                default:
                }
            });
            this.log('');
            break;
        }
        case 'dockerbuild': {
            this.log('You can build your image:');
            if (this.buildTool === 'maven') {
                this.log(' - ./mvnw clean package -Pprod docker:build\n');
            } else if (this.buildTool === 'gradle') {
                this.log(' - ./gradlew clean bootRepackage -Pprod buildDocker\n');
            }
            this.log('Once the container is launched:');
            if (this.dockerBaseImage === 'tomcat') {
                this.log('- Admin Tomcat URL (with tomcat/JH!pst3r): http://localhost:8080/');
                this.log(`- Access URL: http://localhost:8080/${this.dockerBaseUrl}\n`);
            } else if (this.dockerBaseImage === 'wildfly') {
                this.log('- Admin WildFly URL (with admin/JH!pst3r): http://localhost:9990/');
                this.log(`- Access URL: http://localhost:8080/${this.dockerBaseUrl}\n`);
            }
            break;
        }
        default:
        }
    }
});
