angular.module('elaborantProblemCtrl', []).controller('ProblemCtrl', function ($scope, $rootScope, $injector, $sce, amMoment, $stateParams, $http, $modal, ModalService, NotificationService) {
    $scope.dataLoaded = false;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    amMoment.changeLocale('pl');
    $scope.addNewProblem = function(){ 
        var options = ModalService.getModalOptions();
        options.templateUrl = 'app/components/Problem/AddProblemView.html';
        options.controller = 'ProblemManagerCtrl';

        var modalInstance = $modal.open(options);
    };

    $scope.getList = function(pageNumber = 0) {
        $http({
          method: 'GET',
          url: apiUrl + "problems?query=page=" + pageNumber + ",pageSize=" + $scope.pageSize
        })
        .then(function (serverResponse) {
            $scope.problemsListData = serverResponse.data.response;
            $scope.totalElements = serverResponse.totalElements;
            $scope.pages = getPagesArray(serverResponse.totalPages);
            $scope.currentPage = pageNumber;
        }, function(data){
            $scope.errorMessage = $sce.trustAsHtml(ShowLoadDataError(ParseResponseErrorMessages(data), GetTypeOfResponse(data)));
        });
    };

    $rootScope.$on("RefreshProblemList", function(){
        $scope.getList();
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
            NotificationService.successNotification("Status problemu został zmieniony.");
        }, function(response) {
            NotificationService.errorFromResponse("Nie zmieniono statusu problemu.", response);
        });
    }

    $scope.openRemoveProblemWindow = function(entityId = $scope.problemid){
        var options = ModalService.getModalOptions(entityId);
        options.templateUrl = 'modals/deleteEntity.html';
        options.controller = 'ProblemManagerCtrl';

        var modalInstance = $modal.open(options);
    }

});