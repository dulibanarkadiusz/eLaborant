angular.module('elaborantProblemCtrl', []).controller('ProblemCtrl', function ($scope, $rootScope, $injector, $sce, amMoment, $stateParams, $http, $modal, ModalService, NotificationService) {
    $scope.dataLoaded = false;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    amMoment.changeLocale('pl');
    $scope.addNewProblem = function(){ 
        var options = ModalService.getModalOptions();
        options.templateUrl = 'modals/addProblemView.html';
        options.controller = 'ProblemManagerCtrl';

        var modalInstance = $modal.open(options);
    };

    $scope.getList = function(pageNumber = 0) {
        $http.get(apiUrl + 'problems?query=page=' + pageNumber + ",pageSize=" + $scope.pageSize)
        .success(function (serverResponse) {
            $scope.myData = serverResponse.response;
            $scope.totalElements = serverResponse.totalElements;
            $scope.dataLoaded = true;

            $scope.pages = getPagesArray(serverResponse.totalPages);
            $scope.currentPage = pageNumber;
            localStorage.pageSize = $scope.pageSize;
        })
        .error(function(data, status){
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    };

    $rootScope.$on("RefreshProblemList", function(){
        $scope.getList();
    });

    $scope.getProblem = function(idProblem = $stateParams.id) {
        $scope.problemid = idProblem;
        $scope.message = "";
        $http.get(apiUrl + 'problems/'+$scope.problemid)
            .success(function (serverResponse) {
                $scope.problemData = new Array(serverResponse.response);
                $scope.problemDataLoaded = true;
            })
            .error(function(error, status){
                if (status==404)
                    $scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo('(404) Taki problem nie istnieje.'));
                else
                    $scope.errorDataLoaded = $sce.trustAsHtml(parseErrorInfo(dataError));
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
            console.log(response);
            NotificationService.errorNotification("Nie udało się zmienić statusu problemu: " + response.data.errors[0].message);
        });
    }

    $scope.openRemoveProblemWindow = function(entityId = $scope.problemid){
        var options = ModalService.getModalOptions(entityId);
        options.templateUrl = 'modals/deleteEntity.html';
        options.controller = 'ProblemManagerCtrl';

        var modalInstance = $modal.open(options);
    }

});