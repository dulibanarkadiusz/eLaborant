angular.module('elaborantComputerCtrl', []).controller('ComputerCtrl', function($rootScope, $scope, $sce, amMoment, $stateParams, $http, $modal, ModalService, ComputerService) {
    $scope.computerid = $stateParams.id;
    $scope.computerDataLoaded = false;
    $scope.pages = [];
    $scope.errorDataLoaded = '';
    $scope.problemsCount = 0;
    amMoment.changeLocale('pl');

    $scope.addNewComputer = function(computerId = null){ 
        var modalInstance = $modal.open({
            templateUrl: 'app/components/Computer/AddComputerView.html',
            controller: 'ComputerManagerCtrl',
            backdrop: 'static',
            resolve: {
                param: function(){
                    return {'id':computerId}
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
		$scope.computerDataLoaded = false;
		$scope.errorDataLoaded = '';
		$scope.computersListData = null;
	    $http.get(apiUrl + 'computers?query=page=' + pageNumber + ",pageSize=" + localStorage.pageSize)
            .then(function (serverResponse) {
               
                $scope.computersListData = serverResponse.data.response;
                $scope.dataLoaded = true;
                $scope.totalElements = serverResponse.data.totalElements;
                $scope.pages = getPagesArray(serverResponse.data.totalPages);
                $scope.currentPage = pageNumber;
            },function(serverResponse){
                $scope.message = $sce.trustAsHtml(ShowLoadDataError(ParseResponseErrorMessages(serverResponse), GetTypeOfResponse(serverResponse)));
            });			
	  
	};

	    $scope.getEntity = function(idComputer = $scope.computerid) {
	        $scope.message = "";
	        ComputerService.getDataEntity(idComputer, function (response) {
	            $scope.computerData = new Array(response);
	            $scope.computerDataLoaded = true;
	        }, function(response){
	            if (response.status==404){
	                $scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo('(404) Komputer nie został znaleziony.'));
	            }
	            else{
	                $scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo(dataError));
	            }
	            return;
	        })}
	             
	$scope.editComputer = function(computerId){

		$scope.addNewComputer(computerId);
	};
	$scope.openRemoveComputerWindow = function(entityId){
		
		var options = ModalService.getModalOptions(entityId);
		options.templateUrl = 'app/shared/Modal/deleteEntity.html';
		options.controller = 'ComputerManagerCtrl';

		var modalInstance = $modal.open(options);
	};			
}); 