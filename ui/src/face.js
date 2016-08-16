var GeneSet   = require('./gene').GeneSet;
var randomInt = require('./gene').randomInt;
var Point     = require('./math2d').Point;
var Line      = require('./math2d').Line;
var SColor    = require('./colors').SColor;

var MAX_DEPTH = 4;
var DRAW_DEBUG = false;
var NUM_ITERATIONS = 3;

var FACE_GENES = {
  general: {
    hasRandomness:    ["int",  0,    1],
    structure:        ["int",  0,    1]
  },
  face: {
    width:            ["int", 20,   90],
    heightTop:        ["int", 20,   90],
    heightBottom:     ["int", 20,   90]
  },
  eyes: {
    style:           ["int",   0,    4],
    size:            ["int",   0,  100],
    separtion:       ["int",  5,   90]
  },
  eyebrows: {
    tilt:            ["int", -10, 10],
    width:           ["int", 20, 60]
  },
  nose: {
    style:           ["int",   0,    4],
    height:          ["int",   0,  100],
    width:           ["int",  20,   90]
  },
  mouth: {
    height:          ["int", 20, 90],
    width:           ["int", 20, 90],
    up:              ["int", -10, 10],
    center:          ["int", 0, 100]
  }
};

var lineColor = '#333';

class Face {
  constructor (canvas, initializeRandom = true) {
    this._canvas = canvas;
    this.genes = new GeneSet(FACE_GENES);
    if (initializeRandom) {
      this.genes.randomize();
    }
  }

  draw () {
    // reset leaf nodes
    // return false;
    //Math.seedrandom("face");
    this._width = this._canvas.node.clientWidth;
    this._height = this._canvas.node.clientHeight;
    this.center = new Point(this._width/2, this._height/2);

    this.centerLineH = new Line(
      new Point(this._width/2, this._height),
      new Point(this._width/2, 0)
    );

    this.centerLineV = new Line(
      new Point(0, this._height / 2),
      new Point(this._width, this._height / 2)
    );

    if (DRAW_DEBUG) {
      this.drawDebugLine(this.centerLineH);
      this.drawDebugLine(this.centerLineV);
    }

    this.faceBorder();
    this.eyes();
    this.mouth();
    this.nose();
    Math.seedrandom();
  }

  swap (otherFace) {
    var temp = {
      genes: otherFace.genes
    };
    otherFace.genes = this.genes;
    this.genes = temp.genes;
  }


  nose () {
    var width      = this.genes.get('nose',     'width') / 100 *  (this._width/4);
    var height     = this.genes.get('nose',     'height') / 100 *  (this._height/4);
    var style      = this.genes.get('nose',     'style');
    var c = this.center;

    var top = new Point(c.x, c.y - height / 2);
    var bottomR =  new Point(c.x + width / 2, c.y + height / 2);
    var bottomL =  new Point(c.x - width / 2, c.y + height / 2);
    this.drawJitterLine(top, bottomR);
    this.drawJitterLine(bottomR, bottomL);
  }

