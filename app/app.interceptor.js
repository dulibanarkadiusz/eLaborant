elaborantApp.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      config.headers['Authorization'] = localStorage.getItem('token'); 
      return config;
    }
  };
});

elaborantApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});