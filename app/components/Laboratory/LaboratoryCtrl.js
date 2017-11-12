angular.module('elaborantLaboratoryCtrl', []).controller('LaboratoryCtrl', function($rootScope, $scope, $sce, $stateParams, $http, $modal, ModalService, LaboratoryService) {
    $scope.labid = $stateParams.id;
    $scope.labDataLoaded = false;
    $scope.computersCount = 0;
    $scope.errorDataLoaded = '';

    $scope.addNewLaboratory = function(laboratoryId = null){ 
	
        var modalInstance = $modal.open({
            templateUrl: 'modals/addLabView.html',
            controller: 'LaboratoryManagerCtrl',
            backdrop: 'static',
            resolve: {
                param: function(){
                    return {'id':laboratoryId}
                }
            }
        });
    };
	$rootScope.$on("RefreshList", function(){
		$scope.getList();
	});
	$scope.getList = function(pageNumber = 0) {
		LaboratoryService.getDataListEntity(function(serverResponse){
		
			$scope.labListData = serverResponse.response;
			$scope.dataLoaded = true;
			$scope.totalElements = serverResponse.totalElements;
			$scope.pages = getPagesArray(serverResponse.totalPages);
			$scope.currentPage = pageNumber;
		
		
		}, function(status){$scope.responseError = true;
			$scope.errorMessage = $sce.trustAsHtml(errorMessage);},pageNumber,$scope.pageSize )
   
   
	};

	$scope.getEntity = function(id = $scope.labid) {
		$scope.message = "";
		LaboratoryService.GetEntity(id, function (serverResponse) {
			$scope.labData = new Array(serverResponse.response);
			$scope.labDataLoaded = true;
		},function(status){
			if (status==404){
				$scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo('(404) Laboratorium nie zostało znalezione.'));
			}
			else{
				$scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo(dataError));
			}
			return;
		});

		$http.get(apiUrl + 'computers/?query=idLaboratory%3D'+$scope.labid)
		.success(function (serverResponse) {
			$scope.computersCount = serverResponse.totalElements;
			$scope.computersData = serverResponse.response;
			$scope.dataLoaded = true;
		})
		.error(function(error, status) {
			switch(status){
				case 404: 
					$scope.message = "Brak komputerów w laboratorium";
					break;
			}
		});

	}
	$scope.editLaboratory = function(laboratoryId){

		$scope.addNewLaboratory(laboratoryId);
	}
	$scope.openRemoveLaboratoryWindow = function(entityId){

		var options = ModalService.getModalOptions(entityId);
		options.templateUrl = 'modals/deleteEntity.html';
		options.controller = 'LaboratoryManagerCtrl';

		var modalInstance = $modal.open(options);
	}			
});
	