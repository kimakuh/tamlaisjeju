    var trTemplateSrc = $("#tr-template").html();

        var templateFn = Handlebars.compile(trTemplateSrc);


        $.getJSON(serverRoot+"/json/TravelLogContent/list", (data) => {
            $(tlile).html(templateFn({list:data}))
        }); 