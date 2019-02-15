const webpack = require('webpack');
const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const { version } = require('./package.json');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.env.BUILD_ENV === 'development' 
      ? 'site-catalyst.[hash].js'
      : `site-catalyst.${version}.js`
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new UnminifiedWebpackPlugin({
      postfix: 'unmin'
    })
  ]
};
