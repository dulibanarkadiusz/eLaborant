var apiUrl = "http://157.158.16.186:8082/api/";
var defaultPageSize = "10";
var dateFormat = "YYYY-MM-DD HH:mm";

var messageType = {
        Info: 0,
        Warning : 1,
        Error: 2
};

function ParseResponseErrorMessages(response){
    var errorsMessage = "";

    if (response.status == -1){
        errorsMessage += "Problem z wysłaniem żądania do serwera API. Proszę sprawdzić połączenie internetowe."
    }
    else if (response.data != null){
        if (response.data.errors != undefined){
            response.data.errors.forEach(function(err){
                errorsMessage += err.message + "\n";
            });
        }
        else if (response.data.message !== undefined){
            errorsMessage += response.data.message + "\n";
        }
        else{
            errorsMessage += "Problem z odebraniem danych z serwera"
        }
    }
    else{
        errorsMessage += "Kod błędu: " + response.status;
    }

    return errorsMessage.trim();
}

function GetTypeOfResponse(response){
    if (response.status !== undefined){
        switch (response.status){
            case 403:
            case 404:
                return messageType.Warning;
        }
    }

    return messageType.Error;
}

function ShowLoadDataError(message, messtype = messageType.Error){
    var alertType = "info"; 
    var alertTitle = ""; 
    var alertContent = "";

    switch (messtype){
        case messageType.Warning:
            alertType = "warning";
            alertTitle = "Brak danych do wyświetlenia.";
            alertContent = message;
            break;
        case messageType.Error:
            alertType = "danger";
            alertTitle = "Wystąpił błąd!";
            alertContent = "Dane nie mogły zostać załadowane: " + message;
            break;
    }

    return '<div class="alert alert-'+alertType+'"><h4><strong>'+alertTitle+'</strong></h4> '+alertContent+'</div>';
}

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

$(document).on('click', '.no-collapsable', function(e){
    e.stopPropagation();
});


$("body").on('click', 'div[data-notify="container"]', function(e){
    $(this).remove();
})

function queryStringToJSON(queryString) { // Query string przekształcany jest do obiektu
    queryString = queryString.replace("idState>1,idState<5", "hideClosedTask%3Dtrue");
    queryString = queryString.replace("%3E", "%3D"); // priority in query string uses a 'greater than' opearator so it must be replaced with '='
    var pairs = queryString.split(',');
    var result = {};

    pairs.forEach(function(pair) {
        pair = pair.split('%3D');

        var value = decodeURIComponent(pair[1] || '')
        var keyName = pair[0];
        result[keyName] = (value == "true" || value == "false") ? (value=="true") : value;
    });
  
    return result;
}