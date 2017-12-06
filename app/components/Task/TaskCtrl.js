angular.module('elaborantTaskCtrl', []).controller('TaskCtrl', function ($scope, $rootScope, $injector, $sce, amMoment, $stateParams, $http, $modal, ModalService, NotificationService, LoginService) {
    amMoment.changeLocale('pl');
	$scope.canShowProblems = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
	$scope.showDeleteButton = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    var refreshFunction = $rootScope.$on("RefreshTaskList", function(){
        $scope.getList();
    });
    
    $scope.$on('$destroy', function() {
        refreshFunction(); 
    });

    $scope.getList = function(pageNumber = 0, problemId = $stateParams.id){
        console.log("request");
        $scope.dataLoaded = false;
        $scope.message = null;
        var problemIdQuery = (typeof problemId === "undefined") ? '' : 'idProblem%3D'+problemId+',';    // creates query added to URL
        
        $http({
            method: 'GET',
            url: apiUrl + 'tasks/?query='+problemIdQuery+'page=' + pageNumber + ",pageSize=" + $scope.pageSize,
        })
        .then(function (response) {
            $scope.currentPage = pageNumber;
            DisplayTasksList(response);
        },
        function (response) {
            $scope.message = $sce.trustAsHtml(ShowLoadDataError(ParseResponseErrorMessages(response), GetTypeOfResponse(response)));
        });
    }

    $scope.openNewTaskWindow = function(taskId = null) {
        var options = ModalService.getModalOptions(taskId);
        options.templateUrl = 'app/components/Task/AddTaskView.html';
        options.controller = 'TaskManagerCtrl';

        var modalInstance = $modal.open(options);
    };

    $scope.openEditTaskWindow = function(taskId){
        $scope.openNewTaskWindow(taskId);
    }

    $scope.openRemoveTaskWindow = function(taskId){
        var options = ModalService.getModalOptions(taskId);
        options.templateUrl = 'app/shared/Modal/deleteEntity.html';
        options.controller = 'TaskManagerCtrl';

        var modalInstance = $modal.open(options);
    }

    function DisplayTasksList(serverTaskResponse) { 
        $scope.taskData = serverTaskResponse.data.response;
        $scope.tasksCount = serverTaskResponse.totalElements;
        $scope.pages = getPagesArray(serverTaskResponse.totalPages);
        $scope.dataLoaded = true;
        
        for (var i = 0; i < $scope.taskData.length; i++ ){
            var task = $scope.taskData[i];
            task.executorsString = "";
            for (var j = 0; j < task.userExecuteTasksById.length; j++ ){
                task.executorsString += task.userExecuteTasksById[j].firstname + " " + task.userExecuteTasksById[j].surname + "\n";
            }
        }
    }
});