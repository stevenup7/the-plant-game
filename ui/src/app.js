var Plant = require('./plant');

var CONSTS = {
  NUM_PLANTS: 100
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
    plantCanvas.className = 'plant-container pure-u-1-5';

    canvasContainer.appendChild(plantCanvas);
    width = plantCanvas.clientWidth;
    height = plantCanvas.clientHeight;

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





$(document).ready(() => {
  init();
  draw();
  console.log('ready');

  $('.plant-container').click(function(el) {
    debugger;
    var plantid = this[0].attrs('id').replace('plant-');
    console.log(this, el);
  });
});
