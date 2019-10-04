const serialize = require('../dist').serializeList;
const expect = require('chai').expect;

describe("Lists", () => {

  it('should serialize lists', () => {

    const input = [
      {value: 'foo'},
      {value: 'bar'},
      {value: 5},
      {value: true},
      {value: ['a', 'b'], parameters: { foo: -5, bar: 5.5 }},
    ];
    expect(
      serialize(input)
    ).to.eql('"foo", "bar", 5, ?1, ("a" "b");foo=-5;bar=5.5');

  });

});
