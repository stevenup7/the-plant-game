var GeneSet   = require('./gene').GeneSet;
var randomInt = require('./gene').randomInt;
var Point     = require('./math2d').Point;
var Line      = require('./math2d').Line;
var SColor    = require('./colors').SColor;
var SVGUtils  = require('./svgutils');

var DRAW_DEBUG = true;


var FACE_GENES = {
  general: {
    hasRandomness:    ["int",  0,    1],
    structure:        ["int",  0,    1]
  },
  drawing: {
    hasJitter:        ["int",  0,    1],
    jitterIterations: ["int",  1,    5],
    jitterLength:     ["int",  5,    15],
    jitterSize:       ["int",  1,    3]
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
    width:           ["int", 20, 60],
    up:              ["intArray", 3, -10, 10],
    center:          ["int", 0, 100]
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
    this.svg = new SVGUtils();
    this.svg._canvas = this._canvas;
    this.svg.stroke = lineColor;

    this.genes = new GeneSet(FACE_GENES);
    if (initializeRandom) {
      this.genes.randomize();
    }
  }

  draw () {
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
      console.log('dbg');
      this.drawDebugLine(this.centerLineH);
      this.drawDebugLine(this.centerLineV);
    }

    var hasJitter     = (this.genes.get('drawing',     'hasJitter') === 1);
    var jitterIterations  = this.genes.get('drawing',     'jitterIterations');
    var jitterLength  = this.genes.get('drawing',     'jitterLength');
    var jitterSize    = this.genes.get('drawing',     'jitterSize');

    if (hasJitter) {
      this.svg.num_iterations = jitterIterations;
      this.svg.setJitter(jitterLength, jitterSize);
    } else {
      this.svg.num_iterations = 2;
      this.svg.setJitter(false);
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
    this.svg.drawLine(top, bottomR);
    this.svg.drawLine(bottomR, bottomL);
  }

  eyes () {
    var width         = this.genes.get('face',     'width') / 100 *  (this._width/2);
    var separtion     = this.genes.get('eyes',     'separtion') / 100 *  (this._width/2);
    var style         = this.genes.get('eyes',     'style') / 100 *  (this._width/2);
    var size          = this.genes.get('eyes',     'size');
    var eyebrowTilt   = this.genes.get('eyebrows', 'tilt');
    var eyebrowWidth  = this.genes.get('eyebrows', 'width');
    var eyebrowsUp      = this.genes.get('eyebrows', 'up');
    var eyebrowsCenter  = this.genes.get('eyebrows', 'center') / 100 * eyebrowWidth;;

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
        this.svg.drawOval(cl, eyeHeight, eyeWidth , eyeHeight, eyeWidth, 'white', -65, 180);
        this.svg.drawOval(cr, eyeHeight, eyeWidth , eyeHeight, eyeWidth, 'white', -180, 65);
      } else {
        this.svg.drawOval(cl, eyeHeight, eyeWidth , eyeHeight, eyeWidth, 'white');
        this.svg.drawOval(cr, eyeHeight, eyeWidth , eyeHeight, eyeWidth, 'white');
      }
    }

    if (drawPupils) {
      this.svg.drawOval(cl, 2, 2, 2, 2,  lineColor);
      this.svg.drawOval(cr, 2, 2, 2, 2,  lineColor);
    }

    // draw Left eyebrow
    var el1 = new Point(cl.x - (eyebrowWidth/2) , cl.y - eyeHeight * 1.5 - eyebrowsUp[0]);
    var el2 = new Point(cl.x,                   cl.y - eyeHeight * 1.5 - eyebrowsUp[1]);
    var el3 = new Point(cl.x + (eyebrowWidth/2) , cl.y - eyeHeight * 1.5 - eyebrowsUp[2]);

    this.svg.drawLine(el1, el2);
    this.svg.drawLine(el2, el3 );

    var er3 = new Point(cr.x + (eyebrowWidth/2) , cr.y - eyeHeight * 1.5 - eyebrowsUp[0]);
    var er2 = new Point(cr.x,                     cr.y - eyeHeight * 1.5 - eyebrowsUp[1]);
    var er1 = new Point(cr.x - (eyebrowWidth/2) , cr.y - eyeHeight * 1.5 - eyebrowsUp[2]);

    this.svg.drawLine(er1, er2);
    this.svg.drawLine(er2, er3 );


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
    this.svg.stroke = 'red';
    this.svg.drawLine(mLeft, mCenter);
    this.svg.drawLine(mCenter, mRight);
    this.svg.stroke = lineColor;
  }

  faceBorder () {
    var width        = this.genes.get('face', 'width') / 100 *  (this._width/2);
    var heightTop    = this.genes.get('face', 'heightTop') / 100 * (this._height/2);
    var heightBottom = this.genes.get('face', 'heightBottom') / 100 * (this._height/2);
    var c = this.center;
    this.svg.drawOval(c, heightTop, width, heightBottom , width, '#e2d3be', false);
    this.svg.drawOval(c, heightTop, width +5, heightBottom -5, width, '#fdedd6');

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
