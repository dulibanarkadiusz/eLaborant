angular.module('elaborantLaboratoryCtrl', []).controller('LaboratoryCtrl', function($rootScope, $scope, $sce, $stateParams, $http, $modal, ModalService, LaboratoryService, ComputerService) {
    $scope.labid = $stateParams.id;
    $scope.labDataLoaded = false;
    $scope.computersCount = 0;
    $scope.errorDataLoaded = '';

    $scope.addNewLaboratory = function(laboratoryId = null){ 
	
        var modalInstance = $modal.open({
            templateUrl: 'app/components/Laboratory/AddLabView.html',
            controller: 'LaboratoryManagerCtrl',
            backdrop: 'static',
            resolve: {
                param: function(){
                    return {'id':laboratoryId}
                }
            }
        });
    };
	var refreshFunction = $rootScope.$on("RefreshList", function(){
		$scope.getList();
	});
	$scope.$on('$destroy', function() {
		refreshFunction(); 
	});
	$scope.getList = function(pageNumber = 0) {
	    $http.get(apiUrl + 'laboratories?query=page=' + pageNumber + ",pageSize=" + localStorage.pageSize)
            .then(function (serverResponse) {
                $scope.labListData = serverResponse.data.response;
                $scope.dataLoaded = true;
                $scope.totalElements = serverResponse.data.totalElements;
                $scope.pages = getPagesArray(serverResponse.data.totalPages);
                $scope.currentPage = pageNumber;
            },
            function(serverResponse){
                $scope.message = $sce.trustAsHtml(ShowLoadDataError(ParseResponseErrorMessages(serverResponse), GetTypeOfResponse(serverResponse)));
            });
		
   
   
	};

	$scope.getEntity = function(id = $scope.labid) {
		$scope.message = "";
		LaboratoryService.getDataEntity(id, function (response) {
			$scope.labData = new Array(response);
			$scope.labDataLoaded = true;
		},function(response){
			if (response.status==404){
				$scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo('(404) Laboratorium nie zostało znalezione.'));
			}
			else{
				$scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo(dataError));
			}
			return;
		});
		ComputerService.getComputersFromLab($scope.labid,function (serverResponse) {
			//alert(JSON.stringify(serverResponse));
			$scope.computersCount = serverResponse.length;
			$scope.computersData = serverResponse;
			$scope.dataLoaded = true;
		}, function(status) {
			switch(status){
				case 404: 
					$scope.message = "Brak komputerów w laboratorium";
					break;
		} })
		

	}
	$scope.editLaboratory = function(laboratoryId){

		$scope.addNewLaboratory(laboratoryId);
	}
	$scope.openRemoveLaboratoryWindow = function(entityId){

		var options = ModalService.getModalOptions(entityId);
		options.templateUrl = 'app/shared/Modal/deleteEntity.html';
		options.controller = 'LaboratoryManagerCtrl';

		var modalInstance = $modal.open(options);
	}			
});
	