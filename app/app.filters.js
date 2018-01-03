elaborantApp.filter('labelPriority', function(){
        return function(text){
            switch(text){
                case 1: return "label-info"; 
                case 2: return "label-primary";
                case 3: return "label-default";
                case 4: return "label-warning";
                default: return "label-danger"; 
            }
        };
    });

elaborantApp.filter('priortyDescription', function(){
    return function(text){
        switch(text){
            case 1: return "Najniższy"; 
            case 2: return "Niski";
            case 3: return "Normalny";
            case 4: return "Wysoki";
            default: return "Najwyższy";
        }
    };
});

elaborantApp.filter('coloredDate', function(){
    return function(timestamp){
        var now = new Date();
        var receivedDate = new Date(timestamp);
        var threeDaysLater = new Date(timestamp);
        threeDaysLater.setDate(receivedDate.getDate() - 3);

        if (receivedDate < now ){
            return "text-danger important";
        }
        else if (threeDaysLater < now){
            return "text-warning important";
        }
        else{
            return "";
        }
    }
});

elaborantApp.filter('buildingFullname', function(){
    return function(text){
        switch(text){
            case 'MS': return "Wydział Matematyki Stosowanej"; 
            case 'LB': return "Laboratorium Budownictwa";
            default: return '(brak)';
        }
    };
});

elaborantApp.filter('executorsIntToString', function(){
    return function(text){
        switch (text){
            case 1: return "1 laborant";
            default: return text + " laborantów";
        }
    };
});

elaborantApp.filter('range', function() {
    return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});