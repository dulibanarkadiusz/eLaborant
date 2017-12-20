angular.module('elaborantCurrentUserCtrl', []).controller('CurrentUserCtrl', function ($scope, $location, $modal,LoginService) {
    $scope.user = LoginService.getFirstName() + " " + LoginService.getSurname();
    $scope.logOut = function () {
        LoginService.logOut();
        $location.path('/');
    }
	$scope.changePassword = function(){ 
	
        var modalInstance = $modal.open({
            templateUrl: 'app/components/User/ChangeOwnPasswordView.html',
            controller: 'OwnPasswordManagerCtrl',
            backdrop: 'static'
        });
    };
});