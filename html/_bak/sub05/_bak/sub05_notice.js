var trTemplateSrc = $("#tr-template").html();

    var templateFn = Handlebars.compile(trTemplateSrc);


    $.getJSON(serverRoot+"/json/board/list", (data) => {
        $(tableBody).html(templateFn({list:data}))
    }); 
    
