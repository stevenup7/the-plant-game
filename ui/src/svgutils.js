

var randomInt = require('./gene').randomInt;
var Point = require('./math2d').Point;

class SVGUtils {

  constructor () {
    this.stroke = '#333';
    this.strokeWidth = 1;
    this.jitter = false;
    this.jitterLength = 10;
    this.num_iterations = 2;
  }

  setJitter (length, size) {
    if (typeof length === 'boolean') {
      this.jitter = length;
      this.jitterLength = 10;
      this.jitterSize = 10;
    } else {
      this.jitter = true;
      this.jitterLength = length;
      this.jitterSize = size;
    }
  }

  drawLine (p1, p2, withJitter=true) {
    if (this.jitter && withJitter) {
      return this._drawJitterLine(p1, p2);
    } else {
      return this._canvas.line(p1.x, p1.y, p2.x, p2.y).attr({
        stroke: this.stroke
      });
    }
  }

  drawCircle (p, radius, bg = 'white') {
    var c = this._canvas.circle(p.x, p.y, radius);
    c.attr('strokeWidth', 1);
    c.attr('fill', bg);
    //line.attr('strokeDasharray', '4, 10');
    c.attr('stroke', this.stroke);
    return c;
  }

  getOvalRadius (ang, width, height, jitter=2) {
    var rad;
    var ratio;
    ang = (ang - 90) * (Math.PI/180);
    rad = (width * height) /
      Math.sqrt(
        (width * width * (Math.sin(ang) * Math.sin(ang))) +
          (height * height * (Math.cos(ang) * Math.cos(ang)))
      );
    return rad;
  }

  drawOval (c, rtop, rleft, rbottom, rrigth, bgcol = 'none', startAngle=0, finishAngle=360) {
    var pstart;
    var pend;
    var closed = true;
    var returnLines = [];
    if (startAngle !== 0 || finishAngle !== 360) {
      closed = false;
    }
    // approximate circumference
    var avgRadius = (rtop + rleft + rbottom + rrigth) / 4;
    var circumference = 2 * Math.PI * avgRadius;
    var numSteps = Math.max(Math.floor(circumference / this.jitterLength), 12); //at least 6 segments

    var angleStep = 360 / numSteps;

    // using angle steps does not really work as at the steep end of
    var pts;
    var bgIteration = 0;
    if (bgcol !== 'none') {
      bgIteration = 1;
    }
    console.log('steps', numSteps, 'angleStep',angleStep, 'iters', this.num_iterations + bgIteration );

    for(var x = 0; x < this.num_iterations + bgIteration; x++) {
      pts = [];
      //var numSteps = (finishAngle - startAngle) / angleStep;
      pstart = c.pointAtAngleDeg(startAngle, this.getOvalRadius(startAngle, rrigth, rtop));
      pts.push(pstart.toArray());
      var ang = startAngle;

      for(var i = 1 ; i < numSteps; i++) {
        ang = startAngle + angleStep * i;

        if (ang < 90) {
          pend = c.pointAtAngleDeg(ang, this.getOvalRadius(ang, rrigth, rtop));
        } else if (ang < 180){
          pend = c.pointAtAngleDeg(ang, this.getOvalRadius(ang, rrigth, rbottom));
        }  else if (ang < 270){
          pend = c.pointAtAngleDeg(ang, this.getOvalRadius(ang, rleft, rbottom));
        } else {
          pend = c.pointAtAngleDeg(ang, this.getOvalRadius(ang, rleft, rtop));
        }
        pts.push(pend.toArray());
        pstart = pend;
      }

      if (typeof pend === 'undefined') {
        debugger;
      }

      if (this._canvas === undefined) {
        console.log('early exit for no canvas');
        return pts;
      }
      // pts.push(pend.toArray());
      if (x === 0 && bgcol !== 'none') {
        returnLines.push(this.renderArrayLines(pts, closed, bgcol));
      } else {
        returnLines.push(this.renderArrayLines(pts, closed));
      }
    }
    return returnLines;
  }

  renderArrayLines (pts, closed=true, fill='none') {
    var svgString;

    if (this.jitter) {
      svgString =
        'M ' + (pts[0][0] + randomInt(-this.jitterSize, this.jitterSize)) +
        ' '  + (pts[0][1] + randomInt(-this.jitterSize, this.jitterSize));
    } else {

      svgString = 'M ' + pts[0][0] + ' ' + pts[0][1];
    }

    for(var i = 1; i < pts.length; i++) {
      if (this.jitter) {
        svgString +=
          'L ' + (pts[i][0] + randomInt(-this.jitterSize, this.jitterSize)) +
          ' '  + (pts[i][1] + randomInt(-this.jitterSize, this.jitterSize));
      } else {
        svgString +=  ' L ' + pts[i][0] + ' ' + pts[i][1];
      }
    }
    if (closed) {
      svgString += ' z';
    }

    return this._canvas.path(svgString).attr({
      fill: fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth
    });
  }


  _drawJitterLine (p1, p2) {
    var len = p1.distanceTo(p2);
    var steps = Math.floor(len / this.jitterLength);

    if (steps === 0) {
      return this.renderArrayLines([p1.toArray(), p2.toArray()]);
    }

    var pStart;
    var pEnd;

    var dx = (p2.x - p1.x) / steps;
    var dy = (p2.y - p1.y) / steps;

    var pts;

    for(var x = 0; x < this.num_iterations; x++) {
      pStart = p1.copy();
      pts = [pStart.toArray()];

      for(var i = 0; i <= steps ; i++) {
        pEnd = new Point(
          p1.x + dx * i,
          p1.y + dy * i
        );

        if ( isNaN(pEnd.x) || isNaN(pEnd.y)) {
          console.log(pEnd.toString());
          throw('bad calc of pEnd');
        }
        pts.push(pEnd.toArray());
        pStart = pEnd;
      }
      this.renderArrayLines(pts, false);

    }
    return true;
  }

}

module.exports = SVGUtils;
