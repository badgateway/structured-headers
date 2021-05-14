import { Dictionary, List, Item, BareItem, Parameters, IntegerItem, DecimalItem } from './types';

class ParseError extends Error {

  constructor(position: number, message:string) {

    super(`Parse error: ${message} at offset ${position}`);

  }

}

export default class Parser {

  input: string;
  pos: number;

  constructor(input: string) {
    this.input = input;
    this.pos = 0;
  }

  parseDictionary(): Dictionary {

    return {};

  }

  parseList(): List {

    return [];

  }

  parseItem(standaloneItem: boolean): Item {

    const result: Item = [
      this.parseBareItem(),
      this.parseParameters()
    ];

    // If the header is a standalone 'item', it means we're expecting no bytes
    // after parsing.
    if (!this.eof()) {
      throw new ParseError(this.pos, 'Unexpected characters at end of item');
    }

    return result;

  }

  parseBareItem(): BareItem {

    const char = this.checkChar();
    if (char.match(/^[-0-9]/)) {
      return this.parseIntegerOrDecimal();
    }

    throw new Error('Not implemented');

  }

  parseParameters(): Parameters {

    const parameters = new Map();
    while(!this.eof()) {
      const char = this.checkChar();
      if (char!==';') {
        break;
      }

      throw new Error('Not implemented');
    }

    return parameters;

  }

  parseIntegerOrDecimal(): IntegerItem|DecimalItem {

    let type: 'integer' | 'decimal' = 'integer';
    let sign = 1;
    let inputNumber = '';
    if (this.checkChar()==='-') {
      sign = -1;
      this.pos++;
    }

    if (this.eof()) {
      throw new ParseError(this.pos, 'Empty integer');
    }

    if (!isDigit(this.checkChar())) {
      throw new ParseError(this.pos, 'Expected a digit (0-9)');
    }

    while(!this.eof()) {
      const char = this.getChar();
      if (isDigit(char)) {
        inputNumber+=char;
      } else if (type === 'integer' && char === '.') {
        if (inputNumber.length>12) {
          throw new ParseError(this.pos, 'Exceeded maximum decimal length');
        }
        inputNumber+='.';
        type = 'decimal';
      } else {
        // We need to 'prepend' the character, so it's just a rewind
        this.pos--;
        break;
      }

      if (type === 'integer' && inputNumber.length>15) {
        throw new ParseError(this.pos, 'Exceeded maximum integer length');
      }
      if (type === 'decimal' && inputNumber.length>16) {
        throw new ParseError(this.pos, 'Exceeded maximum decimal length');
      }
    }

    if (type === 'integer') {
      return parseInt(inputNumber, 10) * sign;
    } else {
      if (inputNumber.endsWith('.')) {
        throw new ParseError(this.pos, 'Decimal cannot end on a period');
      }
      if (inputNumber.split('.')[1].length>3) {
        throw new ParseError(this.pos, 'Number of digits after the decimal point cannot exceed 3');
      }
      return parseFloat(inputNumber) * sign;
    }

  }

  private checkChar():string {

    return this.input[this.pos];

  }
  private getChar(): string {

    return this.input[this.pos++];

  }
  private eof():boolean {

    return this.pos>=this.input.length;

  }


}

const isDigitRegex = /^[0-9]$/;
function isDigit(char: string): boolean {

  return isDigitRegex.test(char);

}
