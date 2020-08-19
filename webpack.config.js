const webpack = require('webpack');
const { resolve } = require('path');

// TODO: handle it in better way
process.env.NODE_ENV = 'development';

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  devServer: {
    publicPath: '/dist/',
    watchContentBase: true,
  }
};
