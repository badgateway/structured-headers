import { Dictionary, List, Item, BareItem, Parameters, Token, InnerList, ByteSequence } from './types';

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

    throw new Error('Not implemented');

  }

  parseList(): List {

    const members: List = [];
    while(!this.eof()) {
      members.push(
        this.parseItemOrInnerList()
      );
      this.skipOWS();
      if (this.eof()) {
        return members;
      }
      this.expectChar(',');
      this.pos++;
      this.skipOWS();
      if (this.eof()) {
        throw new ParseError(this.pos, 'A list may not end with a trailing comma');
      }
    }

    return members;

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

  parseItemOrInnerList(): Item|InnerList {

    if (this.lookChar()==='(') {
      return this.parseInnerList();
    } else {
      return this.parseItem(false);
    }

  }

  parseInnerList(): InnerList {

    throw new Error('Not implemented');

  }

  parseBareItem(): BareItem {

    const char = this.lookChar();
    if (char.match(/^[-0-9]/)) {
      return this.parseIntegerOrDecimal();
    }
    if (char === '"') {
      return this.parseString();
    }
    if (char.match(/^[A-Za-z*]/)) {
      return this.parseToken();
    }
    if (char === ':' ) {
      return this.parseByteSequence();
    }

    throw new Error('Not implemented');

  }

  parseParameters(): Parameters {

    const parameters = new Map();
    while(!this.eof()) {
      const char = this.lookChar();
      if (char!==';') {
        break;
      }

      throw new Error('Not implemented');
    }

    return parameters;

  }

  parseIntegerOrDecimal(): number {

    let type: 'integer' | 'decimal' = 'integer';
    let sign = 1;
    let inputNumber = '';
    if (this.lookChar()==='-') {
      sign = -1;
      this.pos++;
    }

    if (this.eof()) {
      throw new ParseError(this.pos, 'Empty integer');
    }

    if (!isDigit(this.lookChar())) {
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

  parseString(): string {

    let outputString = '';
    this.expectChar('"');
    this.pos++;

    while(!this.eof()) {
      const char = this.getChar();
      if (char==='\\') {
        if (this.eof()) {
          throw new ParseError(this.pos, 'Unexpected end of input');
        }
        const nextChar = this.getChar();
        if (nextChar!=='\\' && nextChar !== '"') {
          throw new ParseError(this.pos, 'A backslash must be followed by another backslash or double quote');
        }
        outputString+=nextChar;
      } else if (char === '"') {
        return outputString;
      } else if (!/^[\x1F-\x7F]$/.test(char)) { /* eslint-disable-line no-control-regex */
        throw new Error('Strings must be in the ASCII range');
      } else {
        outputString += char;
      }

    }
    throw new ParseError(this.pos, 'Unexpected end of input');

  }

  parseToken(): Token {

    if (!this.lookChar().match(/^[A-Za-z*]/)) {
      throw new ParseError(this.pos, 'A token must begin with an asterisk or letter (A-Z, a-z)');
    }

    let outputString = '';

    while(!this.eof()) {
      const char = this.lookChar();
      if (!/^[:/!#$%&'*+\-.^_`|~A-Za-z0-9]$/.test(char)) {
        return new Token(outputString);
      }
      outputString += this.getChar();
    }

    return new Token(outputString);

  }

  parseByteSequence(): ByteSequence {

    this.expectChar(':');
    this.pos++;
    const endPos = this.input.indexOf(':', this.pos);
    if (endPos === -1) {
      throw new ParseError(this.pos, 'Could not find a closing ":" character to mark end of Byte Sequence');
    }
    const b64Content = this.input.substring(this.pos, endPos);
    this.pos += b64Content.length+1;

    if (!/^[A-Za-z0-9+/=]*$/.test(b64Content)) {
      throw new ParseError(this.pos, 'ByteSequence does not contain a valid base64 string');
    }

    return new ByteSequence(b64Content);

  }

  /**
   * Looks at the next character without advancing the cursor.
   */
  private lookChar():string {

    return this.input[this.pos];

  }

  /**
   * Checks if the next character is 'char', and fail otherwise.
   */
  private expectChar(char: string): void {

    if (this.lookChar()!==char) {
      throw new ParseError(this.pos, `Expected ${char}`);
    }

  }

  private getChar(): string {

    return this.input[this.pos++];

  }
  private eof():boolean {

    return this.pos>=this.input.length;

  }
  // Advances the pointer to skip all whitespace.
  private skipOWS(): void {

    while (true) {
      const c = this.input.substr(this.pos, 1);
      if (c === ' ' || c === '\t') {
        this.pos++;
      } else {
        break;
      }
    }

  }

}

const isDigitRegex = /^[0-9]$/;
function isDigit(char: string): boolean {

  return isDigitRegex.test(char);

}
