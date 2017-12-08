angular.module('elaborantPasswordManagerCtrl', []).controller('PasswordManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, NotificationService ) {
   $scope.user = {};
   
	$scope.init = function () {		
		
			if (param.id) { 
				$scope.user.idUser = param.id;
				
			}
		}
    $scope.save = function () {
        $http({
            method: 'PATCH',
            url: apiUrl + "users/admin-change-password",
            data: JSON.parse(JSON.stringify($scope.user))
        })
        .then(function (success) {		
			 NotificationService.success("Hasło zostało zmienione!");
			//$rootScope.$emit("RefreshList", {});
            $scope.cancel();
			
            $scope.user = {};
            //$scope.lab.building = "MS";
        },function (response) {
            $scope.IsResponseError = true;
            $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
        });

    };
   

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
});