var DrawingObject = require('./flower');
var Vue = window.Vue;

Vue.component('drawing-object', {
	props: ['object'],
	data: function () {
		return {
			isOver: false,
			drawing: null,
			locked: false,
			message: ''
		};
	},
	template: `
		<li class="pure-u-1-2 pure-u-md-1-4 pure-u-lg-1-6" v-bind:id="'o' + object.id"
				v-bind:class="{ 'is-over': isOver }"
			>
			<div class="object-menu">
					<input id="lock" type="checkbox" v-model="locked">
					{{message}}
			</div>
			<div draggable="true"
					@drop="drop"
					@dragstart="dragStart"
					@dragenter="dragEnter"
					@dragexit="dragExit"
					@dragleave="dragLeave"
					@dragover="dragOver"
					v-bind:id="'oc' + object.id">
			</div>
		</li>
		`,
	watch: {
		locked: function () {
			this.object.locked = this.locked;
		}
	},
	mounted: function () {
		var plantCanvas = document.querySelector('#oc' + this.object.id);
		var width = plantCanvas.clientWidth;
		this.half = width / 2;
		var svg = new Snap(width, width);
		svg.prependTo(plantCanvas);
		this.object.drawing = new DrawingObject(svg);
		this.object.locked = this.locked;
		this.object.drawing.draw();
	},
	methods: {
		dragStart: function (event) {
			event.dataTransfer.setData("text/plain", this.object.id);
		},
		drop: function (event) {
			event.preventDefault();
			var draggingId = parseInt(event.dataTransfer.getData("text"), 10);
			this.$parent.drawingDrop({
				target: this.object.id,
				dragged: draggingId,
				action: this.message
			});
			this.message = '';
			this.isOver = false;
		},
		dragEnter: function (event) {
			this.isOver = true;
		},
		dragExit: function (event) {
			//console.log('exit');
		},
		dragLeave: function (event) {
			this.message = '';
			this.isOver = false;
		},
		dragOver: function (event) {
			var p = findPos(this.$el);
			// console.log('dragover', event.layerX, this.half);
			if (event.clientX - p.x > this.half) {
				this.message = 'swap';
			} else {
				this.message = 'breed';
			}
			event.preventDefault();
		}
	}
});

var app = new Vue ({
	el: '#game',
	template: `
	<div>
		 <div class="game-menu">
			 <button class="pure-button button-warning" v-on:click="random">random</button>
			 <button class="pure-button button-success" v-on:click="save">save</button>
			 <button class="pure-button button-secondary" v-on:click="load">load</button>
		 </div>
		 <ul id="game-list" class="pure-g">
			<drawing-object
				 v-for="drawingObject in drawingObjects"
				 v-bind:key="drawingObject.id"
				 v-bind:object="drawingObject">
			</drawing-object>
		 </ul>
	</div>
	`,
	data: {
		drawingObjects: []
	},
	created: function () {
		for(var i = 0; i < 24; i++) {
			//console.log('pushing');
			this.drawingObjects.push({id: i});
		}
	},
	methods: {
		drawingDrop: function (event) {
			var drag = this.getDrawingObjectBy(event.target);
			var drop = this.getDrawingObjectBy(event.dragged);

			if (event.action === 'swap') {
				this.swap(drag, drop);
			} else {
				this.breed(drag, drop);
			}
		},
		getDrawingObjectBy: function (id) {
			var found = null;
			this.drawingObjects.forEach(function (o) {
				if(o.id === id) {
					found = o;
				}
			});
			return found.drawing;
		},
		random: function () {
			this.drawingObjects.forEach(function(drawing) {
				if (drawing.locked !== true) {
					drawing.drawing.genes.randomize();
					drawing.drawing.draw();
				}
			});
		},
		breed: function (drag, drop, mutation=0.01) {
			var dragGenes = drag.genes.clone();
			var dropGenes = drop.genes.clone();

			this.drawingObjects.forEach(function(drawing) {
				if (drawing.locked !== true) {
					drawing.drawing.genes = dragGenes.breed(dropGenes, 0.1, mutation);
					drawing.drawing.draw();
				}
			});
		},
		swap: function (drag, drop) {
			drag.swap(drop);
			drop.draw();
			drag.draw();
		},
		save: function () {
			var saveData = {};
			this.drawingObjects.forEach(function(drawing) {
				saveData['drawing' + drawing.id] = drawing.drawing.genes.toJSON();
			});
			localStorage.setItem('plants', JSON.stringify(saveData));
			//console.log(saveData);
		},
		load: function () {
			var data = JSON.parse(localStorage.getItem('plants'));
			console.log('load', data);
			_.forEach(data, (v, k) => {
				var objectId = parseInt(k.replace('drawing', ''), 10);
				this.drawingObjects[objectId].drawing.genes.fromJSON(v);
				this.drawingObjects[objectId].drawing.draw();
			});
		}
	}
});

document.body.onkeyup = function (e) {
	if(e.keyCode === 82) { // r
		app.random();
	}
};

function findPos(obj) {
	// ewk
	// https://stackoverflow.com/questions/5085689/tracking-mouse-position-in-canvas-when-no-surrounding-element-exists
	var curleft = 0, curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while ((obj = obj.offsetParent));
		return { x: curleft, y: curtop };
	}
	return undefined;
}
