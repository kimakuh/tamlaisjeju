/**
 * 한글포함 문자열 길이를 구한다
 */
function getTextLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length == 6) {
            len++;
        }
        len++;
    }
    return len;
}

$(function(){
	
	
//검색해서 들어온 페이지에 해당하는 관광지를 ajax를 통해 찾는다.	
var mapx = "";
var mapy = "";
var pageNo;
var keyword = $("#cityName").text(); //검색어

/**
 * 페이지 처음 띄웟을 때 데이터 불러오기
 * */
$.ajax({
	
		url : "http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchKeyword?" +
				"ServiceKey=GE8ffyGcbc8LhTbkPBlErwmb2Q7JWxA2rhMEQ6iqXszlPFG%2BtFLSmkYyusYF%2FeguXxpATpP9ZiikFJ9%2BzgqGKA%3D%3D"
		,dataType:"json"
		,data : {
			
			"keyword":keyword.trim(),
			"MobileOS":"ETC",
			"MobileApp":"AppTesting",
			"pageNo":1,
			"arrange":"B",
			"_type":"json",
		}
		,success:function(data){
			//페이지 처리-------------------------------------------
			var totalCount = data.response.body.totalCount;
			
			$.ajax({	
			url : "http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchKeyword?" +
					"ServiceKey=GE8ffyGcbc8LhTbkPBlErwmb2Q7JWxA2rhMEQ6iqXszlPFG%2BtFLSmkYyusYF%2FeguXxpATpP9ZiikFJ9%2BzgqGKA%3D%3D"
				,dataType:"json"
				,data : {
					
					"keyword":keyword.trim(),
					"MobileOS":"ETC",
					"MobileApp":"AppTesting",
					"pageNo":1,
					"arrange":"B",
					"_type":"json",
					"numOfRows":totalCount
				}
				,success:function(data){
					
				//전체 리스트 넣기--------------------------------------------
					var item = data.response.body.items.item;
					
					//슬라이더 이미지----------------------------------
					for(var i=0; i<3; i++){			
					if(i==0){
						$(".carousel-inner").append('<div class="item active slider">'
								+'<img style="width:100%; height:100%" class="img-responsive" src="'+item[i].firstimage+'" alt="'+item[i].title+'">'
								+'</div>');
					}else{
						$(".carousel-inner").append('<div class="item slider">'
								+'<img style="width:100%; height:100%" class="img-responsive" src="'+item[i].firstimage+'" alt="'+item[i].title+'">'
								+'</div>');
					}
					
					}//end image for		
					
					//리스트 넣기-----------------------------------------------
					for(var i=0; i<item.length; i++){
						  var url = "/recommandtravelregion/find.tm?contentid="+item[i].contentid;   
						//이미지 널값 처리
						var firstimage = "/resource/tour/images/noimage.jpg";
			               if(item[i].firstimage != null){
			                  firstimage=item[i].firstimage;
			              
			               }
						
			             //타이틀 글자수 처리  ------------------------------    
			               var title = item[i].title;
			               var titleTag = '<a href="'+url+'" class="sTitle">'+item[i].title+'</a>';
			               if(getTextLength(title)>25){
			            	   
			            	   titleTag = '<a href="'+url+'" class="bTitle" alt="'+item[i].title+'">'+item[i].title.substring(0,20)+"..."+'</a>'
			            	   
			               }
			               
			            //주소처리
			            var addr = "주소가 없습니다.";
			            if(item[i].addr1 != null && item[i].addr2 !=null){
			            	addr=item[i].addr1+item[i].addr2;
			              
			               }
			               
			               //리스트에 붙이기
						$(".List").append('<div class="col-md-4 img-portfolio">'
								+'<a href="'+url+'">'
								+'<img class="img-responsive img-hover list-image" src="'+firstimage+'" alt="'+item[i].title+'" style="width:360px; height:240px;">'
								+' </a>'
								+' <h3>'
								+titleTag
								+'</h3>'
								+' <p>'+addr+'</p>'
								+'</div>'
						);
						
						mapx=item[0].mapx;
						mapy=item[0].mapy;
					}//end for
					
					
					//날씨 받아오기--------------------------------------------------------------------------------------
					
					//현재날씨 받아오는 ajax
					   $.ajax({
						  	
						   url :  "http://apis.skplanetx.com/weather/current/minutely"
						   ,data:{
							    "version" : "1",
							    "appKey" : "65e16fa9-7caa-3142-9757-66d0ae8dd0f0",
								"lat":mapy,
								"lon":mapx
						   }
						   ,dataType : "json",
						   success:function(data){
							 
							  var weatherImage = data.weather.minutely[0].sky.code.substring(5,7);
							var weathetTemp = data.weather.minutely[0].temperature.tc.substring(0,2);
							
								$("#now").append('<a>'
										   +'<p class="weather_text">오늘</p>'
										   +'<img class="img-responsive img-hover img-related" src="/resource/searchpage/image/weather_icons/'+weatherImage+'.png" alt="오늘 날씨">'
										   +'<span class="temp-text">기온 '+weathetTemp+'도</span');
						   }//end date success
						   ,error:function(err){
							   alert("실패!"+err.status);
						   }
					   });
		
					//내일날씨
					   $.ajax({
						  	
						   url :  "http://apis.skplanetx.com/weather/forecast/3days"
						   ,data:{
							    "version" : "1",
							    "appKey" : "65e16fa9-7caa-3142-9757-66d0ae8dd0f0",
								"lat":mapy,
								"lon":mapx
						   }
						   ,dataType : "json",
						   success:function(data){
							   var weatherImage = data.weather.forecast3days[0].fcst3hour.sky.code25hour.substring(5,7);
								var weathetTemp = data.weather.forecast3days[0].fcst3hour.temperature.temp25hour.substring(0,2);
								
								$("#tomorrow").append('<a>'
										   +'<p class="weather_text">내일</p>'
										   +'<img class="img-responsive img-hover img-related" src="/resource/searchpage/image/weather_icons/'+weatherImage+'.png" alt="내일 날씨">'
										   +'<span class="temp-text">기온 '+weathetTemp+'도</span>');
							   
						   }//end date success
						   
					   });
			
					//5일후 날씨
					 $.ajax({
						  	
						   url :  "http://apis.skplanetx.com/weather/forecast/6days"
						   ,data:{
							    "version" : "1",
							    "appKey" : "65e16fa9-7caa-3142-9757-66d0ae8dd0f0",
								"lat":mapy,
								"lon":mapx
						   }
						   ,dataType : "json",
						   success:function(data){
							   var weatherImage = data.weather.forecast6days[0].sky.amCode5day.substring(5,7);
								var weathetTemp = data.weather.forecast6days[0].temperature.tmin5day;
								
								$("#5day").append('<a>'
										   +'<p class="weather_text">5일후</p>'
										   +'<img class="img-responsive img-hover img-related" src="/resource/searchpage/image/weather_icons/'+weatherImage+'.png" alt="5일후 날씨">'
										   +'<span class="temp-text">기온 '+weathetTemp+'도</span');
							   
						   }//end date success
						   
					   });
					//10일 후 날씨
					 $.ajax({
						  	
						   url :  "http://apis.skplanetx.com/weather/forecast/6days"
						   ,data:{
							    "version" : "1",
							    "appKey" : "65e16fa9-7caa-3142-9757-66d0ae8dd0f0",
								"lat":mapy,
								"lon":mapx
						   }
						   ,dataType : "json",
						   success:function(data){
							   var weatherImage = data.weather.forecast6days[0].sky.pmCode10day.substring(5,7);
								var weathetTemp = data.weather.forecast6days[0].temperature.tmin10day;
								
							   $("#10day").append('<a>'
									   +'<p class="weather_text">10일후</p>'
									   +'<img class="img-responsive img-hover img-related" src="/resource/searchpage/image/weather_icons/'+weatherImage+'.png" alt="10일후 날씨">'
									   +'<span class="temp-text">기온 '+weathetTemp+'도</span');
							   
						   }//end date success
						   
						  
					   });
					
				
					
				}//end success
				,error:function(err){
					alert("실패!"+err.status);
				}		
						
			});//end inner ajax
			
		}//end success
		,error:function(){
			
		}
			
	}); //ajax
	

//카테고리 버튼을 눌렀을 경우--------------------------------------------------------------------------------

$(".category").click(function(){
	$('.List').empty();
	var category  = $(this).text().trim();
	var keyword = $("#cityName").text(); //검색어
	
		$.ajax({
			
			url : "http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchKeyword?ServiceKey=GE8ffyGcbc8LhTbkPBlErwmb2Q7JWxA2rhMEQ6iqXszlPFG%2BtFLSmkYyusYF%2FeguXxpATpP9ZiikFJ9%2BzgqGKA%3D%3D"
			,dataType:"json"
			,data : {
				
				"keyword":keyword.trim(),
				"MobileOS":"ETC",
				"MobileApp":"AppTesting",
				"pageNo":1,
				"arrange":"B",
				"_type":"json",
			}
			,success:function(data){
				//페이지 처리-------------------------------------------
				var totalCount = data.response.body.totalCount;
				
				$.ajax({	
				url : "http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchKeyword?ServiceKey=GE8ffyGcbc8LhTbkPBlErwmb2Q7JWxA2rhMEQ6iqXszlPFG%2BtFLSmkYyusYF%2FeguXxpATpP9ZiikFJ9%2BzgqGKA%3D%3D"
					,dataType:"json"
					,data : {
						
						"keyword":keyword.trim(),
						"MobileOS":"ETC",
						"MobileApp":"AppTesting",
						"pageNo":1,
						"arrange":"B",
						"_type":"json",
						"numOfRows":totalCount
					}
					,success:function(data){
						
						var item = data.response.body.items.item;
						//리스트 넣기-----------------------------------------------
						for(var i=0; i<item.length; i++){
							
					if(category =="관광지" && (item[i].cat2 == "A0101" || item[i].cat2 == "A0102" || item[i].cat2 == "A0201"|| item[i].cat2 == "A0202" || item[i].cat2 == "A0203"
						|| item[i].cat2 == "A0204" || item[i].cat2 == "A0205" || item[i].cat2 == "A0206")){
							
							//이미지 널값 처리
							var firstimage = "/resource/tour/images/noimage.jpg";
				               if(item[i].firstimage != null){
				                  firstimage=item[i].firstimage;
				               }
							
				             //타이틀 글자수 처리  ------------------------------    
				               var title = item[i].title;
				               var titleTag = '<a href="#" class="sTitle">'+item[i].title+'</a>';
				               if(getTextLength(title)>25){
				            	   
				            	   titleTag = '<a href="#" class="bTitle" alt="'+item[i].title+'">'+item[i].title.substring(0,20)+"..."+'</a>'
				            	   
				               }
				               
				            //주소처리--------------------------------------------
				            var addr = "주소가 없습니다.";
				            if(item[i].addr1 != null && item[i].addr2 !=null){
				            	addr=item[i].addr1+item[i].addr2;
				              
				               }
				               	               
				               //리스트에 붙이기----------------------------------------
							$(".List").append('<div class="col-md-4 img-portfolio">'
									+'<a href="#">'
									+'<img class="img-responsive img-hover list-image" src="'+firstimage+'" alt="'+item[i].title+'">'
									+' </a>'
									+' <h3>'
									+titleTag
									+'</h3>'
									+' <p>'+addr+'</p>'
									+'</div>'
							);
							
				}else if(category =="축제" &&(item[i].cat2 == "A0207" || item[i].cat2 == "A0208")){
					//이미지 널값 처리
					var firstimage = "/resource/tour/images/noimage.jpg";
		               if(item[i].firstimage != null){
		                  firstimage=item[i].firstimage;
		               }
					
		             //타이틀 글자수 처리  ------------------------------    
		               var title = item[i].title;
		               var titleTag = '<a href="#" class="sTitle">'+item[i].title+'</a>';
		               if(getTextLength(title)>25){
		            	   
		            	   titleTag = '<a href="#" class="bTitle" alt="'+item[i].title+'">'+item[i].title.substring(0,20)+"..."+'</a>'
		            	   
		               }
		               
		            //주소처리--------------------------------------------
		            var addr = "주소가 없습니다.";
		            if(item[i].addr1 != null && item[i].addr2 !=null){
		            	addr=item[i].addr1+item[i].addr2;
		              
		               }
		               	               
		               //리스트에 붙이기----------------------------------------
					$(".List").append('<div class="col-md-4 img-portfolio">'
							+'<a href="#">'
							+'<img class="img-responsive img-hover list-image" src="'+firstimage+'" alt="'+item[i].title+'">'
							+' </a>'
							+' <h3>'
							+titleTag
							+'</h3>'
							+' <p>'+addr+'</p>'
							+'</div>'
					);
					
				}else if(category =="맛집" &&(item[i].cat2 == "A0502")){
					//이미지 널값 처리
					var firstimage = "/resource/tour/images/noimage.jpg";
		               if(item[i].firstimage != null){
		                  firstimage=item[i].firstimage;
		               }
					
		             //타이틀 글자수 처리  ------------------------------    
		               var title = item[i].title;
		               var titleTag = '<a href="#" class="sTitle">'+item[i].title+'</a>';
		               if(getTextLength(title)>25){
		            	   
		            	   titleTag = '<a href="#" class="bTitle" alt="'+item[i].title+'">'+item[i].title.substring(0,20)+"..."+'</a>'
		            	   
		               }
		               
		            //주소처리--------------------------------------------
		            var addr = "주소가 없습니다.";
		            if(item[i].addr1 != null && item[i].addr2 !=null){
		            	addr=item[i].addr1+item[i].addr2;
		              
		               }
		               	               
		               //리스트에 붙이기----------------------------------------
					$(".List").append('<div class="col-md-4 img-portfolio">'
							+'<a href="#">'
							+'<img class="img-responsive img-hover list-image" src="'+firstimage+'" alt="'+item[i].title+'">'
							+' </a>'
							+' <h3>'
							+titleTag
							+'</h3>'
							+' <p>'+addr+'</p>'
							+'</div>'
					);
					
				}else if(category =="전체"){
					//이미지 널값 처리
					var firstimage = "/resource/tour/images/noimage.jpg";
		               if(item[i].firstimage != null){
		                  firstimage=item[i].firstimage;
		               }
					
		             //타이틀 글자수 처리  ------------------------------    
		               var title = item[i].title;
		               var titleTag = '<a href="#" class="sTitle">'+item[i].title+'</a>';
		               if(getTextLength(title)>25){
		            	   
		            	   titleTag = '<a href="#" class="bTitle" alt="'+item[i].title+'">'+item[i].title.substring(0,20)+"..."+'</a>'
		            	   
		               }
		               
		            //주소처리--------------------------------------------
		            var addr = "주소가 없습니다.";
		            if(item[i].addr1 != null && item[i].addr2 !=null){
		            	addr=item[i].addr1+item[i].addr2;
		              
		               }
		               	               
		               //리스트에 붙이기----------------------------------------
					$(".List").append('<div class="col-md-4 img-portfolio">'
							+'<a href="#">'
							+'<img class="img-responsive img-hover list-image" src="'+firstimage+'" alt="'+item[i].title+'">'
							+' </a>'
							+' <h3>'
							+titleTag
							+'</h3>'
							+' <p>'+addr+'</p>'
							+'</div>'
					);
										
				}//end if
							
						}//end for
						
					}//end success
					,error:function(err){
						alert("실패!"+err.status);
					}		
							
				});//end inner ajax
				
			}//end success
			,error:function(){
				
			}
				
		}); //ajax
		
		
	
	
});//end



});
	