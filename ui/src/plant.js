var GeneSet   = require('./gene').GeneSet;
var randomInt = require('./gene').randomInt;
var Point     = require('./math2d').Point;
var Line      = require('./math2d').Line;
var SColor    = require('./colors').SColor;

var MAX_DEPTH = 4;

var PLANT_GENES = {
  general: {
    hasRandomness:    ["int",        0, 1],
    structure:        ["int",        0, 1]
  },
  stem: {
    thickness:        ["intArray",   MAX_DEPTH + 1, 1, 10],
    angle:            ["intArray",   MAX_DEPTH, 5, 100],
    counts:           ["intArray",   MAX_DEPTH, 1, 7],
    lengths:          ["intArray",   MAX_DEPTH, 1, 35],
    styles:           ["intArray",   MAX_DEPTH, 1, 35],
    lengthrandomness: ["intArray",   MAX_DEPTH, 0, 2],
    colors:           ["colorArray", MAX_DEPTH],
    depth:            ["int", 1,     MAX_DEPTH]
  }
};

class Plant {

  constructor (canvas, initializeRandom = true) {
    this._canvas = canvas;
    this.genes = new GeneSet(PLANT_GENES);
    if (initializeRandom) {
      this.genes.randomize();
    }
  }

  draw () {
    // reset leaf nodes
    this.leafNodes = [];
    // return false;
    this._width = this._canvas.node.clientWidth;
    this._height = this._canvas.node.clientHeight;
    this.branches = [];
    this.drawStem();
    //this.drawLeaves();
  }

  swap (otherPlant) {
    var temp = {
      genes: otherPlant.genes
    };
    otherPlant.genes = this.genes;
    this.genes = temp.genes;
  }

  recurseDrawStems (level, start) {
    var angle         = this.genes.get('stem', 'angle'      )[level];
    var thickness     = this.genes.get('stem', 'thickness'  )[level];
    var thicknessNext = this.genes.get('stem', 'thickness'  )[level +1] || 1;
    var color         = this.genes.get('stem', 'colors'     )[level];
    var count         = this.genes.get('stem', 'counts'     )[level];
    var length        = this.genes.get('stem', 'lengths'    )[level];
    var style         = this.genes.get('stem', 'styles'     )[level];
    var startAngle;
    var branch;
    var cString;

    if (style === 1) {
      angle = 360 / count;
      startAngle = 0;
    } else {
      startAngle = ((count-1) * angle)/-2;
    }
    var c1 = new SColor().fromRGBAObject(color);
    var g = this._canvas.g(); // group to draw onto

    for(var x=0; x< count; x++) {
      branch = new Line(start.p2, start.pointAtAngleDeg(startAngle, length));
      this.branches.push(branch);
      startAngle = startAngle + angle;

      cString = c1.toRGBString();
      if (level + 1 < this.maxDepth) {
        this.drawLine(g, branch, thickness, thicknessNext, cString);
        this.recurseDrawStems(level +1, branch);
      } else {
        this.drawLine(g, branch, thickness, thicknessNext, cString, true);
        this.leafNodes.push(branch);
      }
    }

    g.attr('opacity', c1.a);
  }

  drawDebugLine (l) {
    var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
    line.attr('strokeWidth', 1);
    line.attr('strokeDasharray', '4, 10');
    line.attr('stroke', 'rgba(255,0,0,0.5)');
  }


  drawLine (g, l, thicknessStart, thicknessEnd, color, isLeaf = false) {
    // var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
    //line.attr('stroke', 'red');
    // ptl    -   ptr
    //       | |
    //       | |
    //      /   \
    //      |   |
    // pbr  |___| pbl

    var pbl = l.p1.pointAtAngleDeg(l.angleDeg() - 90, thicknessStart/2);
    var pbr = l.p1.pointAtAngleDeg(l.angleDeg() + 90, thicknessStart/2);
    var ptl = l.pointAtAngleDeg(-90, thicknessEnd/2);
    var ptr = l.pointAtAngleDeg( 90, thicknessEnd/2);
    g.add(this._canvas.polygon(
      pbl.x, pbl.y,
      pbr.x, pbr.y,
      ptr.x, ptr.y,
      ptl.x, ptl.y
    ).attr({ fill: color }));

    g.add(this._canvas.circle(
      l.p1.x, l.p1.y,
      thicknessStart/2
    ).attr({ fill: color }));

    if (isLeaf) {
      g.add(this._canvas.circle(
        l.p2.x, l.p2.y,
        thicknessEnd/2
      ).attr({ fill: color }));
    }


  }

  drawStem () {
    this.root = new Line(new Point(this._width/2, this._height),
                         new Point(this._width/2, this._height/2));
    this.maxDepth = this.genes.get('stem', 'depth');
    this.recurseDrawStems(0, this.root);
  }

  drawLeaf (point, color, color2, strokeColor) {
    var leafSize = this.genes.get('leaf', 'size');
    var leafStyle = this.genes.get('leaf', 'style');

    var leaf;
    switch (leafStyle) {
    case 0:
      leaf = this._canvas.circle(point.p2.x, point.p2.y, leafSize);
      leaf.attr('fill', color);
      leaf.attr('stroke', strokeColor);
      break;
    case 1:
      var smallPt = point.pointAtAngleDeg(180, leafSize);
      leaf = this._canvas.circle(point.p2.x, point.p2.y, leafSize/0.6);
      leaf.attr('fill', color);
      var leaf2 = this._canvas.circle(smallPt.x, smallPt.y, leafSize/0.6);
      leaf2.attr('fill', color2);
      break;
    default:
      leaf = this._canvas.circle(point.p2.x, point.p2.y, leafSize);
      leaf.attr('fill', color);
    }


  }

  drawLeaves () {
    //return;
    var colors = this.genes.get('leaf', 'colors');
    var leafStroke = this.genes.get('leaf', 'strokes')[0];
    var c1 = new SColor(
      colors[0].r,
      colors[0].g,
      colors[0].b,
      colors[0].a);

    var c2 = new SColor(
      colors[1].r,
      colors[1].g,
      colors[1].b,
      colors[1].a);

    var style = this.genes.get('leaf', 'colorstyle');
    var colorArray = c1.scaleToColor(c2, this.leafNodes.length);
    //console.log('style', style);
    if (style === 1) {
      colorArray = _.shuffle(colorArray);
    }
    // sort by x or sort by x
    if (style === 2 || style === 3) {
      this.leafNodes = _.sortBy(this.leafNodes, ['x']);
      if (style === 3) {
        this.leafNodes = _.reverse(this.leafNodes);
      }
    }

    for(var i = 0; i < this.leafNodes.length; i++) {
      if (style < 4) {
        this.drawLeaf(
          this.leafNodes[i],
          this.colorToRgbaString(colorArray[i]),
          this.colorToRgbaString(colors[1]),
          this.colorToRgbaString(leafStroke)
        );

      } else {
        this.drawLeaf(
          this.leafNodes[i],
          this.colorToRgbaString(colors[0]),
          this.colorToRgbaString(colors[1]),
          this.colorToRgbaString(leafStroke)
        );
      }
    }
  }

}


module.exports = Plant;
