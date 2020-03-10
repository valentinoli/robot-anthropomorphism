var path = require('path');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'public/js'),
  entry: {
    'webcam': './src/webcam.js',
    'post-processing': './src/post-processing.js',
  },
  output: {
    path: path.resolve(__dirname, "public/js/build"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
