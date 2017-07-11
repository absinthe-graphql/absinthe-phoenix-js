var path = require('path');

module.exports = {
  context: path.join(__dirname, '/pkg/lib'),
  entry: './absinthe-phoenix.umd.js',
  externals: {
    phoenix: "Phoenix"
  },
  output: {
    path: path.join(__dirname, '/pkg/lib/browser'),
    filename: 'index.js',
    library: 'AbsinthePhoenix'
  }
};