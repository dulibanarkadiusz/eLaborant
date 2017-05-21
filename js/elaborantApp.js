var elaborantApp = angular.module('elaborant', ["ui.router"]);

elaborantApp.controller('usersList', function ($scope, $http) {
    $scope.dataLoaded = false;
    $http.get('http://serwis365.pl/api/getFreeTime.php').success(function (response) {
        $scope.myData = response;
        $scope.dataLoaded = true;
    });
});