import { Dictionary, Item, List, Parameters } from './types';

export default class Serializer {

  serializeDictionary(input: Dictionary): string {

    const output: string[] = [];
    for (const [key, value] of Object.entries(input)) {
      output.push(
        this.serializeKey(key) +
        '=' +
        this.serializeItemOrInnerList(value.value) +
        this.serializeParameters(value.parameters)
      );
    }


    return output.join(', ');

  }

  serializeList(input: List): string {

    return input.map( listItem => {

      return this.serializeItemOrInnerList(listItem.value) + this.serializeParameters(listItem.parameters);

    }).join(', ');

  }


  serializeKey(input: string): string {

    if (!/^[a-z][a-z0-9_-]*$/.test(input)) {
      throw new Error('Dictionary keys must start with a-z and only contain a-z0-9_-');
    }

    return input;

  }

  serializeItem(input: Item): string {

    if (typeof input === 'number') {
      if (Number.isInteger(input)) {
        return this.serializeInt(input);
      }
      return this.serializeFloat(input);
    }
    if (typeof input === 'string') {
      return this.serializeString(input);
    }
    // Token ???
    if (typeof input === 'boolean') {
      return this.serializeBoolean(input);
    }
    if (input instanceof Buffer) {
      return this.serializeByteSequence(input);
    }
    throw new Error('Cannot serialize values of type ' + typeof input);

  }

  private serializeParameters(input: Parameters): string {
    if (!input) {
      return '';
    }
    let output = '';
    for (const [paramKey, paramValue] of Object.entries(input)) {
      output += ';' + this.serializeKey(paramKey);
      if (paramValue) {
        output += '=' + this.serializeItem(paramValue);
      }
    }
    return output;

  }

  private serializeItemOrInnerList(input: Item | Item[]) {

    if (Array.isArray(input)) {
      return '(' + input.map( entry => this.serializeItem(entry)).join(' ') + ')';
    } else {
      return this.serializeItem(input);
    }

  }

  private serializeInt(input: number): string {
    if (input > 999_999_999_999_999 || input < -999_999_999_999_999) {
      throw new Error('Integers may not be larger than 15 digits');
    }
    return input.toString();
  }

  private serializeFloat(input: number): string {

    const parts = input.toString().split('.');
    if (parts[0].length > 15 || input > 0 && parts[0].length > 14) {
      throw new Error('When serializing floats, the "whole" part may not be larger than 14 digits');
    }
    return parts[0] + '.' + parts[1].substr(0, 15 - parts[0].length);

  }

  private serializeString(input: string): string {

    /* eslint-disable-next-line no-control-regex */
    if (!/^[\x1F-\x7F]*$/.test(input)) {
      throw new Error('Strings must be in the ASCII range');
    }

    return '"' + input.replace('"', '\\"') + '"';

  }

  /*
  private serializeToken(input: string): string {

    if (!/^[a-zA-Z][a-zA-Z0-9_\-\.\:\%\*]*$/.test(input)) {
      throw new Error('Tokens must start with a letter and must only contain A-Za-z_-.:%/*');
    }

    return input;

  }*/

  private serializeByteSequence(input: Buffer): string {

    return '*' + input.toString('base64') + '*';

  }

  private serializeBoolean(input: boolean): string {

    return input ? '?1' : '?0';

  }

}
