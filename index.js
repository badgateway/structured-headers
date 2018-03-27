var Parser = require('./src/parser');

module.exports = {

  parseDictionary: function(input) {

    var parser = new Parser(input);
    return parser.parseDictionary();

  }

};
