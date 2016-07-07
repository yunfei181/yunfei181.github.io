
var REGIONCODE = 640100;
var poiSearchLayer;
var poiSearchResultObj = null; //暂存查询到的当前结果
var pagerPoi; //POI翻页控件

function initPoiSearch() {
    pagerPoi = new Pager(getPoiList, "pagerPoi", "pagerPoi"); 

    var styles = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style({
            externalGraphic: "YTMap/theme/default/images/a${index}.png",            
            graphicTitle: '${name}',
            graphicWidth: 21,
            graphicHeight: 31,          
            graphicYOffset: 0,
            graphicYOffset: -31,
            graphicZIndex: 1
        }),
        "select": new OpenLayers.Style({
            externalGraphic: "YTMap/theme/default/images/b${index}.png",
            graphicWidth: 24,
            graphicHeight: 35,
            graphicYOffset: 0,
            graphicYOffset: -35,
            graphicZIndex: 2,
            cursor: "pointer"
        })
    });

    poiSearchLayer = new OpenLayers.Layer.Vector("poiSearchLayer", {
        styleMap: styles,
        rendererOptions: { zIndexing: true },
        renderers: renderer
    });

    map.addLayer(poiSearchLayer);

    setLayerCanSelect(poiSearchLayer);
    setLayerCanClearOverlay(poiSearchLayer);

    poiSearchLayer.events.on({
        "featureselected": function (e) {
            onPoiFeatureSelect(e.feature);
        },
        "featureunselected": function (e) {
            onPoiFeatureUnselect(e.feature);
        }
    });
}

function onPoiFeatureSelect(feature) {
    var popup = new OpenLayers.Popup.FramedCloud("feature_poi_popup",
                                     feature.geometry.getBounds().getCenterLonLat(),
                                     null,
                                     feature.attributes.popupHtml,
                                     { size: new OpenLayers.Size(0, 0), offset: new OpenLayers.Pixel(0, -35) },
                                     false, onPoiPopupClose);
    feature.popup = popup;
    popup.feature = feature;
    popup.calculateRelativePosition = function () {
        return 'tr';
    };
    popup.positionBlocks.tr.padding = new OpenLayers.Bounds(0, 40, 0, 0);
    map.addPopup(popup, true);
}

