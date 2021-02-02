const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const middleware = require('./src/middleware/middleware-index');

// TODO: handle it in better way
process.env.NODE_ENV = 'development';

module.exports = {
  mode: 'development',
  entry: './src/frontend/app.js',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader', 'eslint-loader', 'prettier-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  devtool: 'source-map',
  devServer: {
    publicPath: '/dist/',
    watchContentBase: true,
    historyApiFallback: true,
    before: middleware,
    port: 3000,
  }
};
