angular.module('elaborantProblemCtrl', []).controller('ProblemCtrl', function ($scope, $rootScope, $injector, $sce, amMoment, $stateParams, $http, $modal, ModalService, NotificationService) {
    $scope.dataLoaded = false;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    amMoment.changeLocale('pl');
	 
    $scope.addNewProblem = function(){ 
        var options = ModalService.getModalOptions();
		var modalScope = $rootScope.$new();
		options.scope = modalScope;
        options.templateUrl = 'app/components/Problem/AddProblemView.html';
        options.controller = 'ProblemManagerCtrl';		
		options.resolve = {
                param: function(){
                    return {'modal':true}
                }
            }
        modalScope.modalInstance = $modal.open(options);
		modalScope.modalInstance.result.then(function (result) {
        // Closed
    }, function () {
        // Dismissed
    });
    };
	

    $scope.getList = function(pageNumber = 0) {
        $http({
          method: 'GET',
          url: apiUrl + "problems?query=page=" + pageNumber + ",pageSize=" + localStorage.pageSize
        })
        .then(function (serverResponse) {
            $scope.problemsListData = serverResponse.data.response;
            $scope.totalElements = serverResponse.data.totalElements;
            $scope.pages = getPagesArray(serverResponse.data.totalPages);
            $scope.currentPage = pageNumber;
        }, function(data){
            $scope.errorMessage = $sce.trustAsHtml(ShowLoadDataError(ParseResponseErrorMessages(data), GetTypeOfResponse(data)));
        });
    };

    var refreshFunction = $rootScope.$on("RefreshProblemList", function(){
        $scope.getList();
    });

    $scope.$on('$destroy', function() {
        refreshFunction(); 
    });

    $scope.getProblem = function(idProblem = $stateParams.id) {
        $scope.problemid = idProblem;
		
        $scope.message = "";
        $http({
            method: 'GET',
            url: apiUrl + 'problems/'+$scope.problemid
        })
        .then(function (serverResponse) {
            $scope.problemData = new Array(serverResponse.data.response);
        },
        function(serverResponse){
            $scope.errorDataLoaded = $sce.trustAsHtml(ShowLoadDataError(ParseResponseErrorMessages(serverResponse), GetTypeOfResponse(serverResponse)));
        });
    }

    $scope.editEntity = function(problemId, isMarkedAsResolved){
        var problemEntity = {id:parseInt(problemId), isResolved: isMarkedAsResolved};
        $http({
          method: 'PUT',
          url: apiUrl + "problems/",
          data: JSON.parse(JSON.stringify(problemEntity))
        })
        .then(function(response) {
            NotificationService.success("Status problemu został zmieniony.");
        }, function(response) {
            NotificationService.errorFromResponse("Nie zmieniono statusu problemu.", response);
        });
    }

    $scope.openRemoveProblemWindow = function(entityId = $scope.problemid){
        var options = ModalService.getModalOptions(entityId);
        options.templateUrl = 'app/shared/Modal/deleteEntity.html';
        options.controller = 'ProblemManagerCtrl';

        var modalInstance = $modal.open(options);
    }

});