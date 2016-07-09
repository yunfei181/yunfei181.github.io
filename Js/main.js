$(function () {
    //频道页圆角化
    $("#mapChannel").find("li").eq(1).corner("top 5px");

    //初始化频道切换
    $("#mapChannel li").each(function () {
        var mapChannelId = $(this).attr("id");
        if (mapChannelId != undefined) {
            $(this).bind("click", function () {
                mapChannelClick(mapChannelId)
            });
        }
    });

    //左侧滚动条
    $("#leftContent").mCustomScrollbar({
        theme: "minimal-dark",
        scrollInertia: 0 //滚动惯性
    });

    initMapControls();

    initLayers();

    initPlot();

    initSpecial();
   
});

function initMapControls() {
    $("#zoomInControl").on("click", function () { zoomIn(); });
    $("#zoomOutControl").on("click", function () { zoomOut(); });
}

function mapChannelClick(id) {
    $("#mapChannel li").each(function () {
        var mapChannelId = $(this).attr("id");
        if (mapChannelId != undefined) {
            if (mapChannelId != id) {
                $(this).attr("class", "");
                $("#" + mapChannelId + "Container").css("display", "none");
            } else {
                $(this).attr("class", "checked");
                $(this).corner("top 5px");
                $("#" + mapChannelId + "Container").css("display", "block");
            }
        }

        $("#panelPois").css("display", "none");
    });
}

function initLayers() {
    var treeSetting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        data: { simpleData: { enable: true } },
        callback: {
            onClick: onClick,
            onCheck: zTreeOnCheck
        }
    };

    var zNodes = [{ id: 1, pId: 0, name: "地理底图", open: true, nocheck: true, click: false },
    { id: 11, pId: 1, name: "谷歌地图", open: true, nocheck: true },
    { id: 111, pId: 11, name: "谷歌道路", key: "google_road", click: false},
    { id: 112, pId: 11, name: "谷歌影像", key: "google_satellite", click: false},
    { id: 113, pId: 11, name: "谷歌地形", key: "google_terrain", click: false},
    { id: 12, pId: 1, name: "Stamen地图", open: true, nocheck: true },
    { id: 121, pId: 12, name: "WaterColor", key: "stamen_watercolor", click: false },
    { id: 122, pId: 12, name: "Toner", key: "stamen_toner", click: false },
    { id: 123, pId: 12, name: "Terrain", key: "stamen_terrain", click: false },
    { id: 13, pId: 1, name: "BingMap", open: true, nocheck: true },
    { id: 131, pId: 13, name: "Road", key: "BingMap_Road", click: false },
    { id: 132, pId: 13, name: "Aerial", key: "BingMap_Aerial", click: false },
    { id: 133, pId: 13, name: "AerialWithLabels", key: "BingMap_AerialWithLabels", click: false },
    { id: 134, pId: 13, name: "collinsBart", key: "BingMap_collinsBart", click: false,title:'美国地区放很大才能显示' },
    { id: 135, pId: 13, name: "ordnanceSurvey", key: "BingMap_ordnanceSurvey", click: false },
    { id: 14, pId: 1, name: "OpenStreetMap", open: true, nocheck: true },
    { id: 141, pId: 14, name: "OSM", key: "OSM", click: false },
    { id: 142, pId: 14, name: "OpenCycleMap", key: "OpenCycleMap", click: false },    
    { id: 15, pId: 1, name: "MapQuest", open: true, nocheck: true },
    { id: 151, pId: 15, name: "Road", key: "MapQuest_Road", click: false },
    { id: 152, pId: 15, name: "Aerial", key: "MapQuest_Aerial", click: false },
    { id: 153, pId: 15, name: "AerialWithLabels", key: "MapQuest_AerialWithLabels", click: false },
    { id: 16, pId: 1, name: "天地图", open: true, nocheck: true },
    { id: 161, pId: 16, name: "道路", key: "Tianditu_Road", click: false },
    { id: 162, pId: 16, name: "影像", key: "Tianditu_Satellite", click: false },
    { id: 163, pId: 16, name: "地形晕渲", key: "Tianditu_dxyx", click: false },
    { id: 164, pId: 16, name: "百度地图", key: "BMap", click: false },
    { id: 17, pId: 1, name: "ArcGIS", open: true, nocheck: true },
    { id: 171, pId: 17, name: "Streets", key: "ArcGIS_Streets", checked: true,click: false },
    { id: 172, pId: 17, name: "Imagery", key: "ArcGIS_Imagery", click: false },
    { id: 173, pId: 17, name: "Terrain", key: "ArcGIS_Terrain", click: false },
    { id: 174, pId: 17, name: "ShadedRelief", key: "ArcGIS_ShadedRelief", click: false },
    { id: 175, pId: 17, name: "Topographic", key: "ArcGIS_Topographic", click: false },
    { id: 176, pId: 17, name: "Oceans", key: "ArcGIS_Oceans", click: false },
    { id: 177, pId: 17, name: "NationalGeographic", key: "ArcGIS_NationalGeographic", click: false },
    { id: 178, pId: 17, name: "Gray", key: "ArcGIS_Gray", click: false },
    { id: 179, pId: 17, name: "DarkGray", key: "ArcGIS_DarkGray", click: false }
    ];

    $.fn.zTree.init($("#mapTree"), treeSetting, zNodes);

    changeBaseMap("ArcGIS_Streets");    
}

