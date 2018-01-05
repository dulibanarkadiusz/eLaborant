angular.module('elaborantProblemCtrl', []).controller('ProblemCtrl', function ($scope, $rootScope, $injector, $sce, amMoment, $stateParams, $http, $modal, ModalService, NotificationService, LoginService, UserService, ComputerService, LaboratoryService) {
    $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
    $scope.pages = [];

    amMoment.changeLocale('pl');
    $scope.isUser = (LoginService.getRole() == 'pracownik');
	 
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
        $scope.dataLoaded = false;
        $scope.errorMessage = "";
        $scope.problemsListData = [];
        var endPointName = ($scope.isUser) ? 'problems/own' : 'problems';
        var queryString = sessionStorage.problemQueryString;
        var problemQueryString = "";
        if (queryString !== undefined){
            problemQueryString += queryString;
        };

        $http({
          method: 'GET',
          url: apiUrl + endPointName +"?query=" + problemQueryString + "page=" + pageNumber + ",pageSize=" + localStorage.pageSize
        })
        .then(function (serverResponse) {
            $scope.problemsListData = serverResponse.data.response;
            $scope.totalElements = serverResponse.data.totalElements;
            $scope.pages = getPagesArray(serverResponse.data.totalPages);
            $scope.currentPage = pageNumber;
            $scope.dataLoaded = true;
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

    $scope.applyFilters = function(){
        var problemQueryString = "";

        // filtry są dodawanie do query stringa - tylko te pola, w których użytkownik wybrał wartość
        if ($scope.filtersSelectedValues.idAuthor != "-1"){
            problemQueryString += "idAuthor%3D" + $scope.filtersSelectedValues.idAuthor + ",";
        }
        if ($scope.filtersSelectedValues.idLaboratory != "-1"){
            problemQueryString += "idLaboratory%3D" + $scope.filtersSelectedValues.idLaboratory + ",";
        }
        if ($scope.filtersSelectedValues.idComputer != "-1"){
            problemQueryString += "idComputer%3D" + $scope.filtersSelectedValues.idComputer + ",";
        }
        if ($scope.filtersSelectedValues.hideResolved){
            problemQueryString += "isResolved%3Dfalse,";
        }

        sessionStorage.problemQueryString = problemQueryString; // zapis do session storage by móc odtworzyć filtry
        $scope.getList(0); // pobranie rekordów po zmianach
    }

    $scope.restoreFilters = function(){
        var problemQueryString = sessionStorage.problemQueryString;
        $scope.filtersActive = false;

        $scope.filtersSelectedValues = { // domyślne wartości filtrowania
            idAuthor: "-1",
            idLaboratory: "-1",
            idComputer: "-1",
            hideResolved: false
        };

        if (problemQueryString !== undefined){
            $scope.filtersActive = true;
            $scope.filtersSelectedValues = Object.assign({}, $scope.filtersSelectedValues, queryStringToJSON(problemQueryString));
                // konkatenacja wartości domyślnych oraz wartości występujących w query stringu zapisanym w session storage

            if ($scope.filtersSelectedValues.isResolved != null){
                $scope.filtersSelectedValues.hideResolved = !$scope.filtersSelectedValues.isResolved;
            }
        }

    }
    
    $scope.resetFilters = function(){ // czyszczenie bieżących filtrów
        sessionStorage.removeItem("problemQueryString"); // usuwanie bieżącej konfiguracji z pamięci w session storage
        $scope.filtersActive = false;
        $scope.restoreFilters(); // przywracanie (pustej) konfiguracji
        $scope.getList(0);
    }

    $scope.openRemoveProblemWindow = function(entityId = $scope.problemid){
        var options = ModalService.getModalOptions(entityId);
        options.templateUrl = 'app/shared/Modal/deleteEntity.html';
        options.controller = 'ProblemManagerCtrl';

        var modalInstance = $modal.open(options);
    }

    $scope.loadFiltersValues = function(){ // Ładowanie list encji - możliwe do wyboru z list select
        if ($scope.isUser) // filtry nie są widoczne dla zwykłych użytkowników - nie ma potrzeby ładowania list 
            return;

        $scope.filtersAvailableValues = {};

        UserService.getDataListEntity(function(dataJSON){
            $scope.filtersAvailableValues.authorsList = dataJSON;
        });

        LaboratoryService.getDataListEntity(function(dataJSON){
            $scope.filtersAvailableValues.laboratoriesList = dataJSON;
        });

        $scope.loadComputersList();
    }


    $scope.loadComputersList = function(){
        if ($scope.filtersSelectedValues.idLaboratory == "-1"){ // Brak określonego laboratorium, pobieramy wszystkie komputery
            ComputerService.getDataListEntity(function(dataJSON){
                $scope.filtersAvailableValues.computersList = dataJSON;
            });
        }
        else{ // pobieramy tlyko komputery z określonego laboratorium
            $scope.filtersAvailableValues.computersList = ""; // czyszczenie listy 
            ComputerService.getComputersFromLab(
                $scope.filtersSelectedValues.idLaboratory, 
                function(dataJSON){ // powodzenie - ładowanie listy komputerów
                    $scope.filtersAvailableValues.computersList = dataJSON; 
                }
            );
        }
    }

});