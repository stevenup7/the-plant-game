var GeneSet		= require('./gene').GeneSet;
var randomInt = require('./gene').randomInt;
var Point			= require('./math2d').Point;
var Line			= require('./math2d').Line;
var SColor		= require('./colors').SColor;
var BreedableDrawing		= require('./breedableDrawing');

var NUM_PETAL_LAYERS = 2;

var FLOWER_GENES = {
	general: {
		hasRandomness:		["int",				 0, 1],
		structure:				["int",				 0, 1]
	},
	center: {
		size:							["int", 5, 50],
		color:						["color"],
		strokeColor:			["color"],
		strokeWidth:			["int", 1, 5],
	},
	petals: {
		size:							["intArray",	 NUM_PETAL_LAYERS, 1, 55],
		strokeWidth:			["intArray",	 NUM_PETAL_LAYERS, 1, 10],
		angle:						["intArray",	 NUM_PETAL_LAYERS, 5, 100],
		count:						["intArray",	 NUM_PETAL_LAYERS, 1, 15],
		width:						["intArray",	 NUM_PETAL_LAYERS, 1, 35],
		length:						["intArray",	 NUM_PETAL_LAYERS, 1, 35],
		style:						["intArray",	 NUM_PETAL_LAYERS, 1, 10],
		blurry:						["intArray",	 NUM_PETAL_LAYERS, 1, 5],
		color:						["colorArray", NUM_PETAL_LAYERS],
		strokeColor:			["colorArray", NUM_PETAL_LAYERS],
	}
};


class Flower extends BreedableDrawing{

	constructor (canvas, initializeRandom = true) {
		super(canvas, initializeRandom, FLOWER_GENES);
	}

	draw () {
		this._init_draw();
		this.center = new Point(this._width / 2, this._height / 2);
		var petalGroup = this._canvas.g(); // group to draw onto
		this.drawPetals(petalGroup, 0);

		this.drawPetals(petalGroup, 1);

		var centerGroup = this._canvas.g(); // group to draw onto
		this.drawCenter(centerGroup);
	}


	drawCenter(g) {
		var fillColor = new SColor().fromRGBAObject(this.genes.get('center', 'color')).toRGBString();
		var strokeColor = new SColor().fromRGBAObject(this.genes.get('center', 'strokeColor')).toRGBString();
		var strokeWidth = this.genes.get('center', 'strokeWidth');
		var size= this.genes.get('center', 'size');
		this.drawCircle(g, fillColor, strokeColor, strokeWidth, this.center, size);
	}

	drawCircle (g, fillColor, strokeColor, strokeWidth, center, diameter) {
		g.add(
			this._canvas.circle(center.x, center.y, diameter)
				.attr({
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: strokeWidth
				})
		);

	}

	drawPetals (g, level) {
		var centerWidth = this.genes.get('center', 'size');
		var availCircumference = 2 * Math.PI * centerWidth;

		var fillColor = new SColor().fromRGBAObject(this.genes.get('petals', 'color')[level]).toRGBString();

		var strokeColor = new SColor().fromRGBAObject(this.genes.get('petals', 'strokeColor')[level]).toRGBString();
		var strokeWidth = this.genes.get('petals', 'strokeWidth')[level];

		//var strokeColor = new SColor().fromRGBAObject(this.genes.get('center', 'strokeColor')).toRGBString();
		//var strokeWidth = this.genes.get('center', 'strokeWidth');

		var petalSize = this.genes.get('petals', 'size')[level];

		var maxPetals = availCircumference / petalSize;

		var numPetals = Math.min(maxPetals, this.genes.get('petals', 'count')[level]);

		var angle = 360 / numPetals;

		for (var i=0; i < numPetals; i ++){
			var center = this.center.pointAtAngleDeg(angle * i, centerWidth);

			this.drawCircle(g, fillColor, strokeColor, strokeWidth, center , petalSize);
		}

	}

}


module.exports = Flower;
