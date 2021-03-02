const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  // TODO: handle it in better way
  process.env.NODE_ENV = env;
  const middleware = env === 'development' ?
      require('./dist/src/middleware/middleware-index').default :
      () => {};

  return {
    mode: env,
    entry: './src/frontend/index.js',
    output: {
      filename: 'index.js',
      path: resolve(__dirname, './dist/src/frontend'),
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
        filename: 'styles.css',
        chunkFilename: '[id].css'
      }),
      new HtmlWebpackPlugin({
        template: './src/frontend/index.html',
      }),
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
};
