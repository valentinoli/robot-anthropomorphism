var path = require('path');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
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
  },
  plugins: [
	new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Node.js endpoint
        // through BrowserSync
        proxy: 'http://localhost:8000/',
      }
    )
  ]
};
