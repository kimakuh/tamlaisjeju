    var trTemplateSrc = $("#tr-template").html();

        var templateFn = Handlebars.compile(trTemplateSrc);


        $.getJSON(serverRoot+"/json/TravelLogContent/list", (data) => {
            $(tlile).html(templateFn({list:data}))
        }); 

        // var trTemplateSrc = $("#tr-template").html();

        // var templateFn = Handlebars.compile(trTemplateSrc);


        // $.getJSON(serverRoot+"/json/TravelLogContent/list", (data) => {
            
        //     let scheduleOfDay = [];

        //     for(let idx=0; idx < data.length; idx++) {
        //         scheduleOfDay[idx] = [];
                
        //         for(let schedule of data) {
        //             if( (idx+1) == schedule.day )
        //                 scheduleOfDay[idx].push(schedule);
        //         }

        //         console.log(scheduleOfDay[idx]);
        //         $(tlile).html(templateFn({list: scheduleOfDay[idx]}))
        //     }
        // }); 