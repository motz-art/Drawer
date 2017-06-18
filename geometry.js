/* JavaScript charset=utf-8 */
// Geometry tools.

// Segment class;
function Segment(a,b){
	this.a = a;
	this.b = b;
	this.A = a.y - b.y;
	this.B = b.x - a.x;
	this.C = a.x*b.y - b.x*a.y;
	this.D = Math.sqrt(sqr(this.A)+sqr(this.B));
	this.length = dist(a,b);
	
	this.dist = function(segment){
		if ((this.a.x-this.b.x)*(segment.x-this.b.x)+(this.a.y-this.b.y)*(segment.y-this.b.y) <= 0) return dist(this.b,segment);
		if ((this.b.x-this.a.x)*(segment.x-this.a.x)+(this.b.y-this.a.y)*(segment.y-this.a.y) <= 0) return dist(this.a,segment);
		return Math.abs((this.A*segment.x + this.B*segment.y + this.C )/this.D);
	};
	this.cross = function(segment){
		var z = (segment.b.y-segment.a.y)*(this.b.x-this.a.x)-(segment.b.x-segment.a.x)*(this.b.y-this.a.y);
		if (z == 0){return null;}
		var ua = (segment.b.x-segment.a.x)*(this.a.y-segment.a.y)-(segment.b.y-segment.a.y)*(this.a.x-segment.a.x);
		var x = this.a.x + ua*(this.b.x-this.a.x)/z;
		var y = this.a.y + ua*(this.b.y-this.a.y)/z;
		if (((this.a.x-x)*(x-this.b.x) >= 0)&&((this.a.y-y)*(y-this.b.y) >= 0)){
			return {x:x,y:y};}
		return null;
	}
};

// Vector class;
function Vector(x,y){
	this.x = x;
	this.y = y;
	this.length = function(){
		return Math.sqrt(sqr(this.x)+sqr(this.y));
	};	
	this.add = function(v){
		return new Vector(this.x+v.x, this.y+v.y);
	};
	this.mul = function(s){
		return new Vector(this.x*s, this.y*s);
	}
	this.translate = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.toString = function(){
		return '('+this.x+','+this.y+')';
	}
	this.sub = function(v){
		return new Vector(this.x-v.x, this.y-v.y);
	};
};
function vectorFromEvent(e){
	return new Vector(e.clientX, e.clientY);
};

// Besier curve
function Besier(p0, p1, p2, p3){
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.at = function(t){
		return this.p0.mul(sq3(1-t)).add(this.p1.mul(3*t*sqr(1-t)))
			.add(this.p2.mul(3*sqr(t)*(1-t))).add(this.p3.mul(sq3(t)));
	}
	this.length = function(){
		if (!this.length){
			this.length = 0;
			for (var t=0.1;t<1;t+=0.1){
				var p1 = this.at(t-0.1);
				var P2 = this.at(t);
				this.length += p1.sub(p2).length();
			}
		}
		return this.length;
	}
};
function pointsToBesier(p0,p1,p2,p3){
	return new Besier(p0,p0.mul(-5/6).add(p3.mul(1/3)).add(p2.mul(-3/2)).add(p1.mul(3)),
		p0.mul(1/3).add(p3.mul(-5/6)).add(p1.mul(-3/2)).add(p2.mul(3)),p3);
};

// Tool functions
function sqr(x){return x*x;};
function sq3(x){return x*x*x;};
function dist(a,b){	return Math.sqrt(sqr(a.x-b.x)+sqr(a.y-b.y));};

