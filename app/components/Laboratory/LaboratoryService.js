angular.module('elaborantLaboratoryService', []).factory('LaboratoryService', function ($http, NotificationService) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (laboratoryId, successCallback, errorCallback) {
            $http.get(apiUrl + 'laboratories/' + laboratoryId)
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                //alert(response);
                successCallback(response);
            },function (serverResponse) {
                NotificationService.errorFromResponse("Nie udało się pobrać informacji o laboratorium", serverResponse);
                errorCallback(response);
            });
        },
        getDataListEntity: function(successCallback, errorCallback, pageNumber = null, pageSize = null) {
            $http.get(pageNumber == null && pageSize == null ? apiUrl + 'laboratories?query=allItems=true' :apiUrl + 'laboratories?query=page=' + pageNumber + ",pageSize=" + pageSize)
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                successCallback(response)
            },
            function(serverResponse){
                NotificationService.errorFromResponse("Nie udało się pobrać laboratoriów", serverResponse);
                errorCallback(serverResponse);
            });
        }
        };
});