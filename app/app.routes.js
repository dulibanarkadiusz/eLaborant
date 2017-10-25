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
    		templateUrl: 'admin-panel.html'
    	})
		.state('UserPanel', {
    		url: '/UserPanel',
    		templateUrl: 'user-panel.html'
    	})
		 .state('Main', {
            url: '/',
			 controller: function ( $state, LoginService) {
                if(!LoginService.isLogged()){
					$state.go("Login");
				}
				else{
					alert(LoginService.getRole());
						switch(LoginService.getRole()){
							case 'admin':
							$state.go("Panel");
							break;
							default:
							$state.go("UserPanel");
							break;
							
						}
						
						
					}
					
					
				}
					
				
			 }
            )
        
    $locationProvider.html5Mode(true);
});