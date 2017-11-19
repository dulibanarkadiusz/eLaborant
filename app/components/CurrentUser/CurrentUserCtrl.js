angular.module('elaborantCurrentUserCtrl', []).controller('CurrentUserCtrl', function ($scope, $location, LoginService) {
    $scope.user = LoginService.getFirstName() + " " + LoginService.getSurname();
    $scope.logOut = function () {
        LoginService.logOut();
        $location.path('/');
    }
});