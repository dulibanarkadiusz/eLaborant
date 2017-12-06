angular.module('elaborantAdminPanelCtrl', []).controller('AdminPanelCtrl', function ($scope, $rootScope, $state, LoginService) {
	$scope.showMenu = LoginService.getRole() == 'admin' || LoginService.getRole() == 'opiekun';
	$scope.getTitle = function(){
	    switch (LoginService.getRole()) {
	        case 'admin':
	            return 'eLaborant - panel administracyjny';
	            break;
	        case 'pracownik':
	            return 'eLaborant - panel pracownika';
	            break;
	        case 'laborant':
	            return 'eLaborant - panel laboranta';
	            break;
	        case 'opiekun':
	            return 'eLaborant - panel opiekuna';
	            break;
	        default:
	            return '';
	    }
		
	}
	$scope.title = $scope.getTitle();
		
});