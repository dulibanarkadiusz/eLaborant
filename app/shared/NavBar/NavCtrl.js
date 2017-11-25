angular.module('elaborantNavCtrl', []).controller('NavCtrl', function ($scope, $rootScope, $state, LoginService) {
	$scope.active = $state.current.name;
	$scope.showMenu = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
	$scope.showProblems = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
	$scope.showTasks = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
	$scope.showUsers = LoginService.getRole() == 'admin';
	$scope.showLaboratories = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
	$scope.showComputers = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';	
});