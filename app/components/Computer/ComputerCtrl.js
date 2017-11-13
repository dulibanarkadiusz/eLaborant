angular.module('elaborantComputerCtrl', []).controller('ComputerCtrl', function($rootScope, $scope, $sce, amMoment, $stateParams, $http, $modal, ModalService, ComputerService) {
    $scope.computerid = $stateParams.id;
    $scope.computerDataLoaded = false;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];
    $scope.errorDataLoaded = '';
    $scope.problemsCount = 0;
    amMoment.changeLocale('pl');

    $scope.addNewComputer = function(computerId = null){ 
        var modalInstance = $modal.open({
            templateUrl: 'modals/addComputerView.html',
            controller: 'ComputerManagerCtrl',
            backdrop: 'static',
            resolve: {
                param: function(){
                    return {'id':computerId}
                }
            }
        });
    };

	$rootScope.$on("RefreshList", function(){
		$scope.getList();
	});

	$scope.getList = function(pageNumber = 0) {
		ComputerService.getDataListEntity(function (serverResponse) {
			$scope.computersListData = serverResponse.response;
			$scope.dataLoaded = true;
			$scope.totalElements = serverResponse.totalElements;
			$scope.pages = getPagesArray(serverResponse.totalPages);
			$scope.currentPage = pageNumber;
			localStorage.pageSize = $scope.pageSize;
		}, function(data, status){
			$scope.responseError = true;
			$scope.errorMessage = $sce.trustAsHtml(errorMessage);
		}, pageNumber, $scope.pageSize);
	  
	};

	$scope.getEntity = function(idComputer = $scope.computerid) {
		$scope.message = "";
		ComputerService.getDataEntity(idComputer, function (serverResponse) {
			$scope.computerData = new Array(serverResponse.response);
			$scope.computerDataLoaded = true;
		}, function(status){
			if (status==404){
				$scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo('(404) Komputer nie został znaleziony.'));
			}
			else{
				$scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo(dataError));
			}
			return;
		})}
	   

                /* Zgłoszone problemy dla komputera 
                computerProblemsData = function(pageNumber = 0) { 
                    $http.get(apiUrl + 'problems/?query=idComputer%3D'+$scope.computerid+',page=' + pageNumber + ",pageSize=" + $scope.pageSize)
                        .success(function (serverResponse) {
                            $scope.problemsCount = serverResponse.totalElements;
                            $scope.problemsData = serverResponse.response;
                            $scope.dataLoaded = true;
                            $scope.pages = getPagesArray(serverResponse.totalPages);
                            $scope.currentPage = pageNumber;
                            localStorage.pageSize = $scope.pageSize;
                        })
                        .error(function(error, status) {
                            switch(status){
                                case 404: 
                                    $scope.message = "Brak zgłoszonych problemów dla tego komputera";
                                break;
                            }
                        });
                }
                computerProblemsData();*/
           
	$scope.editComputer = function(computerId){

		$scope.addNewComputer(computerId);
	};
	$scope.openRemoveComputerWindow = function(entityId){
		
		var options = ModalService.getModalOptions(entityId);
		options.templateUrl = 'modals/deleteEntity.html';
		options.controller = 'ComputerManagerCtrl';

		var modalInstance = $modal.open(options);
	};			
}); 