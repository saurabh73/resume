const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const jquery = require('jquery');

const isProd = process.env.NODE_ENV === 'production';
const extractPlugin = new ExtractTextPlugin({
  filename: 'styles/main.css'
});

const cssDev = [
  {
    // translates CSS into CommonJS modules
    loader: 'css-loader',
    options: {
      sourceMap: true
    }
  },
  {
    // resolves url
    loader: 'resolve-url-loader',
    options: {
      sourceMap: true
    }
  },
  {
    // compiles Sass to CSS
    loader: 'sass-loader',
    options: {
      sourceMap: true
    }
  }
];

const cssProd = extractPlugin.extract({
  fallback: 'style-loader',
  use: cssDev
});
// const cssConfig = isProd ? cssProd : cssDev;
const cssConfig = cssProd;

module.exports = {
  entry: {
    main: [
      path.resolve(__dirname, 'src/scripts/script.js'),
      path.resolve(__dirname, 'src/styles/main.scss')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    inline: true,
    hot: true,
    compress: true,
    open: true,
    port: 8000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: cssConfig
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]',
          outputPath: 'assets/images/',
          publicPath: 'assets/images/'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: '[name].[ext]',
          outputPath: 'assets/fonts/',
          publicPath: 'assets/fonts/'
        },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts/',
          publicPath: 'assets/fonts/'
        }
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
    ],
  },
  plugins: [
    extractPlugin,
    new CleanWebpackPlugin(['dist']),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename: path.resolve(__dirname, 'dist/index.html'),
      template: path.resolve(__dirname, 'src/index.html'),
      inject: true,
      cache: false
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, 'dist')
    })
  ]
};
