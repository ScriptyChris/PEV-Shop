const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config();

module.exports = (env) => {
  // TODO: handle it in better way
  process.env.NODE_ENV = env;
  const middleware = env === 'development' ?
      require('./dist/src/middleware/middleware-index').default :
      () => {};

  return {
    mode: env,
    entry: ['react-hot-loader/patch','./src/frontend/index.js'],
    output: {
      filename: 'index.js',
      path: resolve(__dirname, './dist/src/frontend'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: ['babel-loader', 'eslint-loader', 'prettier-loader'],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: env === 'development',
              },
            },
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
      publicPath: '/',
      watchContentBase: true,
      historyApiFallback: true,
      before: middleware,
      port: process.env.PORT,
      hotOnly: true,
      liveReload: false,
      watchOptions: {
        ignored: [
          'node_modules', 'dist', '.*', 'src/middleware',
          'src/database', 'test/middleware', 'test/database'
        ].map(path => resolve(__dirname, path)),
      },
    },
  };
};
