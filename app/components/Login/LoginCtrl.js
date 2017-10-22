angular.module('elaborantLoginCtrl', []).controller('LoginCtrl', function ($scope, $rootScope, $stateParams, $state, $location, LoginService) {

        $scope.formSubmit = function () {
            LoginService.login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    $scope.error = '';
                    $scope.username = '';
                    $scope.password = '';
                    LoginService.setToken();
                    $location.path('/Panel');
                } else {
                    $scope.error = "Incorrect username/password !";
                }
            });

        }

    });