angular.module('elaborantMainPageCtrl', []).controller('MainPageCtrl', function ($scope, $state, LoginService) {
    //$state.go("Login");
    if (!LoginService.isLogged()) {

        $state.go("Login");
    }
    else {

        switch (LoginService.getRole()) {
            case 'admin':
                $state.go("Problemy");
                break;
			case 'opiekun':
				$state.go("Problemy");
                break;
			case 'laborant':
				$state.go("Zadania");
                break;	
			case 'pracownik':
				$state.go("UserPanel");
                break;	
            default:
                $state.go("PanelHome");
                break;

        }
    }

});