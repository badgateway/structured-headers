const serialize = require('../dist').serializeItem;
const expect = require('chai').expect;

describe("Items", () => {

  it('should serialize integers', () => {

    const input = 5;
    expect(
      serialize(input)
    ).to.eql('5');

  });
  it('should fail when serializing too large integers', () => {

    const input = Number.MAX_SAFE_INTEGER;
    expect( () => serialize(input) ).to.throw(Error);

  });

  it('should fail when serializing too large floats', () => {

    const input = 123456789012345.25;
    expect( () => serialize(input) ).to.throw(Error);

  });

  it('should serialize strings', () => {

    const input = "hello";
    expect(
      serialize(input)
    ).to.eql('"hello"');

  });
  it('should serialize booleans', () => {

    expect(
      serialize(true)
    ).to.eql('?1');
    expect(
      serialize(false)
    ).to.eql('?0');

  });

  it('should fail when serializing non-ascii strings', () => {

    const input = "hello 🕹";
    expect( () => serialize(input) ).to.throw(Error);

  });

  it('should fail when serializing objects', () => {

    const input = {};
    expect( () => serialize(input) ).to.throw(Error);

  });

  it('should serialize Buffer as base64', () => {

    const input = Buffer.from('hello');
    expect(
      serialize(input)
    ).to.eql('*aGVsbG8=*');

  });

});
