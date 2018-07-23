function realTimeWeather() {
    
    var today = new Date();
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
 
    $('.weather-date').html(month +"월 " + day + "일 " + week[today.getDay()]+"요일");
 
    /*
     * 기상청 30분마다 발표
     * 30분보다 작으면, 한시간 전 hours 값
     */
    if(minutes < 30){
        hours = hours - 2;
        if(hours < 0){
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            day = today.getDate();
            month = today.getMonth()+1;
            year = today.getFullYear();
            hours = 23;
        }
    }
    
    /* example
     * 9시 -> 09시 변경 필요
     */
    
    if(hours < 10) {
        hours = '0'+hours;
    }
    if(month < 10) {
        month = '0' + month;
    }    
    if(day < 10) {
        day = '0' + day;
    } 
 
    today = year+""+month+""+day;
    
    /* 좌표 */
    var _nx = 48, 
    _ny = 36,
    apikey = "j2KT0WiQsYIQ1daSvlJI9F2%2Be0F0UW%2BacYymDWHHCX3BTq8ObPmb7WJSFxmIkLzxJDpIG%2BgjCRY1GqbWupOSlQ%3D%3D",    
    ForecastGribURL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib";
    ForecastGribURL += "?ServiceKey=" + apikey;
    ForecastGribURL += "&base_date=" + today;
    ForecastGribURL += "&base_time=" + "15" +"00";
    ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
    ForecastGribURL += "&pageNo=1&numOfRows=7";
    ForecastGribURL += "&_type=json";
    
    $.ajax({
        url: ForecastGribURL
        ,type: 'GET'
        ,cache: false
        ,success: function(data) {
            var myXML = rplLine(data.responseText);
            var indexS = myXML.indexOf('"body":{"items":{'),
            indexE = myXML.indexOf("}]}"),
            // result = myXML;
            result = myXML.substring(indexS, indexE);
            console.log(result);
        var jsonObj = $.parseJSON('[' + result + ']'),
            rainsnow = jsonObj[0].response.body.items.item[0].obsrValue,
            sky = jsonObj[0].response.body.items.item[4].obsrValue,
            temp = jsonObj[0].response.body.items.item[5].obsrValue;
            var contentText = document.getElementById('content');
        contentText.innerHTML = "하늘 상태 : " + sky + " / 눈 비 상태 : " + rainsnow + " / 온도 : " + temp;
    },
    error:function(request,status,error){
        alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    }
    });

}
// xml2jsonCurrentWth

function rplLine(value){
if (value != null && value != "") {
    return value.replace(/\n/g, "\\n");
}else{
    return value;
}
}