angular.module('elaborantComputerManagerCtrl', []).controller('ComputerManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, ComputerService, NotificationService) {
    $scope.computer = {};
    if (param.id) {
        $scope.computer.id = param.id;
    }


    $scope.init = function () {
        $scope.windowTitle = "Dodaj nowy komputer";
        $scope.computer = {};
        $scope.buttonName = "Dodaj";
        if (param.id) { // get details if task exsists
            $scope.windowTitle = "Edycja komputera";
            ComputerService.getDataEntity(param.id, createObject);
            $scope.buttonName = "Edytuj";
        }
    }
    function createObject(dataEntityJSON) {
        $scope.computer = dataEntityJSON;
        $scope.computer.idLaboratory = $scope.computer.laboratory.id.toString();
        //$scope.lab.owner = {};		
    }



    $scope.labList = function () {
        $http.get(apiUrl + 'laboratories')
        .success(function (serverResponse) {
            $scope.labListData = serverResponse.response;
            $scope.dataLoaded = true;
        })
        .error(function (data, status) {
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    };
    $scope.labList();


    $scope.save = function () {
        var dataAddTask = jQuery.extend({}, $scope.task);
        $http({
            method: ($scope.computer.id) ? 'PUT' : 'POST',
            url: apiUrl + "computers/",
            data: JSON.parse(JSON.stringify($scope.computer))
        })
        .success(function (success) {
			($scope.computer.id) ? NotificationService.success("Komputer został zmieniony!") : NotificationService.success("Komputer został dodany!");
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();
            $scope.computer = {};
        })
        .error(function (response) {
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
			NotificationService.success("Komputer został usunięty!")
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();
        }, function (response) {
            alert("Wystąpił błąd!");
        });
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});