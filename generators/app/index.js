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
            })
        },
        displayLogo: function() {
            console.log(chalk.bold(chalk.cyan(
                '\n' +
                '                              ##        .\n' +
                '                        ## ## ##       ==\n' +
                '                     ## ## ## ##      ===\n' +
                '                 /""""""""""""""""\\___/ ===\n' +
                '            ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~\n' +
                '                 \\______ o          __/\n' +
                '                   \\    \\        __/\n' +
                '                    \\____\\______/\n')));
        }
    }
});
    
