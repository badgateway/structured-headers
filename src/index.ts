import Parser from './parser';
import { Dictionary, Item, List } from './types';


export function parseDictionary(input: string): Dictionary {

  const parser = new Parser(input);
  return parser.parseDictionary();

}

export function parseList(input: string): List {

  const parser = new Parser(input);
  return parser.parseList();

}

export function parseItem(input: string): Item {

  const parser = new Parser(input);
  return parser.parseItem(true);

}
