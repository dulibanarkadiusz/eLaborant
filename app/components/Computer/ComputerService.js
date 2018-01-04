angular.module('elaborantComputerService', []).factory('ComputerService', function ($http, NotificationService) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (computerId, successCallback) {
            $http.get(apiUrl + 'computers/' + computerId)
            .then(function (serverResponse) {
                var response = serverResponse.data.response;				
                successCallback(response);
            },function (serverResponse) {
				NotificationService.errorFromResponse("Nie udało się pobrać informacji o komputerze", serverResponse);
            });
        },
        getDataListEntity: function(successCallback, pageNumber = null, pageSize = null) {
            $http.get(pageNumber == null && pageSize == null ? apiUrl + 'computers?query=allItems=true' :apiUrl + 'computers?query=page=' + pageNumber + ",pageSize=" + pageSize)
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                successCallback(response);
            },function(serverResponse){
                NotificationService.errorFromResponse("Nie udało się pobrać komputerów", serverResponse);
            });
        },

        getComputersFromLab: function(labId, successCallback) {
            $http.get(apiUrl + 'computers?query=allItems=true,idLaboratory%3D'+labId)
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                successCallback(response);
            },function(serverResponse){
                if (serverResponse.status == 404){
                    NotificationService.info("W tym laboratorium nie znaleziono komputerów.");
                }
                else{
                    NotificationService.errorFromResponse("", response);
                }
            });
        }
	
    };

});