angular.module('elaborantLaboratoryService', []).factory('LaboratoryService', function ($http) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (laboratoryId, callback) {
            $http.get(apiUrl + 'laboratories/' + laboratoryId)
            .success(function (serverResponse) {
                var response = serverResponse.response;
                //alert(response);
                callback(response);
            })
            .error(function (data, status) {
                alert("Błąd przy pobieraniu")
            });
        }
    };
});