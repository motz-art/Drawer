/* JavaScript charset=utf-8 */
// Drawer main functionality.
debuging = true;
debugSvg = false;
debugPoint = false;

function createDrawer(element){
	adde(element,{
		contextmenu:function(event){
			stop(event);//prevent popup menu;
		},
		mousedown : function(event){
			if (event.button==0){	
				if (!this.textEditing){
					this.readyForTextEditing = true;
				}

				this.readyForDrawing = true;
				this.setStartingPoint(vectorFromEvent(event));
			}
			if (this.textEditing){
				this.stopEditingText();
			}
			stop(event);
		},
		mousemove : function(event){
			var position = vectorFromEvent(event);
			if (this.isDrawing){
				this.drawing.drawTo(position);
			}else if (this.readyForDrawing && this.isMoved(position)){
				this.readyForDrawing = false;
				this.isDrawing = true;
				this.startDrawing(position);
			}
			stop(event);
		},
		mouseup:function(event){
			stop(event);
			if (this.isDrawing){
				this.isDrawing = false;				
				this.stopDrawing();
			}else if (this.readyForTextEditing){
				this.startTextEditing(event.clientX, event.clientY, event.target);				
			}
			if (this.readyForTextEditing){
				this.readyForTextEditing = false;
			}
			if (this.readyForDrawing){
				this.readyForDrawing = false;
			}
		}
	});
	add(element,{
		//Drawing functionality;
		isMoved:function(position){
			return this.startPoint.sub(position).length() > 3;
		},
		startDrawing:function(){
			this.drawing = new Drawing(this.group = this.createGroup(), this.startPoint, this.mouseTime);
		},
		setStartingPoint:function(position){
			this.startPoint = position;
			this.mouseTime = (new Date()).valueOf();
		},
		stopDrawing:function(){
			//finishing curve;
			this.drawing.stopDrawing();

			var curves = this.drawing.curves;

			//Non shape processing;
			if (dist(curves[0].curve.p0,curves[curves.length-1].curve.p3) > this.drawing.epsilon){//is closed.
				//Process connections;
				var A = findConnection(this, curves[0].curve.p0);
				var B = findConnection(this, curves[curves.length-1].curve.p3);
				if (A!=false && B!=false){
					this.group.clearChilds();
					createLink(this,A,B);
				}else if (this.prev && this.processCross()){//cross processing
				}else{
					this.prev = {group: this.group, drawing:this.drawing};
				}
				return;
			}

			if (this.processEllipse()){
				return;
			}
			this.processPolygon();
		},
		//
		// Ellipse recognition;
		//
		processEllipse: function(){
			var radius = this.drawing.height/2;
			var center = this.drawing.center;
			var sizeProportion = this.drawing.width/this.drawing.height;

			if (this.isEllipse(this.drawing.curves, center, radius, sizeProportion)){
				this.createEllipse(center, radius, sizeProportion);				
				return true;
			}
			return false;
		},
		isEllipse: function(dots, center, radius, sizeProportion){
			for (var i=0;i<dots.length;i++){
				for(var j=0;j<1;j+=5/dots[i].curve.length()){ //check every 5-th pixel.
					var dot = dots[i].curve.at(j);
					var currentRadius = Math.sqrt(sqr((dot.x-center.x)/sizeProportion)+sqr(dot.y-center.y));
					if (sqr(currentRadius-radius) > radius) return false;
				}
			}
			return true;
		},
		createEllipse: function(center, radius, sizeProportion){
			this.group.clearChilds();
			shape(this.group.createEllipse(center.x,center.y,radius*sizeProportion,radius), center).add({//Todo: move to Connection functionality.
				findConnection:function(point){ //Todo: rename to 'closeTo'
					return Math.abs(Math.sqrt(sqr((point.x - this.center.x) / sizeProportion) +
                            sqr(point.y - this.center.y)) - radius) < radius * 0.05;
				},
				getConnectionPoint:function(point){
					var d = Math.sqrt(sqr((point.x-this.center.x)/sizeProportion)+sqr(point.y-this.center.y));
					return {x:(point.x-this.center.x)*radius/d+this.center.x, y:(point.y-this.center.y)*radius/d+this.center.y};
				}
			});
		},

		processPolygon:function(){
			var arr = this.drawing.curves;
			if (arr.length > 2){
				//aligment
				for (var i=0; i<arr.length;i++){
					for (var j=0; j<arr.length;j++){
						if (i==j) continue;
						if (Math.abs(arr[i].curve.p0.x - arr[j].curve.p0.x) < 0.2*(arr[i].curve.p0.y - arr[j].curve.p0.y)){
							mid = (arr[i].curve.p0.x + arr[j].curve.p0.x)/2;
							arr[i].curve.p0.x = mid;
							arr[j].curve.p0.x = mid;
						}
						if (Math.abs(arr[i].y - arr[j].y) < 0.2*(arr[i].x - arr[j].x)){
							mid = (arr[i].y + arr[j].y)/2;
							arr[i].curve.p0.y = mid;
							arr[j].curve.p0.y = mid;
						}
					}
				}
				this.group.clearChilds();
				var poly = this.group.createPolygon();
				for (var i=0;i<arr.length;i++){	poly.addPoint(arr[i].curve.p0); }
				shape(poly,this.drawing.center);
				poly.add({
					findConnection:function(p){
						p = {x:p.x-this.transl.x, y:p.y-this.transl.y};
						d0 = this.points.getItem(this.points.numberOfItems-1);
						for	(i=0;i < this.points.numberOfItems;i++){
							d1 = this.points.getItem(i);
							var l = new Segment(d0,d1);
							var d = l.dist(p);
							if (d < 10)
								return true;
							d0=d1;
						}
						return false;
					},
					getConnectionPoint:function(p){
						p = {x:p.x-this.transl.x, y:p.y-this.transl.y};
	
						d0 = this.points.getItem(this.points.numberOfItems-1);
						var r = d0
						var rd = dist(d0,p);
	
						for	(i=0;i < this.points.numberOfItems;i++){
							d1 = this.points.getItem(i);
							var nd = dist(d1,p);
							if (nd < rd){
								rd = nd;
								r = d1;
							}
							mp = {x:(d0.x+d1.x)/2, y:(d0.y+d1.y)/2}
							var nd = dist(mp,p);
							if (nd < rd){
								rd = nd;
								r = mp;
							}
							d0=d1;
						}
						return {x:r.x+this.transl.x, y:r.y+this.transl.y};
					}
				})
			}
		},

		//
		//Text functionality;
		//
		textArea : document.getElementById('textTyping'),
		startTextEditing : function(x,y,place){
			this.textEditing = true;
			this.textPlace = place;
			if (place.nodeName=='text'){
				x = place.x.baseVal.getItem(0).value-4;
				y = place.y.baseVal.getItem(0).value-16;
				this.textArea.value = (node = place.firstChild).nodeValue;
				node.nodeValue = '';
			}else{
				this.textArea.value = '';
			}
			this.textPosition = {x:x, y:y};
			this.textArea.style.left = x+'px';
			this.textArea.style.top = y+'px';
			this.textArea.style.visibility = 'visible';
			this.textArea.selectionStart = 0;
			this.textArea.selectionEnd = 0;
			this.textArea.focus();
		},
		stopEditingText : function(){
			this.textEditing = false;
			this.textArea.style.visibility = 'hidden';
			var t = this.textArea.value;

			if (t!=''){
				if (this.textPlace.nodeName=='text'){
					this.textPlace.firstChild.nodeValue = t;
				}else{
					var svg = this;
					var textElement = this.createText(this.textPosition.x+4, this.textPosition.y+16, t, 'monospace', '13px').
					add({
						owner: this.textPlace,
						update: function (){
							var b = this.getBBox();
							this.set({x: this.owner.center.x - b.width/2,y:this.owner.center.y - b.height/2});
						}
					});
					if (this.textPlace != this){
						this.textPlace.links.push(textElement);
						textElement.update();
					}
				}
			}
		},
		// Crossing functionality.
		deleteElement: function(element){
			if (element!=this){
				if (element.links){
					while (element.links.length > 0){
						element.links[0].del();
					}
				}
				if (element.parentNode){
					if (typeof(element.parentNode.del)=='function'){
						element.parentNode.del();
					}else{
						element.del();
					}
				}
			}
		},
		processCross: function(){
			var a = new Segment(this.drawing.curves[0].curve.p0, this.drawing.curves[this.drawing.curves.length-1].curve.p3);
			var c = a.cross(new Segment(this.prev.drawing.curves[0].curve.p0, this.prev.drawing.curves[this.prev.drawing.curves.length-1].curve.p3));
			if (c!= null){
				this.group.del();
				this.prev.group.del();
				try{
					var list = this.getIntersectionList(add(this.createSVGRect(),{x: c.x-5, y: c.y-5, height: 10, width: 10}),null);
					for (i=0; i< list.length;i++){
						this.deleteElement(list[i]);
					}
				}
				catch(exception){
					this.deleteElement(this.doc.elementFromPoint(c.x,c.y));
				}
				this.prev = null;
				return true;
			}
		}
	});
	if (debuging){
		debugSvg = element;
		debugPoint = element.createCircle(0,0,5).set({'z-index':100});
	}
	debug = function(x,y){
		if (debuging){
			if (!y)
				debugPoint.set({cx:x.x,cy:x.y});
			else
				debugPoint.set({cx:x,cy:y});
		}
	}
	return element;
};
function shape(element, center){
	//dragable;
	element.add({transl : new Vector(0,0),
		center:center,
		links: new Array(),
		drag: function(event){
			var mouse = vectorFromEvent(event);
			var delta = mouse.sub(this.mouse);
			this.transl.translate(delta);
			this.center.translate(delta);
			this.set({transform:'translate'+this.transl.toString()});
			this.mouse = mouse;

			event.stopPropagation();
			event.preventDefault();
			event.returnValue = false;
		}
	});
	element.set({
		mouseout:function(event){
			if (this.down){
				this.drag(event);
				return false;
			}
		},
		mousedown:function(event){
			if (event.button==2){
				this.moved = false;
				this.mouse = {x:event.clientX, y :event.clientY};
				this.down = true;
				event.preventDefault();
				event.returnValue = false;
				return false;
			}
		},
		mousemove:function(event){
			if (this.down){
				this.moved = true;
				this.drag(event);
				for(var i=0;i<this.links.length;i++){
					this.links[i].update();
				}
				return false;
			}
		},
		mouseup:function(event){
			if (this.down){
				this.down = false;
				if (this.moved)
					event.stopPropagation();
				event.preventDefault();
				event.returnValue = false;
				return false;
			}
		}});
	return element;
}


