var chai = require('chai');
var expect = chai.expect;

var dataStore = require('../dataStore');

var url = 'mongodb://localhost:27017/prices';

const testData = function() {
  items = [];
  items.push ({_id: {id: 'test10', date: new Date('2011-04-11T20:20:30Z')}, price: 50});
  items.push ({_id: {id: 'test20', date: new Date('2011-04-11T10:40:30Z')}, price: 150});
  items.push ({_id: {id: 'test30', date: new Date('2011-04-11T10:30:30Z')}, price: 250});
  items.push ({_id: {id: 'test40', date: new Date('2011-04-14T14:20:30Z')}, price: 200});
  items.push ({_id: {id: 'test50', date: new Date('2011-04-15T10:20:30Z')}, price: 200});
  items.push ({_id: {id: 'test60', date: new Date('2011-04-15T10:20:30Z')}, price: 200});
  return items;
}

var cleanDatabase = function* () {
  console.log ('cleaning database');
  dataStore.dropCollection(url, 'test');
  dataStore.dropCollection(url, 'aggregate_data_test');
}

describe('dataStore', function() {

  it('getIsoDateFormat generate ISO date format', function* () {
    var testDate = new Date('2011-04-11T10:20:30Z');
    expect(dataStore.getIsoDateFormat(testDate)).to.equal("2011-04-11T00:00:00.000Z");
  });

  it('storeAllData stores all documents', function* () {
    yield cleanDatabase();
    const items = testData();
    yield dataStore.storeAllData(url, 'test', items, 'aggregate_data_test');
    expect(yield dataStore.countDocuments(url, 'test', new Date('2011-04-11T10:23:00Z'))).to.equal(3);
    expect(yield dataStore.countDocuments(url, 'test', new Date('2011-04-14T10:23:00Z'))).to.equal(1);
    expect(yield dataStore.countDocuments(url, 'test', new Date('2011-04-15T10:23:00Z'))).to.equal(2);
    expect(yield dataStore.countDocuments(url, 'aggregate_data_test', new Date())).to.equal(1);
    yield cleanDatabase();
  });

  it('calculateAveragePrice calculates the avg. price based on a date', function* () {
    yield cleanDatabase();
    const items = testData();
    yield dataStore.storeAllData(url, 'test', items, 'aggregate_data_test');
    expect(yield dataStore.calculateAveragePrice(url, 'test', new Date('2011-04-11T10:23:00Z'))).to.equal(150);
    yield cleanDatabase();
  });

});
