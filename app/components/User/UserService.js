angular.module('elaborantUserService', []).factory('UserService', function ($http, NotificationService) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (userId, successCallback) {
            $http.get(apiUrl + 'users/' + userId)
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                //alert(response);
                successCallback(response);
            },function (response) {
                NotificationService.errorFromResponse("Nie udało się pobrać informacji o użytkowniku", serverResponse);
            });
        },
        getDataListEntity: function(successCallback, pageNumber = null, pageSize = null) {
            $http.get(pageNumber == null && pageSize == null ? apiUrl + 'users?query=allItems=true' :apiUrl + 'users?query=page=' + pageNumber + ",pageSize=" + pageSize)
            .then(function (serverResponse) {
				var response = serverResponse.data.response;
                successCallback(response)
            },function(response){
				NotificationService.errorFromResponse("Nie udało się pobrać użytkowników", response);
            });
        },
		getLaborants: function(successCallback) {
            $http.get(apiUrl + 'users?query=allItems=true,idRole=3')
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                successCallback(response)
            },function(response){
				NotificationService.errorFromResponse("Nie udało się pobrać użytkowników mających rolę laborant", response);
                errorCallback(response);
            });
        },
		getOwners: function(successCallback) {
            $http.get(apiUrl + 'users?query=allItems=true,idRole=2')
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                successCallback(response)
			},function(response){
				NotificationService.errorFromResponse("Nie udało się pobrać użytkowników mających rolę opiekun", response);
            });
        },
		getMe: function(successCallback) {
            $http.get(apiUrl + 'users/me')
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                successCallback(response)
            },function(response){
				NotificationService.errorFromResponse("Nie udało się pobrać informacji o użytkowniku", response);
            });
        }
        };
});