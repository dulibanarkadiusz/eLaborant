angular.module('elaborantNotificationService', []).factory('NotificationService', function () {
    function showNotification (text, notifyType){
        $.notify({
            // options
            message: text
        }, {
            element: 'body',                
            placement: {
                from: "top",
                align: "right"
            },
            type: (notifyType === undefined) ? 'info' : notifyType,
            offset: 30,
            spacing: 10,
            delay: 5000,
            timer: 1000,
            z_index: 2000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },

        });
    }

    return {
        errorNotification: function (text){
            text = '<p class="title">Wystąpił błąd</p><p>' + text + '</p>';
            showNotification(text, 'danger');
        },

        successNotification: function (text) {
            showNotification(text, 'success');
        }
    };
});