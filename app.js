#!/usr/bin/env nodejs
'use strict';

var getWebData = require('./getDataWeb');
var dataStore = require('./dataStore');
var config = require('config');

var dbURL = 'mongodb://localhost:27017/prices';
var baseURL = config.get('baseURL');

var searchAction = function() {

  var filters = config.get('filters');
  for (var i=0; i<filters.length; i++) {
    var resultList = [];
    getWebData(baseURL, filters[i], 1, resultList, function(resultList, collection) {
      dataStore.storeDocuments(dbURL, collection, resultList);
      console.log('Job done!');
    });
  }

};

const program = require('commander');

program
  .command('insert')
  .description('insert stuff')
  .action(searchAction);

program.parse(process.argv);
