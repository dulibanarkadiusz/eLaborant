angular.module('elaborantComputerManagerCtrl', []).controller('ComputerManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, ComputerService, LaboratoryService, NotificationService) {
    $scope.computer = {};
    if (param.id) {
        $scope.computer.id = param.id;
    }

    $scope.init = function () {
        $scope.windowTitle = "Dodaj nowy komputer";
        $scope.errorMessage = "Błąd przy dodawaniu komputera";
        $scope.computer = {};
        $scope.buttonName = "Dodaj";
        if (param.id) { // get details if task exsists
            $scope.windowTitle = "Edycja komputera";
			$scope.errorMessage = "Błąd przy edycji komputera";
            ComputerService.getDataEntity(param.id, createObject);
            $scope.buttonName = "Edytuj";
        }
    }
    function createObject(dataEntityJSON) {
        $scope.computer = dataEntityJSON;
        $scope.computer.idLaboratory = $scope.computer.laboratory.id.toString();
        	
    }
   
	$scope.labList = function () {
		LaboratoryService.getDataListEntity(function (serverResponse) {
            $scope.labListData = serverResponse;
            $scope.dataLoaded = true;
        })
    };
    $scope.labList();

    $scope.save = function () {
        var dataAddTask = jQuery.extend({}, $scope.task);
        $http({
            method: ($scope.computer.id) ? 'PUT' : 'POST',
            url: apiUrl + "computers/",
            data: JSON.parse(JSON.stringify($scope.computer))
        })
        .then(function (success) {
			($scope.computer.id) ? NotificationService.success("Komputer został zmieniony!") : NotificationService.success("Komputer został dodany!");
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();
        },function (response) {
            $scope.IsResponseError = true;
            $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
        });

    };
    $scope.deleteEntity = function () {
        var json = { id: parseInt($scope.computer.id) };
        $http({
            method: 'DELETE',
            url: apiUrl + "computers/" + $scope.computer.id,
            data: JSON.parse(JSON.stringify(json))
        })
        .then(function (response) {
			NotificationService.success("Komputer został usunięty!");
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();
        }, function (response) {
            NotificationService.error("Wystąpił błąd!")
        });
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});