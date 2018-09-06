var GeneSet		= require('./gene').GeneSet;

class BreedableDrawing {

	constructor (canvas, initializeRandom = true, GENES={}) {
		this._canvas = canvas;
		this.genes = new GeneSet(GENES);
		if (initializeRandom) {
			this.genes.randomize();
		}
	}

	_init_draw () {
		this._canvas.clear();
		this._width = this._canvas.node.clientWidth;
		this._height = this._canvas.node.clientHeight;
		this.f = this._canvas.filter(Snap.filter.blur(1, 1));
		this._canvas.append(this.f);
	}

	swap (otherDrawing) {
		var temp = {
			genes: otherDrawing.genes
		};
		otherDrawing.genes = this.genes;
		this.genes = temp.genes;
	}

	drawDebugLine (l) {
		var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
		line.attr('strokeWidth', 1);
		line.attr('strokeDasharray', '4, 10');
		line.attr('stroke', 'rgba(255,0,0,0.5)');
	}

}

module.exports = BreedableDrawing;
