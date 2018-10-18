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

};

Parser.prototype.parseList = function() {

  var output = [];

  while(!this.eol()) {

    // Get item
    var value = this.parseItem();
    output.push(value);

    // Whitespace
    this.skipOWS();

    if (this.eol()) {
      return output;
    }

    // Grab a comma
    this.matchByte(',');

    // Whitespace
    this.skipOWS();

  }
  throw new Error('Unexpected end of string');

};

Parser.prototype.parseParameterizedList = function() {

  var output = [];
  while(!this.eol()) {

    // Parse item
    output.push(this.parseParameterizedIdentifier());

    // Whitespace
    this.skipOWS();

    if (this.eol()) {
      return output;
    }

    this.matchByte(',');
    this.skipOWS();

  }
  throw new Error('Unexpected end of string');

};

Parser.prototype.parseParameterizedIdentifier = function() {

  var identifier = this.parseIdentifier();
  var parameters = {};

  while(true) {

    // Whitespace
    this.skipOWS();

    // Stop if parameter didn't start with ;
    if (this.input[this.position]!==';') {
      break;
    }
    this.position++;

    // Whitespace
    this.skipOWS();

    var paramName = this.parseIdentifier();
    var paramValue = null;

    // If there's an =, there's a value
    if (this.input[this.position] === '=') {
      this.position++;
      paramValue = this.parseItem();
    }

    parameters[paramName] = paramValue;

  }

  return [identifier, parameters];

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
  if (c.match(/[a-z]/i)) {
    return this.parseIdentifier();
  }

  throw new Error('Unexpected character: ' + c + ' on position ' + this.position);

};

Parser.prototype.parseNumber = function() {

  var match = this.input.substr(
    this.position
  ).match(/[0-9\-][0-9\.]*/);
  this.position += match[0].length;
  if (match[0].indexOf('.') !== -1) {
    return parseFloat(match[0]);
  } else {
    return parseInt(match[0],10);
  }

};

Parser.prototype.parseString = function() {

  var output = '';
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

};

Parser.prototype.parseIdentifier = function() {

  var identifierRegex = /^[a-z][a-z0-9_\-\*\/]{0,254}/i;
  var result = this.input.substr(this.position).match(identifierRegex);
  if (!result) {
    throw Error('Expected identifier at position: ' + this.position);
  }
  this.position += result[0].length;
  return result[0];

};

Parser.prototype.parseBinary = function() {

  this.matchByte('*');
  var result = this.input.substr(this.position).match(/^([A-Za-z0-9\\+\\/=]*)\*/);
  if (!result) {
    throw new Error('Couldn\'t parse binary item');
  }
  debugger;
  if (result[1].length % 4 !== 0) {
    throw new Error('Base64 strings should always have a length that\'s a multiple of 4. Did you forget padding?');
  }
  this.position += result[0].length;

  return Buffer.from(result[1], 'base64');

};

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

};

// Advances the pointer 1 position and returns a byte.
Parser.prototype.getByte = function() {

  var c = this.input[this.position];
  if (c === undefined) {
    throw new Error('Unexpected end of string');
  }
  this.position++;
  return c;

};

// Grabs 1 byte from the stream and makes sure it matches the specified
// character.
Parser.prototype.matchByte = function(match) {

  var c = this.getByte();
  if (c !== match) {
    throw new Error('Expected ' + match + ' on position ' + (this.position-1));
  }

};

// Returns true if we're at the end of the line.
Parser.prototype.eol = function() {

  return this.position === this.input.length;

};

module.exports = Parser;
