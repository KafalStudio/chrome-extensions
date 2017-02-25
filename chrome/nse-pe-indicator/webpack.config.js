module.exports = {
  progress: true,
  color: true,
  entry: {
    background: "./src/background.ts"
    // add more entries
  },
  output: {
    filename: "[name].js"
  },
  resolve: {
    extensions: ['', '.ts']
  },
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' },
    ]
  },
  plugins: [require('webpack-fail-plugin')]
};
