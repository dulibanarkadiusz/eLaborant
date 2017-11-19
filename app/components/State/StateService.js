angular.module('elaborantStateService', []).factory('StateService', function ($http, NotificationService) {
    return {
    	getDataEntity: function (successCallback, errorCallback) {
            $http({
                method: 'GET',
                url: apiUrl + "states/",
            })
            .then(function(serverResponse) {
                successCallback(serverResponse)
            }, 
            function(serverResponse) {
                NotificationService.error("Nie udało się załadować listy dostępnych statusów.");
            });
        }
    };
});