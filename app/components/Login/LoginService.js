angular.module('elaborantLoginService', []).factory('LoginService', function ($http, $rootScope) {

        return {

            login: function (username, password, callback) {
                localStorage.removeItem("token");
                $http({
                    method: 'POST',
                    url: apiUrl + "login",
                    data: { username: username, password: password }
                }).success(function (data, status, headers, config) {
                    localStorage.setItem('token', headers("Authorization"));
                    //alert(headers("Authorization"));
                    callback({ success: true });

                }).error(function () {
                    callback({ success: false });
                });


            },
            setToken: function () {
                $http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
            }

        };

    });