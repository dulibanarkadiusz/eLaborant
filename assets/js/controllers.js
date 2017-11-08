    var functionRefresh; 
    var defaultPageSize = 10;
    var messageType = {
            Info: 0,
            Warning : 1,
            Error: 2
    };

    function getPagesArray(pagesCount){
        var array = [];
        for (var i=0; i<pagesCount; i++){
            array.push(i);
        }

        return array;
    }

    function roundMinutes(date){
        date.setSeconds(0);
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);

        return date;
    }

    elaborantApp.controller('assistantList', function ($scope, $http){
        $scope.dataLoaded = false;
        $http.get('api/laboranci.html').success(function (response) {
            $scope.assistantsData = response;
            $scope.assistantsDataLoaded = true;
        });
    });

    elaborantApp.controller('nav', function($scope, $state){
      
		
		$scope.active = $state.current.name;
		$scope.showProblems = true;
		$scope.showTasks = true;
		$scope.showUsers = true;
		$scope.showLaboratories = true;
		$scope.showComputers = true;			
        
    });

    elaborantApp.filter('labelPriority', function(){
        return function(text){
            switch(text){
                case 1: return "label-info"; 
                case 2: return "label-primary";
                case 3: return "label-default";
                case 4: return "label-warning";
                default: return "label-danger"; 
            }
        };
    });

    elaborantApp.filter('priortyDescription', function(){
        return function(text){
            switch(text){
                case 1: return "Najniższy"; 
                case 2: return "Niski";
                case 3: return "Normalny";
                case 4: return "Wysoki";
                default: return "Najwyższy";
            }
        };
    });

    elaborantApp.filter('buildingFullname', function(){
        return function(text){
            switch(text){
                case 'MS': return "Wydział Matematyki Stosowanej"; 
                case 'LB': return "Laboratorium Budownictwa";
                default: return '(brak)';
            }
        };
    });

    elaborantApp.filter('executorsIntToString', function(){
        return function(text){
            switch (text){
                case 1: return "1 laborant";
                default: return text + " laborantów";
            }
        };
    });

    elaborantApp.filter('range', function() {
        return function(input, total) {
        total = parseInt(total);

        for (var i=0; i<total; i++) {
          input.push(i);
        }

        return input;
      };
    });

    elaborantApp.directive('bsTooltip', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                $(element).hover(function(){
                    // on mouseenter
                    $(element).tooltip('show');
                }, function(){
                    // on mouseleave
                    $(element).tooltip('hide');
                });
            }
        };
    });


    /*
    elaborantApp.controller('addTaskFormController', function($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param){
        $scope.problemid = $stateParams.id;
        $scope.task = {};
        $scope.task.id = param.id;
        $scope.minDate = new Date();

        var datetimepicker = $('#datetimepicker4');
        datetimepicker.on('blur', function(e){
            var value = datetimepicker.val(); 
            datetimepicker.trigger('change');
            $scope.task.dateRealization = new Date(value);
        });
   
        datetimepicker.datetimepicker({
            locale: 'pl',
            sideBySide: true,
            format: 'YYYY-MM-DDTHH:mm'
        });
        
        if ($scope.task.id){ // get details for existing, edited task
            $http.get(apiUrl + 'tasks/' + $scope.task.id) 
            .success(function (serverResponse) {
                var response = serverResponse.response;
                response.dateRealization = new Date(response.dateRealization);
                response.priority = String(response.priority);

                $scope.task = response;
            })
            .error(function(data, status){
                alert("Błąd przy pobieraniu")
            });
        }

        $scope.options = [];
        $http.get(apiUrl + 'users') // TODO - zamienić na laborantów 
            .success(function (serverResponse) {
                var response = serverResponse.response;
                $scope.assistantsDataLoaded = true;

                for(var i=0; i < response.length; i++){
                    $scope.options.push({
                        "id": response[i].id,
                        "name": response[i].firstname + " " + response[i].surname
                    });
                }
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });

        
        $http.get(apiUrl + 'states')
            .success(function (serverResponse) {
                $scope.statesData = serverResponse.response;
                $scope.statesDataLoaded = true;
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });

        $scope.task.priority = "3";
        $scope.task.idState = "2";
        $scope.task.dateRealization = new Date(moment(roundMinutes(new Date())).format('YYYY-MM-DD HH:mm'));
        $scope.task.userExecuteTasksById = {};

        $scope.save =  function(){
            var dataAddTask = jQuery.extend({}, $scope.task);
            dataAddTask.dateRealization = new Date(dataAddTask.dateRealization).getTime();
            dataAddTask.priority = parseInt($scope.task.priority);
            dataAddTask.idState = parseInt($scope.task.idState);
            dataAddTask.idProblem = parseInt($scope.problemid);

            $http({
              method: 'POST',
              url: apiUrl + "tasks/",
              data: JSON.parse(JSON.stringify(dataAddTask))
            })
            .success(function (success) {
                $rootScope.$emit("RefreshTaskList", {});
                $scope.cancel();
                $scope.task = {};
                $scope.task.priority = 3;
                $scope.task.idState = 2;
                $scope.task.userExecuteTasksById = [];
            })
            .error(function (response) {
                $scope.IsResponseError = true;
                $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });*/

    function ParseResponseErrorMessages(JSONresponse){
        if (typeof JSONresponse.status != 'undefined')
            return JSONresponse.error + " (" + JSONresponse.status + ")";

        var responseString = "";
        for (var i=0; i < JSONresponse.errors.length; i++ ){
            responseString += JSONresponse.errors[i].message + "\n";
        }
        return responseString.trim();
    }



    elaborantApp.controller('addProblemByUserFormController', function($scope, $http, $sce, $filter, $stateParams ){
        $scope.problem = {};
		$scope.showErrors = false;
        $scope.labList = function() {
            $http.get(apiUrl + 'laboratories')
            .success(function (serverResponse) {
                $scope.labListData = serverResponse.response;
                $scope.labDataLoaded = true;
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });
        };
        $scope.labList();


        $scope.computersList = function() {
            $http.get(apiUrl + 'computers?query=idLaboratory%3D'+ $scope.problem.idLaboratory)
            .success(function (serverResponse) {
                $scope.computersListData = serverResponse.response;
                $scope.computersDataLoaded = true;
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.computersListData = {};
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });
        };

        $scope.save = function(){
            $scope.data = {};
            $scope.data.content = $scope.problem.content;
            $scope.data.idAuthor = 8;
            if ($scope.problem.source == 'computer'){
                $scope.data.idComputer = parseInt($scope.problem.idComputer);
            }
            else{
                $scope.data.idLaboratory = parseInt($scope.problem.idLaboratory);
            }

            console.log($scope.data);
            $http({
              method: 'POST',
              url: apiUrl + "problems/",
              data: JSON.parse(JSON.stringify($scope.data))
            })
            .success(function (success) {
                           
                $scope.problem = {};
				
            })
            .error(function (response) {
                $scope.IsResponseError = true;
                $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
				
            });

        };

        $scope.cancel = function () {
            //$modalInstance.dismiss('cancel');
        };
    });
	
	

    var test;
    elaborantApp.controller('addComputerFormController', function($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance){
        $scope.computer = {};

        $scope.labList = function() {
            $http.get(apiUrl + 'laboratories')
            .success(function (serverResponse) {
                $scope.labListData = serverResponse.response;
                $scope.dataLoaded = true;
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });
        };
        $scope.labList();


        $scope.save = function(){
            var dataAddTask = jQuery.extend({}, $scope.task);
            $http({
              method: 'POST',
              url: apiUrl + "computers/",
              data: JSON.parse(JSON.stringify($scope.computer))
            })
            .success(function (success) {
                $rootScope.$emit("RefreshList", {});
                $scope.cancel();
                $scope.computer = {};
            })
            .error(function (response) {
                $scope.IsResponseError = true;
                $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };       
    });

    elaborantApp.controller('addUserFormController', function formController($scope, $http){


        $scope.processForm = function() {

        }
    });
    elaborantApp.controller('CurrentUserController', function ($scope, $location, LoginService) {
        $scope.user = LoginService.getFirstName() + " " + LoginService.getSurname();
        $scope.logOut = function () {
            LoginService.logOut();
            $location.path('/');
        }
    });
	
    elaborantApp.controller('MainPageController', function ($scope, $state, LoginService) {
        //$state.go("Login");
        if (!LoginService.isLogged()) {

            $state.go("Login");
        }
        else {

            switch (LoginService.getRole()) {
                case 'admin':
                    $state.go("PanelHome");
                    break;
                default:
                    $state.go("UserPanel");
                    break;

            }
        }

    });
	

    $(document).on('click', '.no-collapsable', function(e){
        e.stopPropagation();
    });
