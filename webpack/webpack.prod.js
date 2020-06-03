const merge = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  entry: './src/main',
  mode: 'production',
  output: {
    // publicPath: '/',
    filename: 'bundle.min.js'
  },
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});
