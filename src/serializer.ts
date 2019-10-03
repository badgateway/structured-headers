import { Dictionary, Item, List } from './types';

export default class Serializer {

  serializeDictionary(input: Dictionary): string {

    const output = [];
    for (const [key, value] of Object.entries(input)) {
      output.push(this.serializeKey(key) + '=' + this.serializeItem(value));
    }

    return output.join(', ');

  }

  serializeList(input: List): string {

    return input.map( listItem => {

      let output = '';
      if (Array.isArray(listItem.value)) {
        output += '(' + listItem.value.map(this.serializeItem.bind(this)).join(' ') + ')';
      } else {
        output += this.serializeItem(listItem.value);
      }
      output += this.serializeParameters(listItem.parameters);
      return output;
    }).join(', ');

    return input.map(this.serializeItem.bind(this)).join(', ');

  }

  serializeParameters(input: Dictionary): string {
    let output = '';
    for (const [dictKey, dictValue] of Object.entries(input)) {
      output += ';' + this.serializeKey(dictKey);
      if (dictValue) {
        output += '=' + this.serializeItem(dictValue);
      }
    }
    return output;

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

  serializeInt(input: number): string {
    if (input > 999_999_999_999_999 || input < -999_999_999_999_999) {
      throw new Error('Integers may not be larger than 15 digits');
    }
    return input.toString();
  }

  serializeFloat(input: number): string {

    const parts = input.toString().split('.');
    if (parts.length > 15 || input > 0 && parts.length > 14) {
      throw new Error('When serializing floats, the "whole" part may not be larger than 14 digits');
    }
    return parts[0] + '.' + parts[1].substr(0, 15 - parts[0].length);

  }

  serializeString(input: string): string {

    if (!/^[\x1F-\x7F]*$/.test(input)) {
      throw new Error('Strings must be in the ASCII range');
    }

    return '"' + input.replace('"', '\\"') + '"';

  }

  serializeToken(input: string): string {

    if (!/^[a-zA-Z][a-zA-Z0-9_\-\.\:\%\*]*$/.test(input)) {
      throw new Error('Tokens must start with a letter and must only contain A-Za-z_-.:%*/');
    }

    return input;

  }

  serializeByteSequence(input: Buffer): string {

    return '*' + input.toString('base64') + '*';

  }

  serializeBoolean(input: boolean): string {

    return input ? '?1' : '?0';

  }

}
