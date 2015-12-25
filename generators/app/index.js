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
      if (jhipsterVar.prodDatabaseType == 'oracle') {
        console.log(chalk.red.bold('ERROR!') + ' Oracle isn\'t on the boat...\n');
        process.exit(1);
      }
    },
    checkDocker: function () {
      var done = this.async();
      exec('docker --version', function (err) {
        if (err) {
          console.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker installed.\n' +
            '         Read http://docs.docker.com/engine/installation/#installation\n');
        }
        done();
      }.bind(this));
    },
    checkDockerCompose: function () {
      var done = this.async();
      exec('docker-compose --version', function (err) {
        if (err) {
          console.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker-compose installed.\n' +
            '         Read https://docs.docker.com/compose/install/\n');
        }
        done();
      }.bind(this));
    },
    checkGithubUrl: function () {
      this.defaultGithubUrl = githubUrl.sync();
      if (this.defaultGithubUrl == null) {
        this.defaultGithubUrl = 'https://github.com/username/' + jhipsterVar.baseName + '.git';
        console.log(chalk.yellow.bold('WARNING!') + ' This project doesn\'t have a remote-origin GitHub.\n' +
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
          {name: 'Local build and push image to https://hub.docker.com/', value: 'dockerpush'}
        ],
        default: 'dockercompose'
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
          return response.dockerType != 'automated';
        },
        type: 'confirm',
        name: 'dockerVolume',
        message: 'Do you want to use volume?',
        default: false
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

    // Create docker-compose files
    if (this.dockerType == "dockercompose") {
      this.template('docker/_sonar.yml', 'docker/sonar.yml', this, {});
      if (this.devDatabaseType != "h2Disk" && this.devDatabaseType != "h2Memory" && this.devDatabaseType != "oracle") {
        this.template('_docker-compose.yml', 'docker-compose.yml', this, {});
      }
      if (this.prodDatabaseType != "oracle" || searchEngine == "elasticsearch") {
        this.template('_docker-compose-prod.yml', 'docker-compose-prod.yml', this, {});
      }
      if (this.devDatabaseType == "cassandra") {
          this.template('_Cassandra-Dev.Dockerfile', 'Cassandra-Dev.Dockerfile', this, {});
          this.template('_Cassandra-Prod.Dockerfile', 'Cassandra-Prod.Dockerfile', this, {});
          this.template('docker/cassandra/_cassandra.sh', 'docker/cassandra/cassandra.sh', this, {});
          this.template('docker/opscenter/_Dockerfile', 'docker/opscenter/Dockerfile', this, {});
      }
    }

    // Create Dockerfile for automated build at docker-hub
    if (this.dockerType == "automated") {
      this.template('docker/hub/_Dockerfile', 'docker/hub/Dockerfile', this, {});
      this.template('_run.sh', 'docker/hub/run.sh', this, {});
      this.template('docker/_app.yml', 'docker/app-hub.yml', this, {});
    }

    // Create Dockerfile for pushing to docker-hub
    if (this.dockerType == "dockerpush") {
      this.template('docker/push/_Dockerfile', 'docker/push/Dockerfile', this, {});
      this.template('_run.sh', 'docker/push/run.sh', this, {});
      this.template('docker/_app.yml', 'docker/app.yml', this, {});
      if (jhipsterVar.buildTool == 'maven') {
        jhipsterFunc.addMavenPlugin('com.spotify', 'docker-maven-plugin', '0.3.7',
          '                <configuration>\n' +
          '                    <imageName>' + this.packageName.toLowerCase() + '/' + this.baseName.toLowerCase() + ':tmp</imageName>\n' +
          '                    <dockerDirectory>docker/push</dockerDirectory>\n' +
          '                    <resources>\n' +
          '                        <resource>\n' +
          '                            <targetPath>/</targetPath>\n' +
          '                            <directory>${project.build.directory}</directory>\n' +
          '                            <include>${project.build.finalName}.war</include>\n' +
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
        dockerCommand = './gradlew -Pprod build -x test buildDocker';
      }
      dockerCommand += ' && docker tag -f ' + this.packageName + '/' + this.baseName.toLowerCase() + ':tmp ' + this.dockerImageTag;
      if (this.dockerPushToHub) {
        dockerCommand += ' && docker push ' + this.dockerImageTag;
      }

      console.log('\nBuilding the image: ' + chalk.cyan.bold(this.dockerImageTag) + '\nThis may take several minutes...\n');
      var child = exec(dockerCommand, function (err, stdout) {
        if (err) {
          this.abort = true;
          console.log(chalk.red.bold('ERROR!'));
          console.log(err);
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
        console.log('\n' + chalk.bold.green('##### USAGE #####'));
        if (this.prodDatabaseType != 'cassandra') {
          if (jhipsterVar.devDatabaseType != 'h2Disk' && jhipsterVar.devDatabaseType != 'h2Memory') {
            console.log('Start services in Development Profile');
            console.log('- launch: ' + chalk.cyan('docker-compose up -d\n'));
          }
          console.log('Start services in Production Profile');
          console.log('- launch: ' + chalk.cyan('docker-compose -f docker-compose-prod.yml up -d\n'));
        } else {
          console.log('Start Cassandra in Development Profile');
          console.log('1) build: ' + chalk.cyan('docker-compose build'));
          console.log('2) launch: ' + chalk.cyan('docker-compose up -d'));
          console.log('3) init database with cql: ' + chalk.cyan('docker exec -it ' + this.baseName.toLowerCase() + '-dev-cassandra init\n'));

          console.log('Start Cluster Cassandra in Production Profile');
          console.log('1) build: ' + chalk.cyan('docker-compose -f docker-compose-node.yml build'));
          console.log('2) launch: ' + chalk.cyan('docker-compose -f docker-compose-node.yml up -d'));
          console.log('3) init database with cql: ' + chalk.cyan('docker exec -it ' + this.baseName.toLowerCase() + '-cassandra init'));
          console.log('4) optional - launch X nodes (with X>=3): ' + chalk.cyan('docker-compose -f docker-compose-node.yml scale ' + this.baseName.toLowerCase() + '-cassandra-node=X'));
          console.log('5) access to OpsCenter: ' + chalk.cyan('http://localhost:8888'));
          console.log('6) add in your ' + chalk.cyan('application-prod.yml') + ' every IP of containers at ' + chalk.cyan('spring.data.cassandra.contactPoints\n'));
        }

        console.log('Start Sonar instance');
        console.log('- launch: ' + chalk.cyan('docker-compose -f docker/sonar.yml up -d\n'));

        break;
      }
      case 'automated': {
        console.log('\n' + chalk.bold.green('##### USAGE #####'));
        console.log('To param your project as Automated build:');
        console.log('- go to https://hub.docker.com/r/' + this.dockerLogin + '/');
        console.log('- menu Create: Create Automated Build');
        console.log('    - select the repository ' + chalk.cyan.bold(this.dockerRepoGithub));
        console.log('    - put a description, then click on create');
        console.log('- go to Build Settings');
        console.log('    - choose your branch or let master by default');
        console.log('    - put this Dockerfile location: ' + chalk.cyan.bold('/docker/hub/'));
        console.log('    - click on Save Changes');
        console.log('- return to this project: git commit and push these changes!\n');
        console.log('- go to Build details: it should be a new line with ' + chalk.cyan.bold('Building'));
        console.log('- go to Repo info and copy/paste in Full description the ' + chalk.cyan.bold('docker/app-hub.yml\n'));
        break;
      }
      case 'dockerpush': {
        if (this.abort) break;
        console.log('\n' + chalk.bold.green('##### USAGE #####'));
        if (this.dockerPushToHub) {
          console.log('Your image should now be live at:\n- ' + chalk.cyan.bold('https://hub.docker.com/r/' + this.dockerImage + '/tags/\n'));
          console.log('- go to Repo info and copy/paste in Full description the ' + chalk.cyan.bold('docker/app.yml\n'));
        }
        console.log('You can test your local image ' + chalk.cyan.bold(this.dockerImageTag));
        if (this.prodDatabaseType == 'cassandra') {
          console.log('- docker-compose -f docker-compose-prod.yml up -d');
          console.log('- wait at least 30sec to let docker up');
          console.log('- docker exec -it ' + this.baseName.toLowerCase() + '-cassandra init');
        }
        console.log('- docker-compose -f docker/app.yml up\n');
        break;
      }
    }
  }
});
