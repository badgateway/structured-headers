const expect = require('chai').expect;
const Parser = require('../dist/parser');
const base32Encode = require('base32-encode');
const fs = require('fs');

describe('HTTP-WG tests', () => {

  const testGroups = [
    'binary',
    'boolean',
    'number',
    'string',
    'token',

    'item',

    'list',
    'listlist',
    'dictionary',
    'param-list',

    'key-generated',
    'large-generated',
    'string-generated',
    'token-generated',
  ];

  for(const testGroup of testGroups) {

    describe(testGroup, () => {

      makeTestGroup(testGroup);

    });

  }


});

function makeTestGroup(testGroup) {

  const fileName = testGroup + '.json';
  const blob = fs.readFileSync(__dirname + '/httpwg-tests/' + fileName);
  const tests = JSON.parse(blob);

  for(const test of tests) {
    makeTest(test);
  }

}
function makeTest(test) {

  const parser = new Parser(test.raw.join(','));

  const skipped = [
//    'too long integer',
//    'negative too long integer',
  ];

  it(test.name, function() {

    if (skipped.includes(test.name)) {
      // Not yet supporting this.
      // see: https://github.com/httpwg/structured-header-tests/issues/9
      this.skip('Can\'t support this yet');
    }

    let hadError = false;
    let caughtError;
    let result;
    try {
      switch(test.header_type) {
        case 'item' :
          result = parser.parseItem();
          break;
        case 'list' :
          result = parser.parseList();
          break;
        case 'list-list' :
          result = parser.parseListList();
          break;
        case 'param-list' :
          result = parser.parseParamList();
          break;
        case 'dictionary' :
          result = parser.parseDictionary();
          break;
        default:
          throw new Error('Unsupported header type: ' + test.header_type);
      }
    } catch (e) {
      hadError = true;
      caughtError = e;
    }

    if (test.must_fail) {
      expect(hadError).to.equal(true);
    } else {

      if (hadError) {
        // There was an error
        if (test.can_fail) {
          // Failure is OK
          expect(hadError).to.equal(true);
        } else {
          // Failure is NOT OK
          throw new Error('We should not have failed but got an error: ' + caughtError.message);
        }
      }

      result = deepReplaceBuffer(result);

      // in javascript 0 === -0, but in mocha it's not the same.
      // this normalizes the 0's.
      if (result === -0) result = 0;

      try {
        expect(result).to.deep.equal(test.expected);
      } catch (e) {
        if (test.can_fail) {
          // Optional failure
          this.skip('can_fail was true');
        } else {
          throw e;
        }
      }

    }
  });

}

/**
 * The HTTP-WG tests decode the "byte sequence" type as a Base32 string.
 *
 * We decode them in buffers. This function replaces all Buffers to base32
 * strings.
 */
function deepReplaceBuffer(input) {

  if(input instanceof Buffer) {
    return base32Encode(input, 'RFC4648');
  }

  if (input === null) {
    return null;
  }

  if (typeof input === 'object') {

    for(const [prop, value] of Object.entries(input)) {
      input[prop] = deepReplaceBuffer(value);
    }

  }

  return input;

}
