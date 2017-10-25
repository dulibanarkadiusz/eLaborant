angular.module('elaborantLoginService', []).factory('LoginService', function ($http, $rootScope) {
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
					userName = username;
                    //alert(headers("Authorization"));
                    callback({ success: true });

                }).error(function () {
                    callback({ success: false });
                });


            },
			checkRole: function (callback) {
               
                $http({
                    method: 'GET',
                    url: apiUrl + "users?query=login=" + userName
                }).success(function (data, status, headers, config) {
                    
                    // firstName = data.response[0].firstname;
					// surname = data.response[0].surname;
					// role = data.response[0].role.name;
					localStorage.setItem('firstName', data.response[0].firstname);
					localStorage.setItem('surname', data.response[0].surname);
					localStorage.setItem('role', data.response[0].role.name);
                    callback({ success: true });

                }).error(function () {
                    callback({ success: false });
                });


            },
			getSurname: function(){
				return localStorage.getItem('surname');
				
			},
			getFirstName: function(){
				return localStorage.getItem('firstName');
				
			},
			getRole: function(){
				//return localStorage.getItem('role');
				return 'user';
				
			},
			isLogged: function(){
				return localStorage.getItem('token') !== null;			
			},
			logOut: function(){
				localStorage.removeItem("token");
				localStorage.removeItem("firstName");
				localStorage.removeItem("surname");
				localStorage.removeItem("role");
				
			}

        };

    });