  eyes () {
    var width         = this.genes.get('face',     'width') / 100 *  (this._width/2);
    var separtion     = this.genes.get('eyes',     'separtion') / 100 *  (this._width/2);
    var style         = this.genes.get('eyes',     'style') / 100 *  (this._width/2);
    var size          = this.genes.get('eyes',     'size');
    var eyebrowTilt   = this.genes.get('eyebrows', 'eyebrowTilt');
    var eyebrowWidth  = this.genes.get('eyebrows', 'eyebrowWidth');

    var c = this.center;
    var cl = new Point(c.x - separtion, c.y);
    var cr = new Point(c.x + separtion, c.y);

    var drawPupils = true;
    var drawOuter = true;

    switch(style) {
    case 0:
      drawOuter = false;
      break;
    default:
      drawOuter = true;
    }

    var eyeWidth  = 20 * size / 100;
    var eyeHeight = 10 * size / 100;

    if (drawOuter) {
      if (style === 1) {
        // this.drawOval(cl, eyeHeight, eyeWidth , eyeHeight, eyeWidth, lineColor, 'white', -65, 180);
        // this.drawOval(cr, eyeHeight, eyeWidth , eyeHeight, eyeWidth, lineColor, 'white', -180, 65);

        this.drawJitterOval(cl, eyeHeight, eyeWidth , eyeHeight, eyeWidth, lineColor, 'white', -65, 180);
        this.drawJitterOval(cr, eyeHeight, eyeWidth , eyeHeight, eyeWidth, lineColor, 'white', -180, 65);
      } else {
        this.drawJitterOval(cl, eyeHeight, eyeWidth , eyeHeight, eyeWidth, lineColor, 'white');
        this.drawJitterOval(cr, eyeHeight, eyeWidth , eyeHeight, eyeWidth, lineColor, 'white');
      }

    }

    if (drawPupils) {
      this.drawCircle(cl, 2,  lineColor, lineColor);
      this.drawCircle(cr, 2,  lineColor, lineColor);
    }

  }

  mouth () {
    var width        = this.genes.get('face', 'width')   / 100 *  (this._width/2);
    var height       = this.genes.get('face', 'heightBottom')  / 100 *  (this._height/2);
    var mouthHeight  = this.genes.get('mouth', 'height') / 100 *  height;
    var mouthWidth   = this.genes.get('mouth', 'width')  / 100 *  width;
    var mouthUp      = this.genes.get('mouth', 'up');
    var mouthCenter  = this.genes.get('mouth', 'center') / 100 * mouthWidth;

    var c = this.center;
    var mLeft = new Point(c.x - mouthWidth, c.y + mouthHeight);
    var mRight = new Point(c.x + mouthWidth, c.y + mouthHeight);
    var mCenter = new Point(c.x - mouthWidth + mouthCenter, c.y + mouthHeight + mouthUp);
    //this.drawLine(cl, cr, 'blue');
    this.drawJitterLine(mLeft, mCenter, 'red');
    this.drawJitterLine(mCenter, mRight, 'red');

  }

  faceBorder () {
    var width        = this.genes.get('face', 'width') / 100 *  (this._width/2);
    var heightTop    = this.genes.get('face', 'heightTop') / 100 * (this._height/2);
    var heightBottom = this.genes.get('face', 'heightBottom') / 100 * (this._height/2);
    var c = this.center;
    this.drawJitterOval(c, heightTop, width, heightBottom, width, lineColor, '#FDEDD6');
  }

  drawJitterLine (p1, p2, color=lineColor) {
    var len = p1.distanceTo(p2);
    var steps = Math.floor(len / 10);

    // todo jitter on this
    if (steps === 0) {
      return false;
    }

    var pStart;
    var pEnd;
    var j= [-0.5, 0.5];
    // var j= [0, 0];

    var dx = (p2.x - p1.x) / steps;
    var dy = (p2.y - p1.y) / steps;


    for(var x = 0; x < NUM_ITERATIONS; x++) {
      pStart = p1.copy();
      for(var i = 0; i <= steps ; i++) {
        pEnd = new Point(
          p1.x + dx * i + randomInt(j[0], j[1]) ,
          p1.y + dy * i + randomInt(j[0], j[1])
        );
        if ( isNaN(pEnd.x)) {
          debugger;
          console.log(pEnd.toString());
        }

        this.drawLine(pStart, pEnd, color);
        pStart = pEnd;
      }
    }
    //this.drawLine(pStart, p2, color);
    //this.drawLine(pStart, p2, color);
    return true;
  }

  drawLine (p1, p2, color=lineColor) {
    var line = this._canvas.line(p1.x, p1.y, p2.x, p2.y).attr({
      stroke: color
    });
  }

  drawCircle (p, radius, stroke = lineColor, bg = 'white') {
    var c = this._canvas.circle(p.x, p.y, radius);
    c.attr('strokeWidth', 1);
    c.attr('fill', bg);
    //line.attr('strokeDasharray', '4, 10');
    c.attr('stroke', stroke);
    return c;
  }

