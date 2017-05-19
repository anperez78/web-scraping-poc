#!/usr/bin/env nodejs
'use strict';

var getWebData = require('./getDataWeb');
var dataStore = require('./dataStore');
var config = require('config');

var baseURL = config.get('baseURL');

var storeData = function(resultList, collection) {
  const dbURL = 'mongodb://localhost:27017/prices';
  dataStore.storeDocuments(dbURL, collection, resultList, true);
  console.log('Job done!');
};

var searchAction = function() {
  var filters = config.get('filters');
  for (var i=0; i<filters.length; i++) {
    getWebData(baseURL, filters[i], 1, [], storeData);
  }
};

const program = require('commander');

program
  .command('search')
  .action(searchAction);

program.parse(process.argv);
