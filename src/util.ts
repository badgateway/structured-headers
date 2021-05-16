import { Item, InnerList } from './types';

const asciiRegex = /^[\x20-\x7E]*$/;

export function isAscii(str: string): boolean {

  return asciiRegex.test(str);

}

export function isInnerList(input: Item | InnerList): input is InnerList {

  return Array.isArray(input[0]);

}
