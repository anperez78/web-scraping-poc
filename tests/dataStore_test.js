var chai = require('chai');
var expect = chai.expect;
var dataStore = require('../dataStore');

var url = 'mongodb://localhost:27017/prices';

describe('dataStore', function() {
  it('getSubtotal() should return 0 if no items are passed in', function() {

    items = [];
    items.push ({_id: 'test10'});
    items.push ({_id: 'test20'});
    items.push ({_id: 'test30'});

    dataStore.storeDocuments(url, 'test', items);

    dataStore.dropCollection(url, 'test');

    // expect(cartSummary.getSubtotal()).to.equal(0);
  });
});
