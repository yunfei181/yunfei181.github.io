var plotDraw, plotEdit, drawOverlay, drawStyle;

function initPlot() {
    map.on('click', function (e) {
        if (plotDraw.isDrawing()) {
            return;
        }
        var feature = map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
            return feature;
        });
        if (feature) {
            // 开始编辑
            plotEdit.activate(feature);
            activeDelBtn();
        } else {
            // 结束编辑
            plotEdit.deactivate();
            deactiveDelBtn();
        }
    });

    // 初始化标绘绘制工具，添加绘制结束事件响应
    plotDraw = new P.PlotDraw(map);
    plotDraw.on(P.Event.PlotDrawEvent.DRAW_END, onDrawEnd, false, this);

    // 初始化标绘编辑工具
    plotEdit = new P.PlotEdit(map);

    // 设置标绘符号显示的默认样式
    var stroke = new ol.style.Stroke({ color: '#FF0000', width: 2 });
    var fill = new ol.style.Fill({ color: 'rgba(0,255,0,0.4)' });
    var image = new ol.style.Circle({ fill: fill, stroke: stroke, radius: 8 });
    drawStyle = new ol.style.Style({ image: image, fill: fill, stroke: stroke });

    // 绘制好的标绘符号，添加到FeatureOverlay显示。
    drawOverlay = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    drawOverlay.setStyle(drawStyle);
    drawOverlay.setMap(map);

    $('#btn-delete').bind("click", function () {
        if (drawOverlay && plotEdit && plotEdit.activePlot) {
            drawOverlay.getSource().removeFeature(plotEdit.activePlot);
            plotEdit.deactivate();
            deactiveDelBtn();
        }
    });
}

// 绘制结束后，添加到FeatureOverlay显示。
function onDrawEnd(event) {
    var feature = event.feature;
    drawOverlay.getSource().addFeature(feature);
    // 开始编辑
    plotEdit.activate(feature);
    activeDelBtn();
}

// 指定标绘类型，开始绘制。
function activate(type) {
    plotEdit.deactivate();
    plotDraw.activate(type);
};

function activeDelBtn() {
    $('#btn-delete').css("display", 'inline-block');
}

function deactiveDelBtn() {
    $('#btn-delete').css("display",'none');
}