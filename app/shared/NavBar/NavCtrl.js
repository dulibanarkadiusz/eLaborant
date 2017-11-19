angular.module('elaborantNavCtrl', []).controller('NavCtrl', function ($scope, $rootScope, $state) {
	$scope.active = $state.current.name;
	$scope.showProblems = true;
	$scope.showTasks = true;
	$scope.showUsers = true;
	$scope.showLaboratories = true;
	$scope.showComputers = true;	
});