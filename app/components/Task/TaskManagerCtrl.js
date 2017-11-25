angular.module('elaborantTaskManagerCtrl', []).controller('TaskManagerCtrl', function($rootScope, amMoment, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, TaskService, UserService, StateService, NotificationService){     
    $scope.task = {};
    if (param.id){
        $scope.task.id = param.id;
    }

    $scope.init = function(){   // default values
        $scope.windowTitle = "Dodaj nowe zadanie";
        $scope.dateValidationText= "Termin realizacji nie może być datą przeszłą!";
        $scope.options = [];
        $scope.minDate = new Date();

        $scope.task = {};
        $scope.task.problemid = $stateParams.id;
        $scope.task.priority = "3";
        $scope.task.idState = "2";
        $scope.task.dateRealization = new Date(moment(roundMinutes(new Date())).format('YYYY-MM-DD HH:mm')); // set current date rounded to the nearest hour (ex. 12:43 -> 13:00)
        $scope.task.userExecuteTasksById = {};


        if (param.id){ // get details if task already exsists
            $scope.windowTitle = "Edycja zadania";
            TaskService.getDataEntity(param.id, createTaskObject, $scope.showGetTaskDataError);
        }

        UserService.getLaborants(createLaborantsList);
        StateService.getDataEntity(createStateList);
    }

    function createLaborantsList(dataJSON){
        var response = dataJSON.response;
        for(var i=0; i < response.length; i++){
            $scope.options.push({ // creates bootstrap dropdown list 
                "id": response[i].id,
                "name": response[i].firstname + " " + response[i].surname
            });
        }
    }

    function createStateList(dataJSON){
        $scope.statesData = dataJSON.data.response;
    }

    function createTaskObject(dataEntityJSON){
        $scope.task = dataEntityJSON;
        $scope.task.idState = $scope.task.idState.toString();
        $scope.minDate = new Date($scope.task.dateNotification);
        $scope.dateValidationText = "Data realizacji musi być późniejsza niż data dodania zadania ("+moment($scope.minDate).format('D MMMM YYYY H:mm')+")";
    }

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

    $scope.deleteEntity = function(){
        var json = {id:parseInt($scope.task.id)};
        $http({
            method: 'DELETE',
            url: apiUrl + "tasks/" + $scope.task.id,
            data: JSON.parse(JSON.stringify(json))
        })
        .then(function(response) {
            NotificationService.success("Zadanie zostało usunięte.");
            $rootScope.$emit("RefreshTaskList", {});
            $scope.cancel();
        }, function(response) {
            NotificationService.errorFromResponse("Nie udało się usunąć zadania", response);
        });
    }

    $scope.updateDateRealization = function($event){
        $scope.task.dateRealization = new Date($event.target.value);
    }

    $scope.showGetTaskDataError = function (serverResponse){
        NotificationService.errorFromResponse("Nie udało się pobrać szczegółów zadania", serverResponse);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});