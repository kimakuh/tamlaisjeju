


var contentid = $(location).attr('search').slice($(location).attr('search').indexOf('=') + 1);

// console.log(contentid);




var serviceKey = "5fTAWN079L8Yfhs%2F9YQ7zBKyOO6%2BKpeQJ15u5GiLJY4AN%2Bx96uwIQHWmIyyxcQwhOxdfQw8s23QzN%2B22icuKbw%3D%3D";

var url1="http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=";
var url2="http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailIntro?ServiceKey=";



// $(function () {
//     $.getJSON(url1 + serviceKey +
//         "&contentId=" + contentid +
//         "&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTesting&_type=json",
//         function (contentId) {

//             var items = contentId.response.body.items.item;
        
//             var temp2 = $('#codeTemp01').html();
//             var template = Handlebars.compile(temp2);
            
//             var html = template(items);
//             // console.log(items);
//             // console.log(html);
            
//             $('#result01').html(html);

//         });
// });

$(function () {
    $.getJSON(url2 + serviceKey +
        "&contentId=" + contentid +
        "&MobileOS=ETC&MobileApp=AppTesting&_type=json", 
        function (contentId) {

            var items = contentId.response.body.items.item;
        
            var temp2 = $('#codeTemp02').html();
            var template = Handlebars.compile(temp2);
            
            var html = template(items);
            // console.log(items);
            // console.log(html);
            
            $('#result02').html(html);

        });
});






