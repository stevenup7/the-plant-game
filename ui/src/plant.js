var GeneSet = require('./gene').GeneSet;
var Point = require('./math2d').Point;
var Line = require('./math2d').Line;

class Plant {

  constructor (canvas, randomInit = true) {
    this._canvas = canvas;
    this.genes = new GeneSet(PLANT_GENES);

    if (randomInit) {
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

  recurseDrawStems (level, start, thickness) {
    var branches = [];
    var angle = this.genes.get('stem', 'angle')[level];
    var count;
    if(level === this.depth) {
      // more stems on last level
      count = this.genes.get('stem', 'counts')[level] & 15;
    } else {
      count = this.genes.get('stem', 'counts')[level] & 7;
    }
    var length = this.genes.get('stem', 'lengths')[level] & 63;
    var startAngle =((count-1)* angle)/-2;

    for(var x=0; x< count; x++) {
      branches[x] = new Line(start.p2, start.pointAtAngleDeg(startAngle, length));
      startAngle = startAngle + angle;
      this.drawLine(branches[x], thickness, level);
      if (level < this.depth) {
        this.recurseDrawStems(level +1, branches[x], thickness );
      }
    }
  }

  drawLine (l, thickness, level) {
    var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
    line.attr('strokeWidth', thickness + 1);
    line.attr('stroke', 'rgba(' +
              this.stemColors[level].r + ',' +
              this.stemColors[level].g + ',' +
              this.stemColors[level].b + ',' +
              this.stemColors[level].a/100 + ')'
             );
  }

  drawStem () {
    this.root = new Line(new Point(this._width/2, this._height),
                         new Point(this._width/2, this._height -1));

    var thickness = this.genes.get('stem', 'thickness') & 3;

    // how deep to recurse
    this.depth = this.genes.get('stem', 'depth') % 4;
    this.drawLine(this.root, thickness, 1);

    this.recurseDrawStems(1, this.root, thickness);
  }

  draw () {
    // return false;
    this._width = this._canvas.node.clientWidth;
    this._height = this._canvas.node.clientHeight;
    this.stemColors = [];
    for(var i = 0; i < MAX_DEPTH; i++) {
      this.stemColors.push({
        r: this.genes.get('stem', 'colors')[i*3   ] & 255,
        g: this.genes.get('stem', 'colors')[i*3 +1] & 255,
        b: this.genes.get('stem', 'colors')[i*3 +2] & 255,
        a: this.genes.get('stem', 'alphas')[i] % 100
      });
    }
    this.drawStem();
  }
}

var MAX_DEPTH = 4;

var PLANT_GENES = {
  petals: {
    length: 8,
    width: 8,
    shape: 8
  },
  stem: {
    thickness: 8,
    angle: [MAX_DEPTH, 8],
    counts: [MAX_DEPTH, 8],
    lengths: [MAX_DEPTH, 8],
    colors: [MAX_DEPTH * 3, 24],
    alphas: [MAX_DEPTH, 9],
    depth: 8
  }
};

module.exports = Plant;
