angular.module("elaborantChart", ["chart.js"]).controller("DoughnutCtrl", function ($scope, $http) {

    $http.get(apiUrl + 'problems?query=page=' + 0 + ",pageSize=" + 100)
          .success(function (serverResponse) {
              $scope.myData = serverResponse.response;
              var resolved = $.grep($scope.myData, function (e) { return e.isResolved == false; });
              var numberofSolved = 0;
              $scope.labels = ["Rowiązane problemy", "Nierozwiązane problemy"];
              $scope.data = [resolved.length, $scope.myData.length - resolved.length];
          })



});
