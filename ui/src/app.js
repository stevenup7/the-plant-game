console.log('this is the app');

var Plant = require('./plant');

var CONSTS = {
  NUM_PLANTS: 1000
};

var plants = [];

function init () {
  var canvasContainer = document.getElementById('main-canvas');
  var plantCanvas;
  var svgEl;
  var width;
  var height;

  for (var i=0; i<CONSTS.NUM_PLANTS; i++) {
    plantCanvas = document.createElement('div');
    plantCanvas.setAttribute('id', 'plant-' + i);
    // plantCanvas.setAttribute('version', '1.1');
    // plantCanvas.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    plantCanvas.className = 'plant-container pure-u-1-5';

    canvasContainer.appendChild(plantCanvas);
    width = plantCanvas.clientWidth;
    height = plantCanvas.clientHeight;

    // svgEl = document.createElement('svg');
    // svgEl.setAttribute('width', width + 'px');
    // svgEl.setAttribute('height', height + 'px');
    // svgEl.setAttribute('id', 'plant-svg-' + i);

    svgEl = Snap(width, height);
    svgEl.prependTo(plantCanvas);

    plants[i] = new Plant(svgEl);
  }
}

function draw () {
  for (var i=0; i<CONSTS.NUM_PLANTS; i++) {
    plants[i].draw();
  }
}


init();
draw();
