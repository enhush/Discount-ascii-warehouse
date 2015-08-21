'use strict';
angular.module('App', ['ngRoute','relativeDate','App.controllers','App.services','App.directives'])
    .value('BATCH_SIZE',50);