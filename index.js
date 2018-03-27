var Parser = require('./src/parser');

module.exports = {

  parseDictionary: function(input) {

    var parser = new Parser(input);
    return parser.parseDictionary();

  },

  parseList: function(input) {

    var parser = new Parser(input);
    return parser.parseList();

  },

  parseParameterizedList: function(input) {

    var parser = new Parser(input);
    return parser.parseParameterizedList();

  }

};
