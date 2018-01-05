angular.module('elaborantLoginCtrl', []).controller('LoginCtrl', function ($scope, $rootScope, $stateParams, $state, $location, LoginService) {

    $scope.formSubmit = function () {
        $scope.error = '';

        LoginService.login($scope.username, $scope.password, function (response) {
            if (response.success) {
                $scope.username = '';
                $scope.password = '';
                LoginService.checkRole(function (checkUserResponse) {
                    if (checkUserResponse.success)
                        $location.path('/Main');
                    else						
						$scope.error = "Wystąpił błąd !";
                }
                );
            } else {
                if(response.status == 401)
					$scope.error = "Niepoprawny login/hasło !";
				else if (response.status == -1){
                    $scope.error = "Brak połączenia z serwerem.\nSprawdź połączenie internetowe.";
                }
                else {
                    console.log(response);
					$scope.error = "Wystąpił błąd (" +response.status + ")";
                }
            }
        });
    }

});