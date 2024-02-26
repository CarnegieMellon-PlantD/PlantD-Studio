/* eslint-env node */
const path = require('path');
const fs = require('fs');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const WebpackBarPlugin = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const env = require('./utils/env');

const isDevelopment = env.NODE_ENV === 'development';
const isAnalyzer = env.ANALYZER === 'true';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const cssLoaderOptions = {
  modules: {
    auto: true,
    localIdentName: isDevelopment ? '[file]__[local]' : '[md5:hash:base64:12]',
    exportLocalsConvention: 'dashesOnly',
  },
};

const config = {
  devServer: {
    hot: true,
    client: { overlay: false },
    host: env.HOST,
    port: env.PORT,
    open: true,
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    historyApiFallback: true, // To support `BrowserRouter`
    proxy: [
      {
        context: ['/api/', '/data/'],
        target: 'http://127.0.0.1:5000',
        pathRewrite: {
          '^/api/': '/api/',
          '^/data/': '/data/',
        },
      },
    ],
  },
  entry: {
    app: path.resolve(__dirname, 'src/app.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]_[contenthash].js',
    chunkFilename: '[id]_[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDevelopment,
                  refresh: isDevelopment,
                },
              },
            },
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { ...cssLoaderOptions, importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { ...cssLoaderOptions, importLoaders: 2 },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { ...cssLoaderOptions, importLoaders: 2 },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: { lessOptions: { javascriptEnabled: true } },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/template.html'),
      minify: !isDevelopment,
      chunks: ['app'],
    }),
    new DefinePlugin({
      APP_VERSION: JSON.stringify(packageJson.version),
      IS_DEVELOPMENT: JSON.stringify(isDevelopment),
      BUILD_LOCAL_TIME: JSON.stringify(new Date().toString()),
      BUILD_ISO_TIME: JSON.stringify(new Date().toISOString()),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};

const devConfig = merge(config, {
  mode: 'development',
  stats: false,
  devtool: 'inline-cheap-module-source-map',
  plugins: [new ReactRefreshPlugin(), new FriendlyErrorsWebpackPlugin()],
});

const prodConfig = merge(config, {
  mode: 'production',
  stats: 'errors-warnings',
  plugins: [
    new WebpackBarPlugin({
      profile: true, // Require patch to work properly.
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'build'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash].css',
    }),
    isAnalyzer &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        logLevel: 'silent',
      }),
  ].filter(Boolean),
});

module.exports = isDevelopment ? devConfig : prodConfig;
