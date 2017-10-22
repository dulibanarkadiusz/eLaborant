angular.module('elaborantLoginService', []).factory('LoginService', function ($http, $rootScope) {

        return {

            login: function (username, password, callback) {
                sessionStorage.removeItem("token");
                $http({
                    method: 'POST',
                    url: apiUrl + "login",
                    data: { username: username, password: password }
                }).success(function (data, status, headers, config) {
                    sessionStorage.setItem('token', headers("Authorization"));
                    //alert(headers("Authorization"));
                    callback({ success: true });

                }).error(function () {
                    callback({ success: false });
                });


            },
            setToken: function () {
                $http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
            }

        };

    });