import { describe, it } from 'node:test';
import {
  parseItem,
  parseList,
  parseDictionary,

  serializeItem,
  serializeList,
  serializeDictionary,

  ParseError,

  Token,
  DisplayString,

} from '../dist/index.js';

import base32Encode from 'base32-encode';
import base32Decode from 'base32-decode';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

describe('HTTP-WG tests', () => {

  const testGroups = [
    'binary',
    'boolean',
    'number',
    'string',
    'token',
    'date',
    'display-string',

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

    'serialisation-tests/key-generated',
    'serialisation-tests/number',
    'serialisation-tests/string-generated',
    'serialisation-tests/token-generated',
  ];

  for(const testGroup of testGroups) {

    describe(testGroup, () => {

      makeTestGroup(testGroup);

    });

  }

});

function makeTestGroup(testGroup) {

  const testFile = path.join(
    fileURLToPath(import.meta.url),
    '../httpwg-tests',
    testGroup + '.json',
  );
  const blob = fs.readFileSync(testFile);
  const tests = JSON.parse(blob);

  describe('Parsing', () => {

    for(const test of tests) {
      makeParseTest(test);
    }

  });
  describe('Serializing', () => {

    for(const test of tests) {
      makeSerializeTest(test);
    }

  });

}
function makeParseTest(test) {

  if (test.raw === undefined) {
    // If there is no 'raw', it means that this is a serialization test.
    return;
  }
  const input = test.raw.join(',');

  const skipped = [
    //'long integer',
    //'long negative integer',
  ];

  it(`should parse: ${test.name}`, function() {

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
          result = parseItem(input);
          break;
        case 'list' :
          result = parseList(input);
          break;
        case 'dictionary' :
          result = parseDictionary(input);
          break;
        default:
          throw new Error('Unsupported header type: ' + test.header_type);
      }
    } catch (e) {
      hadError = true;
      caughtError = e;
    }

    if (test.must_fail) {
      assert.ok(hadError, 'Parsing this should result in a failure');

      if (!(caughtError instanceof ParseError)) {
        console.error('Original error:');
        console.error(caughtError);
        throw new Error(
          `Errors during the parsing phase should be of type "ParseError" We got: "${caughtError.constructor.name}"`,
          {cause: caughtError}
        );
      }
    } else {

      if (hadError) {

        if (test.can_fail) {
          assert.ok(caughtError instanceof ParseError);
        } else {
          // Failure is NOT OK
          throw new Error('We should not have failed but got an error: ' + caughtError.message);
        }
      }

      result = packTestValue(result);

      try {
        assert.deepStrictEqual(result, expected);
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
function makeSerializeTest(test) {

  const skipped = [
    // We can't differentiate "1.0" from "1", so our output is different =(
    'single item parameterised dict',
    'list item parameterised dict',
    'list item parameterised dictionary',
    'single item parameterised list',
    'missing parameter value parameterised list',
    'missing terminal parameter value parameterised list',

    // Structured headers dictates that rounding should go towards the nearest
    // even number if the distance is identical.
    // This has not been implemented yet.
    'round positive even decimal - serialize',
    'round negative even decimal - serialize',
    'decimal round up to integer part - serialize',
  ];

  if (!test.expected) {
    // There is no expected output for parsing, which means that this was
    // a parse test for an invalid string.
    //
    // We just silently skip these.
    return;
  }

  it(`should serialize: ${test.name}`, t => {

    if (skipped.includes(test.name) || test.name.endsWith('0 decimal')) {
      // Not yet supporting this.
      // see: https://github.com/httpwg/structured-header-tests/issues/9
      t.skip('Can\'t support this yet');
      return;
    }

    // Since we do the opposite of the httpwg test, expected and input are
    // basically swapped.
    let expected;
    if (test.must_fail) {
      expected = null;
    } else {
      expected = (test.canonical || test.raw).join(',');
    }
    const input = test.expected;

    let hadError = false;
    let caughtError;
    let output;

    try {
      switch(test.header_type) {
        case 'item' :
          output = serializeItem(unpackTestValue(input));
          break;
        case 'list' :
          output = serializeList(unpackTestValue(input));
          break;
        case 'dictionary' :
          output = serializeDictionary(unpackDictionary(input));
          break;
        default:
          throw new Error('Unsupported header type: ' + test.header_type);
      }
    } catch (e) {
      hadError = true;
      caughtError = e;
    }

    if (test.must_fail) {
      assert.ok(hadError, 'Parsing this should result in a failure');
    } else {

      if (hadError) {
        // There was an error
        if (test.can_fail) {

          // Failure is OK
          assert.ok(hadError);
        } else {
          // Failure is NOT OK
          throw new Error('We should not have failed but got an error: ' + caughtError.message);
        }
      }

      try {
        assert.strictEqual(output, expected);
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
function packTestValue(input) {

  if(input instanceof Token) {
    return {
      __type: 'token',
      value: input.toString()
    }
  }
  if(input instanceof DisplayString) {
    return {
      __type: 'displaystring',
      value: input.toString()
    }
  }
  if (input instanceof ArrayBuffer) {
    return {
      __type: 'binary',
      value: base32Encode(input, 'RFC4648')
    }
  }
  if (input instanceof Date) {
    return {
      __type: 'date',
      value: Math.floor(input.getTime()/1000)
    };
  }
  if (input instanceof Map) {
    return Array.from(input.entries()).map( ([key, value]) => {
      return [key, packTestValue(value)];
    });
  }

  if (Array.isArray(input)) {
    return input.map( item => packTestValue(item));
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
      input[prop] = packTestValue(value);
    }

  }

  return input;

}

/**
 * This does the opposite of 'packTestValue', it turns values from the JSON test
 * cases into values that the package expects
 */
function unpackTestValue(input) {

  if (input.__type) {
    switch(input.__type) {
      case 'token' :
        return new Token(input.value);
      case 'binary':
        return new base32Decode(input.value, 'RFC4648');
      case 'date' :
        return new Date(input.value * 1000);
      case 'displaystring' :
        return new DisplayString(input.value);
      default:
        throw new Error('Unknown input __type: ' + input.__type);
    }
  }
  if (Array.isArray(input)) {
    return input.map(unpackTestValue);
  }
  return input;

}

function unpackDictionary(input) {

  return new Map(
    input.map(([key, value]) => [key, unpackTestValue(value)])
  );

}
