angular.module('elaborantProblemManagerCtrl', []).controller('ProblemManagerCtrl', function($rootScope, $scope, $state, $http, $sce, $filter, $stateParams, $modalInstance, param){     
    $scope.problem = {};
    if (param.id){
        $scope.problem.id = param.id;
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
            $state.go('Problemy');
        }, function(response) {
            
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});