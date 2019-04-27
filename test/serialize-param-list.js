const serialize = require('../dist').serializeParamList;
const expect = require('chai').expect;

describe("Parameterized Lists", () => {

  it('should serialize param-lists', () => {

    const input = [
      ['foo', {a: 'b'}],
      ['bar', {c: 2}]
    ];
    expect(
      serialize(input)
    ).to.eql('foo;a="b", bar;c=2');

  });

});