function findConnection(element, p){
	for (var i=0;i<element.childNodes.length;i++){
		if (typeof(element.childNodes[i].findConnection)=='function'){
			if (element.childNodes[i].findConnection(p)){return element.childNodes[i];}
		}else{
			var r = findConnection(element.childNodes[i], p);
			if (r!=false) return r;
		}
	}
	return false;
}

function createLink(element,A,B){
	var am = A.center;
	var bm = B.center;
	var pointA = {shape: A,
		update:function(){
			this.link.update();
		},
		del:function(){
			this.link.del();
		}
	}
	A.links.push(pointA);
	var pointB = {shape: B,
		update:function(){
			this.link.update();
		},
		del:function(){
			this.link.del();
		}
	}
	B.links.push(pointB);
	var am = A.center;
	var bm = B.center;
	var line = element.group.createLine(am,bm);
	var link = {
		link: line,
		A:A,
		B:B,
		update:function(){
			var am = this.A.center;
			var bm = this.B.center;
			var p1 = this.A.getConnectionPoint(bm);
			var p2 = this.B.getConnectionPoint(am);
			this.link.set({x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y});
		},
		del:function(){
			var l = pointA.shape.links
			for(i=0;i<l.length;i++) if (l[i]==pointA){
				l.splice(i,1);
				break;
			}
			var l = pointB.shape.links
			for(i=0;i<l.length;i++) if (l[i]==pointB){
				l.splice(i,1);
				break;
			}
			this.link.del();
		}
	};
	line.links = [link];
	pointA.link = link;
	pointB.link = link;
	link.update();
	return link;
}
function stop(event){
	event.stopPropagation();
	event.preventDefault();
	event.returnValue = false;
}