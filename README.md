# generator-jhipster-docker
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> JHipster module, additional Docker support in your JHipster application

<div align="center">
  <a href="http://www.jhipster.tech/">
    <img src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/logo-jhipster.png">
  </a>
  <a href="https://www.docker.com/">
    <img width=200px src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/logo-docker.png">
  </a>
</div>


# Introduction

This is a [JHipster](http://www.jhipster.tech/) module, that is meant to be used in a JHipster application. This module is used to generate a:

- Dockerfile for Automated build at [Docker Hub](https://hub.docker.com/)
- Docker Compose file for using a Local SMTP Server with [MailDev](https://github.com/djfarrelly/MailDev/)


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
* [License](#license)


# Prerequisites

As this is a [JHipster](http://www.jhipster.tech/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](http://www.jhipster.tech/installation/)

You have to install Docker and Docker Compose:

- [Docker](https://docs.docker.com/installation/#installation)
- [Docker Compose](https://docs.docker.com/compose/install)

To use *Automated build*, you have to create an account at:

- [https://hub.docker.com/](https://hub.docker.com/)


# Installation

To install this module:

```bash
yarn global add generator-jhipster-docker
```

To update this module:

```bash
yarn global upgrade generator-jhipster-docker
```

# Usage

To run the module on a JHipster generated application:

```bash
yo jhipster-docker
```

You can use this command to generate the Dockerfile for Automated build:

```bash
yo jhipster-docker default
```

To force the generator:

```bash
yo jhipster-docker default --force
```



## 1 - Automated build at the [Docker Hub](https://hub.docker.com)

### 1.1 - Description

When using the option *Dockerfile for Automated build*, [Docker Hub](https://hub.docker.com) will build a Docker image everytime you commit to your repository.

### 1.2 - Generate the files

- Launch : `yo jhipster-docker`
- Select the option : `Dockerfile for Automated build at https://hub.docker.com/`

### 1.3 - Set your Docker Hub project

#### At GitHub

- Go to Settings > Integrations & services
- Add service and select Docker
- Click [x] active
- Click on update service
- Back to Integration & services, Docker must be :white_check_mark: Docker


#### At Docker Hub

- Go to [https://hub.docker.com/r/YOUR_DOCKER_ID/](https://hub.docker.com/r/YOUR_DOCKER_ID/) (replace `YOUR_DOCKER_ID` by yours)
- Menu Create
    - Select Create Automated Build
    - Select the repository of your project
    - Put a description, then click on create
<div align="center">
  <a href="http://www.jhipster.tech/">
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


## 2 - Local SMTP Server

### 2.1 - MailDev

The project [djfarrelly/maildev](https://github.com/djfarrelly/MailDev) is a simple way to test your project’s generated emails during development with an easy to use web interface.

You can launch: `docker-compose -f src/main/docker/smtp.yml up`

You can access to it: [http://localhost:1080](http://localhost:1080)


# License

Apache-2.0 © [Pascal Grimaud](https://twitter.com/pascalgrimaud) and the respective JHipster contributors

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-docker.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-docker
[travis-image]: https://travis-ci.org/pascalgrimaud/generator-jhipster-docker.svg?branch=master
[travis-url]: https://travis-ci.org/pascalgrimaud/generator-jhipster-docker
[daviddm-image]: https://david-dm.org/pascalgrimaud/generator-jhipster-docker.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/pascalgrimaud/generator-jhipster-docker
