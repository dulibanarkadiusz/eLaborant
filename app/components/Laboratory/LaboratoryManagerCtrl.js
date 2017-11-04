angular.module('elaborantLaboratoryManagerCtrl', []).controller('LaboratoryManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, LaboratoryService) {
    $scope.lab = {};
    if (param.id) {
        $scope.lab.id = param.id;
    }


    $scope.init = function () {
        $scope.windowTitle = "Dodaj nowe laboratorium";
        $scope.lab = {};
        $scope.lab.building = "MS";
        $scope.buttonName = "Dodaj";

        if (param.id) { // get details if task exsists
            $scope.lab.id = param.id;
            $scope.windowTitle = "Edycja laboratorium";
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
        $http.get(apiUrl + 'users')
        .success(function (serverResponse) {
            $scope.usersListData = serverResponse.response;
            $scope.dataLoaded = true;
        })
        .error(function (data, status) {
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    };

    $scope.usersList();


    $scope.save = function () {
        var dataAddTask = jQuery.extend({}, $scope.task);
        $http({
            method: ($scope.id) ? 'PUT' : 'POST',
            url: apiUrl + "laboratories/",
            data: JSON.parse(JSON.stringify($scope.lab))
        })
        .success(function (success) {
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();
            $scope.lab = {};
            $scope.lab.building = "MS";
        })
        .error(function (response) {
            $scope.IsResponseError = true;
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
        }, function (response) {
            alert("Wystąpił błąd!");
        });
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.editLaboratory = function (laboratoryId) {

        $scope.addNewLaboratory(laboratoryId);
    }
});