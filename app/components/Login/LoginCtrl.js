angular.module('elaborantLoginCtrl', []).controller('LoginCtrl', function ($scope, $rootScope, $stateParams, $state, $location, LoginService) {

    $scope.formSubmit = function () {
        LoginService.login($scope.username, $scope.password, function (response) {

            if (response.success) {
                $scope.error = '';
                $scope.username = '';
                $scope.password = '';

                LoginService.checkRole(function (checkUserResponse) {
                    if (checkUserResponse.success)
                        $location.path('/Main');
                    else
						$location.path('/Main');    
						//$scope.error = "Wystąpił błąd !";

                    //LoginService.refresh(function(){});
                }
                );

            } else {
                $scope.error = "Niepoprawny login/hasło !";
            }
        });

    }

});