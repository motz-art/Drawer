/* JavaScript ccharset=utf-8 */
//SVG Library;
Array.prototype.select = function(f){
	var result = new Array();
	for(i=0;i<this.length;i++){
		if (this[i]!=undefined){
			result[i] = f(this[i]);
		}
	}
	return result;
}
function add(e,p){
	for(k in p){
		e[k] = p[k];
	}
	return e;
};
function adde(e,p){
	for(k in p){
		if (p[k]!=null){
			if (typeof(p[k]) == 'function'){e.addEventListener(k, p[k], false);}
			else{e.setAttribute(k,p[k]);}}
	}
	return e;
}

svgns = "http://www.w3.org/2000/svg";
function createElement(name, p){
	var e = this.doc.createElementNS(svgns, name);
	adde(e,p);
	this.appendChild(e);
	add(e,{
		set : function(p){return adde(this,p);},
		add : function(p){return add(this,p);},
		del : function(){this.parentNode.removeChild(this);},
		doc : this.doc
	});
	return e;
}
function initElement(e){
add(e,{
		doc : e.ownerDocument,
		create : createElement,
		createLine:function ( a, b, opacity, color, width ){return this.create('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,opacity:opacity,stroke:color||'black','stroke-width':width||1});},
		createCircle:function(x,y,r,fill,color,width){return this.create('circle',{cx:x, cy:y, r:r||10,fill:fill||null,stroke:color||null,'stroke-width':width||null});},
		createEllipse:function(cx,cy,rx,ry,color,fill,width){return this.create('ellipse',{cx:cx,cy:cy,rx:rx,ry:ry,stroke:color,fill:fill,'stroke-width':width||null});},
		createGroup:function(){return initElement(this.create('g',{}));},
		createPolygon:function(color,fill,width){return this.create('polygon',{stroke:color||null,fill:fill||null,'stroke-width':width||null})
			.add({addPoint: function(p){
				var point = this.doc.childNodes[1].createSVGPoint();
				point.x = p.x; point.y = p.y;
				this.points.appendItem(point);}});},
		createPath:function(color, fill, width){return this.create('path',{stroke:color||null, fill:fill||null, 'stroke-width':width||null})
			.add({
				addM:function(p){
					var moveTo = this.createSVGPathSegMovetoAbs(p.x,p.y);
					this.pathSegList.appendItem(moveTo);
				},
				addC:function(p1,p2,p3){
					var curveTo = this.createSVGPathSegCurvetoCubicAbs(p3.x,p3.y,p1.x,p1.y,p2.x,p2.y);
					this.pathSegList.appendItem(curveTo);
				}
			})
		},
		createText:function(x,y,text,font,size){
			var txt = this.create('text',{x:x,y:y,'font-family':font,'font-size':size})
				.add({setText:function(t){
					while (this.childNodes.length > 0){
						this.removeChild(this.firstChild);
					}
					this.appendChild(this.doc.createTextNode(t));					
				}});
			txt.setText(text);
			return txt;
		},
		clearChilds:function(){
			while (this.childNodes.length > 0 ){
				this.removeChild( this.firstChild );
			}			
		}
	});
return e;
}
function getSVG(id){	
	var svg = document.getElementById(id).contentDocument.childNodes[1];
	initElement(svg);	
	return svg;
};
