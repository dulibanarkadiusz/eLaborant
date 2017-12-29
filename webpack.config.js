var webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "bundle.js"
   }
  //,
  // plugins: [
    // new UglifyJSPlugin()
  // ]
}
