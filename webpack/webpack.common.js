const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  output: {
    publicPath: '/',
    filename: 'bundle.js',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|mp3|ogg)$/i,
        use: 'file-loader',
      },
      {
        test: /\.woff$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        },
      },
    ]
  },
  resolve: {
    alias: {
      Src: path.resolve(__dirname, '../src/'),
      Scenes: path.resolve(__dirname, '../src/scenes/'),
      Services: path.resolve(__dirname, '../src/services/'),
      Assets: path.resolve(__dirname, '../src/assets/'),
      Utils: path.resolve(__dirname, '../src/utils/'),
      Rex: path.resolve(__dirname, '../src/plugins/rex/'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html',
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
};
