angular.module('elaborantLoginService', []).factory('LoginService', function ($http, $rootScope, UserService) {
    return {

        login: function (username, password, callback) {
            localStorage.removeItem("token");
            $http({
                method: 'POST',
                url: apiUrl + "login",
                data: { username: username, password: password }
            }).then(function (response) {
                localStorage.setItem('token', response.headers("Authorization"));
                localStorage.setItem('refreshToken', response.headers("X-Refresh-Token"));
                callback({ success: true, status: response.status});
			}
            ,function (response) {
                callback({ success: false, status:response.status});
            });


        },
        refresh: function (callback) {
            $http({
                method: 'GET',
                url: apiUrl + "refresh?refresh_token=" + localStorage.getItem('refreshToken')

            }).then(function (response) {
                localStorage.setItem('token', response.headers("Authorization"));
                localStorage.setItem('refreshToken', response.headers("X-Refresh-Token"));
                callback({ success: true });

            },function (response) {
                callback({ success: false });
            });

        },
        checkRole: function (callback) {
            UserService.getMe(function (data) {

                localStorage.setItem('firstName', data.firstname);
                localStorage.setItem('surname', data.surname);
                localStorage.setItem('role', data.role.name);
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