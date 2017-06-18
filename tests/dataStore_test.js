var chai = require('chai');
var expect = chai.expect;

var dataStore = require('../dataStore');

var url = 'mongodb://localhost:27017/prices';

describe('dataStore', function() {

  it('getIsoDateFormat generate ISO date format', function* () {
    var testDate = new Date('2011-04-11T10:20:30Z');
    expect(dataStore.getIsoDateFormat(testDate)).to.equal("2011-04-11T00:00:00.000Z");
  });

  it('storeAllData stores documents & dropCollection drops a entire collection', function* () {

    items = [];
    items.push ({_id: {id: 'test10', date: new Date('2011-04-11T10:20:30Z')}, price: 50});
    items.push ({_id: {id: 'test20', date: new Date('2011-04-11T10:20:30Z')}, price: 150});
    items.push ({_id: {id: 'test30', date: new Date('2011-04-14T10:20:30Z')}, price: 200});

    yield dataStore.storeAllData(url, 'test', items, 'aggregate_data_test');

    expect(yield dataStore.countDocuments(url, 'test', new Date('2011-04-11T10:23:00Z'))).to.equal(2);
    expect(yield dataStore.countDocuments(url, 'aggregate_data_test', new Date())).to.equal(1);

    dataStore.dropCollection(url, 'test');
    expect(yield dataStore.countDocuments(url, 'test', new Date('2011-04-11T10:23:00Z'))).to.equal(0);

    dataStore.dropCollection(url, 'aggregate_data_test');
    expect(yield dataStore.countDocuments(url, 'aggregate_data_test', new Date())).to.equal(0);

  });
});
