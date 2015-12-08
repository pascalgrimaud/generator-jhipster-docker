'use strict';
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
    templates: function() {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
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
    },
    checkOracle: function() {
      if (jhipsterVar.prodDatabaseType == 'oracle') {
        console.log(chalk.red.bold('ERROR!')
          + ' Oracle isn\'t on the boat...\n');
        process.exit(1);
      }
    },
    checkGradle: function() {
      if (jhipsterVar.buildTool == 'gradle') {
        console.log(chalk.red.bold('ERROR!')
          + ' Gradle isn\'t supported yet...\n');
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
          console.log(chalk.yellow.bold('WARNING!')
            + ' You don\'t have docker installed.\n'
            + 'Read http://docs.docker.com/engine/installation/#installation\n');
        }
        done();
      }.bind(this));
    },
    checkDockerCompose: function() {
      var done = this.async();
      exec('docker-compose --version', function (err) {
        if (err) {
          console.log(chalk.yellow.bold('WARNING!')
          +' You don\'t have docker-compose installed.\n'
          +'Read https://docs.docker.com/compose/install/\n');
        }
        done();
      }.bind(this));
    },
    checkGithubUrl: function() {
      this.defaultGithubUrl = githubUrl.sync();
      if (this.defaultGithubUrl == null) {
        this.defaultGithubUrl = 'https://github.com/username/'+this.appname+'.git';
        console.log(chalk.yellow.bold('WARNING!')
        +' This project doesn\'t have a remote-origin GitHub.\n'
        +'The option Automated build won\'t work correctly.\n');
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
          {name: 'Build and push image to https://hub.docker.com/', value: 'dockerpush'}
        ],
        default: 'dockercompose'
      },{
        when: function (response) {
          return response.dockerType == 'automated';
        },
        validate: function (input) {
          if (input != '') return true;
          return 'Your login is mandatory, cannot contain special characters or a blank space';
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
          return response.dockerType == 'dockerpush';
        },
        type: 'list',
        name: 'dockerPushToHub',
        message: 'Docker Hub: do you want to push to docker-hub?',
        choices: [
          {value: 'no', name: 'No'},
          {value: 'yes', name: 'Yes'}
        ],
        default: 0
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      this.dockerType = props.dockerType;
      this.dockerRepoGithub = props.dockerRepoGithub;
      this.dockerLogin = props.dockerLogin;
      this.dockerTag = props.dockerTag;
      this.dockerPushToHub = props.dockerPushToHub;

      done();
    }.bind(this));
  },

  writing: function () {
    var done = this.async();

    this.baseName = jhipsterVar.baseName;
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
        jhipsterFunc.addMavenPlugin('<plugin>\n'+
          '                <groupId>com.spotify</groupId>\n'+
          '                <artifactId>docker-maven-plugin</artifactId>\n'+
          '                <version>0.3.7</version>\n'+
          '                <configuration>\n'+
          '                    <imageName>tmp/'+this.baseName+'</imageName>\n'+
          '                    <dockerDirectory>docker/push</dockerDirectory>\n'+
          '                    <resources>\n'+
          '                        <resource>\n'+
          '                            <targetPath>/</targetPath>\n'+
          '                            <directory>${project.build.directory}</directory>\n'+
          '                            <include>${project.build.finalName}.war</include>\n'+
          '                        </resource>\n'+
          '                    </resources>\n'+
          '                </configuration>\n'+
          '            </plugin>');
      } else if (jhipsterVar.buildTool == 'gradle') {
        jhipsterFunc.addGradlePlugin('se.transmode.gradle','gradle-docker','1.2');
        jhipsterFunc.applyFromGradleScript('docker');
        // need function to add task
      }
    }
    done();
  },

  install: function () {
    if (this.dockerType == 'dockerpush') {
      var done = this.async();
      this.dockerImage = this.dockerLogin.toLowerCase()+'/'+this.baseName.toLowerCase();
      this.dockerImageTag = this.dockerImage+':'+this.dockerTag;
      var dockerCommand;
      if (this.buildTool == 'maven') {
        dockerCommand = 'mvn package -DskipTests=true docker:build';
        dockerCommand = dockerCommand + ' && mvn docker:tag -DforceTags=true -Dimage=tmp/'+this.baseName.toLowerCase()+' -DnewName='+this.dockerImageTag;
      } else if (this.buildTool == 'gradle') {
        dockerCommand = './gradlew -Pprod build buildDocker -x test';
        dockerCommand = dockerCommand + ' && docker tag -f tmp/'+this.baseName.toLowerCase()+' '+this.dockerImageTag;
      }
      if (this.dockerPushToHub == 'yes') {
        // dockerCommand = dockerCommand + ' && docker push '+this.dockerImageTag;
        dockerCommand = dockerCommand + ' && docker push pascalgrimaud/busybox:'+this.dockerTag; // TODO : change this / easy to upload :)
      }

      console.log("\nBuilding the image: "+chalk.cyan.bold(this.dockerImageTag)+"\nThis may take several minutes...\n");
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
        console.log('\n'+chalk.bold.green('USAGE:'));
        console.log('Start services with profile');
        console.log('- DEV:   docker-compose up -d');
        console.log('- PROD:  docker-compose -f docker-compose-prod.yml up -d');
        console.log('Start sonar instance');
        console.log('- SONAR: docker-compose -f docker/sonar.yml -d\n');
        break;
      }
      case 'automated': {
        console.log('\n'+chalk.bold.green('USAGE:'));
        console.log('To param your project as Automated build:');
        console.log('- go to https://hub.docker.com/r/'+this.dockerLogin+'/');
        console.log('- menu Create: Create Automated Build');
        console.log('- select the repository '+chalk.cyan(chalk.bold(this.dockerRepoGithub)));
        console.log('- put a description, then click on create');
        console.log('- go build settings');
        console.log('- [TODO description]'); // TODO : put description here
        console.log('- git commit and push these changes!\n');
        break;
      }
      case 'dockerpush': {
        if (this.abort) break;
        console.log('\n'+chalk.bold.green('USAGE:'));
        if (this.dockerPushToHub == 'yes') {
          console.log('Your image should now be live at:\n- '+chalk.cyan.bold('https://hub.docker.com/r/'+this.dockerImage+'/tags/\n'));
        }
        console.log('You can test your local image '+chalk.cyan.bold(this.dockerImageTag));
        if (this.prodDatabaseType == 'cassandra') {
          console.log('- docker-compose -f docker-compose-prod.yml up -d');
          console.log('- wait at least 30sec to let docker up');
          console.log('- docker exec -it '+this.baseName.toLowerCase()+'-cassandra init');
        }
        console.log('- docker-compose -f docker/app.yml up\n');
        break;
      }
    }
  }
});