function onPoiFeatureUnselect(feature) {
    if (feature.popup) {
        feature.popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}

function onPoiPopupClose(evt) {
    selectControlClick.unselectAll();
    for (var i = map.popups.length - 1; i >= 0; i--) {
        var pop = map.popups[i];
        map.removePopup(pop);
        pop = null;
    }
}


function openPoisPanel() {
    $("#panelPois").css("display", "block");
}

function closePoisPanel() {
    $("#panelPois").css("display", "none");   
}

//获取某类别POI列表
function displayPoiListWithClass(classId) {
    //获取数量
    var poiCount = -1;
    $.ajax({
        url: 'PoiHandler.ashx',
        data: { searchType: 2, f: 'getPoiCount', classId: classId, regionCode: REGIONCODE },
        success: function (data) { poiCount = data; },
        async: false
    });
    if (poiCount == -1) return;

    openPoisPanel();

    var poiCountDivStr = "<div style=\" padding:3px; margin-top:5px; border-top:dotted 1px #b5b5b5; \"><b>共查到<span>" + poiCount + "</span>个结果</b>　<a href='javascript:void(0)' onclick='closePoisPanel()' >[返回]</a></div>";
    $("#panelPois").html("<div id='searchDiv'><div>" + poiCountDivStr + "</div><div id='searchResultDiv'></div><div id='pagerPoi' style='padding:5px;'></div></div>");

    var tempPageSize = 9;
    var tempPageCount = Math.ceil(poiCount / tempPageSize);

    pagerPoi.config({ "searchType": 2, "classId": classId, "regionCode": REGIONCODE }, tempPageCount, tempPageSize);
}


//获取某分页的POI查询列表
function getPoiList(options, pageIndex, pageSize) {
    var url = "PoiHandler.ashx";
    if (options.searchType == 1) {//关键词查找
        url += "?f=getPoiList&searchType=1&key=" + escape(options.keyword) + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&regionCode=" + options.regionCode;
    } else if (options.searchType == 2) { //分类查找
        url += "?f=getPoiList&searchType=2&classId=" + options.classId + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex + "&regionCode=" + options.regionCode;
    }

    $("#searchResultDiv").html("<div style='padding:15px;'>正在加载列表，请稍候...</div>");

    $.ajax({
        url: url,
        success: function (data) {
            poiSearchResultObj = eval("(" + data + ")");
            displayPoiSearchResult(true);
        }
    });
}


//关键词查询处理函数
function getSearchPoi() {
    var keyword = $("#keyword").val();
    if (keyword == undefined || keyword == null) {
        return;
    }
   
    if (keyword == "") {
        alert("关键词不能为空！");
        return;
    }

    openPoisPanel();

    var strHtml = "<div id='searchDiv'><div id='searchResultCountDiv'></div><div id='searchResultDiv'></div><div id='pagerPoi' style='padding:5px;'></div></div>";
    $("#panelPois").html(strHtml);

    //获取结果数量
    var poiCount = -1;
    $.ajax({
        url: 'PoiHandler.ashx',
        data: { searchType: 1, f: 'getPoiCount', key: keyword, regionCode: REGIONCODE },
        success: function (data) { poiCount = Number(data); },
        async: false
    });
    if (poiCount == -1) return;
    
    //显示分页栏
    $("#searchResultCountDiv").html("<div style=\" padding:3px; margin-top:5px; border-top:dotted 1px #b5b5b5; \"><b>共查到<span>" + poiCount + "</span>个结果</b> 　<a href='javascript:void(0)' onclick='closePoisPanel()' >[返回]</a></div>");
    var tempPageSize = 9 ;
    var tempPageCount = Math.ceil(poiCount / tempPageSize);

    pagerPoi.config({ "searchType": 1, "keyword": keyword, "regionCode": REGIONCODE }, tempPageCount, tempPageSize);
}


function displayPoiSearchResult(isFixtent) {
    //查询列表
    var searchResultDiv = $("#searchResultDiv");
   
    if (poiSearchResultObj == undefined || poiSearchResultObj == null) {
        searchResultDiv.html("");

    } else {
        var htmlStr = "<table style='width:95%;'cellpadding=5 cellspacing=0>";
        for (var i = 0, len = poiSearchResultObj.length; i < len; i++) {
            htmlStr += "<tr onclick=Javascript:openPoiDlg('" + poiSearchResultObj[i].ID + "'," + poiSearchResultObj[i].RegionID + ") onmouseover=Javascript:hoverPoi('" + poiSearchResultObj[i].ID + "','" + i + "') onmouseout=Javascript:hoverPoiOut('" + poiSearchResultObj[i].ID + "','" + i + "') ><td valign='top'style='padding-top:5px;width:24px;'><div id='searchResultIndicator" + i + "' style='width:19px; height:29px;background:url(YTMap/theme/default/images/markerlist.png) no-repeat -" + 24 * i + "px -77px'></div></td><td><a href='javascript:void(0)'>" + poiSearchResultObj[i].Name + "</a><br/>类型：" + poiSearchResultObj[i].ClassNames + "</td></tr>";
        }
        htmlStr += "</table>";

        searchResultDiv.html(htmlStr);
    }

    //将查询结果显示在地图上并缩放到合适范围
    displaySearchPoiInMap(isFixtent);
}

function displaySearchPoiInMap(isFitExtent) {
    if (poiSearchResultObj == undefined || poiSearchResultObj == null) return;

    poiSearchLayer.removeAllFeatures();

    if (poiSearchResultObj.length == 0) return;

    var count = poiSearchResultObj.length;
    var features = new Array(count);
    for (var i = 0; i < count; i++) {
        var lonlat = new OpenLayers.LonLat(poiSearchResultObj[i].Longitude, poiSearchResultObj[i].Latitude).transform(map.displayProjection, map.getProjectionObject());       
        features[i] = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),
            { index: i + 1, name: poiSearchResultObj[i].name, popupHtml: getPoiDisplayHtml(poiSearchResultObj[i]) }
        );
        features[i].layer = poiSearchLayer;     
        features[i].id = poiSearchResultObj[i].ID + "_poi_spot";
        features[i].lonlat = lonlat;
    }

    poiSearchLayer.addFeatures(features);

    if (isFitExtent) {       
        //缩放到结果集        
         map.zoomToExtent(poiSearchLayer.getDataExtent());
    }

    if (features.length == 1) {
        selectControlHover.overFeature(features[0]);
        onPoiFeatureSelect(features[0]);
    }
}

