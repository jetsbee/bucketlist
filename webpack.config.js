const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      hash: true,
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        // Applying css-module with HTML
        // ref. https://stackoverflow.com/questions/59568928/how-to-emit-css-chunk-for-styles-from-htmlwebpackplugin-chunk
        oneOf: [
          {
            issuer: /\.html$/,
            use: [
              {
                loader: 'css-loader',
                options: {
                  onlyLocals: true,
                  modules: true,
                  importLoaders: 2,
                },
              },
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 2,
                },
              },
              'postcss-loader',
              'sass-loader',
            ],
          },
        ],
        // End of applying css-module with HTML
      },
    ],
  },
};