  getFaceRadius (ang, width, height, jitter=2) {
    var rad;
    var ratio;
    ang = (ang - 90) * (Math.PI/180);
    rad = (width * height) /
      Math.sqrt(
        (width * width * (Math.sin(ang) * Math.sin(ang))) +
          (height * height * (Math.cos(ang) * Math.cos(ang)))
      );
    return rad + randomInt(jitter * -1, jitter);
  }

  drawJitterOval (c, rtop, rleft, rbottom, rrigth, col, bgcol = 'none', startAngle=0, finishAngle=360) {
    var pstart;
    var pend;
    var avgRadius = (rtop + rleft + rbottom + rrigth) / 4;
    var angleStep = 90;
    var jitter = 1;
    var pts;

    if (avgRadius < 30)  {
      angleStep = 20;
      jitter = 0.5;
    } else {
      angleStep = 5;
    }

    for(var x = 0; x < NUM_ITERATIONS; x++) {
      pts = [];

      var numSteps = (finishAngle - startAngle) / angleStep;
      pstart = c.pointAtAngleDeg(startAngle, this.getFaceRadius(startAngle, rrigth, rtop, jitter));
      var ang = startAngle;
      //for(var ang = startAngle + angleStep; ang <= finishAngle; ang += angleStep) {
      for(var i = 1 ; i <= numSteps; i++) {
        ang = startAngle + angleStep * i;

        if (ang < 90) {
          pend = c.pointAtAngleDeg(ang, this.getFaceRadius(ang, rrigth, rtop, jitter));
        } else if (ang < 180){
          pend = c.pointAtAngleDeg(ang, this.getFaceRadius(ang, rrigth, rbottom, jitter));
        }  else if (ang < 270){
          pend = c.pointAtAngleDeg(ang, this.getFaceRadius(ang, rleft, rbottom, jitter));
        } else {
          pend = c.pointAtAngleDeg(ang, this.getFaceRadius(ang, rleft, rtop, jitter));
        }
        pts.push(pstart.toArray());
        this._canvas.line(pstart.x, pstart.y, pend.x, pend.y).attr({
          stroke: col,
          fill: '#efefef'
        });
        pstart = pend;
      }
      pts.push(pend.toArray());
      if (x === 0) {
        this.renderArray(pts, true, lineColor, bgcol);
      } else {
        this.renderArray(pts, true, lineColor);
      }
    }

    // this.drawDebugPoint(c.pointAtAngleDeg(-90,  rleft),   'blue');
    // this.drawDebugPoint(c.pointAtAngleDeg(  0,  rtop),    'green');
    // this.drawDebugPoint(c.pointAtAngleDeg( 90,  rrigth),  'red');
    // this.drawDebugPoint(c.pointAtAngleDeg(180,  rbottom), 'purple');

  }

  renderArray (pts, closed=true, stroke='red', fill='none') {
    var svgString = 'M ' + pts[0][0] + ' ' + pts[0][1];
    for(var i = 1; i < pts.length; i++) {
      svgString +=  ' L ' + pts[i][0] + ' ' + pts[i][1];
    }
    if (closed) {
      svgString += ' z';
    }
    return this._canvas.path(svgString).attr({
      fill: fill,
      stroke: stroke,
      strokeWidth: 1
    });
  }

  drawDebugLine (l) {
    var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
    line.attr('strokeWidth', 1);
    line.attr('strokeDasharray', '4, 10');
    line.attr('stroke', 'rgba(255,0,0,0.5)');
  }

  drawDebugPoint (p, c) {
    var line = this._canvas.circle(p.x, p.y, 5);
    line.attr('strokeWidth', 1);
    line.attr('fill', 'white');
    //line.attr('strokeDasharray', '4, 10');
    line.attr('stroke', c);
  }

}


module.exports = Face;
