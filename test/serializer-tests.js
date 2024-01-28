const { serializeDictionary, serializeItem, SerializeError } = require("../dist");
const expect = require('chai').expect;

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
      expect(str).to.equal(
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
      expect(caught).to.be.true;

    });

  });

});
