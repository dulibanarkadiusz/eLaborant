angular.module('elaborantUserService', []).factory('UserService', function ($http) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (userId, successCallback, errorCallback) {
            $http.get(apiUrl + 'users/' + userId)
            .success(function (serverResponse) {
                var response = serverResponse.response;
                //alert(response);
                successCallback(response);
            })
            .error(function (data, status) {
                errorCallback(status);
            });
        },
        getDataListEntity: function(successCallback, errorCallback, pageNumber = null, pageSize = null) {
            $http.get(pageNumber == null && pageSize == null ? apiUrl + 'users?query=allItems=true' :apiUrl + 'users?query=page=' + pageNumber + ",pageSize=" + pageSize)
            .success(function (serverResponse) {
                successCallback(serverResponse)
            })
            .error(function(data, status){
                errorCallback(status);
            });
        },
		getLaborants: function(successCallback, errorCallback) {
            $http.get(apiUrl + 'users?query=allItems=true,idRole=3')
            .success(function (serverResponse) {
                successCallback(serverResponse)
            })
            .error(function(status){
                errorCallback(status);
            });
        },
		getOwners: function(successCallback, errorCallback) {
            $http.get(apiUrl + 'users?query=allItems=true,idRole=2')
            .success(function (serverResponse) {
                successCallback(serverResponse)
            })
            .error(function(status){
                errorCallback(status);
            });
        },
		getMe: function(successCallback, errorCallback) {
            $http.get(apiUrl + 'users/me')
            .success(function (serverResponse) {
                successCallback(serverResponse)
            })
            .error(function( status){
                errorCallback(status);
            });
        }
        };
});