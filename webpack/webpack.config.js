const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  plugins: [
    plugins.HtmlWebpackPlugin,
    plugins.MiniCssExtractPlugin,
  ],
  module: {
    rules: [
      loaders.JSLoader,
      loaders.CSSLoader,
    ],
  },
};
