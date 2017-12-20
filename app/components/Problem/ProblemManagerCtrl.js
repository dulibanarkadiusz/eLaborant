angular.module('elaborantProblemManagerCtrl', []).controller('ProblemManagerCtrl', function($rootScope, $scope, param, $state, $http, $sce, $filter, $modalInstance, $stateParams,  NotificationService, LaboratoryService, ComputerService){     
    $scope.problem = {};
    if (param.id){
        $scope.problem.id = param.id;
    }
	$scope.isModal = function(){
		return param.modal;
		
	};
    $scope.init = function(){
        $scope.problem = {};
        LaboratoryService.getDataListEntity($scope.LoadLabsData);
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
            NotificationService.success("Problem został dodany.");
            $scope.cancel();
        }, 
        function(response) {
            NotificationService.errorFromResponse("Dodawanie problemu zakończone niepowodzeniem", response);
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
            NotificationService.success("Problem został usunięty.");
        }, function(response) {
            NotificationService.errorFromResponse("Nie udało się usunąć problemu", response);
        });
    }

    $scope.LoadLabsData = function(serverResponse){
        $scope.labListData = serverResponse;
        $scope.labDataLoaded = true;
    }

    $scope.LoadComputersData = function(serverResponse){
		
        $scope.computersListData = serverResponse;
        $scope.computersDataLoaded = true;
    }

    function ShowComputersLoadError(response){
        if (response.status == 404){
            NotificationService.info("W tym laboratorium nie znaleziono komputerów.");
        }
        else{
            NotificationService.errorFromResponse("", response);
        }
    }

    $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
    };
});