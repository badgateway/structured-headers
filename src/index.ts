import Parser from './parser';
import Serializer from './serializer';
import { Dictionary, Item, List } from './types';

module.exports = {

  parseDictionary: (input: string): Dictionary => {

    const parser = new Parser(input);
    return parser.parseDictionary();

  },

  parseList: (input: string): List => {

    const parser = new Parser(input);
    return parser.parseList();

  },

  parseItem: (input: string): Item => {

    const parser = new Parser(input);
    return parser.parseItem();

  },

  serializeDictionary: (input: Dictionary): string => {

    const serializer = new Serializer();
    return serializer.serializeDictionary(input);

  },

  serializeList: (input: List) => {

    const serializer = new Serializer();
    return serializer.serializeList(input);

  },

  serializeItem: (input: Item) => {

    const serializer = new Serializer();
    return serializer.serializeItem(input);

  },

};
