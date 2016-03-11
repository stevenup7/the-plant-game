var GeneSet = require('./gene').GeneSet;
var randomInt = require('./gene').randomInt;
var Point = require('./math2d').Point;
var Line = require('./math2d').Line;

var MAX_DEPTH = 4;

var PLANT_GENES = {
  leaf: {
    style: ["int", 1, 4],
    size: ["int", 1, 5],
    colors: ["colorArray", 2]
  },
  stem: {
    thickness: ["intArray", MAX_DEPTH, 1, 3],
    angle: ["intArray", MAX_DEPTH, 5, 100],
    counts: ["intArray", MAX_DEPTH, 1, 6],
    lengths: ["intArray", MAX_DEPTH, 3, 40],
    styles: ["intArray", MAX_DEPTH, 0, 2],
    lengthrandomness: ["intArray", MAX_DEPTH, 0, 1],
    colors: ["colorArray", MAX_DEPTH],
    colors2: ["colorArray", MAX_DEPTH],
    depth: ["int", 1, MAX_DEPTH]
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

  swap (otherPlant) {
    var temp = {
      genes: otherPlant.genes
    };
    otherPlant.genes = this.genes;
    this.genes = temp.genes;
  }

  recurseDrawStems (level, start) {
    var angle = this.genes.get('stem', 'angle')[level];
    var thickness = this.genes.get('stem', 'thickness')[level];
    var color = this.genes.get('stem', 'colors')[level];
    var color2 = this.genes.get('stem', 'colors')[level];
    var count = this.genes.get('stem', 'counts')[level];
    var length = this.genes.get('stem', 'lengths')[level];
    var style  = this.genes.get('stem', 'styles')[level];

    var startAngle = ((count-1) * angle)/-2;
    var branch;


    // var headingline = new Line(start.p2, start.pointAtAngleDeg(0, 500));
    // this.drawDebugLine(headingline);
    for(var x=0; x< count; x++) {
      switch (style) {
      case 0:
        length = randomInt(length/2, length);
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

      this.drawLine(branch, thickness, color);

      if (level + 1 < this.maxDepth) {
        this.recurseDrawStems(level +1, branch);
      } else {
        this.leafNodes.push(branch.p2);
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
    line.attr('stroke', this.colorToRgbaString(color));
  }

  drawStem () {
    this.root = new Line(new Point(this._width/2, this._height),
                         new Point(this._width/2, this._height/2));
    this.maxDepth = this.genes.get('stem', 'depth');
    console.log('maxDepth', this.maxDepth);
    this.recurseDrawStems(0, this.root);
  }

  drawLeaf (point) {
    var leafSize = this.genes.get('leaf', 'size');
    var leaf = this._canvas.circle(point.x, point.y, leafSize);
    leaf.attr('fill', this.colorToRgbaString(
      this.genes.get('leaf', 'colors')[0]
    ));
  }

  drawLeaves () {
    for(var i = 0; i < this.leafNodes.length; i++) {
      this.drawLeaf(this.leafNodes[i]);
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
}


module.exports = Plant;
