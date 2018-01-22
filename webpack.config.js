var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'site-catalyst.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ mangle: true, sourcemap: true })
  ]
};
