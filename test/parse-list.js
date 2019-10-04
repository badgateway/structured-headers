const parse = require('../dist').parseList;
const expect = require('chai').expect;

describe("Lists", () => {

  it('should parse lists', () => {

    var input = 'foo, bar, baz_45';
    var output = parse(input);

    var expected = [
      {value: 'foo', parameters: {}},
      {value: 'bar', parameters: {}},
      {value: 'baz_45', parameters: {}},
    ];

    expect(output).to.deep.equal(expected);

  });

  it('should parse strings with escaped sequences', () => {

    var input = 'foo, "stringA", "string\\"B\\"", "string\\\\C"';
    var output = parse(input);

    var expected = [
      {value: 'foo', parameters: {}},
      {value: 'stringA', parameters: {}},
      {value: 'string"B"', parameters: {}},
      {value: 'string\\C', parameters: {}},
    ];

    expect(output).to.deep.equal(expected);

  });

  it('should fail on invalid escape sequences', () => {

    var input = 'foo, "foo\\B"';

    expect(function() {
      parse(input);
    }).to.throw(Error);

  });

  it('should fail on invalid strings delimeters', () => {

    var input = 'foo, "foo';

    expect(function() {
      parse(input);
    }).to.throw(Error);

  });


  it('should fail on invalid binary sequences', () => {

    var input = 'foo, bar, *bla';

    expect(function() {
      parse(input);
    }).to.throw(Error);

  });

  it('should fail on invalid identifiers', () => {

    var input = 'foo, bar#';

    expect(function() {
      parse(input);
    }).to.throw(Error);

  });

  it('should fail if the list ends with a comma', () => {

    var input = 'foo,';

    expect(function() {
      parse(input);
    }).to.throw(Error);

  });

});
