/**
 * Created by IntelliJ IDEA.
 * User: oleg
 * Date: 03.01.2011
 * Time: 14:27:03
 * To change this template use File | Settings | File Templates.
 */
var groupMock = {
    createLine:function(a,b){}
};
window.testSets.drawing = {
    curveLength:function(){
        var drawing = new Drawing(groupMock, new Vector(0,0), 0);
        drawing.lines[0] = add(new Vector(0,0),{speed:200, length:10});
        drawing.lines.push(add(new Vector(10,0),{speed:200, length:10}));
        drawing.lines.push(add(new Vector(30,0),{speed:300, length:20}));
        drawing.lines.push(add(new Vector(40,0),{speed:200, length:10}));
        var length = drawing.getCurveLength(drawing.lines.length-1);
        if (length!=40)
            return 'wrong length!';

        var i = drawing.indexOfMaxDeviation();
        if (i!=-1)
            return 'wrong index!';

        return 'pass';
    },
    maxDeviation:function(){
        var drawing = new Drawing(groupMock, new Vector(0,0), 0);
        drawing.lines[0] = add(new Vector(0,0),{speed:1, length:10});
        drawing.lines.push(add(new Vector(10,10),{speed:1, length:Math.sqrt(200)}));
        drawing.lines.push(add(new Vector(30,30),{speed:1, length:Math.sqrt(800)}));
        drawing.lines.push(add(new Vector(40,0),{speed:1, length:Math.sqrt(1000)}));

        var i = drawing.indexOfMaxDeviation();
        if (i!=2)
            return 'wrong index!';

        return 'pass';
    }
}