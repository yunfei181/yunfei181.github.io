
loadPlotJSFiles();

function loadPlotJSFiles() {
    var myJsFiles = ['goog/base.js',
       'goog/idisposable.js',
       'goog/disposable.js',
       'goog/eventid.js',
       'goog/event.js',
       'goog/error.js',
       'goog/nodetype.js',
       'goog/string.js',
       'goog/asserts.js',
       'goog/array.js',
       'goog/object.js',
       'goog/util.js',
       'goog/browser.js',
       'goog/engine.js',
       'goog/reflect.js',
       'goog/useragent.js',
       'goog/eventtype.js',
       'goog/browserfeature.js',
       'goog/browserevent.js',
       'goog/entrypointregistry.js',
       'goog/listenable.js',
       'goog/listener.js',
       'goog/listenermap.js',
       'goog/events.js',
       'alatu/Alatu.js',
       'alatu/Constants.js',
       'alatu/util/Utils.js',
       'alatu/util/DomUtils.js',
       'alatu/PlotTypes.js',
       'alatu/PlotUtils.js',
       'alatu/event/Event.js',
       'alatu/event/PlotDrawEvent.js',
       'alatu/plot/Plot.js',
       'alatu/plot/Arc.js',
       'alatu/plot/AttackArrow.js',
       'alatu/plot/SquadCombat.js',
       'alatu/plot/TailedAttackArrow.js',
       'alatu/plot/TailedSquadCombat.js',
       'alatu/plot/Circle.js',
       'alatu/plot/ClosedCurve.js',
       'alatu/plot/Curve.js',
       'alatu/plot/DoubleArrow.js',
       'alatu/plot/Ellipse.js',
       'alatu/plot/FineArrow.js',
       'alatu/plot/AssaultDirection.js',
       'alatu/plot/GatheringPlace.js',
       'alatu/plot/Lune.js',
       'alatu/plot/Sector.js',
       'alatu/plot/StraightArrow.js',
       'alatu/plot/Polyline.js',
       'alatu/plot/FreehandLine.js',
       'alatu/plot/Polygon.js',
       'alatu/plot/Marker.js',
       'alatu/plot/Rectangle.js',
       'alatu/plot/FreehandPolygon.js',     
       'alatu/PlotFactory.js',
       'alatu/tool/PlotDraw.js',
       'alatu/tool/PlotEdit.js'];

    var scriptTags = new Array(myJsFiles.length);
    var host = getPlotBasePath();
    for (var i = 0, len = myJsFiles.length; i < len; i++) {
        scriptTags[i] = "<script type='text/javascript' src='" + host + myJsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
}


function getPlotBasePath() {
    var scriptName = "PlotConfig.js";
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
