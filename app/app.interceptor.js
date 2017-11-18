elaborantApp.factory('httpRequestInterceptor', function ($q, $injector) {
    return {
        request: function (config) {
            config.headers['Authorization'] = localStorage.getItem('token');
            return config;
        },
        responseError: function (response) {
            var LoginService = $injector.get('LoginService');

            if (response.status === 401 && LoginService.isLogged()) {

                var deferred = $q.defer();

                LoginService.refresh(function (result) {
                    if (result.success) {
                        $injector.get("$http")(response.config).then(function (resp) { deferred.resolve(resp); });
                    }
                    else {
                        deferred.reject();
                        alert("Wystąpił błąd");
                    }
                });
                return deferred.promise;
            }
            return response;
        }
    };
});

elaborantApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});