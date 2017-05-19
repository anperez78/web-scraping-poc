'use strict';

var co = require('co');
var MongoClient = require('mongodb').MongoClient;

var storeDocuments = function (url, collection, myDocuments, storeAggregateDataFlag) {
  co(function*() {
    var db = yield MongoClient.connect(url);
    var r = yield db.collection(collection).insertMany(myDocuments);
    db.close();
    if (storeAggregateDataFlag) {
      calculateAndStoreAggregateData(url, collection);
    }
  }).catch(function(err) {
    console.log(err.stack);
  });
};

var calculateAndStoreAggregateData = function (dbURL, collection) {
  co(function*() {
      const item_id = {};
      item_id["id"] = collection;
      item_id["date"] =  new Date();

      const item = {};
      item["_id"] = item_id;

      item["countDocuments"] =  yield countDocuments(dbURL, collection);
      item["countNullPrice"] =  yield countNullPrice(dbURL, collection);
      item["countNaNPrice"] =  yield countNaNPrice(dbURL, collection);
      item["avgPrice"] = yield calculateAveragePrice(dbURL, collection);

      var db = yield MongoClient.connect(dbURL);
      var r = yield db.collection('aggregate_data').insertOne(item);
      db.close();
    }).catch(function(err) {
      console.log(err.stack);
    });
}

var countDocuments = co.wrap(function* (url, collection) {
  var db = yield MongoClient.connect(url);
  var count = yield db.collection(collection).find().count();
  db.close();
  console.log("Number of records for " + collection + " -> ", count);
  return count;
});

var countNullPrice = co.wrap(function* (url, collection) {
  var db = yield MongoClient.connect(url);
  var count = yield db.collection(collection).find({price: null}).count();
  db.close();
  console.log("Number of records with null price for " + collection + " -> ", count);
  return count;
});

var countNaNPrice = co.wrap(function* (url, collection) {
  var db = yield MongoClient.connect(url);
  var count = yield db.collection(collection).find({price: NaN}).count();
  db.close();
  console.log("Number of records with NaN price for " + collection + " -> ", count);
  return count;
});

var calculateAveragePrice = co.wrap(function* (url, collection) {
  var db = yield MongoClient.connect(url);
  var avgPrice = yield db.collection(collection).aggregate(
     [
       { $group: { _id: null, avg: { $avg: '$price' } } }
     ]
  ).toArray();
  db.close();

  if (avgPrice.length == 1) {
    console.log("Average price for for " + collection + " -> ", avgPrice[0].avg);
    return avgPrice[0].avg;
  }
  else return null;
});

var dropCollection = function(url, collection) {
  co(function*() {
    var db = yield MongoClient.connect(url);
    var avgPrice = yield db.collection(collection).drop();
    db.close();
  }).catch(function(err) {
    console.log(err.stack);
  });
}

module.exports = {
  storeDocuments: storeDocuments,
  countDocuments: countDocuments,
  dropCollection: dropCollection
}
