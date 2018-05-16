const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({ filename: './css/app.css' });

const config = {
  mode: 'development',
  // absolute path for project root with the 'src' directory
  context: path.resolve(__dirname, 'src'),

  entry: {
    // relative path declaration
    app: './app.js'
  },

  output: {
    // absolute path declaration
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].bundle.js'
  },

  module: {
    rules: [

      // babel-loader with 'env' preset
      { test: /\.js$/, include: /src/, exclude: /node_modules/, use: { loader: "babel-loader", options: { presets: ['env'] } } },
      // html-loader
      { test: /\.html$/, use: ['html-loader'] },
      // sass-loader with sourceMap activated
      {
        test: /\.(scss|sass|css)$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: process.NODE_ENV === 'production' } },
            // { loader: 'postcss-loader', options: { sourceMap: true } },
            'resolve-url-loader',
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
        }),
      },
      // file-loader(for images)
      { test: /\.(jpg|png|gif|svg)$/, use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: './assets/img/' } }] },

    ]
  },

  plugins: [
    // cleaning up only 'dist' directory
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),

    // copy fonts form src to 'dist' directory
    new CopyWebpackPlugin([
      { from: 'assets/fonts', to: 'assets/fonts' },
      { from: 'assets/img', to: 'assets/img' },
    ]), 
    // extract-text-webpack-plugin instance
    extractPlugin
  ],

  devServer: {
    // static files served from here
    contentBase: path.resolve(__dirname, "./dist/assets/"),
    compress: true,
    // open app in localhost:3000
    port: 3000,
    stats: 'errors-only',
    open: true
  },

  devtool: 'inline-source-map'

};

module.exports = config;