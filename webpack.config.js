const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { readFileSync } = require('fs');
const glob = require('glob');

const databaseDirname = 'E:/Projects/eWheels-Custom-App-Scraped-Data/database';

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
      const [ firstCategory ] = JSON.parse(readFileSync(`${databaseDirname}/raw-data-formatted.json`, 'utf8'));
      const productList = firstCategory.products.map(({name, url, price, images}) => {
        const image = '/images/' + images[0].imageSrc.split('/').pop();

        return {name, url, price, image};
      });

      app.get('/getProductList', (req, res) => {
        res.json(productList);
      });

      app.get('/images/*', (req, res) => {
        const imagePath = req.url.split('/').pop();

        getImage(imagePath)
          .then((image) => {
            res.sendFile(image);
          })
          .catch((error) => {
            console.log('Image searching error: ', error, ' /imagePath: ', imagePath);

            res.status(404);
            res.end();
          });
      });
    },
  }
};

function getImage(fileName) {
  const cachedImage = getImage.cache[fileName];

  if (!cachedImage) {
    return findFileRecursively(fileName).then(([image]) => {
      getImage.cache[fileName] = image;

      return image;
    });
  }

  return Promise.resolve(cachedImage);
}
getImage.cache = {};

function findFileRecursively(fileName) {
  return new Promise((resolve, reject) => {
    glob(`${databaseDirname}/web-scraped/images/**/${fileName}`, (err, files) => {
      if (err || !files.length) {
        reject(err || 'No files found!');
        return;
      }

      resolve(files);
    })
  });
}
