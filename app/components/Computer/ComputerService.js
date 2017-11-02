angular.module('elaborantComputerService', []).factory('ComputerService', function ($http) {
    //var username, firstName, surname, role;
    return {
        getDataEntity: function (computerId, callback) {
            $http.get(apiUrl + 'computers/' + computerId)
            .success(function (serverResponse) {
                var response = serverResponse.response;

                callback(response);
            })
            .error(function (data, status) {
                alert("Błąd przy pobieraniu")
            });
        }
    };
});