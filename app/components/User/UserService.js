angular.module('elaborantUserService', []).factory('UserService', function ($http) {
    //var username, firstName, surname, role;
    return {
        
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
		getUserWithLogin: function(login, successCallback, errorCallback) {
            $http.get(apiUrl + 'users?query=allItems=true,login=' + login)
            .success(function (serverResponse) {
                successCallback(serverResponse)
            })
            .error(function( status){
                errorCallback(status);
            });
        }
        };
});