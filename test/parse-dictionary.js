const parse = require('../dist').parseDictionary;
const expect = require('chai').expect;

describe("Dictionaries", () => {

  it('should parse dictionaries', () => {

    var input = 'foo=1.23, en="Applepie", da=*w4ZibGV0w6ZydGUK*';
    var output = parse(input);

    var expected = {
      foo: {value: 1.23, parameters: {}},
      en: {value: 'Applepie', parameters: {}},
      da: {value: Buffer.from('w4ZibGV0w6ZydGUK', 'base64'), parameters: {}},
    };

    expect(output).to.deep.equal(expected);

  });

  it('should fail if a dictionary key appeared twice', () => {

    var input = 'foo=1.23, foo="bar"';
    expect( () => {
      parse(input);
    }).to.throw(Error);

  });
  
  it('should fail on broken identifiers', () => {

    var input = '##=1.23, foo="bar"';
    expect( () => {
      parse(input);
    }).to.throw(Error);

  });

  it('should fail on invalid items', () => {

    var input = 'foo=^bla^, bar="bar"';
    expect( () => {
      parse(input);
    }).to.throw(Error);

  });

  it('should fail if a dictionary ended on a comma', () => {

    var input = 'foo=1.23,';
    expect( () => {
      parse(input);
    }).to.throw(Error);

  });

  it('should fail on broken numbers', () => {

    var input = 'foo=1.23-';
    expect( () => {
      parse(input);
    }).to.throw(Error);

  });

});
