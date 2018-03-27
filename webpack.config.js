module.exports = {

  entry: './index',
  output: {
    path: __dirname + '/dist',
    filename: 'structured-header.min.js',
    library: 'structuredHeader'
  },

  resolve: {
    extensions: ['.web.js', '.js', '.json']
  },

  devtool: 'source-map'
}
