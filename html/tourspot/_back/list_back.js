/*
※ 파라미터의 조합에 따라 아래와 같이 표현이 가능합니다.
- 지역별 관광정보 : 지역정보(필수) > 타입정보(선택) > 분류정보(선택) > 관광정보 목록
- 타입별 관광정보 : 타입정보(필수) > 지역정보(선택) > 분류정보(선택) > 관광정보 목록
- 분류별 관광정보 : 타입정보(필수) > 분류정보(선택) > 지역정보(선택) > 관광정보 목록
- 통합(키워드) 검색 : 지역정보(선택) > 타입정보(선택) > 분류정보(선택) > 검색된 정보 목록
- 내주변 관광정보 : 타입정보(선택) > 관광정보 목록
- 날짜별 행사축제 : 지역정보(선택) > 행사공연축제 목록
- 베니키아, 한옥, 굿스테이 숙박 검색 : 지역정보(선택) > 각 숙박 정보 목록
*/

//http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode?ServiceKey=ServiceKey&numOfRows=10&pageNo=1&MobileOS=AND&MobileApp=appName


var baseURL = "http://api.visitkorea.or.kr/openapi/service/rest/KorService";
//지역코드조회
var areaCode = "areaCode";
//서비스 분류코드 조회
var categoryCode = "categoryCode";
//지역기반 관광정보 조회
var areaBasedList = "areaBasedList";
//위치기반 관광정보 조회
var locationBasedList = "locationBasedList";
//키워드 검색 조회
var searchKeyword ="searchKeyword";
//행사정보 조회
var searchFestival ="searchFestival";
//숙박정보 조회
var searchStay ="searchStay";
//공통정보 조회(상세정보1)
var detailCommon = "detailCommon";
//소개정보 조회(상세정보2)
var detailIntro = "detailIntro";
//반복정보 조회(상세정보3)
var detailInfo = "detailInfo";
//이미지정보 조회(상세정보4)
var detailImage = "detailImage";


var serviceKey = "5fTAWN079L8Yfhs%2F9YQ7zBKyOO6%2BKpeQJ15u5GiLJY4AN%2Bx96uwIQHWmIyyxcQwhOxdfQw8s23QzN%2B22icuKbw%3D%3D";
// var API_KEY = "Q6MEbeyAP7scqDnkIJT2gUlUj0Fka7fy4xYnWeqOrIr1ri%2B6fiL5HinpEnMyRGym%2Bk5fBDt9YzClTIpQeqaWXA%3D%3D";
var SEARCH_AREA_URL = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode?ServiceKey=";
var REST_PARAMS = "&MobileOS=ETC&MobileApp=AppTesting";
var JSON_TYPE = "&_type=json";
var AREA_BASE_URL = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey="
var EVENT_DETAIL_URL = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey="




/*
public static final String baseURL = "http://openapi.q-net.or.kr";

public static final String suportURL = "/api/service/rest/InquiryTestInformationNTQSVC/";

public static final String servicekey = "XgEUt3mfkuKJFIgseJbCwzCzYpYXX0Zvpf0GsVffrhMFyez0tFfeJiaPWAbL2UxLnh7fagSw%2FjNeRQJcvG9T7w%3D%3D&_type=json";

//기술사 시험
public static final String PEListURL = "getPEList?serviceKey=";

//기능사 시험
public static final String CListURL = "getCList?serviceKey=";

//기능장 시험
public static final String MCListURL = "getMCList?serviceKey=";

//기사, 산업기사 시험
public static final String EListURL = "getEList?serviceKey=";

//종목별 수수료
public static final String FeeListURL = "getFeeList?serviceKey=";

//종목별 시험 일정
public static final String JMListURL = "getJMList?serviceKey=";

*/



// // 템플릿 엔진이 사용할 템플릿 데이터 가져오기
// var trTemplateSrc = $("#tr-template").html();

// // 위에서 준비한 템플릿 데이터를 가지고 HTML을 생성할 템플릿 엔진 준비
// var templateFn = Handlebars.compile(trTemplateSrc);

// $.getJSON(serverRoot + "/json/tour/list", (data) => {
//     //tableBody.innerHTML = templateFn({list:data});
// 	$(tableBody).html(templateFn({list:data}))
// });




var serviceKey = "5fTAWN079L8Yfhs%2F9YQ7zBKyOO6%2BKpeQJ15u5GiLJY4AN%2Bx96uwIQHWmIyyxcQwhOxdfQw8s23QzN%2B22icuKbw%3D%3D";



$(function () {
    $.getJSON("http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=" + serviceKey + "&contentTypeId=12&areaCode=39&sigunguCode=&cat1=&cat2=&cat3=&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=P&numOfRows=6&pageNo=1&_type=json", function (areaCode) {
        // json 객체 내부 접근하기

        var items = areaCode.response.body.items.item;

        var temp2 = $('#codeTemp').html();
        var template = Handlebars.compile(temp2);

        var html = template(items);
        console.log(html);

        $('#result').html(html);

    });
});





// $('#clear').on('click', function() {
//     $('#result').html("");
// });