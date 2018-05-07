const expect = require('chai').expect;
const Parser = require('../src/parser');
const binaryTests = require('./httpwg-tests/binary.json');
const listTests = require('./httpwg-tests/list.json');
const numberTests = require('./httpwg-tests/list.json');
const stringTests = require('./httpwg-tests/string.json');

function addTest(test) {

  const parser = new Parser(test.raw.join(','));

  it(test.name, () => {
    let hadError = false;
    let result;
    try {
      switch(test.header_type) {
        case 'item' :
          result = parser.parseItem();
          break;
        case 'list' :
          result = parser.parseList();
          break;
      }
    } catch (e) {
      hadError = true;
      //console.log(e);
    }

    if (test.expected === false) {
      expect(hadError).to.equal(true);
    } else {
      expect(hadError).to.equal(false);

      if(result instanceof Buffer) {
        result = result.toString('utf-8');
      }
      expect(result).to.deep.equal(test.expected);
    }
  });

}

describe('HTTP-WG tests', () => {

  describe('binary.json', () => {

    for(const test of binaryTests) {

      addTest(test);

    }

  });

  describe('list.json', () => {

    for(const test of listTests) {

      addTest(test);

    }

  });

  describe('number.json', () => {

    for(const test of numberTests) {

      addTest(test);

    }

  });

  describe('string.json', () => {

    for(const test of stringTests) {

      addTest(test);

    }

  });

});
