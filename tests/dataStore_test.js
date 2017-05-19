var chai = require('chai');
var expect = chai.expect;

var dataStore = require('../dataStore');

var url = 'mongodb://localhost:27017/prices';

describe('dataStore', function() {
  it('storeDocuments stores documents & dropCollection drops a entire collection', function* () {

    items = [];
    items.push ({_id: 'test10'});
    items.push ({_id: 'test20'});
    items.push ({_id: 'test30'});

    dataStore.storeDocuments(url, 'test', items, false);
    console.log('documents stored');
    expect(yield dataStore.countDocuments(url, 'test')).to.equal(3);
    dataStore.dropCollection(url, 'test');
    expect(yield dataStore.countDocuments(url, 'test')).to.equal(0);
  });
});
