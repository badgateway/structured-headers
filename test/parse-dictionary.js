const parseDictionary = require('../index').parseDictionary;
const expect = require('chai').expect;

describe("testing parsing structured headers", () => {

  const tests = [

    [
      'foo=1.23, en="Applepie", da=*w4ZibGV0w6ZydGUK*',
      {
        foo: 1.23,
        en: 'Applepie',
        da: Buffer.from('w4ZibGV0w6ZydGUK', 'base64')
      }
    ]

  ];

  for(const test of tests) {

    it('should parse: ' + test[0], () => {

      expect(parseDictionary(test[0])).to.deep.equal(test[1]);

    });

  }

});
