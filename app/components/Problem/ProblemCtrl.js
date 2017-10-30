angular.module('elaborantProblemCtrl', []).controller('ProblemCtrl', function ($scope, $injector, $sce, amMoment, $stateParams, $http, $modal) {
    $scope.dataLoaded = false;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    amMoment.changeLocale('pl');
    $scope.addNewProblem = function(){ 
        var modalInstance = $modal.open({
            templateUrl: 'modals/addProblemView.html',
            controller: 'addProblemFormController'
        });
    };

    $scope.getList = function(pageNumber = 0) {
        $http.get(apiUrl + 'problems?query=page=' + pageNumber + ",pageSize=" + $scope.pageSize)
        .success(function (serverResponse) {
            $scope.myData = serverResponse.response;
            $scope.totalElements = serverResponse.totalElements;
            $scope.dataLoaded = true;

            $scope.pages = getPagesArray(serverResponse.totalPages);
            $scope.currentPage = pageNumber;
            localStorage.pageSize = $scope.pageSize;
        })
        .error(function(data, status){
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    };

    $scope.getProblem = function(idProblem = $stateParams.id) {
        $scope.problemid = idProblem;
        $scope.message = "";
        $http.get(apiUrl + 'problems/'+$scope.problemid)
            .success(function (serverResponse) {
                $scope.problemData = new Array(serverResponse.response);
                $scope.problemDataLoaded = true;
            })
            .error(function(error, status){
                if (status==404)
                    $scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo('(404) Taki problem nie istnieje.'));
                else
                    $scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo(dataError));
            });

        $scope.loadTasks = function(pageNumber = 0){
            $http.get(apiUrl + 'tasks/?query=idProblem%3D'+$scope.problemid+',page=' + pageNumber + ",pageSize=" + $scope.pageSize)
            .success(function (serverTaskResponse) {
                $scope.taskData = serverTaskResponse.response;
                $scope.tasksCount = serverTaskResponse.totalElements;
                $scope.pages = getPagesArray(serverTaskResponse.totalPages);
                $scope.currentPage = pageNumber;
                localStorage.pageSize = $scope.pageSize;
                
                $scope.dataLoaded = true;
                for (var i = 0; i < $scope.taskData.length; i++ ){
                    var task = $scope.taskData[i];
                    task.executorsString = "";
                    for (var j = 0; j < task.userExecuteTasksById.length; j++ ){
                        task.executorsString += task.userExecuteTasksById[j].firstname + " " + task.userExecuteTasksById[j].surname + "\n";
                    }
                }
            })
            .error(function(error, status) {
                switch(status){
                    case 404: 
                        $scope.message = "Brak zadań do wyświetlenia.";
                        break;
                }
            });
        }
    }

});