angular.module('elaborantProblemManagerCtrl', []).controller('ProblemManagerCtrl', function($rootScope, $scope, $state, $http, $sce, $filter, $stateParams, $modalInstance, param, NotificationService, LaboratoryService, ComputerService){     
    $scope.problem = {};
    if (param.id){
        $scope.problem.id = param.id;
    }

    $scope.init = function(){
        $scope.problem = {};
        LaboratoryService.getDataListEntity($scope.LoadLabsData, ShowError);
    }

    $scope.computersList = function(){
        ComputerService.getComputersFromLab($scope.problem.idLaboratory, $scope.LoadComputersData, ShowComputersLoadError);
    }

    $scope.save = function(){
        $scope.data = {};
        $scope.data.content = $scope.problem.content;
        if ($scope.problem.source == 'computer'){
            $scope.data.idComputer = parseInt($scope.problem.idComputer);
        }
        else{
            $scope.data.idLaboratory = parseInt($scope.problem.idLaboratory);
        }

        $http({
          method: 'POST',
          url: apiUrl + "problems/",
          data: JSON.parse(JSON.stringify($scope.data))
        })
        .then(function(response) {
            $rootScope.$emit("RefreshProblemList", {});
            NotificationService.successNotification("Problem został dodany.");
            $scope.cancel();
        }, 
        function(response) {
            console.log(response);
            NotificationService.errorNotification("Dodawanie problemu zakończone niepowodzeniem: " + response.data.errors[0].message);
        });   
    }

    $scope.deleteEntity = function(){
        var json = {id:parseInt($scope.problem.id)};
        $http({
            method: 'DELETE',
            url: apiUrl + "problems/" + $scope.problem.id,
            data: JSON.parse(JSON.stringify(json))
        })
        .then(function(response) {
            $scope.cancel();
            $state.go('Problemy', {}, {reload: true}); // redirection from problem page to problemList
            NotificationService.successNotification("Problem został usunięty.");
        }, function(response) {
            NotificationService.errorNotification("Nie udało się usunąć problemu: " + response.data.errors[0].message);
        });
    }

    $scope.LoadLabsData = function(serverResponse){
        $scope.labListData = serverResponse.response;
        $scope.labDataLoaded = true;
    }

    $scope.LoadComputersData = function(serverResponse){
        $scope.computersListData = serverResponse.response;
        $scope.computersDataLoaded = true;
    }

    function ShowError(){
        NotificationService.errorNotification("Nie udało się załadować listy laboratoriów: " + response.data.errors[0].message);
    }

    function ShowComputersLoadError(response, status){
        if (status == 404){
            NotificationService.info("W tym laboratorium nie znaleziono komputerów.");
        }
        else{
            NotificationService.errorNotification(response.errors.message + " (błąd" + status + ")");
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});