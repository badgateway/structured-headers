const parseDictionary = require('../index').parseDictionary;
const expect = require('chai').expect;

describe("testing parsing structured headers", () => {

  it('should parse dictionaries', () => {

    var input = 'foo=1.23, en="Applepie", da=*w4ZibGV0w6ZydGUK*';
    var output = parseDictionary(input);

    var expected = {
      foo: 1.23,
      en: 'Applepie',
      da: Buffer.from('w4ZibGV0w6ZydGUK', 'base64')
    };

    expect(output).to.deep.equal(expected);

  });

});
