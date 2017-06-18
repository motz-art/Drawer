/**
 * Created by IntelliJ IDEA.
 * User: oleg
 * Date: 03.01.2011
 * Time: 18:30:33
 * To change this template use File | Settings | File Templates.
 */
function DrawingProvessor(curves){
    this.curves = curves;
    this.calculateSizes = function(){
        this.maxX = this.curves[0].curve.p0.x;
        this.minX = this.curves[0].curve.p0.x;
        this.maxY = this.curves[0].curve.p0.y;
        this.minY = this.curves[0].curve.p0.y;
        for(var i=1;i<this.curves.length;i++){
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