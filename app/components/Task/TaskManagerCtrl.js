angular.module('elaborantTaskManagerCtrl', []).controller('TaskManagerCtrl', function($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, TaskService){     
    $scope.init = function(){
        $scope.windowTitle = "Dodaj nowe zadanie";
        $scope.problemid = $stateParams.id;
        $scope.task = {};
        $scope.options = [];
        $scope.minDate = new Date();
        $scope.task.priority = "3";
        $scope.task.idState = "2";
        $scope.task.dateRealization = new Date(moment(roundMinutes(new Date())).format('YYYY-MM-DD HH:mm'));
        $scope.task.userExecuteTasksById = {};

        if (param.id){ // get details if task exsists
            $scope.windowTitle = "Edycja zadania";
            TaskService.getDataEntity(param.id, createObject);
        }
    }

    function createObject(dataEntityJSON){
        $scope.task = dataEntityJSON;
        $scope.task.idState = $scope.task.idState.toString();
    }

    /*  ---- TEMPORARY ---- */
    $http.get(apiUrl + 'users') // TODO - zamienić na laborantów 
        .success(function (serverResponse) {
            var response = serverResponse.response;
            $scope.assistantsDataLoaded = true;

            for(var i=0; i < response.length; i++){
                $scope.options.push({
                    "id": response[i].id,
                    "name": response[i].firstname + " " + response[i].surname
                });
            }
        })
        .error(function(data, status){
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });

    
    $http.get(apiUrl + 'states')
        .success(function (serverResponse) {
            $scope.statesData = serverResponse.response;
            $scope.statesDataLoaded = true;
        })
        .error(function(data, status){
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    /* ---- TEMPORARY END ---- */ 

    

    $scope.prepareObjectToSave = function(){
        var dataEntity = jQuery.extend({}, $scope.task);
        dataEntity.dateRealization = new Date(dataEntity.dateRealization).getTime();
        dataEntity.priority = parseInt(dataEntity.priority);
        dataEntity.idState = parseInt(dataEntity.idState);
        dataEntity.idProblem = parseInt(dataEntity.problemid);
        return dataEntity;
    }

    $scope.save =  function(){
        var dataTask = $scope.prepareObjectToSave();

        $http({
          method: ($scope.task.id) ? 'PUT' : 'POST',
          url: apiUrl + "tasks/",
          data: JSON.parse(JSON.stringify(dataTask))
        })
        .success(function (success) {
            $rootScope.$emit("RefreshTaskList", {});
            $scope.cancel();
        })
        .error(function (response) {
            $scope.IsResponseError = true;
            $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
        });

    };

    $scope.updateDateRealization = function($event){
        $scope.task.dateRealization = new Date($event.target.value);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});