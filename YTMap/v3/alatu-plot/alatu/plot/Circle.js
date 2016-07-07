
P.Plot.Circle = function(points){
    goog.base(this, []);
    this.type = P.PlotTypes.CIRCLE;
    this.fixPointCount = 2;
    this.setPoints(points);

    //var stroke = new ol.style.Stroke({ color: '#0000FF', width: 2 });
    //var fill = new ol.style.Fill({ color: 'rgba(0,255,0,0.4)' });
    //var image = new ol.style.Circle({ fill: fill, stroke: stroke, radius: 8 });
    //this.drawStyle = new ol.style.Style({ image: image, fill: fill, stroke: stroke });
}

goog.inherits(P.Plot.Circle, ol.geom.Polygon);
goog.mixin(P.Plot.Circle.prototype, P.Plot.prototype);

P.Plot.Circle.prototype.generate = function(){
    var count = this.getPointCount();
    if(count < 2) {
        return;
    }
    var center = this.points[0];
    var radius = P.PlotUtils.distance(center, this.points[1]);
    this.setCoordinates([this.generatePoints(center, radius)]);
};

P.Plot.Circle.prototype.generatePoints = function(center, radius){
    var x, y, angle, points=[];
    for(var i=0; i<= P.Constants.FITTING_COUNT; i++){
        angle = Math.PI*2*i/ P.Constants.FITTING_COUNT;
        x = center[0] + radius*Math.cos(angle);
        y = center[1] + radius*Math.sin(angle);
        points.push([x,y]);
    }
    return points;
};

