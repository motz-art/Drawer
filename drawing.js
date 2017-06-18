/*Drawing*/ 
function Drawing(element, startPoint, startTime){
	this.curves = [];
    this.lines = [add(startPoint,{speed:0, t:0, length:0})];
	this.mtime = startTime;
	this.group = element;

    this.drawTo=function(position){
        this.createLineTo(position);
        this.processLines();
    };

    this.stopDrawing=function(){
        this.smoothTo(this.lines.length-1);
        this.calculateSizes();
    };

    this.processLines = function(){
        var maxI = 0;
        if (this.lines.length < 4 || (maxI = this.indexOfMaxDeviation())<0)
            return;
        this.smoothTo(maxI);
    };

    this.indexOfMaxDeviation = function () {
        var curve = this.getBesierCurve(this.lines.length-1);
        var curveLength = this.getCurveLength(this.lines.length-1);

        var maxDeviation = 0;
        var maxDeviationIndex = -1;
        var position = 0;

        for (var i = 1; i < this.lines.length; i++) {
            var d = this.lines[i];
            position += d.length;
            var deviation = curve.at(position / curveLength).sub(d).length();
            if (deviation > 3 + Math.sqrt(d.speed / 10) && maxDeviation < deviation) {
                maxDeviation = deviation;
                maxDeviationIndex = i;
            }
        }
        return maxDeviationIndex;
    };

    this.createLineTo = function(position) {
        var lastPosition = this.lines[this.lines.length - 1];
        var line = this.group.createLine(lastPosition, position);
        var currentTime = (new Date()).valueOf();
        var length = lastPosition.sub(position).length();
        var speed = Math.round(length * 1000 / (currentTime - this.mtime));
        this.lines.push(add(position, {speed:speed, t:(currentTime - this.mtime), length:length, line: line}));
        this.mtime = currentTime;
    };

    this.smoothTo = function( ti ){
        var curve = this.getBesierCurve( ti );
        var curveElement = this.group.createPath();
        curveElement.addM(curve.p0);
        curveElement.addC(curve.p1, curve.p2, curve.p3);

        this.curves.push({path: curveElement, curve: curve});
        for (var i=ti; i > 1; i--)	this.lines[i].line.del();
        this.lines.splice(0,ti-1);
    };

	this.getCurveLength = function(finish){
		var result = 0;
		for (var i=1; i <= finish;i++){
			result += this.lines[i].length;
		}
		return result;
	};

	this.getBesierCurve=function( ti ){
		var curveLength = this.getCurveLength(ti);
		return pointsToBesier(this.lines[0],
			this.getPointAt(curveLength/3),
			this.getPointAt(curveLength*2/3),
			this.lines[ti]);
	};

    this.getPointAt = function(position){
        var currentPosition = 0;
        for (var i=1; i< this.lines.length;i++){
            var current = this.lines[i];
            var length = current.length;
            if (currentPosition+length >= position){
                var prev = this.lines[i-1];
                return prev.add(current.sub(prev).mul((position-currentPosition)/length));
            }else{
                currentPosition += length;
            }
        }
    };

    this.calculateSizes = function(){
        this.maxX = this.curves[0].curve.p0.x;
        this.minX = this.curves[0].curve.p0.x;
        this.maxY = this.curves[0].curve.p0.y;
        this.minY = this.curves[0].curve.p0.y;
        for(var i=0;i<this.curves.length;i++){
            for(var j=0;j<1;j+=0.1){
                var d = this.curves[i].curve.at(j);
                this.maxX = Math.max(this.maxX, d.x);
                this.minX = Math.min(this.minX, d.x);
                this.maxY = Math.max(this.maxY, d.y);
                this.minY = Math.min(this.minY, d.y);
            }
        }
        this.height = this.maxY - this.minY;
        this.width = this.maxX - this.minX;
        this.center = new Vector((this.maxX+this.minX)/2,(this.maxY+this.minY)/2);
        this.epsilon = (Math.sqrt(this.maxX-this.minX)+Math.sqrt(this.maxY-this.minY))/2;
    };
}