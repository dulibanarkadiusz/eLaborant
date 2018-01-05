angular.module('elaborantTaskCtrl', []).controller('TaskCtrl', function ($scope, $rootScope, $injector, $sce, amMoment, $stateParams, $http, $modal, ModalService, NotificationService, LoginService, StateService, UserService) {
    amMoment.changeLocale('pl');
	$scope.canShowProblems = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
	$scope.showDeleteButton = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';

    $scope.pages = [];

    var refreshFunction = $rootScope.$on("RefreshTaskList", function(){
        $scope.getList();
    });
    
    $scope.$on('$destroy', function() {
        refreshFunction(); 
    });

    $scope.getList = function(pageNumber = 0, problemId = $stateParams.id){
        $scope.dataLoaded = false;
        $scope.message = null;
        var problemIdQuery = (typeof problemId === "undefined") ? '' : 'idProblem%3D'+problemId+',';    // creates query added to URL
        var taskQueryString = sessionStorage.taskQueryString;
        if (taskQueryString !== undefined){
            problemIdQuery += sessionStorage.taskQueryString;
        }

        $http({
            method: 'GET',
            url: apiUrl + 'tasks/?query='+problemIdQuery+'page=' + pageNumber + ",pageSize=" + localStorage.pageSize,
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
        $scope.tasksCount = serverTaskResponse.data.totalElements;
        $scope.pages = getPagesArray(serverTaskResponse.data.totalPages);
        $scope.dataLoaded = true;
        
        for (var i = 0; i < $scope.taskData.length; i++ ){
            var task = $scope.taskData[i];
            task.executorsString = "";
            for (var j = 0; j < task.userExecuteTasksById.length; j++ ){
                task.executorsString += task.userExecuteTasksById[j].firstname + " " + task.userExecuteTasksById[j].surname + "\n";
            }
        }
    }

    $scope.applyFilters = function(){
        var taskQueryString = "";

        // filtry są dodawanie do query stringa - tylko te pola, w których użytkownik wybrał pewną wartość
        if ($scope.filtersSelectedValues.idState != "-1"){
            taskQueryString += "idState%3D" + $scope.filtersSelectedValues.idState + ",";
        }
        if ($scope.filtersSelectedValues.idAuthor != "-1"){
            taskQueryString += "idAuthor%3D" + $scope.filtersSelectedValues.idAuthor + ",";
        }
        if ($scope.filtersSelectedValues.hideClosedTask){
            taskQueryString += "idState>1,idState<5,";
        }
        taskQueryString += "priority%3E" + $scope.filtersSelectedValues.priority + ",";

        sessionStorage.taskQueryString = taskQueryString; // zapis do session storage by móc odtworzyć filtry
        $scope.getList(0); // pobranie rekordów po zmianach
    }

    $scope.restoreFilters = function(){
        var taskQueryString = sessionStorage.taskQueryString;
        $scope.filtersActive = false;

        $scope.filtersSelectedValues = { // domyślne wartości filtrowania
            idState: "-1",
            idAuthor: "-1",
            priority: "0",
            hideClosedTask: false
        };

        if (taskQueryString !== undefined){
            $scope.filtersActive = true;
            $scope.filtersSelectedValues = Object.assign({}, $scope.filtersSelectedValues, queryStringToJSON(taskQueryString));
                // konkatenacja wartości domyślnych oraz wartości występujących w query stringu zapisanym w session storage
        }

    }

    $scope.resetFilters = function(){ // czyszczenie bieżących filtrów
        sessionStorage.removeItem("taskQueryString"); // usuwanie bieżącej konfiguracji z pamięci w session storage
        $scope.filtersActive = false;
        $scope.restoreFilters(); // przywracanie (pustej) konfiguracji
        $scope.getList(0);
    }

    $scope.loadFiltersValues = function(){ // Ładowanie list encji - możliwe do wyboru z list select
        $scope.filtersAvailableValues = {};

        StateService.getDataEntity(function(dataJSON){
             $scope.filtersAvailableValues.statesList = dataJSON.data.response;
        });


        if (!$scope.canShowProblems){
            return; // zalogowany użytkownik nie ma pełnych praw - nie wyswietlamy użytkowników
        }

        UserService.getDataListEntity(function(dataJSON){
            $scope.filtersAvailableValues.authorsList = dataJSON;
        });
    }

});