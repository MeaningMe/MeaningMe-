(function(){
	'use strict';
	//加载地图函数库
	window.BMap_loadScriptTime = (new Date).getTime();
	document.write('<script type="text/javascript" src="http://api.map.baidu.com/getscript?v=2.0&ak=077E114C2eb9cf894df88566ea8cfce7&services=&t=20160310104956"></script>');   
})(window)
function MapInit(map,json){
		//=====初始化init

		var isNumc = 1, 
			defaultCity = '天津', //中心点城市
			defaultPoint = '117.22072,39.084436', //中心点坐标
			defaultZoom = 15, 
			copyright = 'MeaningMe 1.0'; 
		if(typeof(json)!='undefined'){
			isNumc = typeof(json.isNumc)=='undefined' ? isNumc : json.isNumc,
			defaultCity = typeof(json.city)=='undefined' ? defaultCity : (json.city=='' ? defaultCity : json.city), 
			defaultPoint = typeof(json.point)=='undefined' ? defaultPoint : (json.point=='' ? defaultPoint : json.point), 
			defaultZoom = typeof(json.zoom)=='undefined' ? defaultZoom : json.zoom,
			copyright = typeof(json.copyright)=='undefined' ? copyright : json.copyright; 
		}
		var default_longitude = defaultPoint.split(',')[0], //经度
			default_latitude = defaultPoint.split(',')[1]; //纬度	

		map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
		map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

		//=====设置地图中心点/默认城市
		var point = new BMap.Point(default_longitude,default_latitude);
		if(isNumc==1)
			map.centerAndZoom(point, defaultZoom); 
		else 
			map.centerAndZoom(defaultCity,defaultZoom);  


		var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
		var mapType2 = new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT});
		var overView = new BMap.OverviewMapControl();
		var overViewOpen = new BMap.OverviewMapControl({isOpen:false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
		map.addControl(mapType1);          
		map.addControl(mapType2);          
		map.setCurrentCity(defaultCity);   
		map.addControl(overView);          
		map.addControl(overViewOpen);      

		//=====版权
		var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_TOP_RIGHT});  
		map.addControl(cr); 
		var bs = map.getBounds();   
		cr.addCopyright({id: 1, content: '<a class="b_copyright">'+copyright+'</a>', bounds: bs}); 

		//=====城市切换
		map.enableContinuousZoom();
		var size = new BMap.Size(180, 10); 
		map.addControl(new BMap.CityListControl({
		    anchor: BMAP_ANCHOR_TOP_LEFT,
		    offset: size,
		}));
	}
	// function addMarker(point,label){}
		
		
		//Marker
	
	function createMapPoint(dataJson,paramJson){
	
		var l_point = dataJson.l_point,
			r_point = dataJson.r_point,
			title = dataJson.title,
			description = dataJson.description,
			dragging = typeof(dataJson.dragging)=='undefined' ? false : dataJson.dragging, 
			isInfo = typeof(dataJson.isInfo)=='undefined' ? true : dataJson.isInfo, 
			style = typeof(dataJson.style)=='undefined' ? "" : dataJson.style, 
			iconImg = typeof(dataJson.icon)=='undefined' ? "" : dataJson.icon; 
	
		var showDetails = typeof(paramJson) == 'undefined' ? false : typeof(paramJson.showDetails)=='undefined' ? false : paramJson.showDetails; 
		if(showDetails) isInfo = false;
	
	
		//创建标注
		var point = new BMap.Point(l_point,r_point); 
		var $iconJson = {}
		if(iconImg!=""){
			var size = new BMap.Size(30,30); 
			var iconOptions = {
			    anchor: new BMap.Size(5, 10) 
			}
			var icon = new BMap.Icon(iconImg, size,iconOptions);
			$iconJson = {"icon":icon}
		}
	
		
		var marker = new BMap.Marker(point,$iconJson); //创建标注
		map.addOverlay(marker); //添加标注
		if(dragging) marker.enableDragging(); 
		else marker.disableDragging(); 
		if(showDetails) title = description;
		var $labelJson = {"point":point,"title":title,"style":style,"showDetails":showDetails}
		createMapLabel(marker,$labelJson);
	
		if(typeof infoButtonClickFunc === 'function' ) infoButtonClickFunc(); 
	

		if(isInfo){
			var	$infoJson = {"point":point,"title":title,"description":description}
			createMapInfoWindow(marker,$infoJson);
		}
	
	}
	
	
	function createMapLabel(marker,json){
		var point = json.point,
			title = json.title,
			style = json.style;
		var showDetails = json.showDetails;
	
	
		var l_opts = { 
		  position : point,    
		  offset   : new BMap.Size(25, -25)    
		}
	
	
		var color = '#fff',
			backgroundColor = style==''? 'red' : style,
			borderColor = style=='' ? 'red' : 'transparent';
	
		var styleJson = { 
			 color : "inherit",
			 backgroundColor:"red",
			 fontSize : "12px",
			 padding:"5px 8px",
			 borderWidth:"1px",
			 borderStyle:"solid",
			 borderColor:"red",
			 borderRadius:"3px",
			 fontFamily:"微软雅黑"
		}
		var label = new BMap.Label('<div class="bdLabel '+style+'">'+title+'</div>', l_opts);  
		label.setStyle(styleJson);
		// marker.setLabel(label);
		var $parent = $('.bdLabel').parents('.BMapLabel');
		if(showDetails) $parent.addClass('hasDetail');
		else $parent.removeClass('hasDetail');
	}
	
	//
	function createMapInfoWindow(marker,json){
		var title = json.title,
			description = json.description,
			point = json.point;
		var content = '<div class="bdInfoWindow">'+description+'</div>';
	
		var infoOptions = {
		  "width" : 0,     
		  "maxWidth":500, 
		  "height": 0,     
		  "offset":{width:15, height: -10},
		  "title" : ""
		}
	
	
	
		var infoWindow = new BMap.InfoWindow(content, infoOptions);
	
		//打开信息窗
		if($infoWindowOpenMethod=='click'){
			marker.addEventListener("click", 
	            function(){
	                this.openInfoWindow(infoWindow);
	            }
	        );
		}else{
			marker.addEventListener("mouseover", function(e){  
				map.openInfoWindow(infoWindow,point); //开启信息窗口
			});
		}
	
	

		if(!infoWindow.isOpen()){ 
			infoWindow.addEventListener('open', function(e){
				if(typeof infoButtonClickFunc === 'function') infoButtonClickFunc(); 
			});				
		}else{
			if(typeof infoButtonClickFunc === 'function') infoButtonClickFunc(); 
			
		}
	}