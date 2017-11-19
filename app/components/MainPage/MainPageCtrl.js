angular.module('elaborantMainPageCtrl', []).controller('MainPageCtrl', function ($scope, $state, LoginService) {
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