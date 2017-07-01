    var functionRefresh; 
    var defaultPageSize = 10;
    elaborantApp.controller('usersList', function ($scope, $http) {
        $scope.dataLoaded = false;
        $scope.totalElements = 0;
        $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
        $scope.pages = [];

        $scope.loadData = function(pageNumber = 0) {
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

        $scope.loadData();
    });

    elaborantApp.controller('labList', function ($scope, $sce, $http) {
        $scope.dataLoaded = false;
        $scope.totalElements = 0;
        $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
        $scope.pages = [];

        $scope.loadData = function(pageNumber = 0) {
            $http.get(apiUrl + 'laboratories?query=page=' + pageNumber + ",pageSize=" + $scope.pageSize)
            .success(function (serverResponse) {
                $scope.labListData = serverResponse.response;
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

        $scope.loadData();
    });


    elaborantApp.controller('computersList', function ($scope, $http) {
        $scope.dataLoaded = false;
        $scope.totalElements = 0;
        $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
        $scope.pages = [];

        functionRefresh = $scope.loadData = function(pageNumber = 0) {
            $http.get(apiUrl + 'computers?query=page=' + pageNumber + ",pageSize=" + $scope.pageSize)
            .success(function (serverResponse) {
                $scope.computersListData = serverResponse.response;
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

        $scope.loadData();
    });

    elaborantApp.controller('taskList', function ($scope, $injector, $sce, amMoment, $http) {
        $scope.dataLoaded = false;
        $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
        $scope.pages = [];

        amMoment.changeLocale('pl');

        $scope.loadData = function(pageNumber) {
            if (pageNumber<0)
                return false;

            $http.get(apiUrl + 'tasks?query=page=' + pageNumber + ",pageSize=" + $scope.pageSize)
            .success(function (serverResponse) {
                $scope.taskListData = serverResponse.response;
                $scope.pages = getPagesArray(serverResponse.totalPages);
                $scope.dataLoaded = true;
                $scope.totalElements = serverResponse.totalElements;
                $scope.currentPage = pageNumber;
                localStorage.pageSize = $scope.pageSize;

                for (var i = 0; i < $scope.taskListData.length; i++ ){
                        var task = $scope.taskListData[i];
                        task.executorsString = "";
                        for (var j = 0; j < task.userExecuteTasksById.length; j++ ){
                            task.executorsString += task.userExecuteTasksById[j].firstname + " " + task.userExecuteTasksById[j].surname + "\n";
                        }
                    }
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });

            $('[data-toggle="tooltip"]').tooltip(); 
        };
        $scope.loadData(0);


    });

    function getPagesArray(pagesCount){
        var array = [];
        for (var i=0; i<pagesCount; i++){
            array.push(i);
        }

        return array;
    }

    elaborantApp.controller('assistantList', function ($scope, $http){
        $scope.dataLoaded = false;
        $http.get('api/laboranci.html').success(function (response) {
            $scope.assistantsData = response;
            $scope.assistantsDataLoaded = true;
        });

    });

    elaborantApp.controller('nav', function($scope, $state){
        $(function(){
            $scope.active = $state.current.name;
        });
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


    elaborantApp.controller('lastProblems', function ($scope, $injector, $sce, amMoment, $http) {
        $scope.dataLoaded = false;
        $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
        $scope.pages = [];

        amMoment.changeLocale('pl');

        $scope.loadData = function(pageNumber = 0) {
            //$http.get(apiUrl+'problems')
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

        $('#reload').on('click', function(){
            $scope.dataLoaded = false;
            $scope.loadData();
        })

        $scope.loadData();
    });

    elaborantApp.controller('problem', function($scope, $sce, amMoment, $stateParams, $http) {
        $scope.problemid = $stateParams.id;
        amMoment.changeLocale('pl');
        $scope.problemDataLoaded = false;
        $scope.tasksCount = 0;
        $scope.errorDataLoaded = '';

        functionRefresh = $scope.loadData = function() {
            $scope.message = "";
            $scope.pageSize = (localStorage.pageSize) ? parseInt(localStorage.pageSize) : defaultPageSize;
            $scope.pages = [];
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

            $scope.loadTasks = function(pageNumber = 0){
                $http.get(apiUrl + 'tasks/?query=idProblem%3D'+$scope.problemid+',page=' + pageNumber + ",pageSize=" + $scope.pageSize)
                .success(function (serverTaskResponse) {
                    $scope.taskData = serverTaskResponse.response;
                    $scope.tasksCount = serverTaskResponse.totalElements;
                    $scope.pages = getPagesArray(serverTaskResponse.totalPages);
                    $scope.currentPage = pageNumber;
                    localStorage.pageSize = $scope.pageSize;
                    
                    $scope.dataLoaded = true;
                    for (var i = 0; i < $scope.taskData.length; i++ ){
                        var task = $scope.taskData[i];
                        task.executorsString = "";
                        for (var j = 0; j < task.userExecuteTasksById.length; j++ ){
                            task.executorsString += task.userExecuteTasksById[j].firstname + " " + task.userExecuteTasksById[j].surname + "\n";
                        }
                    }
                })
                .error(function(error, status) {
                    switch(status){
                        case 404: 
                            $scope.message = "Brak zadań do wyświetlenia.";
                            break;
                    }
                });
            }

            $scope.loadTasks();

            $('[data-toggle="tooltip"]').tooltip(); 
        }

        $scope.loadData();
    }); 


    elaborantApp.controller('laboratory', function($scope, $sce, $stateParams, $http) {
        $scope.labid = $stateParams.id;
        $scope.labDataLoaded = false;
        $scope.computersCount = 0;
        $scope.errorDataLoaded = '';

        functionRefresh = $scope.loadData = function() {
            $scope.message = "";
            $http.get(apiUrl + 'laboratories/'+$scope.labid).success(function (serverResponse) {
                $scope.labData = new Array(serverResponse.response);
                $scope.labDataLoaded = true;
            })
            .error(function(error, status){
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

        $scope.loadData();
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


    elaborantApp.controller('addTaskFormController', function($rootScope, $scope, $http, $sce, $filter, $stateParams){
        $scope.problemid = $stateParams.id;
        $scope.task = {};
        $scope.idAuthor = 5;
        var datetimepicker = $('#datetimepicker4');
        $scope.minDate = new Date();

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
        
        /*
        $scope.options = [];
        $http.get('api/laboranci.html').success(function (response) {
            $scope.assistantsData = response;
            $scope.assistantsDataLoaded = true;

            for(var i=0; i < response.length; i++){
                $scope.options.push({
                    "id": parseInt(response[i].id),
                    "name": response[i].firstname + " " + response[i].surname
                });
            }
        });*/
        $scope.options = [];
        $http.get(apiUrl + 'users')
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
        $scope.task.status = "2";
        $scope.task.userExecuteTasksById = [];

        $('button[type=submit]').on('click', function(e){
            $scope.idAuthor = 5;
            var dataAddTask = jQuery.extend({}, $scope.task);
            dataAddTask.dateRealization = new Date(dataAddTask.dateRealization).getTime();
            dataAddTask.idAuthor = 5;
            dataAddTask.idProblem = parseInt($scope.problemid);
            
            // testowo 
            /*dataAddTask.userExecuteTasksById = [];
            var exs = $scope.task.userExecuteTasksById;
            if (exs != null ){
                for(var i=0; i < exs.length; i++){
                    dataAddTask.userExecuteTasksById.push(exs[i].id);
                }
            }*/
            //
            $('#addTask').modal('hide');
            functionRefresh();

            $http({
              method: 'POST',
              url: apiUrl + "tasks/",
              data: JSON.parse(JSON.stringify(dataAddTask))
            })
            .success(function (success) {
                functionRefresh();
                $('#addTask').modal('hide');
                $scope.task = {};
                $scope.task.priority = "3";
                $scope.task.status = "2";
                $scope.task.userExecuteTasksById = [];
            })
            .error(function (response) {
                $scope.IsResponseError = true;
                $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
            });

        });
        
    });

    function ParseResponseErrorMessages(JSONresponse){
        if (typeof JSONresponse.status != 'undefined')
            return JSONresponse.error + " (" + JSONresponse.status + ")";

        var responseString = "";
        for (var i=0; i < JSONresponse.errors.length; i++ ){
            responseString += JSONresponse.errors[i].message + "\n";
        }
        return responseString.trim();
    }

    elaborantApp.controller('addLabFormController', function($scope, $http, $sce, $filter, $stateParams){
        $scope.lab = {};
        $scope.lab.building = "MS";

        $scope.usersList = function() {
            $http.get(apiUrl + 'users')
            .success(function (serverResponse) {
                $scope.usersListData = serverResponse.response;
                $scope.dataLoaded = true;
            })
            .error(function(data, status){
                $scope.responseError = true;
                $scope.errorMessage = $sce.trustAsHtml(errorMessage);
            });
        };

        $scope.usersList();


        $('button[type=submit]').on('click', function(e){
            var dataAddTask = jQuery.extend({}, $scope.task);
            $http({
              method: 'POST',
              url: apiUrl + "laboratories/",
              data: JSON.parse(JSON.stringify($scope.lab))
            })
            .success(function (success) {
                functionRefresh();
                $('#addLab').modal('hide');
                $scope.lab = {};
                $scope.lab.building = "MS";
            })
            .error(function (response) {
                $scope.IsResponseError = true;
                $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
            });

        });
        
    });

    var test;
    elaborantApp.controller('addComputerFormController', function($scope, $http, $sce, $filter, $stateParams){
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


        $('button[type=submit]').on('click', function(e){
            var dataAddTask = jQuery.extend({}, $scope.task);
            $http({
              method: 'POST',
              url: apiUrl + "computers/",
              data: JSON.parse(JSON.stringify($scope.computer))
            })
            .success(function (success) {
                functionRefresh();
                $('#addComputer').modal('hide');
                $scope.computer = {};
            })
            .error(function (response) {
                $scope.IsResponseError = true;
                $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
            });

        });
        
    });

    elaborantApp.controller('addUserFormController', function formController($scope, $http){


        $scope.processForm = function() {

        }
    });

    $(document).on('click', '.no-collapsable', function(e){
        e.stopPropagation();
    });