//根据POI的ID获取弹出框中显示内容HTML
function getPoiDisplayHtml(poiItem) {
    var htmlContent = "<div style='width:300px;' class='poi-dialog'>";
    htmlContent += "<div class='poi-dialog-title'>";
    htmlContent += "<div style='float:left'><b>" + poiItem.Name + "</b></div>";
    htmlContent += "<div id='btnClosePoiDlg' class='poi-dialog-title-close'  title='关闭' onclick='onPoiPopupClose()'></div>";
    if (poiItem.IsUserPOI=="1") htmlContent += "<div style='float:right;'><a href='PoiDetail.aspx?ID=" + poiItem.ID + "' target='_blank'>详情»</a>&nbsp;&nbsp;&nbsp;&nbsp;</div>";
    htmlContent += "<div class='clearfloat'></div></div>";

    htmlContent += "<div class='poi-dialog-container'>";
    $.ajax({
        url: 'PoiHandler.ashx',
        data: { searchType: 2, f: 'getPoiDetail', poiId: poiItem.ID, isUserPOI: poiItem.IsUserPOI ? "1" : "0" },
        success: function (jsonData) {
            if (jsonData == "{}") {
                htmlContent += "<div><b>" + poiItem.Name + "</b></div>";                
            } else {

                data = eval("(" + jsonData + ")");

                if (data.DisplayType == 5) {
                    if (data.Pictures != null && data.Pictures != "") {
                        var picFirst = data.Pictures.split(",")[0];
                        htmlContent += "<a href='data/pics/" + picFirst + ".jpg' target='_blank'><img src='data/pics/" + picFirst + ".jpg' width='100%' border=0 /></a>";
                    }
                } else {
                    htmlContent += "<div><table><tr><td>";
                    if (data.Pictures != null && data.Pictures != "") {
                        var picFirst = data.Pictures.split(",")[0];
                        htmlContent += "<a href='data/pics/" + picFirst + ".jpg' target='_blank'><img src='data/pics/" + picFirst + ".jpg' width='80px' border=0 style='padding:5px;' /></a>";
                    }
                    if (data.Address != null && data.Address != "") htmlContent += "</td><td valign='top'>地址：" + data.Address;
                    if (data.Phone != null && data.Phone != "") htmlContent += "<br>电话：" + data.Phone;
                    if (data.Website != null && data.Website != "") htmlContent += "<br>网址：<a target='_blank' href=" + data.Website + ">" + data.Website + "</a>";
                    htmlContent += "</td></tr></table></div>";
                    if (data.Introduction != null && data.Introduction != "") {
                        var introduction = data.Introduction;
                        if (introduction.length > 100) introduction = introduction.substring(0, 100) + "...";
                        htmlContent += "<p style='line-height:150%; text-indent:2em; '>" + introduction + "</p>";
                    }
                    if (data.Video != null && data.Video != "") {
                        htmlContent += "<div style='height:180px'><object type='application/x-shockwave-flash' data=''swf/vcastr3.swf' width='300' height='180' id='vcastr3'>";
                        htmlContent += "<param name='movie' value='swf/vcastr3.swf'/><param name='allowFullScreen' value='true'/> <param name='FlashVars' value='xml=";
                        htmlContent += "<vcastr><channel><item><source>../data/videos/" + data.Video + ".flv</source><duration></duration><title></title></item></channel><config></config></vcastr>'/>";
                        htmlContent += "</object></div>";
                    }
                }

            }            

        },
        async: false
    });

    htmlContent += "</div></div>";

    return htmlContent;
}

