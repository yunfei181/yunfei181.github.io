function initSpecial() {
    var treeSetting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "level"
        },
        data: { simpleData: { enable: true } },
        callback: {
            onClick: specailTreeOnClick,
            onCheck: specailTreeOnCheck
        }
    };

    var zNodes = [{ id: 1, pId: 0, name: "专题地图", nocheck: true, open: true, click: false },
    { id: 14, pId: 1, name: "专题图1", key:"ydyl",open: true },
    { id: 141, pId: 14, name: "沿线国家", nocheck: true, click: false, icon: "Images/icon_yxgj.png" },
    { id: 142, pId: 14, name: "大陆线", nocheck: true, click: false, icon: "Images/icon_polygon.png" },
    { id: 143, pId: 14, name: "海洋线", nocheck: true, click: false, icon: "Images/icon_polyline.png" },
    { id: 144, pId: 14, name: "沿线城市", nocheck: true, click: false, icon: "Images/icon_yxcs.png" },
    { id: 15, pId: 1, name: "专题图2", key: "test", open: true },
    { id: 16, pId: 1, name: "地震热力图", key: "earthquakeheap", open: true },
    { id: 17, pId: 1, name: "2012年全球地震分布图", key: "earthquake2012", open: true },
    { id: 18, pId: 1, name: "分层设色图", key: "fenceng", open: true },
    ];
  
    $.fn.zTree.init($("#specialTree"), treeSetting, zNodes);

    //displaySpecialMap("ydyl");
}

//实时查询Tree
function specailTreeOnClick(event, treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj("specialTree");
    //zTree.expandNode(treeNode);
    var nodes = treeNode.children;
    if (nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            zTree.checkNode(nodes[i], true, false);
        }
    }

    displaySpecialMap(treeNode.key);
    zTree.checkNode(treeNode, true, false);
}

function specailTreeOnCheck(event, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("specialTree");
    zTree.selectNode(treeNode);
    displaySpecialMap(treeNode.key);
}



var speLayers = [];

function displaySpecialMap(mapKey) {

    for (i = 0; i < speLayers.length; i++) {
        map.removeLayer(speLayers[i]);
        speLayers.pop();
    }

    if (mapKey == "ydyl") {
        var vector = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: 'data/ydyl_countrys.gml',
                format: new ol.format.GML()
            })
        });
        speLayers.push(vector);
        map.addLayer(vector);

    } else if (mapKey == "test") {
        var source = new ol.source.Vector({
            url: 'data/2012-02-10.kml',
            format: new ol.format.KML()
        });
        var vector = new ol.layer.Vector({
            source: source
        });
        speLayers.push(vector);
        map.addLayer(vector);
        
        //map.getView().fit(ol.proj.transform([7.35, 46.27, 8.4863, 46.73], 'EPSG:4326', "EPSG:3857"), map.getSize());
        map.getView().setCenter(ol.proj.transform([7.73, 46.5], 'EPSG:4326', "EPSG:3857"));
        map.getView().setZoom(10);

    } else if (mapKey == "fenceng") {
        var vector = new ol.layer.Tile({
            source: new ol.source.TileJSON({
                url: 'data/mapbox.20110804-hoa-foodinsecurity-3month.json',
                crossOrigin: 'anonymous'
            })
        });
        speLayers.push(vector);
        map.addLayer(vector);

        //map.getView().fit(ol.proj.transform([7.35, 46.27, 8.4863, 46.73], 'EPSG:4326', "EPSG:3857"), map.getSize());
        map.getView().setCenter(ol.proj.transform([35.39, 10.27], 'EPSG:4326', "EPSG:3857"));
        map.getView().setZoom(5);

    } else if (mapKey == "earthquakeheap") {
        var vector = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                url: 'data/2012_Earthquakes_Mag5.kml',
                format: new ol.format.KML({
                    extractStyles: false
                })
            }),
            blur: parseInt(5, 10),
            radius: parseInt(15, 10)
        });

        vector.getSource().on('addfeature', function (event) {
            // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
            // standards-violating <magnitude> tag in each Placemark.  We extract it from
            // the Placemark's name instead.
            var name = event.feature.get('name');
            var magnitude = parseFloat(name.substr(2));
            event.feature.set('weight', magnitude - 5);
        });

        speLayers.push(vector);
        map.addLayer(vector);
    } else if (mapKey == "earthquake2012") {
        var styleCache = {};
        var styleFunction = function (feature) {
            // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
            // standards-violating <magnitude> tag in each Placemark.  We extract it from
            // the Placemark's name instead.
            var name = feature.get('name');
            var magnitude = parseFloat(name.substr(2));
            var radius = 5 + 20 * (magnitude - 5);
            var style = styleCache[radius];
            if (!style) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: radius,
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 153, 0, 0.4)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255, 204, 0, 0.2)',
                            width: 1
                        })
                    })
                });
                styleCache[radius] = style;
            }
            return style;
        };

        var vector = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: 'data/2012_Earthquakes_Mag5.kml',
                format: new ol.format.KML({
                    extractStyles: false
                })
            }),
            style: styleFunction
        });

        var info = $('#info');
        info.tooltip({
            animation: false,
            trigger: 'manual'
        });

        var displayFeatureInfo = function (pixel) {
            info.css({
                left: pixel[0] + 'px',
                top: (pixel[1] - 15) + 'px'
            });
            var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });
            if (feature) {
                info.tooltip('hide')
                    .attr('data-original-title', feature.get('name'))
                    .tooltip('fixTitle')
                    .tooltip('show');
            } else {
                info.tooltip('hide');
            }
        };

        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                info.tooltip('hide');
                return;
            }
            displayFeatureInfo(map.getEventPixel(evt.originalEvent));
        });

        map.on('click', function (evt) {
            displayFeatureInfo(evt.pixel);
        });

        speLayers.push(vector);
        map.addLayer(vector);
    }

    
}