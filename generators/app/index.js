'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var jhipster = require('generator-jhipster');
var exec = require('child_process').exec;
var githubUrl = require('remote-origin-url');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'docker'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

  initializing: {
    templates: function(args) {
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
    displayLogo: function() {
      console.log(chalk.cyan.bold(
        '\n' +
        '                              ##        .\n' +
        '                        ## ## ##       ==\n' +
        '                     ## ## ## ##      ===\n' +
        '                 /""""""""""""""""\\___/ ===\n' +
        '            ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~\n' +
        '                 \\______ o          __/\n' +
        '                   \\    \\        __/\n' +
        '                    \\____\\______/\n'));
      console.log(chalk.white.bold('              http://jhipster.github.io\n'));
    },
    checkOracle: function() {
      if (jhipsterVar.prodDatabaseType == 'oracle') {
        console.log(chalk.red.bold('ERROR!') + ' Oracle isn\'t on the boat...\n');
        process.exit(1);
      }
    },
    checkCassandra: function() {
      if (jhipsterVar.prodDatabaseType == 'cassandra') {
        console.log(chalk.yellow.bold('WARNING!') + ' Cassandra isn\'t fully supported yet...\n');
      }
    },
    checkDocker: function() {
      var done = this.async();
      exec('docker --version', function (err) {
        if (err) {
          console.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker installed.\n' +
            '         Read http://docs.docker.com/engine/installation/#installation\n');
        }
        done();
      }.bind(this));
    },
    checkDockerCompose: function() {
      var done = this.async();
      exec('docker-compose --version', function (err) {
        if (err) {
          console.log(chalk.yellow.bold('WARNING!') + ' You don\'t have docker-compose installed.\n' +
            '         Read https://docs.docker.com/compose/install/\n');
        }
        done();
      }.bind(this));
    },
    checkGithubUrl: function() {
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

  prompting: function() {
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
          return 'Your login is mandatory, cannot contain special characters or a blank space';
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
        type: 'confirm',
        name: 'dockerPushToHub',
        message: 'Docker Hub: do you want to push to docker-hub?',
        default: false
      }
    ];

    if (this.dockerDefault == 'dockercompose') {
      this.dockerType = 'dockercompose';
      this.dockerVolume = false;
      this.dockerVolumePath = '~/volumes/jhipster';
      done();
    } else {
      this.prompt(prompts, function (props) {
        this.props = props;
        // To access props later use this.props.someOption;
        this.dockerType = props.dockerType;
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
      if (this.devDatabaseType != "h2Disk" && this.devDatabaseType != "h2Memory" && this.devDatabaseType != "oracle") {
        this.template('_docker-compose.yml', 'docker-compose.yml', this, {});
      }
      if (this.prodDatabaseType != "oracle" || searchEngine == "elasticsearch") {
        this.template('_docker-compose-prod.yml', 'docker-compose-prod.yml', this, {});
      }
      if (this.devDatabaseType == "cassandra") {
        this.template('docker/cassandra/_Cassandra.Dockerfile', 'Cassandra.Dockerfile', this, {});
        this.template('docker/cassandra/_cassandra.sh', 'docker/cassandra/cassandra.sh', this, {});
        this.template('docker/cassandra/_Opscenter.Dockerfile', 'docker/cassandra/Opscenter.Dockerfile', this, {});
      }
      this.template('docker/_sonar.yml', 'docker/sonar.yml', this, {});
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

  end: function() {
    switch (this.dockerType) {
      case 'dockercompose': {
        console.log('\n' + chalk.bold.green('##### USAGE #####'));
        console.log('Start services with profile');
        if (jhipsterVar.devDatabaseType != 'h2Disk' && jhipsterVar.devDatabaseType != 'h2Memory') {
          console.log('- DEV:   docker-compose up -d');
        }
        console.log('- PROD:  docker-compose -f docker-compose-prod.yml up -d');
        console.log('Start sonar instance');
        console.log('- SONAR: docker-compose -f docker/sonar.yml up -d\n');
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
