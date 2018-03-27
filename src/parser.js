// Regular experession for an identifier
var identifierRegex = /[a-z][a-z0-9_\-\*\/]{0,254}/

var Parser = function(input) {

  this.input = input;
  this.position = 0;
  this.skipOWS();

};

Parser.prototype.parseDictionary = function() {

  var output = {};

  while(true) {

    // Dictionary key
    var key = this.parseIdentifier();
    if (output[key] !== undefined) {
      throw new Error('Duplicate key in dictionary: ' + key);
    }

    // Equals sign
    this.matchByte('=');

    // Value
    var value = this.parseItem();
    output[key] = value;

    // Optional whitespace
    this.skipOWS();
   
    // Exit if at end of string
    if (this.eol()) {
      return output;
    }

    // Comma for separating values
    this.matchByte(',');

    // Optional whitespace
    this.skipOWS();

    if (this.eol()) {
      throw new Error('Unexpected end of string');
    }

  }

  return output;

};

Parser.prototype.parseIdentifier = function() {

  var result = this.input.substr(this.position).match(identifierRegex);
  if (!result) {
    throw Error('Expected identifier at position: ' + this.position);
  }
  this.position += result[0].length;
  return result[0];

};

Parser.prototype.parseItem = function() {

  this.skipOWS();
  var c = this.input[this.position];
  if (c === '"') {
    return this.parseString();
  }
  if (c === '*') {
    return this.parseBinary();
  }
  if (c.match(/[0-9\-]/)) {
    return this.parseNumber();
  }
  if (c.match(/[a-z]/)) {
    return this.parseIdentifier();
  }

  throw new Error('Unexpected character: ' + c + ' on position ' + this.position);

}

Parser.prototype.parseNumber = function() {

  var match = this.input.substr(
    this.position
  ).match(/[0-9\-][0-9\.]+/);
  if (!match) {
    throw Error('Could not parse number at position: ' + this.position);
  }
  this.position += match[0].length;
  if (match[0].indexOf('.') !== -1) {
    return parseFloat(match[0]);
  } else {
    return parseInt(match[0],10);
  }

}

Parser.prototype.parseString = function() {

  var output = '';
  if (this.input[this.position] !== '"') {
    throw new Error('Expected " on position: ' + this.position);
  }
  this.position++;
  while(true) {

    var c = this.getByte();
    switch (c) {
        
      case '\\' :
        var c2 = this.getByte();
        if (c2 !== '"' && c2 !== '\\') {
          throw new Error('Expected a " or \\ on position: ' + (this.position-1));
        }
        output += c2;
        break;
      case '"' :
        return output;
      default :
        output += c;
        break;
    }

  }

}

Parser.prototype.parseBinary = function() {

  this.matchByte('*');
  var result = this.input.substr(this.position).match(/^(.*)\*/);
  if (!result) {
    throw new Error('Couldn\'t parse binary item');
  }
 
  this.position += result[0].length;

  return Buffer.from(result[1], 'base64');

}

// Advances the pointer to skip all whitespace.
Parser.prototype.skipOWS = function() {

  while (true) {
    var c = this.input.substr(this.position, 1);
    if (c === ' ' || c === "\t") {
      this.position++;
    } else {
      break;
    }
  }

}

// Advances the pointer 1 position and returns a byte.
Parser.prototype.getByte = function() {

  var c = this.input[this.position];
  if (c === undefined) {
    throw new Error('Unexpected end of string');
  }
  this.position++;
  return c;

}

// Grabs 1 byte from the stream and makes sure it matches the specified
// character.
Parser.prototype.matchByte = function(match) {

  var c = this.getByte();
  if (c !== match) {
    throw new Error('Expected ' + match + ' on position ' + (this.position-1));
  }

}

// Returns true if we're at the end of the line.
Parser.prototype.eol = function() {

  return this.position === this.input.length;

}

module.exports = Parser;
