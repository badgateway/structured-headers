const parser = require('../index');
const expect = require('chai').expect;

describe("testing parsing structured headers", () => {

  it('should parse dictionaries', () => {

    var input = 'foo=1.23, en="Applepie", da=*w4ZibGV0w6ZydGUK*';
    var output = parser.parseDictionary(input);

    var expected = {
      foo: 1.23,
      en: 'Applepie',
      da: Buffer.from('w4ZibGV0w6ZydGUK', 'base64')
    };

    expect(output).to.deep.equal(expected);

  });

  it('should parse lists', () => {

    var input = 'foo, bar, baz_45';
    var output = parser.parseList(input);

    var expected = [
      'foo',
      'bar',
      'baz_45'
    ];

    expect(output).to.deep.equal(expected);

  });

  it('should parse parameterized lists', () => {

    var input = ' abc_123;a=1;b=2; c, def_456, ghi;q="19";r=foo';
    var output = parser.parseParameterizedList(input);

    var expected = [
      ['abc_123', {a: 1, b: 2, c: null}],
      ['def_456', {}],
      ['ghi', {q: '19', r: 'foo'}]
    ];

    expect(output).to.deep.equal(expected);

  });

});
