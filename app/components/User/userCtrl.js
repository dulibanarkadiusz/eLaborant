angular.module('elaborantUserCtrl', []).controller('UserCtrl', function ($scope, $rootScope, UserService, $modal, ModalService, LoginService) {
	
    $scope.dataLoaded = false;
    $scope.totalElements = 0;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];
	
    $scope.getList = function(pageNumber = 0) {
        UserService.getDataListEntity(function (serverResponse) {
            $scope.usersListData = serverResponse.response;
            $scope.dataLoaded = true;
            $scope.totalElements = serverResponse.totalElements;
            $scope.pages = getPagesArray(serverResponse.totalPages);
            $scope.currentPage = pageNumber;
            localStorage.pageSize = $scope.pageSize;
        },function(status){
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        }, pageNumber, $scope.pageSize)
    };
	$scope.addNewUser = function(userId = null){ 
	
        var modalInstance = $modal.open({
            templateUrl: 'app/components/User/AddUserView.html',
            controller: 'UserManagerCtrl',
            backdrop: 'static',
            resolve: {
                param: function(){
                    return {'id':userId}
                }
            }
        });
    };
	$scope.editUser = function(userId){
		$scope.addNewUser(userId);
	}
	var refreshFunction = $rootScope.$on("RefreshList", function(){
		$scope.getList();
	});
	$scope.$on('$destroy', function() {
		refreshFunction(); 
	});
	$scope.openRemoveUserWindow = function(entityId){

		var options = ModalService.getModalOptions(entityId);
		options.templateUrl = 'app/shared/Modal/deleteEntity.html';
		options.controller = 'UserManagerCtrl';

		var modalInstance = $modal.open(options);
	}

	$scope.openChangePasswordWindow = function(entityId){

		var options = ModalService.getModalOptions(entityId);
		options.templateUrl = 'app/components/User/changePasswordView.html';
		options.controller = 'PasswordManagerCtrl';

		var modalInstance = $modal.open(options);
	}	
    });