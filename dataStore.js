'use strict';

var co = require('co');
var MongoClient = require('mongodb').MongoClient;

var storeDocuments = function(url, collection, myDocuments) {
  co(function*() {
    var db = yield MongoClient.connect(url);
    console.log("Connected correctly to server");
    var r = yield db.collection(collection).insertMany(myDocuments);
    db.close();
  }).catch(function(err) {
    console.log(err.stack);
  });
};

var retrieveDocuments = function(url) {
  console.log ('not implemented yet');
}

module.exports = {
  storeDocuments: storeDocuments,
  retrieveDocuments: retrieveDocuments
}
