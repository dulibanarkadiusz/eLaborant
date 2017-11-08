angular.module('elaborantProblemManagerCtrl', []).controller('ProblemManagerCtrl', function($rootScope, $scope, $state, $http, $sce, $filter, $stateParams, $modalInstance, param){     
    $scope.problem = {};
    if (param.id){
        $scope.problem.id = param.id;
    }

    $scope.init = function(){
        $scope.problem = {};

        $scope.labList = function() { // TO DO
            $http.get(apiUrl + 'laboratories')
            .success(function (serverResponse) {
                $scope.labListData = serverResponse.response;
                $scope.labDataLoaded = true;
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });
        };
        $scope.labList();

        $scope.computersList = function() { // TO DO
            $http.get(apiUrl + 'computers?query=idLaboratory%3D'+ $scope.problem.idLaboratory)
            .success(function (serverResponse) {
                $scope.computersListData = serverResponse.response;
                $scope.computersDataLoaded = true;
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.computersListData = {};
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });
        };
    }

    $scope.save = function(){
        $scope.data = {};
        $scope.data.content = $scope.problem.content;
        $scope.data.idAuthor = 8;
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
            $scope.cancel();
        }, 
        function(response) {
            $scope.IsResponseError = true;
            $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
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
        }, function(response) {
            
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});