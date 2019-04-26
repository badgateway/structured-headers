import { Dictionary, Item, List, ListList, ParameterizedList } from './types';

export default class Serializer {

  serializeDictionary(input: Dictionary): string {

    const output = [];
    for (const [key, value] of Object.entries(input)) {
      output.push(this.serializeKey(key) + '=' + this.serializeItem(value));
    }

    return output.join(', ');

  }

  serializeList(input: List): string {

    return input.map(this.serializeItem).join(', ');

  }

  serializeListList(input: ListList): string {

    return input.map(
      innerList => innerList.map(this.serializeItem).join('; ')
    ).join(', ');

  }

  serializeParamList(input: ParameterizedList): string {

    const output = [];
    for (const [key, dict] of input) {
      let item = '';
      item += this.serializeKey(key);

      for (const [dictKey, dictValue] of Object.entries(dict)) {
        item += ';' + this.serializeKey(dictKey);
        if (dictValue) {
          item += '=' + this.serializeItem(dictValue);
        }
      }

      output.push(item);
    }
    return output.join(', ');

  }

  serializeKey(input: string): string {

    if (!input.match(/^[a-z][a-z0-9_-]*$/)) {
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

    return input.toString();

  }

  serializeString(input: string): string {

    if (/^[\x1F-\x7F]*$/.test(input)) {
      throw new Error('Strings must be in the ASCII range');
    }

    return '"' + input.replace('"', '\\"') + '"';

  }

  serializeToken(input: string): string {

    if (/^[a-zA-Z][A-Za-z0-9_-\.\:%\*/]*$/.test(input)) {
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
