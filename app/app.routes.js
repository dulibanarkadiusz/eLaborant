var elaborantApp = angular.module('elaborantRouter', ["ui.router"]);

elaborantApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('Problemy', {
            url: '/Problemy',
            parent: "Panel",
            templateUrl: 'app/components/Problem/ProblemsList.html'
        })
        .state('Problem', {
            url: "/Problem/:id?",
            parent: "Panel",
            templateUrl: "app/components/Problem/Problem.html"
        })
        .state('Zadania', {
            url: "/Zadania",
            parent: "Panel",
            templateUrl: "app/components/Task/TasksList.html"
        })
        .state('Laboratoria', {
            url: "/Laboratoria",
            parent: "Panel",
            templateUrl: "app/components/Laboratory/LaboratoryList.html"
        })
        .state('Laboratorium', {
            url: "/Laboratorium/:id?",
            parent: "Panel",
            templateUrl: "app/components/Laboratory/Laboratory.html"
        })
        .state('Komputery', {
            url: "/Komputery",
            parent: "Panel",
            templateUrl: "app/components/Computer/ComputersList.html"
        })
        .state('Komputer', {
            url: "/Komputer/:id?",
            parent: "Panel",
            templateUrl: "app/components/Computer/Computer.html"
        })
        .state('Uzytkownicy', {
            url: "/Uzytkownicy",
            parent: "Panel",
            templateUrl: "app/components/User/UsersList.html"
        })
        .state('Login', {
            url: '/Login',
            templateUrl: 'app/components/Login/Login.html'
        })
    	.state('Panel', {
    		url: '/Panel',
    		templateUrl: 'app/shared/AdminPanel/AdminPanel.html'
    	})
		.state('PanelHome', {
    		url: '/Home',
			parent: "Panel",
    		templateUrl: 'app/components/Home/Home.html'
    	})
		.state('UserPanel', {
		    url: '/UserPanel',
			parent: "Panel",
			templateUrl: "app/components/Problem/Problem.html"
		})
		 .state('Main', {
		     url: '/',
		     controller: 'MainPageCtrl'
		 });

    $locationProvider.html5Mode(true);
});

elaborantApp.run(function($rootScope, $state) {
    $rootScope.$state = $state;
});

elaborantApp.run([
        '$rootScope', '$modalStack',
        function ($rootScope, $modalStack) {
            $rootScope.$on('$locationChangeStart', function (event) { // on locations changes
                $.notifyClose(); // close all notifications
                $("div[data-notify='container']").remove();

                var top = $modalStack.getTop();
                if (top) {
                    if( confirm("Czy chcesz wrócić na poprzednią stronę?\nNiezapisane zmiany zostaną utracone.") ){
                        $modalStack.dismiss(top.key);
                    } else {
                        event.preventDefault();
                    }
                }
            });
        }
    ]);
elaborantApp.run([
        '$rootScope', '$location', 'LoginService',
        function ($rootScope, $location, LoginService) {
            $rootScope.$on('$stateChangeStart', function (event) {
                if (!LoginService.isLogged()) {
                    $location.path('/');
                }
            });
        }

])