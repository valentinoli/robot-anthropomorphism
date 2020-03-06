var path = require('path');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'public/js'),
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, "public/js/build"),
    filename: "[name].js",
  },
};