//高亮每条记录前面的图标以及地图中的POI图标
function hoverPoi(poiId, resultIndex) {
    $("#searchResultIndicator" + resultIndex).css("backgroundPosition", "-" + 24 * resultIndex + "px -109px");

    var featureId = poiSearchResultObj[resultIndex].ID + "_poi_spot";
    var feature = poiSearchLayer.getFeatureById(featureId);
    selectControlHover.overFeature(feature);
}

function hoverPoiOut(poiId, resultIndex) {
    $("#searchResultIndicator" + resultIndex).css("backgroundPosition", "-" + 24 * resultIndex + "px -77px");

    var featureId = poiSearchResultObj[resultIndex].ID + "_poi_spot";
    var feature = poiSearchLayer.getFeatureById(featureId);
    selectControlHover.outFeature(feature);
}

//弹出POI提示框
function openPoiDlg(poiId, regionId) {    
   
    for (var i = 0; i < poiSearchLayer.features.length; i++) {
        var tempFeature = poiSearchLayer.features[i];
        if (tempFeature.id.substring(0, tempFeature.id.indexOf("_")) == poiId) {
            if (!map.getExtent().containsLonLat(tempFeature.lonlat)) {
                map.setCenter(tempFeature.lonlat);
            } else {
                map.panTo(tempFeature.lonlat);
            }
            selectControlClick.unselectAll();
            selectControlClick.select(tempFeature);

            return;
        }
    }
}

//附近查找
var popupNear = null;
function nearFind(longitude, latitude) {
    if (popMenu != null)
        popMenu.hide();

    var styles = new OpenLayers.StyleMap({
        externalGraphic: "../../Images/map/near.png",
        graphicWidth: 28,
        graphicHeight: 36,
        graphicYOffset: -36,
        graphicZIndex: 1000,
        fillColor: "#97b4f5",
        fillOpacity: 0.3,
        graphicOpacity: 1.0,
        strokeColor: "#97b4f5",
        strokeWidth: 1
    });

    var searchLayers = map.getLayersByName("nearLayer");
    var nearLayer;
    if (searchLayers.length == 0) {
        nearLayer = new OpenLayers.Layer.Vector("nearLayer", {
            styleMap: styles,
            rendererOptions: { zIndexing: true },
            renderers: renderer
        });
        map.addLayer(nearLayer);

        //        nearLayer.events.on({
        //            "featuremodified": report
        //        });

        //设置圆可以改变大小
        //        var controlResizeCircle = new OpenLayers.Control.ModifyFeature(nearLayer);
        //        controlResizeCircle.mode = OpenLayers.Control.ModifyFeature.RESIZE;
        //        map.addControl(controlResizeCircle);
        //        controlResizeCircle.activate();

    } else {
        nearLayer = searchLayers[0];
    }

    nearLayer.removeAllFeatures();

    var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(longitude, latitude));
    feature.id = "feature_near_center";
    nearLayer.addFeatures([feature]);

    //新建一个Popup   
    var popupHtml = "<div style='width:250px;height:100px; color:#333; '><b>附近查找</b><div style='border-top:solid 1px #ccc;margin:5px auto;'></div><div style='margin-top:10px;' >" +
                    "<input type='text' id='keywordnear' style='width:100px; height:18px;' onkeydown='SubmitKeyClick(\"btnSearchNear\",event)'/>" +
                    "　<div class='map-select-outer map-select-wh100'><div class='map-select-inner'><select id='selectNearDistance' class='map-select-h'><option value='100'>100米</option><option value='200'>200米</option><option value='500'>500米</option><option value='1000' selected='selected'>1000米</option><option value='2000'>2000米</option><option value='5000'>5000米</option></select></div></div>" +
                    "　<input type='button' value='搜索' id='btnSearchNear' onclick='getSearchNearPoi()' class='btn-map' /></div>" +
                    "<div style='margin-top:10px;'><a href='javascript:void(0)' onclick='displayNearPoiListQuick(\"医院\")'>医院</a>　" +
                    "<a href='javascript:void(0)' onclick='displayNearPoiListQuick(\"学校\")'>学校</a>　" +
                    "<a href='javascript:void(0)' onclick='displayNearPoiListQuick(\"银行\")'>银行</a>　" +
                    "<a href='javascript:void(0)' onclick='displayNearPoiListQuick(\"商场\")'>商场</a>　" +
                    "<a href='javascript:void(0)' onclick='displayNearPoiListQuick(\"酒店\")'>酒店</a>　" +
                    "<a href='javascript:void(0)' onclick='displayNearPoiListQuick(\"餐厅\")'>餐厅</a>　" +
                    "<a href='javascript:void(0)' onclick='displayNearPoiListQuick(\"景点\")'>景点</a>" +
                    "</div></div>";
    popupNear = new OpenLayers.Popup.FramedCloud("Popup_NearSearch",
                                     new OpenLayers.LonLat(longitude, latitude),
                                     null,
                                     popupHtml,
                                     { size: new OpenLayers.Size(0, 0), offset: new OpenLayers.Pixel(0, -36) },
                                     true, onDlgClose);
    popupNear.calculateRelativePosition = function () {
        return 'tr';
    };
    map.addPopup(popupNear, true);
    document.getElementById("keywordnear").focus();
}

