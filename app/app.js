window.$ = window.jQuery = require("jquery");
require('bootstrap');
require('eonasdan-bootstrap-datetimepicker');
require('moment');
require('angular-moment');
require('angular-bootstrap-multiselect');
require('angular-bootstrap-npm-old');
require('bootstrap-notify');



function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
//require("../assets/js/functions.js");
 require("./app.module.js");
require("./app.routes.js");
require("./app.interceptor.js");
require("./app.directives.js");
require("./app.filters.js");
requireAll(require.context("./components", true, /\.js$/));
requireAll(require.context("./shared", true, /\.js$/));
