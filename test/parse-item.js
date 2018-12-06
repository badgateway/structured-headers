const parse = require('../index').parseItem;
const expect = require('chai').expect;

describe("Lists", () => {

  it('should parse items with tokens', () => {

    var input = 'foo';
    var output = parse(input);
    var expected = 'foo';

  });

});
