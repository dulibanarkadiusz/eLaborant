angular.module('elaborantUserCtrl', []).controller('UserCtrl', function ($scope, $http) {
    $scope.dataLoaded = false;
    $scope.totalElements = 0;
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    $scope.getList = function(pageNumber = 0) {
        $http.get(apiUrl + 'users?query=page=' + pageNumber + ",pageSize=" + $scope.pageSize)
        .success(function (serverResponse) {
            $scope.usersListData = serverResponse.response;
            $scope.dataLoaded = true;
            $scope.totalElements = serverResponse.totalElements;
            $scope.pages = getPagesArray(serverResponse.totalPages);
            $scope.currentPage = pageNumber;
            localStorage.pageSize = $scope.pageSize;
        })
        .error(function(data, status){
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    };

});