//实时查询Tree
function onClick(event, treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj("mapTree");
    //zTree.expandNode(treeNode);
    var nodes = treeNode.children;
    if (nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            zTree.checkNode(nodes[i], true, false);
        }
    }
    
    changeBaseMap(treeNode.key);
    zTree.checkNode(treeNode, true, false);
}

function zTreeOnCheck(event, treeId, treeNode) {
    //showLayer(treeNode.name, treeNode.checked);
    var zTree = $.fn.zTree.getZTreeObj("mapTree");
    zTree.selectNode(treeNode);
    changeBaseMap(treeNode.key);
}

function changeBaseMap(mapKey) {
    if (mapKey == "google_road") {
        displayMap(0);
    } else if (mapKey == "google_satellite") {
        displayMap(1);
    } else if (mapKey == "google_terrain") {
        displayMap(2);
    } else if (mapKey == "stamen_watercolor") {
        changeBaseMapSource(new ol.source.Stamen({ layer: 'watercolor' }));
    } else if (mapKey == "stamen_toner") {
        changeBaseMapSource(new ol.source.Stamen({ layer: 'toner' }));
    } else if (mapKey == "stamen_terrain") {       
        changeBaseMapSource(new ol.source.Stamen({ layer: 'terrain' }));
    } else if (mapKey == "BingMap_Road") {
        changeBaseMapSource(new ol.source.BingMaps({ imagerySet: 'Road', key: 'AkGbxXx6tDWf1swIhPJyoAVp06H0s0gDTYslNWWHZ6RoPqMpB9ld5FY1WutX8UoF', }));
    } else if (mapKey == "BingMap_Aerial") {
        changeBaseMapSource(new ol.source.BingMaps({ imagerySet: 'Aerial', key: 'AkGbxXx6tDWf1swIhPJyoAVp06H0s0gDTYslNWWHZ6RoPqMpB9ld5FY1WutX8UoF', }));
    } else if (mapKey == "BingMap_AerialWithLabels") {
        changeBaseMapSource(new ol.source.BingMaps({ imagerySet: 'AerialWithLabels', key: 'AkGbxXx6tDWf1swIhPJyoAVp06H0s0gDTYslNWWHZ6RoPqMpB9ld5FY1WutX8UoF', }));
    } else if (mapKey == "BingMap_collinsBart") {
        changeBaseMapSource(new ol.source.BingMaps({ imagerySet: 'collinsBart', key: 'AkGbxXx6tDWf1swIhPJyoAVp06H0s0gDTYslNWWHZ6RoPqMpB9ld5FY1WutX8UoF', }));
    } else if (mapKey == "BingMap_ordnanceSurvey") {
        changeBaseMapSource(new ol.source.BingMaps({ imagerySet: 'ordnanceSurvey', key: 'AkGbxXx6tDWf1swIhPJyoAVp06H0s0gDTYslNWWHZ6RoPqMpB9ld5FY1WutX8UoF', }));
    } else if (mapKey == "OSM") {
        changeBaseMapSource(new ol.source.OSM());
    } else if (mapKey == "OpenCycleMap") {
        changeBaseMapSource(new ol.source.OSM({ url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png' }));
     } else if (mapKey == "MapQuest_Road") {
        changeBaseMapSource(new ol.source.MapQuest({ layer: 'osm' }));
    } else if (mapKey == "MapQuest_Aerial") {
        changeBaseMapSource(new ol.source.MapQuest({ layer: 'sat' }));
    } else if (mapKey == "MapQuest_AerialWithLabels") {
        changeBaseMapSource(new ol.source.MapQuest({ layer: 'sat' }));
        addAnnoLayer(new ol.source.MapQuest({ layer: 'hyb' }));
    } else if (mapKey == "MapBox") {
        changeBaseMapSource(new ol.source.MapQuest({ layer: 'sat' }));
    } else if (mapKey == "Tianditu_Road") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}" }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}' }));
    } else if (mapKey == "Tianditu_Satellite") {
        changeBaseMapSource(new ol.source.XYZ({ url: 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}' }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://t3.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}' }));
    } else if (mapKey == "Tianditu_dxyx") {
        changeBaseMapSource(new ol.source.XYZ({ url: 'http://t3.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}' }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://t3.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}' }));
    } else if (mapKey == "BMap") {
        var projection = ol.proj.get("EPSG:3857");
        var resolutions = [];
        for (var i = 0; i < 19; i++) {
            resolutions[i] = Math.pow(2, 18 - i);
        }
        var tilegrid = new ol.tilegrid.TileGrid({
            origin: [0, 0],
            resolutions: resolutions
        });
        var source = new ol.source.TileImage({
            projection: projection,
            tileGrid: tilegrid,
            tileUrlFunction: function (tileCoord, pixelRatio, proj) {
                if (!tileCoord) {
                    return "";
                }
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = tileCoord[2];

                if (x < 0) {
                    x = "M" + (-x);
                }
                if (y < 0) {
                    y = "M" + (-y);
                }

                return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
            }
        });
        changeBaseMapSource(source);
    } else if (mapKey == "ArcGIS_Streets") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" }));
    } else if (mapKey == "ArcGIS_Terrain") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}" }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}' }));
    } else if (mapKey == "ArcGIS_ShadedRelief") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}" }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}' }));
    } else if (mapKey == "ArcGIS_Imagery") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}' }));
    } else if (mapKey == "ArcGIS_Topographic") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" }));
    } else if (mapKey == "ArcGIS_Oceans") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}" }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}' }));
    } else if (mapKey == "ArcGIS_NationalGeographic") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}" }));
    } else if (mapKey == "ArcGIS_Gray") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}' }));
    } else if (mapKey == "ArcGIS_DarkGray") {
        changeBaseMapSource(new ol.source.XYZ({ url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" }));
        addAnnoLayer(new ol.source.XYZ({ url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}' }));
    }
    
    
}


function changeBaseMapSource(source) {
    if (baseLayer != null) map.removeLayer(baseLayer);
    if (annoLayer != null) map.removeLayer(annoLayer);
    baseLayer = new ol.layer.Tile({
        source: source
    });
    map.getLayers().insertAt(0, baseLayer);
}

var annoLayer;
function addAnnoLayer(source) {
    annoLayer = new ol.layer.Tile({
        source: source
    });
    map.getLayers().insertAt(1, annoLayer);
}