var webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "bundle.js"
   },
   module: {
    
  }
  ,
  plugins: [
    new UglifyJSPlugin({
        parallel: true,
        uglifyOptions: {
          ie8: false,
          mangle: false, // debug false
          output: {
            comments: false,
            beautify: false,  // debug true
          }
        }
      })
  ]
}
