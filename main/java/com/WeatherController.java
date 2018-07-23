package com;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/weather")
public class WeatherController {
    
    @RequestMapping("info")
    public Object weather(int nx, int ny) {
        System.out.println("123");
        BufferedReader br = null;
        
        //현재 날짜 받아오기
        SimpleDateFormat day = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
        SimpleDateFormat hr = new SimpleDateFormat("HH", Locale.KOREA);
        SimpleDateFormat min = new SimpleDateFormat("mm", Locale.KOREA);
        Calendar c1 = Calendar.getInstance();
        int today = Integer.parseInt(day.format(c1.getTime()));
        int hours = Integer.parseInt(hr.format(c1.getTime()));
        int minutes = Integer.parseInt(min.format(c1.getTime()));
 
        HashMap<String, Object> map = new HashMap<>();
        // 기상청 데이터 업데이트 시간 + kkmm 형식으로 변경
        if(minutes < 40) {
            hours = hours -1;
            if(hours < 0) {
                today = today -1;
                hours = 23;
            }
        }
        String base_time = String.valueOf(hours) + String.valueOf(minutes);
        
        try {
            String urlstr = "http://newsky2.kma.go.kr/"
                    + "service/SecndSrtpdFrcstInfoService2/ForecastGrib"
                    + "?ServiceKey=j2KT0WiQsYIQ1daSvlJI9F2%2Be0F0UW%2BacYymDWHHCX3BTq8ObPmb7WJSFxmIkLzxJDpIG%2BgjCRY1GqbWupOSlQ%3D%3D"
                    + "&base_date="
                    + today
                    + "&base_time="
                    + base_time
                    + "&nx=" + nx
                    + "&ny=" + ny
                    + "&numOfRows=10"
                    + "&pageNo=1"
                    + "&_type=json";
            URL url = new URL(urlstr);
            HttpURLConnection urlconnection = (HttpURLConnection) url.openConnection();
            urlconnection.setRequestMethod("GET");
            br = new BufferedReader(new InputStreamReader(urlconnection.getInputStream(), "UTF-8"));
            
            String result = "";
            String line;
            while((line = br.readLine()) != null) {
                result = result + line + "\n";
            }
            System.out.println(result);
            
            JSONParser parser = new JSONParser();
            JSONObject obj = (JSONObject) parser.parse(result);
            
            // Top레벨 단계인 response 키를 가지고 데이터를 파싱합니다.
            JSONObject parse_response = (JSONObject) obj.get("response");
            // response 로 부터 body 찾아옵니다.
            JSONObject parse_body = (JSONObject) parse_response.get("body");
            // body 로 부터 items 받아옵니다.
            JSONObject parse_items = (JSONObject) parse_body.get("items");
             
            // items로 부터 itemlist 를 받아오기 itemlist : 뒤에 [ 로 시작하므로 jsonarray이다
            JSONArray parse_item = (JSONArray) parse_items.get("item");
            
            JSONObject vec_item = (JSONObject)parse_item.get(7); // 풍향
            
            JSONObject temp_item = (JSONObject)parse_item.get(5); // 기온
            JSONObject wsd_item = (JSONObject)parse_item.get(9); // 풍속
            
            
            long vec = (Long) vec_item.get("obsrValue");
            System.out.println(vec);
            String vector;
            
            if(vec < 45) {
                vector = "북";
            } else if(44 < vec && vec < 135) {
                vector = "동";
            } else if(134 < vec && vec < 225) {
                vector = "남";
            } vector = "서";
            
            map.put("temp", temp_item.get("obsrValue").toString());
            map.put("vec", vector);
            map.put("wsd", wsd_item.get("obsrValue").toString());
                br.close();
            }catch(Exception e){
                System.out.println(e);
            }
        System.out.println(map);
        return map;
        }
     
    }
