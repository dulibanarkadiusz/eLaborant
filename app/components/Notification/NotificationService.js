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
    function createNotifyContent(title, text){
        return '<p class="title">'+title+'</p><p>' + text + '</p>';
    }


    return {
        errorFromResponse: function (text, response){
            console.log(response);

            var errorsMessage = "";
            if (response.data.errors !== undefined){
                response.data.errors.forEach(function(err){
                    errorsMessage += err.message + "\n";
                });
            }
            else if (response.data.message !== undefined){
                errorsMessage += response.data.message;
            }

            showNotification(createNotifyContent(text, errorsMessage), 'danger');
        },
        errorNotification: function (text){
            showNotification(createNotifyContent("Wystąpił błąd", text), 'danger');
        },

        successNotification: function (text) {
            showNotification(createNotifyContent("Operacja wykonana poprawnie", text), 'success');
        },

        info: function(text) {
            showNotification(createNotifyContent("Informacja", text));
        }
    };
});