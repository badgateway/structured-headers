const expect = require('chai').expect;
const Parser = require('../dist/parser').default;
const { Token, ByteSequence } = require('../dist/types');
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
    'param-dict',
    'param-list',
    'param-listlist',

    'examples',
    'key-generated',
    'large-generated',
    'number-generated',
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
    //'long integer',
    //'long negative integer',
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
    let expected = test.expected;

    try {
      switch(test.header_type) {
        case 'item' :
          result = parser.parseItem();
          break;
        case 'list' :
          result = parser.parseList();
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
      expect(hadError).to.equal(true, 'Parsing this should result in a failure');
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

      result = deepClean(result);

      try {
        expect(result).to.deep.equal(expected);
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
 * Fix values so they compare better.
 *
 * This function deeply changes the following:
 *
 * * support __type from HTTPWG test suite
 * * Convert Map to arrays.
 * * Convert -0 to 0
 */
function deepClean(input) {

  if(input instanceof Token) {
    return {
      __type: 'token',
      value: input.toString()
    }
  }
  if (input instanceof ByteSequence) {
    return {
      __type: 'binary',
      value: base32Encode(Buffer.from(input.toBase64(), 'base64'), 'RFC4648')
    }
  }
  if (input instanceof Map) {
    return Array.from(input.entries()).map( ([key, value]) => {
      return [key, deepClean(value)];
    });
  }

  if (Array.isArray(input)) {
    return input.map( item => deepClean(item));
  }

  if (input === null) {
    return null;
  }
  if (input === -0) {
    // Convert -0 to 0 to satisfy mocha
    input = 0;
  }

  if (typeof input === 'object') {

    for(const [prop, value] of Object.entries(input)) {
      input[prop] = deepClean(value);
    }

  }

  return input;

}
