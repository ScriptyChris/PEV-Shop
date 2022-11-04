require('dotenv').config();

const { DefinePlugin } = require('webpack');
const { resolve } = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const preparedModulePathsAliases = require('./commons/moduleAliasesResolvers').frontend();

module.exports = (env) => {
  // TODO: handle it in better way
  process.env.NODE_ENV = env;
  const IS_DEVELOPMENT_MODE = env === 'development';
  const middleware = IS_DEVELOPMENT_MODE ? require('./dist/src/middleware/middleware-index').default : () => {};

  return {
    mode: env,
    entry: ['react-hot-loader/patch', './src/frontend/index.js'],
    output: {
      filename: 'index.js',
      path: resolve(__dirname, './dist/src/frontend'),
    },
    resolve: {
      alias: preparedModulePathsAliases,
    },
    module: {
      rules: [
        {
          test: /\.(t|j)s(x?)$/,
          loader: ['babel-loader', 'eslint-loader', 'prettier-loader'],
          resolve: { extensions: ['.ts', '.js', '.tsx', '.jsx'] },
        },
        {
          test: /\.scss$/,
          use: [
            /* TODO: [build code redundancy] find a way for MUI to pre-export it's styles to external CSS */
            // {
            //   loader: MiniCssExtractPlugin.loader,
            //   options: {
            //     hmr: IS_DEVELOPMENT_MODE,
            //   },
            // },
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new DefinePlugin({
        __IS_DEV_MODE__: JSON.stringify(IS_DEVELOPMENT_MODE)
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: 'tsconfig.frontend.json',
        },
      }),
      /* TODO: [refactor] improve MUI integration regarding attaching CSS */
      // new MiniCssExtractPlugin({
      //   filename: 'styles.css',
      //   chunkFilename: '[id].css',
      // }),
      new HtmlWebpackPlugin({
        template: './src/frontend/index.html',
      }),
      new HtmlWebpackPlugin({
        filename: 'embedded/shipment-map.html',
        template: './src/frontend/assets/embedded/shipment-map.html',
        inject: false,
      }),
      new CopyPlugin({
        patterns: ['shipment-map-3rd-party.js', 'shipment-map-3rd-party.css', 'shipment-map.js'].map((fileName) => ({
          from: `./src/frontend/assets/embedded/${fileName}`,
          to: `./embedded/${fileName}`,
        })),
      }),
    ],
    devtool: 'source-map',
    devServer: {
      publicPath: '/',
      watchContentBase: true,
      historyApiFallback: true,
      before: middleware,
      port: process.env.APP_PORT,
      hotOnly: true,
      liveReload: false,
      watchOptions: {
        ignored: [
          'node_modules',
          'dist',
          '.*',
          'src/middleware',
          'src/database',
          'test/middleware',
          'test/database',
          '__mocks__'
        ].map((path) => resolve(__dirname, path)),
      },
    },
  };
};
