'use strict';

var moment = require('moment');

var co = require('co');
var MongoClient = require('mongodb').MongoClient;

var storeAllData  = co.wrap(function* (url, collection, myDocuments, aggregateCollection) {
  yield storeFlatsAndPrices(url, collection, myDocuments);
  yield calculateAndStoreAggregateData(url, collection, aggregateCollection);
});

var storeFlatsAndPrices = co.wrap(function* (url, collection, myDocuments) {
  var db = yield MongoClient.connect(url);
  var r = yield db.collection(collection).insertMany(myDocuments);
  db.close();
});

var calculateAndStoreAggregateData = co.wrap(function* (dbURL, collection, aggregateCollection) {

  const item_id = {};
  const currentDate = new Date();
  item_id["id"] = collection;
  item_id["date"] = currentDate;

  const item = {};
  item["_id"] = item_id;

  item["countDocuments"] =  yield countDocuments(dbURL, collection, currentDate);
  item["countNullPrice"] =  yield countNullPrice(dbURL, collection);
  item["countNaNPrice"] =  yield countNaNPrice(dbURL, collection);
  item["avgPrice"] = yield calculateAveragePrice(dbURL, collection);

  var db = yield MongoClient.connect(dbURL);
  var r = yield db.collection(aggregateCollection).insertOne(item);
  db.close();
});

var countDocuments = co.wrap(function* (url, collection, limitDate) {

  var limitDateLimit = moment(limitDate).add(1, 'days');

  var db = yield MongoClient.connect(url);
  var count = yield db.collection(collection).find(
      {"_id.date":
        {
          $gte: new Date(getIsoDateFormat(limitDate)),
          $lt: new Date(getIsoDateFormat(limitDateLimit))
        }
      }
    ).count();
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

var getIsoDateFormat = function (theDate) {
  var momentDate = moment(theDate);
  return momentDate.format("YYYY-MM-DD") + "T00:00:00.000Z";
}

module.exports = {
  storeAllData: storeAllData,
  countDocuments: countDocuments,
  dropCollection: dropCollection,
  getIsoDateFormat: getIsoDateFormat
}
