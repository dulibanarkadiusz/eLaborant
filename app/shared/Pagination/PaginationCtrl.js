angular.module('elaborantPaginationCtrl', []).controller('PaginationCtrl', function($rootScope, $scope, $http, $sce){     
	$scope.availablePageSizes = [5,10,25,50]; 

	$scope.pageSize = (localStorage.pageSize) ? localStorage.pageSize : defaultPageSize;

	$scope.pageSizeChanged = function(){
		localStorage.setItem("pageSize", parseInt($scope.pageSize));
		$scope.getList();
	}
});