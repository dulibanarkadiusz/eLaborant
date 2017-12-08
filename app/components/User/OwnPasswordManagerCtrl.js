angular.module('elaborantOwnPasswordManagerCtrl', []).controller('OwnPasswordManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, NotificationService ) {
   $scope.user = {};
   
	
    $scope.save = function () {
        $http({
            method: 'PATCH',
            url: apiUrl + "users/change-password",
            data: JSON.parse(JSON.stringify($scope.user))
        })
        .then(function (success) {		
			 NotificationService.success("Hasło zostało zmienione!");
			//$rootScope.$emit("RefreshList", {});
            $scope.cancel();
			
            $scope.user = {};
            //$scope.lab.building = "MS";
        },
        function (response) {
            $scope.IsResponseError = true;
            $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
        });

    };
   

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
});