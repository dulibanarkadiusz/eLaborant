angular.module('elaborantNotificationService', []).factory('NotificationService', function () {
    return {
        successNotification: function (text) {
            $.notify({
                // options
                message: text
            }, {
                element: 'body',                
                placement: {
                    from: "top",
                    align: "center"
                },
                offset: 100,
                spacing: 10,
                delay: 5000,
                timer: 1000,
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },

            });
        }
    };
});