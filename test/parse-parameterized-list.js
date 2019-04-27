const parse = require('../dist').parseParamList;
const expect = require('chai').expect;

describe("Parameterized lists", () => {

  it('should parse parameterized lists', () => {

    var input = ' abc_123;a=1;b=2; c, def_456, ghi;q="19";r=foo';
    var output = parse(input);

    var expected = [
      ['abc_123', {a: 1, b: 2, c: null}],
      ['def_456', {}],
      ['ghi', {q: '19', r: 'foo'}]
    ];

    expect(output).to.deep.equal(expected);

  });

  it('should fail on invalid delimeters', () => {

    var input = 'abc_123;a=1 $';

    expect(function() {
      parse(input);
    }).to.throw(Error);

  });

  it('should fail if the list ends with a delimiter', () => {

    var input = 'abc_123;a=1,';

    expect(function() {
      parse(input);
    }).to.throw(Error);

  });

});