function onDlgClose(evt) {
    this.destroy();

    map.getLayersByName("nearLayer")[0].removeAllFeatures();

    //displayNearPoiList("宾馆", 1000);
}

function report(event) {
    alert(event.type, event.feature ? event.feature.id : event.components);
}

function getSearchNearPoi() {
    if (document.getElementById("keywordnear") == undefined) {
        return;
    }
    var keyword = document.getElementById("keywordnear").value.trim();
    if (keyword == "") {
        return;
    }

    var distance = document.getElementById("selectNearDistance").value;

    displayNearPoiList(keyword, distance);
}

function displayNearPoiListQuick(keyword) {
    displayNearPoiList(keyword, 1000);
}

//获取附近POI列表
function displayNearPoiList(keyword, distance) {

    if (popupNear != null) {
        popupNear.destroy();
    }

    //创建一个圆
    var searchLayer = map.getLayersByName("nearLayer")[0];
    var featureNearCenter = searchLayer.getFeatureById("feature_near_center");
    var centerPt = featureNearCenter.geometry;
    var R = 6371012;
    var delta = (distance / (2 * Math.PI * R)) * 360;
    var circle = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon.createRegularPolygon(centerPt, delta, 100, 0));
    circle.id = "circle_near";

    searchLayer.removeAllFeatures();
    searchLayer.addFeatures([circle]);

    var featureNearCenterPt = new OpenLayers.Feature.Vector(centerPt);
    featureNearCenterPt.id = "feature_near_center";
    searchLayer.addFeatures([featureNearCenterPt]);

    var centerPt = new OpenLayers.LonLat(featureNearCenterPt.geometry.x, featureNearCenterPt.geometry.y);

    var poiCount = -1;
    $.ajax({
        url: '../../PoiHandler.ashx',
        data: { searchType: 3, f: 'getNearPoiCount', lon: centerPt.lon, lat: centerPt.lat, distance: distance, keyword: keyword, regionCode: regionCode },
        success: function (data) { poiCount = data; },
        async: false
    });
    if (poiCount == -1) return;

    //如果是城市图则切换到搜索结果频道
    if (channels.length != 1) {
        switchChannelPanel("search");
    }

    $("#sliderbar_detail").html("<div id='searchDiv'><div id='searchResultCountDiv'></div><div id='searchResultGroupCountDiv'></div><div id='searchResultDiv'></div><div id='page' style='padding:5px;'></div></div>");

    $("#searchResultCountDiv").html("<div style=\" padding:3px; margin-top:5px; border-top:dotted 1px #b5b5b5; \"><b>共查到<span style='color:red;'>" + poiCount + "</span>个结果</b></div>");

    var tempPageSize = 9;
    var tempPageCount = Math.ceil(poiCount / tempPageSize);
    pager.regionCode = regionCode;
    pager.config(3, "", keyword, tempPageCount, tempPageSize, centerPt.lon, centerPt.lat, distance);
}