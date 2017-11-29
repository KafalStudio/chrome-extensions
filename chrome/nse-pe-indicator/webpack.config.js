const uglify = require('uglifyjs-webpack-plugin');

module.exports = {
  progress: true,
  color: true,
  entry: {
    background: "./src/background.ts",
    popup: "./src/popup.ts",
    options : "./src/options.ts"
    // add more entries
  },
  output: {
    filename: "[name].js"
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' },
    ]
  },
  plugins: [require('webpack-fail-plugin'),
   new uglify({
     compress:true
   }) 
   ]
};
