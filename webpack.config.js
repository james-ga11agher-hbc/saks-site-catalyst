
// var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'site-catalyst.js'
  },
  plugins: [
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: true }),
  ]
};
