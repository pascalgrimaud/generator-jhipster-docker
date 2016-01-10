'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var jhipster = require('generator-jhipster');
var exec = require('child_process').exec;
var githubUrl = require('remote-origin-url');
var packagejs = require(__dirname + '/../../package.json');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'docker'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

  initializing: {
    templates: function (args) {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
      if (args == 'default' || args == 'compose' || args == 'dockercompose') {
        this.dockerDefault = 'dockercompose';
      }
    },
    displayLogo: function () {
      this.log(' \n' +
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
      this.log(chalk.white.bold('                        http://jhipster.github.io\n'));
      this.log(chalk.white('Welcome to the ' + chalk.bold('JHipster Docker') + ' Generator! ' + chalk.yellow('v' + packagejs.version + '\n')));
    },
    checkOracle: function () {
      if (jhipsterVar.prodDatabaseType == 'oracle') {
        this.log(chalk.red.bold('ERROR!') + ' Oracle isn\'t on the boat...\n');
        process.exit(1);
      }
    },
    checkDocker: function () {
      var done = this.async();
      exec('docker --version', function (err) {
        if (err) {
          this.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker installed.\n' +
            '         Read http://docs.docker.com/engine/installation/#installation\n');
        }
        done();
      }.bind(this));
    },
    checkDockerCompose: function () {
      var done = this.async();
      exec('docker-compose --version', function (err) {
        if (err) {
          this.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker-compose installed.\n' +
            '         Read https://docs.docker.com/compose/install/\n');
        }
        done();
      }.bind(this));
    },
    checkGithubUrl: function () {
      this.defaultGithubUrl = githubUrl.sync();
      if (this.defaultGithubUrl == null) {
        this.defaultGithubUrl = 'https://github.com/username/' + jhipsterVar.baseName + '.git';
        this.log(chalk.yellow.bold('WARNING!') + ' This project doesn\'t have a remote-origin GitHub.\n' +
          '         The option Automated build won\'t work correctly.\n');
      } else {
        this.defaultGithubUrl = this.defaultGithubUrl.replace(/git@github.com:/g, 'https:\/\/github.com\/');
      }
    }
  },

  prompting: function () {
    var done = this.async();
    var prompts = [
      {
        when: function (response) {
          return jhipsterVar.prodDatabaseType == 'cassandra';
        },
        type: 'list',
        name: 'dockerType',
        message: 'Please choose what you want to do:',
        choices: [
          {name: 'Generate docker-compose services', value: 'dockercompose'}
        ],
        default: 'dockercompose'
      },{
        when: function (response) {
          return jhipsterVar.prodDatabaseType != 'cassandra';
        },
        type: 'list',
        name: 'dockerType',
        message: 'Please choose what you want to do:',
        choices: [
          {name: 'Generate docker-compose services', value: 'dockercompose'},
          {name: 'Generate files for Automated build at https://hub.docker.com/', value: 'automated'},
          {name: 'Containerize your application and push image to https://hub.docker.com/', value: 'dockerpush'}
        ],
        default: 'dockercompose'
      },{
        when: function (response) {
          return response.dockerType == 'dockerpush';
        },
        type: 'list',
        name: 'dockerBaseImage',
        message: 'Choose the base image',
        choices: [
          {name: 'java:openjdk-8u66-jre (default)', value: 'java:openjdk-8u66-jre'},
          {name: 'tomcat:8.0.30-jre8', value: 'tomcat:8.0.30-jre8'},
          {name: 'jboss/wildfly:9.0.1.Final', value: 'jboss/wildfly:9.0.1.Final'},
        ],
        default: 'java:openjdk-8u66-jre'
      },{
        when: function (response) {
          return response.dockerType == 'dockerpush' && response.dockerBaseImage != 'java:openjdk-8u66-jre';
        },
        validate: function (input) {
          if (/^([a-zA-Z0-9_]*)$/.test(input) && input != '') return true;
          return 'The base domain url is mandatory, cannot contain special characters or a blank space';
        },
        name: 'dockerBaseUrl',
        message: 'Choose the base domain url',
        default: jhipsterVar.baseName
      },{
        when: function (response) {
          return jhipsterVar.prodDatabaseType == 'mysql';
        },
        type: 'list',
        name: 'dockerVersionDB',
        message: 'Choose the version of MySQL:',
        choices: [
          {name: '5.5.47', value: '5.5.47'},
          {name: '5.6.28', value: '5.6.28'},
          {name: '5.7.9 (default)', value: '5.7.9'},
          {name: '5.7.10', value: '5.7.10'}
        ],
        default: '5.7.9'
      },{
        when: function (response) {
          return jhipsterVar.prodDatabaseType == 'postgresql';
        },
        type: 'list',
        name: 'dockerVersionDB',
        message: 'Choose the version of PostgreSQL:',
        choices: [
          {name: '9.2.14', value: '9.2.14'},
          {name: '9.3.10', value: '9.3.10'},
          {name: '9.4.5 (default)', value: '9.4.5'},
        ],
        default: '9.4.5'
      },{
        when: function (response) {
          return jhipsterVar.prodDatabaseType == 'mongodb';
        },
        type: 'list',
        name: 'dockerVersionDB',
        message: 'Choose the version of MongoDB:',
        choices: [
          {name: '3.0.7 (default)', value: '3.0.7'},
          {name: '3.0.8', value: '3.0.8'},
          {name: '3.1.9', value: '3.1.9'},
          {name: '3.2.0', value: '3.2.0'}
        ],
        default: '3.0.7'
      },{
        when: function (response) {
          return jhipsterVar.prodDatabaseType == 'cassandra';
        },
        type: 'list',
        name: 'dockerVersionDB',
        message: 'Choose the version of Cassandra:',
        choices: [
          {name: '2.1.12', value: '2.1.12'},
          {name: '2.2.3 (default)', value: '2.2.3'},
          {name: '2.2.4', value: '2.2.4'}
        ],
        default: '2.2.3'
      },{
        when: function (response) {
          return jhipsterVar.searchEngine == 'elasticsearch';
        },
        type: 'list',
        name: 'dockerVersionSE',
        message: 'Choose the version of ElasticSearch:',
        choices: [
          {name: '1.7.3 (default)', value: '1.7.3'},
          {name: '1.7.4', value: '1.7.4'}
        ],
        default: '1.7.3'
      },{
        when: function (response) {
          return response.dockerType == 'dockercompose';
        },
        type: 'list',
        name: 'dockerVersionSonar',
        message: 'Choose the version of SonarQube:',
        choices: [
          {name: '4.5.6 (default)', value: '4.5.6'},
          {name: 'latest', value: 'latest'}
        ],
        default: '4.5.6'
      },{
        when: function (response) {
          return response.dockerType != 'automated';
        },
        type: 'confirm',
        name: 'dockerVolume',
        message: 'Do you want to use volume?',
        default: false
      },{
        when: function (response) {
          return response.dockerType == 'automated';
        },
        validate: function (input) {
          if (input != '') return true;
          return 'The GitHub repository is mandatory';
        },
        name: 'dockerRepoGithub',
        message: 'GitHub: choose the repository?',
        default: this.defaultGithubUrl
      },{
        when: function (response) {
          return response.dockerType == 'automated' || response.dockerType == 'dockerpush';
        },
        validate: function (input) {
          if (/^([a-zA-Z0-9_]*)$/.test(input) && input != '') return true;
          return 'Your username is mandatory, cannot contain special characters or a blank space';
        },
        name: 'dockerLogin',
        message: 'Docker Hub: what is your username?'
      },{
        when: function (response) {
          return response.dockerType == 'dockerpush';
        },
        name: 'dockerTag',
        message: 'Docker Hub: what is the tag?',
        default: 'latest'
      },{
        when: function (response) {
          return response.dockerType != 'automated' && response.dockerVolume;
        },
        name: 'dockerVolumePath',
        message: 'Choose your path for volume?',
        default: '~/volumes/jhipster'
      },{
        when: function (response) {
          return response.dockerType == 'dockerpush';
        },
        type: 'list',
        name: 'dockerPushToHub',
        message: 'Docker Hub: do you want to push to docker-hub?',
        choices: [
          {name: 'No', value: false},
          {name: 'Yes - ' + chalk.yellow(chalk.bold('WARNING!') + ' Don\'t put your credentials in your properties files (application-prod.yml)'), value: true}
        ],
        default: false
      }
    ];

    if (this.dockerDefault == 'dockercompose') {
      this.dockerType = 'dockercompose';
      this.dockerVolume = false;
      this.dockerVolumePath = '~/volumes/jhipster';
      switch (jhipsterVar.prodDatabaseType) {
        case 'mysql': {
          this.dockerVersionDB = '5.7.9';
          break;
        }
        case 'postgresql': {
          this.dockerVersionDB = '9.4.5';
          break;
        }
        case 'mongodb': {
          this.dockerVersionDB = '3.0.7';
          break;
        }
        case 'cassandra': {
          this.dockerVersionDB = '2.2.3';
          break;
        }
      }
      this.dockerVersionSE = '1.7.3';
      this.dockerVersionSonar = '4.5.6';
      done();
    } else {
      this.prompt(prompts, function (props) {
        this.props = props;
        // To access props later use this.props.someOption;
        this.dockerType = props.dockerType;
        this.dockerVersionDB = props.dockerVersionDB;
        this.dockerVersionSE = props.dockerVersionSE;
        this.dockerVersionSonar = props.dockerVersionSonar;
        this.dockerRepoGithub = props.dockerRepoGithub;

        this.dockerBaseUrl = props.dockerBaseUrl;
        if (this.dockerRepoGithub) {
          var segments = this.dockerRepoGithub.split(path.sep);
          this.dockerNameGithub = segments[4].replace(/.git/g, '');
        }
        this.dockerVolume = props.dockerVolume;
        if (this.dockerVolume) {
          this.dockerVolumePath = props.dockerVolumePath;
        } else {
          this.dockerVolumePath = '~/volumes/jhipster';
        }
        this.dockerLogin = props.dockerLogin;
        this.dockerTag = props.dockerTag;
        this.dockerPushToHub = props.dockerPushToHub;

        if (this.dockerType == "automated") {
          this.dockerBaseImage = 'java:openjdk-8u66-jre';
          this.dockerTypeImage = 'java';
        } else if (this.dockerType == 'dockerpush') {
          this.dockerBaseImage = props.dockerBaseImage;
          switch (this.dockerBaseImage) {
            case 'java:openjdk-8u66-jre': {
              this.dockerTypeImage = 'java';
              break;
            }
            case 'tomcat:8.0.30-jre8': {
              this.dockerTypeImage = 'tomcat';
              break;
            }
            case 'jboss/wildfly:9.0.1.Final': {
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

    var dockerDir = 'src/main/docker/';

    // Create docker-compose files
    if (this.dockerType == "dockercompose") {
      this.template(dockerDir + '_sonar.yml', dockerDir + 'sonar.yml', this, {});
      if (this.devDatabaseType != "h2Disk" && this.devDatabaseType != "h2Memory" && this.devDatabaseType != "oracle") {
        this.template(dockerDir + '_dev.yml', dockerDir + 'dev.yml', this, {});
      }
      if (this.prodDatabaseType != "oracle" || searchEngine == "elasticsearch") {
        this.template(dockerDir + '_prod.yml', dockerDir + 'prod.yml', this, {});
      }
      if (this.devDatabaseType == "cassandra") {
        this.template(dockerDir + 'cassandra/_Cassandra-Dev.Dockerfile', dockerDir + 'cassandra/Cassandra-Dev.Dockerfile', this, {});
        this.template(dockerDir + 'cassandra/_Cassandra-Prod.Dockerfile', dockerDir + 'cassandra/Cassandra-Prod.Dockerfile', this, {});
        this.template(dockerDir + 'cassandra/scripts/_init-dev.sh', dockerDir + 'cassandra/scripts/init-dev.sh', this, {});
        this.template(dockerDir + 'cassandra/scripts/_init-prod.sh', dockerDir + 'cassandra/scripts/init-prod.sh', this, {});
        this.template(dockerDir + 'cassandra/scripts/_entities.sh', dockerDir + 'cassandra/scripts/entities.sh', this, {});
        this.template(dockerDir + 'cassandra/scripts/_cassandra.sh', dockerDir + 'cassandra/scripts/cassandra.sh', this, {});
        this.template(dockerDir + 'opscenter/_Dockerfile', dockerDir + 'opscenter/Dockerfile', this, {});
      }
    }

    // Create Dockerfile for automated build at docker-hub
    if (this.dockerType == "automated") {
      this.template(dockerDir + 'hub/_Dockerfile', dockerDir + 'hub/Dockerfile', this, {});
      this.template(dockerDir + '_run.sh', dockerDir + 'hub/run.sh', this, {});
      this.template(dockerDir + '_app.yml', dockerDir + 'app-hub.yml', this, {});
    }

    // Create Dockerfile for pushing to docker-hub
    if (this.dockerType == "dockerpush") {
      if (this.dockerBaseImage == 'java:openjdk-8u66-jre') {
        this.template(dockerDir + 'push/_Openjdk.Dockerfile', dockerDir + 'push/Dockerfile', this, {});
        this.template(dockerDir + '_run.sh', dockerDir + 'push/run.sh', this, {});
      } else if (this.dockerBaseImage == 'tomcat:8.0.30-jre8') {
        this.template(dockerDir + 'push/_Tomcat.Dockerfile', dockerDir + 'push/Dockerfile', this, {});
        this.template(dockerDir + '_run.sh', dockerDir + 'push/run.sh', this, {});
      } else if (this.dockerBaseImage == 'jboss/wildfly:9.0.1.Final') {
        this.template(dockerDir + 'push/_Wildfly.Dockerfile', dockerDir + 'push/Dockerfile', this, {});
        this.template(dockerDir + '_run.sh', dockerDir + 'push/run.sh', this, {});
      }

      this.template(dockerDir + '_app.yml', dockerDir + 'app.yml', this, {});
      if (jhipsterVar.buildTool == 'maven') {
        jhipsterFunc.addMavenPlugin('com.spotify', 'docker-maven-plugin', '0.3.7',
          '                <configuration>\n' +
          '                    <imageName>' + this.packageName.toLowerCase() + '/' + this.baseName.toLowerCase() + ':tmp</imageName>\n' +
          '                    <dockerDirectory>src/main/docker/push</dockerDirectory>\n' +
          '                    <resources>\n' +
          '                        <resource>\n' +
          '                            <targetPath>/</targetPath>\n' +
          '                            <directory>${project.build.directory}</directory>\n' +
          '                            <include>${project.build.finalName}.war*</include>\n' +
          '                        </resource>\n' +
          '                    </resources>\n' +
          '                </configuration>');
      } else if (jhipsterVar.buildTool == 'gradle') {
        jhipsterFunc.addGradlePlugin('se.transmode.gradle','gradle-docker','1.2');
        jhipsterFunc.applyFromGradleScript('docker');
        this.template('_docker.gradle', 'docker.gradle', this, {});
      }
    }
    done();
  },

  install: function () {
    if (this.dockerType == 'dockerpush') {
      var done = this.async();
      this.dockerImage = this.dockerLogin.toLowerCase() + '/' + this.baseName.toLowerCase();
      this.dockerImageTag = this.dockerImage + ':' + this.dockerTag;
      var dockerCommand = 'mvn package -Pprod -DskipTests=true docker:build';
      if (jhipsterVar.buildTool == 'gradle') {
        dockerCommand = './gradlew -Pprod bootRepackage -x test buildDocker';
      }
      dockerCommand += ' && docker tag -f ' + this.packageName + '/' + this.baseName.toLowerCase() + ':tmp ' + this.dockerImageTag;
      if (this.dockerPushToHub) {
        dockerCommand += ' && docker push ' + this.dockerImageTag;
      }

      this.log('\nBuilding the image: ' + chalk.cyan.bold(this.dockerImageTag) + '\nThis may take several minutes...\n');
      var child = exec(dockerCommand, function (err, stdout) {
        if (err) {
          this.abort = true;
          this.log(chalk.red.bold('ERROR!'));
          this.log(err);
        }
        done();
      }.bind(this));

      child.stdout.on('data', function(data) {
        process.stdout.write(data.toString());
      }.bind(this));
    }
  },

  end: function () {
    switch (this.dockerType) {
      case 'dockercompose': {
        this.log('\n' + chalk.bold.green('##### USAGE #####'));
        if (this.prodDatabaseType != 'cassandra') {
          if (jhipsterVar.devDatabaseType != 'h2Disk' && jhipsterVar.devDatabaseType != 'h2Memory') {
            this.log('Start services in Development Profile');
            this.log('- launch: ' + chalk.cyan('docker-compose -f src/main/docker/dev.yml up -d\n'));
          }
          this.log('Start services in Production Profile');
          this.log('- launch: ' + chalk.cyan('docker-compose -f src/main/docker/prod.yml up -d\n'));
        } else {
          this.log('Start Cassandra in Development Profile');
          this.log('1) build: ' + chalk.cyan('docker-compose -f src/main/docker/dev.yml build'));
          this.log('2) launch: ' + chalk.cyan('docker-compose -f src/main/docker/dev.yml up -d'));
          this.log('3) copy cql: ' + chalk.cyan('docker cp src/main/resources/config/cql/ ' + this.baseName.toLowerCase() + '-dev-cassandra:/'));
          this.log('4) init database with cql: ' + chalk.cyan('docker exec -it ' + this.baseName.toLowerCase() + '-dev-cassandra init\n'));

          this.log('Start Cluster Cassandra in Production Profile');
          this.log('1) build: ' + chalk.cyan('docker-compose -f src/main/docker/prod.yml build'));
          this.log('2) launch: ' + chalk.cyan('docker-compose -f src/main/docker/prod.yml up -d'));
          this.log('3) copy cql: ' + chalk.cyan('docker cp src/main/resources/config/cql/ ' + this.baseName.toLowerCase() + '-cassandra:/'));
          this.log('4) init database with cql: ' + chalk.cyan('docker exec -it ' + this.baseName.toLowerCase() + '-cassandra init'));
          this.log('4) optional - launch X nodes (with X>=3): ' + chalk.cyan('docker-compose -f src/main/docker/prod.yml scale ' + this.baseName.toLowerCase() + '-cassandra-node=X'));
          this.log('5) access to OpsCenter: ' + chalk.cyan('http://localhost:8888'));
          this.log('6) add in your ' + chalk.cyan('application-prod.yml') + ' every IP of containers at ' + chalk.cyan('spring.data.cassandra.contactPoints\n'));
        }

        this.log('Start Sonar instance');
        this.log('- launch: ' + chalk.cyan('docker-compose -f src/main/docker/sonar.yml up -d\n'));

        break;
      }
      case 'automated': {
        this.log('\n' + chalk.bold.green('##### USAGE #####'));
        this.log('To param your project as Automated build:');
        this.log('- go to https://hub.docker.com/r/' + this.dockerLogin + '/');
        this.log('- menu Create: Create Automated Build');
        this.log('    - select the repository ' + chalk.cyan.bold(this.dockerRepoGithub));
        this.log('    - put a description, then click on create');
        this.log('- go to Build Settings');
        this.log('    - choose your branch or let master by default');
        this.log('    - put this Dockerfile location: ' + chalk.cyan.bold('src/main/docker/hub/'));
        this.log('    - click on Save Changes');
        this.log('- return to this project: git commit and push these changes!\n');
        this.log('- go to Build details: it should be a new line with ' + chalk.cyan.bold('Building'));
        this.log('- go to Repo info and copy/paste in Full description the ' + chalk.cyan.bold('src/main/docker/app-hub.yml\n'));
        break;
      }
      case 'dockerpush': {
        if (this.abort) break;
        this.log('\n' + chalk.bold.green('##### USAGE #####'));
        if (this.dockerPushToHub) {
          this.log('Your image should now be live at:\n- ' + chalk.cyan.bold('https://hub.docker.com/r/' + this.dockerImage + '/tags/\n'));
          this.log('- go to Repo info and copy/paste in Full description the ' + chalk.cyan.bold('src/main/docker/app.yml\n'));
        }
        this.log('You can test your local image ' + chalk.cyan.bold(this.dockerImageTag));
        if (this.prodDatabaseType == 'cassandra') {
          this.log('- docker-compose -f docker-compose-prod.yml up -d');
          this.log('- wait at least 30sec to let docker up');
          this.log('- docker exec -it ' + this.baseName.toLowerCase() + '-cassandra init');
        }
        this.log('- docker-compose -f src/main/docker/app.yml up');
        if (this.dockerBaseImage == 'java:openjdk-8u66-jre') {
          this.log('- Access URL: http://localhost:8080/\n');
        } else if (this.dockerBaseImage == 'tomcat:8.0.30-jre8') {
          this.log('- Admin Tomcat URL (with tomcat/JH!pst3r): http://localhost:8080/');
          this.log('- Access URL: http://localhost:8080/' + this.dockerBaseUrl + '/\n');
        } else if (this.dockerBaseImage == 'jboss/wildfly:9.0.1.Final') {
          this.log('- Admin WildFly URL (with admin/JH!pst3r): http://localhost:9990/');
          this.log('- Access URL: http://localhost:8080/' + this.dockerBaseUrl + '/\n');
        }
        break;
      }
    }
  }
});
