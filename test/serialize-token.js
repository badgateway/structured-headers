const Serializer = require('../dist/serializer').default;
const expect = require('chai').expect;

describe("Tokens", () => {

  it('should serialize tokens', () => {

    const serializer = new Serializer();
    const input = 'foo';
    expect(
      serializer.serializeToken(input)
    ).to.eql('foo');

  });

  it('should fail when serializing tokens with invalid characters', () => {

    const serializer = new Serializer();
    const input = '"';
    expect(
      () => serializer.serializeToken(input)
    ).to.throw(Error)

  });
});
