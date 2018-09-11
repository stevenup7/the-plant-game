var GeneSet = require('./gene').GeneSet;
var randomInt = require('./gene').randomInt;
var Point = require('./math2d').Point;
var Line = require('./math2d').Line;
var SColor = require('./colors').SColor;
var BreedableDrawing = require('./breedableDrawing');

var NUM_PETAL_LAYERS = 2;

var FLOWER_GENES = {
  general: {
    hasRandomness: ["int", 0, 1],
    structure: ["int", 0, 1],
    background: ["color"]
  },
  center: {
    size: ["int", 5, 50],
    color: ["color"],
    strokeColor: ["color"],
    strokeWidth: ["int", 1, 5]
  },
  petals: {
    strokeWidth: ["intArray", NUM_PETAL_LAYERS, 1, 10],
    angle: ["intArray", NUM_PETAL_LAYERS, 5, 100],
    count: ["intArray", NUM_PETAL_LAYERS, 1, 15],
    width: ["intArray", NUM_PETAL_LAYERS, 1, 90],
    length: ["intArray", NUM_PETAL_LAYERS, 1, 90],
    style: ["intArray", NUM_PETAL_LAYERS, 1, 10],
    blurry: ["intArray", NUM_PETAL_LAYERS, 1, 5],
    color: ["colorArray", NUM_PETAL_LAYERS],
    strokeColor: ["colorArray", NUM_PETAL_LAYERS],
    isAngleOffset: ["intArray", NUM_PETAL_LAYERS, 0, 1],
    centerOffSet: ["intArray", NUM_PETAL_LAYERS, 0, 50]
  }
};


class Flower extends BreedableDrawing{
  constructor (canvas, initializeRandom = true) {
    super(canvas, initializeRandom, FLOWER_GENES);
  }

  draw () {
    this._init_draw();
    this.center = new Point(this._width / 2, this._height / 2);
    var fillColor = new SColor().fromRGBAObject(this.genes.get('general', 'background')).toRGBString();
    this.drawCircle(this._canvas, fillColor, fillColor, 0, this.center , 500);

    var petalGroup1 = this._canvas.g(); // group to draw onto
    this.drawPetals(petalGroup1, 1);

    var petalGroup0Stroke = this._canvas.g(); // group to draw onto
    this.drawShapedPetals(petalGroup0Stroke, 0, true);
    var petalGroup0Fill = this._canvas.g(); // group to draw onto
    this.drawShapedPetals(petalGroup0Fill, 0);

    // var petalGroup0Stroke1 = this._canvas.g(); // group to draw onto
    // this.drawShapedPetals(petalGroup0Stroke1, 1, true);
    // var petalGroup0Fill1 = this._canvas.g(); // group to draw onto
    // this.drawShapedPetals(petalGroup0Fill1, 1);


    var centerGroup = this._canvas.g(); // group to draw onto
    this.drawCenter(centerGroup);

    // var opacity = new SColor().fromRGBAObject(this.genes.get('center', 'color')).a;
    // console.log(opacity);
    // centerGroup.attr('opacity', opacity);


  }


  drawCenter(g) {
    var fillColor = new SColor().fromRGBAObject(this.genes.get('center', 'color')).toRGBString();
    var strokeColor = new SColor().fromRGBAObject(this.genes.get('center', 'strokeColor')).toRGBString();
    var strokeWidth = this.genes.get('center', 'strokeWidth');
    var size= this.genes.get('center', 'size');
    this.drawCircle(g, fillColor, strokeColor, strokeWidth, this.center, size);
  }

  pathStr (command, pt, xOff=0, yOff=0) {
    return " " + command + (pt.x + xOff)        + " " + (pt.y + yOff);
  }

  drawShapedPetals (g, level, isStroke = false) {
    var centerWidth = this.genes.get('center', 'size') + (this.genes.get('petals', 'centerOffSet')[level] - 25);
    var availCircumference = 2 * Math.PI * centerWidth;
    var color = "red";

    if(isStroke) {
      color = new SColor().fromRGBAObject(this.genes.get('petals', 'strokeColor')[level]).toRGBString();
    } else {
      color = new SColor().fromRGBAObject(this.genes.get('petals', 'color')[level]).toRGBString();
    }

    var strokeWidth = this.genes.get('petals', 'strokeWidth')[level];
    var petalLength = this.genes.get('petals', 'length')[level];
    var petalWidth = this.genes.get('petals', 'width')[level];

    var numPetals = this.genes.get('petals', 'count')[level];
    var isAngleOffset = this.genes.get('petals', 'isAngleOffset')[level] === 0;

    var angle = 360 / numPetals;
    var offAngle = angle /2;

    for (let i=0; i < numPetals; i ++){
      let center;
      let a = angle * i;
      if (isAngleOffset) {
        a = a + offAngle;
        center = this.center.pointAtAngleDeg(a, centerWidth);
      } else {
        center = this.center.pointAtAngleDeg(a, centerWidth);
      }
      let petalG = this._canvas.g();
      let pathString = "";

      if(isStroke) {
        pathString = `
                                         M 0 -${strokeWidth}
                                         Q ${petalWidth + strokeWidth} ${petalLength + strokeWidth}, 0 ${petalLength + strokeWidth}
                                         Q -${petalWidth + strokeWidth} ${petalLength + strokeWidth}, 0 -${strokeWidth} Z
                                `;
      } else {
        pathString = `
                                         M 0 0
                                         Q ${petalWidth} ${petalLength}, 0 ${petalLength}
                                         Q -${petalWidth} ${petalLength}, 0 0 Z
                                `;
      }

      petalG.add(this._canvas.path(
        pathString
      )).attr({
        fill: color,
      });

      petalG.attr({transform: "translate(" + center.svgStr() + ") , rotate(" + (a + 180) + ")"});

      g.add(petalG);
    }

  }

  drawPetals (g, level) {
    var centerWidth = this.genes.get('center', 'size');

    var fillColor = new SColor().fromRGBAObject(this.genes.get('petals', 'color')[level]).toRGBString();
    var strokeColor = new SColor().fromRGBAObject(this.genes.get('petals', 'strokeColor')[level]).toRGBString();
    var strokeWidth = this.genes.get('petals', 'strokeWidth')[level];
    var petalSize = this.genes.get('petals', 'length')[level];

    var numPetals = this.genes.get('petals', 'count')[level];
    var angle = 360 / numPetals;

    for (let i=0; i < numPetals; i ++){
      let center = this.center.pointAtAngleDeg(angle * i, centerWidth);
      this.drawCircle(g, strokeColor, strokeColor, 0, center , petalSize );
    }

    for (let i=0; i < numPetals; i ++){
      let center = this.center.pointAtAngleDeg(angle * i, centerWidth);
      this.drawCircle(g, fillColor, fillColor, 0, center , Math.max(0, petalSize - strokeWidth));
    }
    //g.attr('opacity', fillColor.a);
  }

}


module.exports = Flower;
