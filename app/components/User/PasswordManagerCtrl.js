angular.module('elaborantPasswordManagerCtrl', []).controller('PasswordManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param ) {
  
    if (param.id) {
        //$scope.user.id = param.id;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
});