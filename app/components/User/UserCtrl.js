angular.module('elaborantUserCtrl', []).controller('UserCtrl', function ($scope, $rootScope, $sce, $http, UserService, $modal, ModalService, LoginService) {
	
    $scope.dataLoaded = false;
    $scope.totalElements = 0;
    $scope.pages = [];
	
    $scope.getList = function(pageNumber = 0) {
		$scope.usersListData = null;
        $http.get(apiUrl + 'users?query=page=' + pageNumber + ",pageSize=" + localStorage.pageSize)
            .then(function (serverResponse) {
			
                $scope.usersListData = serverResponse.data.response;
                $scope.dataLoaded = true;
                $scope.totalElements = serverResponse.data.totalElements;
                $scope.pages = getPagesArray(serverResponse.data.totalPages);
                $scope.currentPage = pageNumber;
            },function(serverResponse){
                $scope.responseError = true;
                $scope.message = $sce.trustAsHtml(ShowLoadDataError(ParseResponseErrorMessages(serverResponse), GetTypeOfResponse(serverResponse)));
            });
	
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
			var modalInstance = $modal.open({
            templateUrl: 'app/components/User/changePasswordView.html',
            controller: 'PasswordManagerCtrl',
            backdrop: 'static',
            resolve: {
                param: function(){
                    return {'id':entityId}
                }
            }
        });
	
		
	}	
    });