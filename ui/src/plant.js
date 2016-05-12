var GeneSet   = require('./gene').GeneSet;
var randomInt = require('./gene').randomInt;
var Point     = require('./math2d').Point;
var Line      = require('./math2d').Line;
var SColor    = require('./colors').SColor;

var MAX_DEPTH = 4;

var PLANT_GENES = {
  leaf: {
    style:            ["int",        0, 2],
    size:             ["int",        1, 10],
    colors:           ["colorArray", 4],
    strokes:          ["colorArray", 2],
    colorstyle:       ["int",        0, 3]
  },
  stem: {
    thickness:        ["intArray",   MAX_DEPTH, 1, 3],
    angle:            ["intArray",   MAX_DEPTH, 5, 100],
    counts:           ["intArray",   MAX_DEPTH, 1, 6],
    lengths:          ["intArray",   MAX_DEPTH, 3, 40],
    styles:           ["intArray",   MAX_DEPTH, 0, 2],
    colorstyles:      ["intArray",   MAX_DEPTH, 0, 1],
    lengthrandomness: ["intArray",   MAX_DEPTH, 0, 1],
    colors:           ["colorArray", MAX_DEPTH],
    colors2:          ["colorArray", MAX_DEPTH],
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
    this.drawLeaves();
  }

  swap (otherPlant) {
    var temp = {
      genes: otherPlant.genes
    };
    otherPlant.genes = this.genes;
    this.genes = temp.genes;
  }

  recurseDrawStems (level, start) {
    var angle      = this.genes.get('stem', 'angle'      )[level];
    var thickness  = this.genes.get('stem', 'thickness'  )[level];
    var color      = this.genes.get('stem', 'colors'     )[level];
    var color2     = this.genes.get('stem', 'colors2'    )[level];
    var count      = this.genes.get('stem', 'counts'     )[level];
    var length     = this.genes.get('stem', 'lengths'    )[level];
    var style      = this.genes.get('stem', 'styles'     )[level];
    var colorStyle = this.genes.get('stem', 'colorstyles')[level];
    var lengthrandomness  = this.genes.get('stem', 'lengthrandomness')[level];

    var startAngle = ((count-1) * angle)/-2;
    var branch;
    var cString;

    var c1 = new SColor(
      color.r,
      color.g,
      color.b,
      color.a);

    var c2 = new SColor(
      color2.r,
      color2.g,
      color2.b,
      color2.a);

    var colors = c1.scaleToColor(c2, count);

    for(var x=0; x< count; x++) {
      switch (style) {
      case 0:
        if (lengthrandomness === 1) {
          length = randomInt(1, length);
        } else {
          length = randomInt(length/2, length);
        }
        /* falls through */
      case 1:
        branch = new Line(start.p2, start.pointAtAngleDeg(startAngle, length));
        break;
      case 2:
        branch = new Line(start.p2, start.p2.pointAtAngleDeg(startAngle, length));
        break;
      default:
        throw('bad style');
      }

      this.branches.push(branch);
      startAngle = startAngle + angle;

      if (colorStyle) {
        cString = this.colorToRgbaString(color);
      } else {
        cString = this.colorToRgbaString(colors[x]);
      }

      this.drawLine(branch, thickness, cString);

      if (level + 1 < this.maxDepth) {
        this.recurseDrawStems(level +1, branch);
      } else {
        this.leafNodes.push(branch);
      }
    }
  }

  colorToRgbaString (color) {
    return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
  }

  drawDebugLine (l) {
    var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
    line.attr('strokeWidth', 1);
    line.attr('strokeDasharray', '4, 10');
    line.attr('stroke', 'rgba(255,0,0,0.5)');
  }


  drawLine (l, thickness, color) {
    var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
    line.attr('strokeWidth', thickness);
    line.attr('stroke', color);
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
      leaf = this._canvas.circle(point.p2.x, point.p2.y, leafSize/.6);
      leaf.attr('fill', color);
      var leaf2 = this._canvas.circle(smallPt.x, smallPt.y, leafSize/.6);
      leaf2.attr('fill', color2);
      break;
    default:
      leaf = this._canvas.circle(point.p2.x, point.p2.y, leafSize);
      leaf.attr('fill', color);
    }


  }

  drawLeaves () {
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
