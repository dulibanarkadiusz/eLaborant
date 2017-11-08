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

/*
        getDataListEntity: function (problemId, callback){
            $http({
                method: 'GET',
                url: apiUrl + "tasks/?query=idProblem%3D" + problemId + ",page=" ,
                data: JSON.parse(JSON.stringify(json))
            })
            .then(function(response) {
                $rootScope.$emit("RefreshTaskList", {});
                $scope.cancel();
            }, function(response) {
                alert("Wystąpił błąd!");
            });
        }*/
    };
});