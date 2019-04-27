const serialize = require('../dist').serializeDictionary;
const expect = require('chai').expect;

describe("Dictionaries", () => {

  it('should serialize dictionaries', () => {

    const input = {a: 5, b: true, c: 'foo'};
    expect(
      serialize(input)
    ).to.eql('a=5, b=?1, c="foo"');

  });

  it('should fail when serializing dictionaries with keys outside the valid range', () => {

    const input = {'%$%': 5};
    expect( () => serialize(input) ).to.throw(Error);

  });

});