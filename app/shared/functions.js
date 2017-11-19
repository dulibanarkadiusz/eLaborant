var messageType = {
        Info: 0,
        Warning : 1,
        Error: 2
};

function ParseResponseErrorMessages(response){
    var errorsMessage = "";
    if (response.data.errors !== undefined){
        response.data.errors.forEach(function(err){
            errorsMessage += err.message + "\n";
        });
    }
    else if (response.data.message !== undefined){
        errorsMessage += response.data.message + "\n";
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