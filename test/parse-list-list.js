const parse = require('../dist').parseListList;
const expect = require('chai').expect;

describe("Lists of lists", () => {

  it('should parse lists of lists', () => {

    var input = '"foo";"bar", "baz", "bat"; "one"';
    var output = parse(input);

    var expected = [
      ['foo', 'bar'],
      ['baz'],
      ['bat', 'one'],
    ];

    expect(output).to.deep.equal(expected);

  });

  it('should fail when hitting a bad separator', () => {

    var input = '"foo";"bar", "baz", "bat"# "one"';
    expect(() => parse(input)).to.throw(Error);

  });

});
