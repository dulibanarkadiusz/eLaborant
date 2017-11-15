angular.module('elaborantComputerService', []).factory('ComputerService', function ($http) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (computerId, successCallback, errorCallback) {
            $http.get(apiUrl + 'computers/' + computerId)
            .success(function (serverResponse) {
                var response = serverResponse.response;

                successCallback(response);
            })
            .error(function (data, status) {
                errorCallback(status);
            });
        },
        getDataListEntity: function(successCallback, errorCallback, pageNumber = null, pageSize = null) {
            $http.get(pageNumber == null && pageSize == null ? apiUrl + 'computers?query=allItems=true' :apiUrl + 'computers?query=page=' + pageNumber + ",pageSize=" + pageSize)
            .success(function (serverResponse) {
                successCallback(serverResponse)
            })
            .error(function(data, status){
                errorCallback(status);
            });
        },
            //TODO zmienić nazwę?
            getComputersFromLab: function(labId, successCallback, errorCallback) {
                $http.get(apiUrl + 'computers?query=allItems=true,idLaboratory%3D'+labId)
                .success(function (serverResponse) {
                    successCallback(serverResponse)
                })
                .error(function(serverResponse, status){
                    errorCallback(serverResponse, status);
                });
            }
		
        };

});