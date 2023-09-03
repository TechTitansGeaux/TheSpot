// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';
const Dotenv = require('dotenv-webpack');

require("dotenv").config();

const { NODE_ENV } = process.env;


const config = {
  mode: NODE_ENV,
  entry: path.resolve(__dirname, './client/src/index.tsx'),
  output: {
    // path: path.resolve(__dirname, './built/client/dist'), <------ change back to this before pushing
    path: path.resolve(__dirname, './client/dist'),
    filename: 'bundle.js',
  },
  devServer: {
    open: true,
    host: 'localhost',
    liveReload: true,
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new Dotenv({
      template: path.join(__dirname, '.env'),
    }),
    new BundleAnalyzerPlugin()

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noEmit: false,
          },
        },
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|jpeg)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';

        config.plugins.push(new MiniCssExtractPlugin());
        config.plugins.push(new Dotenv());

    } else {
        config.mode = 'development';
        config.plugins.push(new Dotenv());
    }
    return config;
};
