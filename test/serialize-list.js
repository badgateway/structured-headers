const serialize = require('../dist').serializeList;
const expect = require('chai').expect;

describe("Lists", () => {

  it('should serialize lists', () => {

    const input = ['foo', 'bar', 5, true];
    expect(
      serialize(input)
    ).to.eql('"foo", "bar", 5, ?1');

  });

});
