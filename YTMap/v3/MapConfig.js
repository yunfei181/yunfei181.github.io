//参数配置
var MAP_SERVER_URL = "http://www.map1000.com/MapSite/";
var TILE_HANDLER_URL = MAP_SERVER_URL + "TileHandlerTest.ashx"; //切片加载程序
var GET_MAP_CONFIG_HANDLER_URL = "/GetMapConfigHandler.ashx";   //相对于根目录


configMap();

function configMap() {
    loadMapCustomJSFiles();
}

//加载地图扩展文件
function loadMapCustomJSFiles() {
    var myCssFiles = ["OpenLayers3/ol.css", "OpenLayers3/ol-ext.css"];
    var myJsFiles = ["OpenLayers3/ol.js","map.js", "../mapui.js","../Pager.js"];

    //css
    var cssTags = new Array(myCssFiles.length);
    var host = getYTMapBasePath();
    for (var i = 0, len = myCssFiles.length; i < len; i++) {
        cssTags[i] = "<link rel='stylesheet' type='text/css' href='" + host + myCssFiles[i] + "' />";
    }
    if (cssTags.length > 0) {
        document.write(cssTags.join(""));
    }

    //js
    var scriptTags = new Array(myJsFiles.length);
    var host = getYTMapBasePath();
    for (var i = 0, len = myJsFiles.length; i < len; i++) {
        scriptTags[i] = "<script type='text/javascript' src='" + host + myJsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }

}

function getYTMapBasePath() {
    var scriptName = "MapConfig.js";
    var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "";
    for (var i = 0, len = s.length; i < len; i++) {
        src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                l = m[1];
                break;
            }
        }
    }
    return l;
}

//获取当前网页的根路径
function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return (prePath + postPath);
}