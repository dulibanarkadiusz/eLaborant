angular.module('elaborantLoginService', []).factory('LoginService', function ($http, $rootScope, UserService) {
    //var username, firstName, surname, role;
    return {

        login: function (username, password, callback) {
            localStorage.removeItem("token");
            $http({
                method: 'POST',
                url: apiUrl + "login",
                data: { username: username, password: password }
            }).success(function (data, status, headers, config) {

                localStorage.setItem('token', headers("Authorization"));
                localStorage.setItem('refreshToken', headers("X-Refresh-Token"));
                userName = username;
                //alert(headers("Authorization"));
                callback({ success: true, status: status });

            }).error(function () {
                callback({ success: false, status: status });
            });


        },
        refresh: function (callback) {
            $http({
                method: 'GET',
                url: apiUrl + "refresh?refresh_token=" + localStorage.getItem('refreshToken')

            }).success(function (data, status, headers, config) {
                localStorage.setItem('token', headers("Authorization"));
                localStorage.setItem('refreshToken', headers("X-Refresh-Token"));
                callback({ success: true });

            }).error(function () {
                callback({ success: false });
            });

        },
        checkRole: function (callback) {
            UserService.getMe(function (data) {
				//alert(JSON.stringify(data.response));
                // firstName = data.response[0].firstname;
                // surname = data.response[0].surname;
                // role = data.response[0].role.name;
                localStorage.setItem('firstName', data.response.firstname);
                localStorage.setItem('surname', data.response.surname);
                localStorage.setItem('role', data.response.role.name);
                //localStorage.setItem('role', 'admin');
                callback({ success: true });

            }, function (status) {
                callback({ success: false });
            }
            )
        },
        getSurname: function () {
            return localStorage.getItem('surname');

        },
        getFirstName: function () {
            return localStorage.getItem('firstName');

        },
        getRole: function () {
            return localStorage.getItem('role');

        },
        isLogged: function () {
            return localStorage.getItem('token') !== null;
        },
        logOut: function () {
            localStorage.removeItem("token");
            localStorage.removeItem("firstName");
            localStorage.removeItem("surname");
            localStorage.removeItem("role");

        }

    };

});