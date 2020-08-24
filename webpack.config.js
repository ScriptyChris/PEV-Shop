const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { readFileSync } = require('fs');

// TODO: handle it in better way
process.env.NODE_ENV = 'development';

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  devServer: {
    publicPath: '/dist/',
    watchContentBase: true,
    historyApiFallback: true,
    before(app) {
      const categories = JSON.parse(readFileSync('E:/Projects/eWheels-Custom-App-Scraped-Data/database/raw-data-formatted.json', 'utf8'));
      // console.log('categories[0].products:', categories[0].products);

      const productList = categories[0].products.map(({name, url, price}) => {
        return {name, url, price};
      })

      app.get('/getProductList', (req, res) => {
        res.json(productList);
      });
    },
  }
};
