P.Plot.YTTriangle = function(points){
    goog.base(this,[]);
    this.type = P.PlotTypes.YT_TRIANGLE;
    this.fixPointCount = 3;
    this.setPoints(points);
};

goog.inherits(P.Plot.YTTriangle,ol.geom.Polygon);
goog.mixin(P.Plot.YTTriangle.prototype, P.Plot.prototype);

P.Plot.YTTriangle.prototype.generate = function() {
    var count = this.getPointCount();
    if(count < 2) {
        return;
    }else{    	
    	this.setCoordinates([this.points]);
    }
    
};