var mapExtent = [-20037508.34, -20037508.34, 20037508.34, 20037508.34];
var mapResolutions = [156543.03392804062, 78271.51696402031, 39135.758482010155, 19567.8792410050775, 9783.93962050253875, 4891.969810251269, 2445.984905125635, 1222.992452562817, 611.4962262814085, 305.7481131407043, 152.8740565703521, 76.43702828517606, 38.21851414258803, 19.10925707129402, 9.554628535647008, 4.777314267823504, 2.388657133911752, 1.194328566955876];
var map = null;
var baseLayer = null;

$(function () {
    initMap();    
});

function initMap() {
    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
    });

    map = new ol.Map({
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }).extend([mousePositionControl]),
        loadTilesWhileInteracting: true,
        target: 'mapDiv',
        view: new ol.View({
            projection: 'EPSG:3857',
            zoom: 4,
            center: [11804325,3854872],
            resolutions: mapResolutions
        })
    });

    map.addControl(new ol.control.ScaleLine({ units: 'metric' }));

    map.on("moveend", function () { refreshZoomControlState(); });
}

function displayMap(type) {
    var mapType = type;
    var mapFormat = "png";
    if (type == 2) mapFormat = "jpg";
    var urlTemplate = "http://localhost:24459/MapServer/TileHandlerTest.ashx?m=ChinaMap&t=" + mapType + "&l={z}&r={y}&c={x}&f=" + mapFormat;
    var attribution = new ol.Attribution({ html: "<a href='http://www.map1000.com/' target='_blank'>千图网</a>" });

    var tileGrid = new ol.tilegrid.TileGrid({
        extent: mapExtent,
        minZoom: 0,
        origin: [mapExtent[0], mapExtent[3]],
        resolutions: mapResolutions,
        tileSize: [256, 256]
    });

    if (baseLayer != null) map.removeLayer(baseLayer);

    baseLayer = new ol.layer.Tile({
        attributions: [attribution],
        source: new ol.source.XYZ({
            url: urlTemplate,
            tileGrid: tileGrid
        })
    });

    map.getLayers().insertAt(0, baseLayer);
}


//放大
function zoomIn() {           
    zoom(map.getView().getZoom() + 1);
}


//缩小
function zoomOut() {    
    zoom(map.getView().getZoom() - 1);
}

function zoom(zoom) {    
    var view = map.getView();
    var currentResolution = view.getResolution();
    map.beforeRender(ol.animation.zoom({
        resolution: currentResolution,
        duration: 250,
        easing: ol.easing.easeOut
    }));
    map.getView().setZoom(zoom);

    refreshZoomControlState(zoom);
}

function refreshZoomControlState() {
  
    var zoom = map.getView().getZoom();
    if (zoom >= 18) {
        $("#zoomInControl").addClass("alatu-disabled");
    } else {
        $("#zoomInControl").removeClass("alatu-disabled");
    }

    if (zoom <= 0) {
        $("#zoomOutControl").addClass("alatu-disabled");
    } else {
        $("#zoomOutControl").removeClass("alatu-disabled");
    }
}