angular.module('elaborantTaskService', []).factory('TaskService', function ($http, NotificationService) {
    return {
    	getDataEntity: function (taskId, callback) {
            $http({
                method: 'GET',
                url: apiUrl + 'tasks/' + taskId
            })
            .then(function (serverResponse) {
                var response = serverResponse.data.response;
                response.dateRealization = new Date(response.dateRealization);
                response.priority = String(response.priority);

                callback(response);
            },
            function(serverResponse){
                NotificationService.errorFromResponse("Nie udało się pobrać szczegółów zadania", serverResponse);
            });
        }
    };
});