# generator-jhipster-docker
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, Docker support in your JHipster application

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

- Generate docker-compose services
- Generate files for Automated build at [Docker Hub](https://hub.docker.com/)
- Containerize your application and push image to [Docker Hub](https://hub.docker.com/)

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

You have to install Docker and Docker Compose:

- [Docker](https://docs.docker.com/installation/#installation)
- [Docker Compose](https://docs.docker.com/compose/install)

To use *Automated build* or *Containerize your application*, you have to create an account at:

- [https://hub.docker.com/](https://hub.docker.com/)

All these images come from the official [Docker Hub](https://hub.docker.com/):

- [MySQL](https://hub.docker.com/_/mysql/)
- [PostgreSQL](https://hub.docker.com/_/postgres/)
- [MongoDB](https://hub.docker.com/_/mongo/)
- [Cassandra](https://hub.docker.com/_/cassandra/)
- [Elasticsearch](https://hub.docker.com/_/elasticsearch/)
- [SonarQube](https://hub.docker.com/_/sonarqube/)

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

You can use this command to generate docker-compose services with default options:

```bash
yo jhipster-docker default
```

To force the generator:

```bash
yo jhipster-docker default --force
```


## 1 - Generate docker-compose services

### 1.1 - Description

When using the option *Generate docker-compose services*, if your project uses MySQL, PostgreSQL, MongoDB or Cassandra, these files will be generated in your folder project:

- docker-compose.yml
- docker-compose-prod.yml
- docker/sonar.yml

If your project uses Elasticsearch as search engine, the configuration will be included in the `docker-compose-prod.yml` file.

So you can use docker-compose to start your database in development or production profile.

The main JHipster Generator already generated the docker-compose services described here: [docker_compose](https://http://jhipster.github.io/docker_compose.html). You can use this option to use a specific version of database or to use volumes.

### 1.2 - Working with databases

#### 1.2.1 - Starting MySQL, PostgreSQL or MongoDB

**In development profile**:

```bash
docker-compose up -d
```

**In production profile** (it will start ElasticSearch too if you selected it as search engine):

```bash
docker-compose -f docker-compose-prod.yml up -d
```

#### 1.2.2 - Starting Cassandra the first time

**In development profile**:

Build the image, which will contain the CQL scripts generated by your project for initializing the database:

```bash
docker-compose build
```

Start the container (it will show the container id):

```bash
docker-compose up -d
```

Initialize the database by creating the Keyspace and the Tables:

```bash
docker exec -it "container id" init
```

**In production profile** (with Clusters):

Build the image:

```bash
docker-compose -f docker-compose-prod.yml build
```

Start the container (it will show the container id):

```bash
docker-compose -f docker-compose-prod.yml up -d
```

Initialize the database by creating the Keyspace and the Tables:

```bash
docker exec -it "container id" init
```

Add X other nodes (it's optional):

```bash
docker-compose -f docker-compose-prod.yml scale <name_of_your_app>-cassandra-node=X
```

Manage nodes with OpsCenter: [http://localhost:8888](http://localhost:8888)

Before starting your application in production profile, add in your `application-prod.yml` every IP of containers to the key `spring.data.cassandra.contactPoints`

#### 1.2.3 - Starting Cassandra the next times

**In development profile**:

```bash
docker-compose up -d
```

**In production profile**:

```bash
docker-compose -f docker-compose-prod.yml up -d
```

### 1.3 - Working with Sonar

When generating your application, the `docker/sonar.yml` is generated in your folder project.
So you can start a sonar instance to analyze your code:

Start a sonar instance:

```bash
docker-compose -f docker/sonar.yml up -d
```

Analyze your code with Maven:

```bash
mvn sonar:sonar
```

Analyze your code with Gradle:

```bash
./gradlew sonar
```

You can access to sonar: [http://localhost:9000](http://localhost:9000)

### 1.4 - Common commands

#### 1.4.1 - List the containers

You can use `docker ps -a` to list all the containers

    $ docker ps -a
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
    fc35e1090021        mysql               "/entrypoint.sh mysql"   4 seconds ago       Up 4 seconds        0.0.0.0:3306->3306/tcp   sampleapplication-mysql


#### 1.4.2 - Stop the containers

**In development profile**:

```bash
docker-compose stop
```

**In production profile**:

```bash
docker-compose -f docker-compose-prod.yml stop
```

You can use directly docker:

```bash
docker stop "container id"
```

When you stop a container, the data are not deleted, unless you delete the container.

#### 1.4.3 - Delete a container

:warning: **Warning!** All data will be deleted (unless you used volumes):

```bash
docker rm "container id"
```

## 2 - Automated build at the [Docker Hub](https://hub.docker.com)

### 2.1 - Description

When using the option *Generate files for Automated build*, [Docker Hub](https://hub.docker.com) will build a Docker image everytime you commit to your repository.

### 2.2 - Generate the files

- Launch : `yo jhipster-docker`
- Select the option : `Generate files for Automated build at https://hub.docker.com/`
- Answer all questions
    - Select the version of your database
    - Select the version of ElasticSearch
    - Put the URL of your Git repository
    - Put your Docker Hub username

### 2.3 - Set your Docker Hub project

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
    - Put this Dockerfile location: /docker/hub/
    - Click on Save Changes
<div align="center">
  <a href="https://www.docker.com/">
    <img src="https://github.com/pascalgrimaud/generator-jhipster-docker/raw/master/images/automated-step3.png">
  </a>
</div>


- Return to this project: git commit and push these changes!
- Go to Build details: it should be a new line with Building
- Go to Repo info and copy/paste in Full description the `docker/app-hub.yml`

## 3 - Local build and push image to [Docker Hub](https://hub.docker.com/)

### 3.1 - Description

This option is used to build a Docker image for running the JHipster application.
You can read this documentation for more details:
[spring-boot-docker](https://spring.io/guides/gs/spring-boot-docker/)

If you want, you can push your Docker image to Docker Hub.

:warning: **Warning!** Don't put your credentials in config files, if you decided to push your application to [Docker Hub](https://hub.docker.com/)

### 3.2 - Containerize your application

- Launch : `yo jhipster-docker`
- Select the option : `Containerize your application and push image to https://hub.docker.com/`
- Answer all questions
    - Select the version of your database
    - Select the version of ElasticSearch
    - Put your Docker Hub username
    - Put your the tag
    - Use volume or not
    - Choose if you want to push your image to [Docker Hub](https://hub.docker.com/)

:hourglass_flowing_sand: **Be patient!** This may take several minutes, depending on the speed of your connection.

### 3.3 - Examples

#### 3.3.1 - Default

#### 3.3.2 - Use external properties

#### 3.3.3 - Start in dev profile

# License

Apache-2.0 © [Pascal Grimaud](https://twitter.com/pascalgrimaud)

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-docker.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-docker
[travis-image]: https://travis-ci.org/pascalgrimaud/generator-jhipster-docker.svg?branch=master
[travis-url]: https://travis-ci.org/pascalgrimaud/generator-jhipster-docker
[daviddm-image]: https://david-dm.org/pascalgrimaud/generator-jhipster-docker.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/pascalgrimaud/generator-jhipster-docker
