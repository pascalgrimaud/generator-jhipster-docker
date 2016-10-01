# generator-jhipster-docker
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, additional Docker support in your JHipster application

<div align="center">
  <a href="http://jhipster.github.io">
    <img src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/logo-jhipster.png">
  </a>
  <a href="https://www.docker.com/">
    <img width=200px src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/logo-docker.png">
  </a>
</div>


# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application. This module is used to :

- Generate Dockerfile for Automated build at [Docker Hub](https://hub.docker.com/)
- Generate additional docker-compose services
- Change the default Dockerfile


# Table of contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
  * [1 - Automated build at the <a href="https://hub.docker.com">Docker Hub</a>](#1---automated-build-at-the-docker-hub)
    * [1.1 - Description](#11---description)
    * [1.2 - Generate the files](#12---generate-the-files)
    * [1.3 - Set your Docker Hub project](#13---set-your-docker-hub-project)
      * [At GitHub](#at-github)
      * [At Docker Hub](#at-docker-hub)
  * [2 - Generate additional docker-compose services](#2---generate-additional-docker-compose-services)
    * [2.1 - MailDev](#21---maildev)
  * [3 - Change the default Dockerfile](#3---change-the-default-dockerfile)
    * [3.1 - Description](#31---description)
    * [3.2 - Examples](#32---examples)
      * [Default option](#default-option)
* [License](#license)


# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

You have to install Docker and Docker Compose:

- [Docker](https://docs.docker.com/installation/#installation)
- [Docker Compose](https://docs.docker.com/compose/install)

To use *Automated build*, you have to create an account at:

- [https://hub.docker.com/](https://hub.docker.com/)


# Installation

To install this module:

```bash
npm install -g generator-jhipster-docker
```

To update this module:

```bash
npm update -g generator-jhipster-docker
```

# Usage

To run the module on a JHipster generated application:

```bash
yo jhipster-docker
```

You can use this command to generate the Dockerfile for Automated build with default options:

```bash
yo jhipster-docker default
```

To force the generator:

```bash
yo jhipster-docker default --force
```



## 1 - Automated build at the [Docker Hub](https://hub.docker.com)

### 1.1 - Description

When using the option *Generate Dockerfile for Automated build*, [Docker Hub](https://hub.docker.com) will build a Docker image everytime you commit to your repository.

### 1.2 - Generate the files

- Launch : `yo jhipster-docker`
- Select the option : `Generate Dockerfile for Automated build at https://hub.docker.com/`
- Answer the question:
    - Put your Docker Hub ID

### 1.3 - Set your Docker Hub project

#### At GitHub

- Go to settings > Webhooks & services
- Verify the services: Docker => edit
- Click [x] active
- Click on update service
- Then, the next time you make a commit+push, the service Docker must be :white_check_mark: Docker


#### At Docker Hub

- Go to [https://hub.docker.com/r/username/](https://hub.docker.com/r/username/) (replace username by yours)
- Menu Create:
    - Select Create Automated Build
    - Select the repository
    - Put a description, then click on create
<div align="center">
  <a href="http://jhipster.github.io">
    <img src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/automated-step1.png">
  </a>
  <br/>
  <a href="https://www.docker.com/">
    <img src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/automated-step2.png">
  </a>
</div>


- Go to Build Settings
    - Choose your branch or let master by default
    - Put this Dockerfile location: /
    - Click on Save Changes
<div align="center">
  <a href="https://www.docker.com/">
    <img src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/automated-step3.png">
  </a>
</div>


- Return to this project: git commit and push these changes!
- Go to Build details: it should be a new line with Building


## 2 - Generate additional docker-compose services

### 2.1 - MailDev

The project [djfarrelly/maildev](https://github.com/djfarrelly/MailDev) is a simple way to test your project’s generated emails during development with an easy to use web interface.

You can launch: `docker-compose -f src/main/docker/smtp.yml up`

You can access to it: [http://localhost:1080](http://localhost:1080)


## 3 - Change the default Dockerfile

### 3.1 - Description

On a generated project with JHipster, the file src/main/docker/Dockerfile is
used to build a Docker image for running the JHipster application.
This default image used [java:openjdk-8-jre-alpine](https://hub.docker.com/_/java/) as base image.

This option proposed to use [tomcat:8.0.36-jre8-alpine](https://hub.docker.com/_/tomcat/) instead.

With maven: `./mvnw clean package -Pprod docker:build`

With gradle: `./gradlew clean bootRepackage -Pprod buildDocker`

You can read this documentation for more details:
[spring-boot-docker](https://spring.io/guides/gs/spring-boot-docker/)


### 3.2 - Examples

#### Default option

- Use this `.yo-rc.json` to generate your JHipster application (all options are default):

```yaml
{
  "generator-jhipster": {
    "jhipsterVersion": "3.6.1",
    "baseName": "jhipster",
    "packageName": "com.mycompany.myapp",
    "packageFolder": "com/mycompany/myapp",
    "serverPort": "8080",
    "authenticationType": "session",
    "hibernateCache": "ehcache",
    "clusteredHttpSession": "no",
    "websocket": "no",
    "databaseType": "sql",
    "devDatabaseType": "h2Disk",
    "prodDatabaseType": "mysql",
    "searchEngine": "no",
    "buildTool": "maven",
    "enableSocialSignIn": false,
    "rememberMeKey": "7a8b2edfaf2353b83e9fe934a9a60e1a7992f399",
    "useSass": false,
    "applicationType": "monolith",
    "testFrameworks": [
      "gatling"
    ],
    "jhiPrefix": "jhi",
    "enableTranslation": true,
    "nativeLanguage": "en",
    "languages": [
      "en"
    ]
  }
}
```

- Launch : `yo jhipster-docker`
- Select the option : `Change the default Dockerfile`
- Select: `tomcat:8.0.36-jre8-alpine`
- Type: `jhipster`
- Type `a` to resolve all conflicts
- Build the new docker image: `./mvnw clean package -Pdev docker:build`
- Start the docker image: `docker run --rm -p 8080:8080 jhipster`
- Go to tomcat (tomcat/JH!pst3r): [http://localhost:8080](http://localhost:8080)
- Go to the application: [http://localhost:8080/jhipster](http://localhost:8080/jhipster)

You can define or override other spring boot, using environment variables


# License

Apache-2.0 © [Pascal Grimaud](https://twitter.com/pascalgrimaud) and the respective JHipster contributors

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-docker.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-docker
[travis-image]: https://travis-ci.org/pascalgrimaud/generator-jhipster-docker.svg?branch=master
[travis-url]: https://travis-ci.org/pascalgrimaud/generator-jhipster-docker
[daviddm-image]: https://david-dm.org/pascalgrimaud/generator-jhipster-docker.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/pascalgrimaud/generator-jhipster-docker
