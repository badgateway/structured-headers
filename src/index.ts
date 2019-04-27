import Parser from './parser';
import Serializer from './serializer';
import { Dictionary, Item, List, ListList, ParameterizedList } from './types';

module.exports = {

  parseDictionary: (input: string): Dictionary => {

    const parser = new Parser(input);
    return parser.parseDictionary();

  },

  parseList: (input: string): List => {

    const parser = new Parser(input);
    return parser.parseList();

  },

  parseListList: (input: string): ListList => {

    const parser = new Parser(input);
    return parser.parseListList();

  },

  parseParamList: (input: string): ParameterizedList => {

    const parser = new Parser(input);
    return parser.parseParamList();

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

  serializeListList: (input: ListList) => {

    const serializer = new Serializer();
    return serializer.serializeListList(input);

  },

  serializeParamList: (input: ParameterizedList) => {

    const serializer = new Serializer();
    return serializer.serializeParamList(input);

  },

  serializeItem: (input: Item) => {

    const serializer = new Serializer();
    return serializer.serializeItem(input);

  },

};
