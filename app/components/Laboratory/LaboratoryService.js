angular.module('elaborantLaboratoryService', []).factory('LaboratoryService', function ($http) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (laboratoryId, successCallback, errorCallback) {
            $http.get(apiUrl + 'laboratories/' + laboratoryId)
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
            $http.get(pageNumber == null && pageSize == null ? apiUrl + 'laboratories?query=allItems=true' :apiUrl + 'laboratories?query=page=' + pageNumber + ",pageSize=" + pageSize)
            .success(function (serverResponse) {
                successCallback(serverResponse)
            })
            .error(function(data, status){
                errorCallback(status);
            });
        }
        };
});