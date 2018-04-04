const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const vueConfig = require('./vue-loader.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'static/js/[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      '@': resolve("src")
    },
    extensions: ['.ts','.js']
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('build'),
          resolve('test'),
          resolve('node_modules/_element-ui@2.2.2@element-ui/src'),
          resolve('node_modules/_element-ui@2.2.2@element-ui/packages')
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name:utils.assetsPath('img/[name].[ext]?[hash]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(css)$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: 'css-loader?minimize',
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(styl)$/,
        loader:'style-loader!css-loader!stylus-loader'
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        }),
        new webpack.ProvidePlugin({
          jQuery:'jquery',
          $: "jquery"
        })
      ]
    : [
        new FriendlyErrorsPlugin(),
        new webpack.ProvidePlugin({
          jQuery:'jquery',
          $: "jquery"
        })
      ],

};
