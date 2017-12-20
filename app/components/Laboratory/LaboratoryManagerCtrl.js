angular.module('elaborantLaboratoryManagerCtrl', []).controller('LaboratoryManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, LaboratoryService, NotificationService , UserService) {
    $scope.lab = {};
    if (param.id) {
        $scope.lab.id = param.id;
    }


    $scope.init = function () {		
        $scope.windowTitle = "Dodaj nowe laboratorium";
		$scope.errorMessage = "Błąd przy dodawaniu laboratorium";
        $scope.lab = {};
        $scope.lab.building = "MS";
        $scope.buttonName = "Dodaj";

        if (param.id) { // get details if task exsists
            $scope.lab.id = param.id;
            $scope.windowTitle = "Edycja laboratorium";
			$scope.errorMessage = "Błąd przy edycji laboratorium";
            LaboratoryService.getDataEntity(param.id, createObject);
            $scope.buttonName = "Edytuj";
        }
    }
    function createObject(dataEntityJSON) {
        $scope.lab = dataEntityJSON;
        $scope.lab.idOwner = $scope.lab.owner.id.toString();
        //$scope.lab.owner = {};		
    }


    $scope.usersList = function () {
		UserService.getOwners(function (serverResponse) {
            $scope.usersListData = serverResponse;
            $scope.dataLoaded = true;
			
        },function (status) {
           
        })
        
    };

    $scope.usersList();


    $scope.save = function () {
        var dataAddTask = jQuery.extend({}, $scope.task);
        $http({
            method: ($scope.lab.id) ? 'PUT' : 'POST',
            url: apiUrl + "laboratories/",
            data: JSON.parse(JSON.stringify($scope.lab))
        })
        .then(function (success) {		
			($scope.lab.id) ? NotificationService.success("Laboratorium zostało zmienione!") : NotificationService.success("Laboratorium zostało dodane!");
			$rootScope.$emit("RefreshList", {});
            $scope.cancel();			
            $scope.lab = {};
            $scope.lab.building = "MS";
        },function (response) {
            $scope.IsResponseError = true;
			//alert(JSON.stringify(response));
            $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
        });

    };
    $scope.deleteEntity = function () {
        var json = { id: parseInt($scope.lab.id) };
        $http({
            method: 'DELETE',
            url: apiUrl + "laboratories/" + $scope.lab.id,
            data: JSON.parse(JSON.stringify(json))
        })
        .then(function (response) {
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();
			NotificationService.success("Laboratorium zostało usunięte!");
        }, function (response) {
            NotificationService.error("Wystąpił błąd!");
        });
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.editLaboratory = function (laboratoryId) {

        $scope.addNewLaboratory(laboratoryId);
    }
});