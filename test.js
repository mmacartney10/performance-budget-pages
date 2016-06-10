var expect = require('chai').expect;
var performanceBudgetPages = require('./index.js');

var options = {
  performanceBudgetPath: './data/performanceBudget.json',
  outputPath: './data/output.json',
  urls: [
    'http://localhost:7000/',
    'http://localhost:7000/test'
  ]
};

describe('potter kata', function () {

  it('should not fail', function () {
    performanceBudgetPages(options);
    expect(1).to.equal(1);
  });
});
