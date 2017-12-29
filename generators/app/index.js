const chalk = require('chalk');
const packagejs = require('../../package.json');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const exec = require('child_process').exec;
const githubUrl = require('remote-origin-url');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    this.dockerDefault = true;
                }
            },

            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },

            displayLogo() {
                this.log('');
                this.log(`${chalk.cyan.bold('                                      ##        .')}`);
                this.log(`${chalk.cyan.bold('                                ## ## ##       ==')}`);
                this.log(`${chalk.cyan.bold('                             ## ## ## ##      ===')}`);
                this.log(`${chalk.cyan.bold('                         /""""""""""""""""\\___/ ===')}`);
                this.log(`${chalk.cyan.bold('                    ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~')}`);
                this.log(`${chalk.cyan.bold('                         \\______ o          __/')}`);
                this.log(`${chalk.cyan.bold('                           \\    \\        __/')}`);
                this.log(`${chalk.cyan.bold('                            \\____\\______/')}\n`);
                this.log(`${chalk.white.bold('                        http://www.jhipster.tech/')}`);
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
                        this.log(`${chalk.yellow.bold('WARNING!')} You don't have Docker installed.`);
                        this.log('    Read http://docs.docker.com/engine/installation/#installation');
                    }
                    done();
                });
            },

            checkDockerCompose() {
                const done = this.async();
                exec('docker-compose --version', (err) => {
                    if (err) {
                        this.log(`${chalk.yellow.bold('WARNING!')} You don't have Docker Compose installed.`);
                        this.log('    Read https://docs.docker.com/compose/install/\n');
                    }
                    done();
                });
            },

            checkGithubUrl() {
                this.defaultGithubUrl = githubUrl.sync();
                if (!this.defaultGithubUrl) {
                    this.log(`${chalk.yellow.bold('WARNING!')} This project doesn't have a remote-origin GitHub.`);
                    this.log('  The option Automated build won\'t work correctly.\n');
                } else {
                    this.defaultGithubUrl = this.defaultGithubUrl.replace(/git@github.com:/g, 'https://github.com/');
                }
            }
        };
    }

    prompting() {
        const done = this.async();
        const choices = [];
        const defaultChoice = [];

        choices.push({
            name: `Dockerfile for Automated build at ${chalk.bold('https://hub.docker.com/')}`,
            value: 'automated:true'
        });
        choices.push({
            name: 'Local SMTP Server (https://github.com/djfarrelly/MailDev/)',
            value: 'maildev:true'
        });
        choices.push({
            name: 'NGinx as proxy server',
            value: 'nginx:true'
        });

        const PROMPTS = {
            type: 'checkbox',
            name: 'dockerOptions',
            message: 'Which additionnal options would you like?',
            choices,
            default: defaultChoice
        };

        if (this.dockerDefault) {
            this.automated = true;
            done();
        } else {
            this.prompt(PROMPTS).then((prompt) => {
                this.dockerOptions = prompt.dockerOptions;
                this.automated = this.getOptionFromArray(this.dockerOptions, 'automated');
                this.maildev = this.getOptionFromArray(this.dockerOptions, 'maildev');
                this.nginx = this.getOptionFromArray(this.dockerOptions, 'nginx');
                done();
            });
        }
    }

    writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        this.buildTool = this.jhipsterAppConfig.buildTool;
        this.serverPort = this.jhipsterAppConfig.serverPort ? this.jhipsterAppConfig.serverPort : '8080';
        this.cacheProvider = this.jhipsterAppConfig.cacheProvider ?
            this.jhipsterAppConfig.cacheProvider : this.jhipsterAppConfig.hibernateCache;

        const dockerDir = jhipsterConstants.DOCKER_DIR;

        if (this.automated) {
            this.template('_Dockerfile', 'Dockerfile');
        }

        if (this.maildev) {
            this.template(`${dockerDir}_smtp.yml`, `${dockerDir}smtp.yml`);
        }

        if (this.nginx) {
            this.template(`${dockerDir}_nginx.yml`, `${dockerDir}nginx.yml`);
            this.template(`${dockerDir}/nginx/_nginx.conf`, `${dockerDir}/nginx/nginx.conf`);
            this.template(`${dockerDir}/nginx/_site.conf`, `${dockerDir}/nginx/site.conf`);
        }
    }

    end() {
        this.log(`\n${chalk.bold.green('##### USAGE #####\n')}`);

        if (this.automated) {
            this.log(`${chalk.bold('To set your project as Automated build:\n')}`);

            this.log('Go to your GitHub project');
            this.log('- Go to Settings > Integrations & services');
            this.log('- Add service and select Docker');
            this.log('- Click [x] Active');
            this.log('- Click on update service');
            this.log(`- Back to Integration & services, Docker must be: ${chalk.bold.green('✓')} Docker`);
            this.log('Go to https://hub.docker.com/r/YOUR_DOCKER_ID');
            this.log('- Menu Create');
            this.log('  - Select Create Automated Build');
            this.log('  - Select the repository of your project');
            this.log('  - Put a description, then click on create');
            this.log('- Go to Build Settings');
            this.log('  - Choose your branch or let master by default');
            this.log('  - Put this Dockerfile location: /');
            this.log('  - Click on Save Changes');
            this.log('- Return to this project: git commit and push these changes!');
            this.log(`- Go to Build details: it should be a new line with ${chalk.cyan.bold('Building\n')}`);
        }

        if (this.maildev) {
            this.log(`${chalk.bold('Start local SMTP server:')}`);
            this.log(`- ${chalk.cyan('docker-compose -f src/main/docker/smtp.yml up -d')}`);
            this.log('');
            this.log(`You can access to it: ${chalk.cyan('http://localhost:1080')}`);
            this.log('');
        }

        if (this.nginx) {
            this.log(`${chalk.bold('Use NGinx as proxy server:')}`);
            this.log('- Start your local backend server or use an existing one. You can start more than 1 backend server.');
            this.log(`- Edit ${chalk.cyan('src/main/docker/nginx/nginx.conf')}, depending on the 1st step`);
            this.log(`- Start NGinx: ${chalk.cyan('docker-compose -f src/main/docker/nginx.yml up -d')}`);
            this.log('');
            this.log('Note:');
            this.log(`The use of ${chalk.cyan('network_mode: \'host\'')} in ${chalk.cyan('nginx.yml')} may not work for Windows or MacOS.`);
            this.log(`Simply comment it and replace ${chalk.cyan('localhost')} in ${chalk.cyan('src/main/docker/nginx/nginx.conf')} file.`);
            this.log('Your container (from inside) must access to the application.');
            this.log('');
            this.log(`You can access to it: ${chalk.cyan('http://localhost')} or ${chalk.cyan('http://localhost:8000')}`);
            this.log('');
        }
    }
};
