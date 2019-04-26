import Parser from './parser';
import Serializer from './serializer';
import { Dictionary, Item, List, ListList, ParameterizedList } from './types';

module.exports = {

  parseDictionary: function(input: string): Dictionary {

    let parser = new Parser(input);
    return parser.parseDictionary();

  },

  parseList: function(input: string): List {

    let parser = new Parser(input);
    return parser.parseList();

  },

  parseListList: function(input: string): ListList {

    let parser = new Parser(input);
    return parser.parseListList();

  },

  parseParamList: function(input: string): ParameterizedList {

    let parser = new Parser(input);
    return parser.parseParamList();

  },

  parseItem: function(input: string): Item {

    let parser = new Parser(input);
    return parser.parseItem();

  },

  serializeDictionary: function(input: Dictionary): string {

    let serializer = new Serializer();
    return serializer.serializeDictionary(input);

  },

  serializeList: function(input: List) {

    let serializer = new Serializer();
    return serializer.serializeList(input);

  },

  serializeListList: function(input: ListList) {

    let serializer = new Serializer();
    return serializer.serializeListList(input);

  },

  serializeParamList: function(input: ParameterizedList) {

    let serializer = new Serializer();
    return serializer.serializeParamList(input);

  },

  serializeItem: function(input: Item) {

    let serializer = new Serializer();
    return serializer.serializeItem(input);

  },

};
