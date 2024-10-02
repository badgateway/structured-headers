import {
  serializeDictionary,
  serializeItem,
  SerializeError
} from '../dist/index.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * These tests cover cases that aren't covered by the HTTPWG tests.
 */
describe('serializer shorthands', () => {

  describe('serializeDictionary', () => {

    it('should support a simple object syntax', () => {

      const simpleDict = {
        a: 1,
        b: true,
        c: 'd',
        f: [[1,2,3], new Map([['a', 'b']])], 
      };

      const str = serializeDictionary(simpleDict);
      assert.equal(
        str,
        'a=1, b, c="d", f=(1 2 3);a="b"'
      );

    });

  });

  describe('serializeItem', () => {

    it('should error when passing a type that\'s not recognized', () => {

      let caught = false;
      try {
        serializeItem(Symbol.for('bla'));
      } catch (err) {
        if (err instanceof SerializeError) {
          caught = true;
        } else {
          throw err;
        }
      }
      assert.ok(caught);

    });

  });

});
