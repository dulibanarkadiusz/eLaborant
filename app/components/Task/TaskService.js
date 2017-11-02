angular.module('elaborantTaskService', []).factory('TaskService', function ($http) {
    return {
    	getDataEntity: function (taskId, callback) {
            $http.get(apiUrl + 'tasks/' + taskId) 
            .success(function (serverResponse) {
                var response = serverResponse.response;
                response.dateRealization = new Date(response.dateRealization);
                response.priority = String(response.priority);

                callback(response);
            })
            .error(function(data, status){
                alert("Błąd przy pobieraniu")
            });
        }
    };
});