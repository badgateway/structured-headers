var Parser = require('./dist/parser');

module.exports = {

  parseDictionary: function(input) {

    var parser = new Parser(input);
    return parser.parseDictionary();

  },

  parseList: function(input) {

    var parser = new Parser(input);
    return parser.parseList();

  },

  parseListList: function(input) {

    var parser = new Parser(input);
    return parser.parseListList();

  },

  parseParameterizedList: function(input) {

    var parser = new Parser(input);
    return parser.parseParameterizedList();

  },

  parseItem: function(input) {

    var parser = new Parser(input);
    return parser.parseItem();

  }

};
