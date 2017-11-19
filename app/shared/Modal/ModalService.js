angular.module('elaborantModalService', []).factory('ModalService', function ($http) {
    return {
    	getModalOptions: function (entityId = undefined) {
            return  {
                backdrop: 'static',     // prevent close modal on background click
                keyboard: false,        // prevent close modal on ESC 
                resolve: {
                    param: function(){
                        return {'id':entityId}
                    }
                }
            };
        }
    };
});