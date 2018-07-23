<?php

/*

참고링크

http://www.kma.go.kr/weather/lifenindustry/sevice_rss.jsp?sido=3000000000&gugun=3017000000&dong=3017063000&x=21&y=5

우리 동네 예보값 검색 한후 xml 주소 붙여넣기

*/

  $url = "http://www.kma.go.kr/wid/queryDFS.jsp?gridx=52&gridy=38";
  $result = simplexml_load_file($url);
  $list = array();
  
  $location= iconv("UTF-8","euc-kr",$result->header->title); //예보지역
  $results = $result->body;
  $bl_data='';
  foreach($results->data as $item)
  {
   if(!$bl_data) {
    $temp=$item->temp; //현재온도
    $sky=iconv("UTF-8","euc-kr",$item->wfKor); //날씨상태(맑음,구름조금,구름많음,흐림,비,눈/비,눈)
    $bl_data=true;
   }
  }
?>

