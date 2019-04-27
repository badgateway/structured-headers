const serialize = require('../dist').serializeListList;
const expect = require('chai').expect;

describe("Lists", () => {

  it('should serialize lists', () => {

    const input = [[1, 'a'], [2, 'b'], [3, false], [4, 0.5]];
    expect(
      serialize(input)
    ).to.eql('1; "a", 2; "b", 3; ?0, 4; 0.5');

  });

});
