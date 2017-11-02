angular.module('elaborantTaskCtrl', []).controller('TaskCtrl', function ($scope, $rootScope, $injector, $sce, amMoment, $stateParams, $http, $modal, ModalService) {
    $scope.dataLoaded = false;
    $scope.refresh;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    amMoment.changeLocale('pl');

    /*$scope.getList = function(pageNumber = 0) {
        $scope.refresh = this;
        $http.get(apiUrl + 'tasks?query=page=' + pageNumber + ",pageSize=" + $scope.pageSize)
        .success(function (serverResponse) {
            $scope.taskListData = serverResponse.response;
            $scope.pages = getPagesArray(serverResponse.totalPages);
            $scope.dataLoaded = true;
            $scope.totalElements = serverResponse.totalElements;
            $scope.currentPage = pageNumber;
            localStorage.pageSize = $scope.pageSize;

            for (var i = 0; i < $scope.taskListData.length; i++ ){
                    var task = $scope.taskListData[i];
                    task.executorsString = "";
                    for (var j = 0; j < task.userExecuteTasksById.length; j++ ){
                        task.executorsString += task.userExecuteTasksById[j].firstname + " " + task.userExecuteTasksById[j].surname + "\n";
                    }
                }
        })
        .error(function(data, status){
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    };*/

    $rootScope.$on("RefreshTaskList", function(){
        $scope.getList();
    });
    

    $scope.getList = function(pageNumber = 0, problemId = $stateParams.id){
        var problemIdQuery = (typeof problemId === "undefined") ? '' : 'idProblem%3D'+problemId+',';
        $http.get(apiUrl + 'tasks/?query='+problemIdQuery+'page=' + pageNumber + ",pageSize=" + $scope.pageSize)
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

    $scope.openNewTaskWindow = function(taskId = null) {
        var options = ModalService.getModalOptions(taskId);
        options.templateUrl = 'modals/addTaskView.html';
        options.controller = 'TaskManagerCtrl';

        var modalInstance = $modal.open(options);
    };

    $scope.openEditTaskWindow = function(taskId){
        $scope.openNewTaskWindow(taskId);
    }

    $scope.openRemoveTaskWindow = function(taskId){
        var options = ModalService.getModalOptions(taskId);
        options.templateUrl = 'modals/deleteEntity.html';
        options.controller = 'TaskManagerCtrl';

        var modalInstance = $modal.open(options);
    }

});