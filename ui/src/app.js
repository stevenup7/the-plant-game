var Plant = require('./plant');

var CONSTS = {
  NUM_PLANTS: 40
};

var plants = [];
var parents = [];
var selectedParent = 0;
var downNumber = -1;
var isDown = [false, false, false, false, false];
var xoverChance = 0.1;

function init () {
  var canvasContainer = document.getElementById('main-canvas');
  var parentContainer = document.getElementById('parent-canvas');
  createPlantSet(parentContainer, 5, 'parent-', parents);
  createPlantSet(canvasContainer, CONSTS.NUM_PLANTS, 'plant-', plants);
}

function createPlantSet (containerEl, numPlants, elementIdPrefix, holdingArray) {
  var plantCanvas;
  var svgEl;
  var width;
  var height;

  for (var i=0; i<numPlants; i++) {
    plantCanvas = document.createElement('div');
    plantCanvas.setAttribute('id', elementIdPrefix + i);
    plantCanvas.className = 'plant-container pure-u-1-5';
    plantCanvas.setAttribute('draggable', true);
    plantCanvas.setAttribute('ondragstart', 'plantDrag(event)');
    plantCanvas.setAttribute('ondrop', 'plantDrop(event)');
    plantCanvas.setAttribute('ondragover', 'plantDragOver(event)');
    containerEl.appendChild(plantCanvas);
    width = plantCanvas.clientWidth;
    height = plantCanvas.clientHeight;

    svgEl = Snap(width, height);
    svgEl.prependTo(plantCanvas);

    holdingArray[i] = new Plant(svgEl);
  }

}

function plantDrag(ev) {
  console.log(arguments);
  ev.dataTransfer.dropEffect ='move';
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function plantDragOver(ev) {
  ev.preventDefault();
  var draggingId = ev.dataTransfer.getData("text");
  var dropId = ev.target.id;
}

function getPlantById (id) {
  var stripString = 'plant-';
  var srcArray = plants;
  if(id.indexOf('parent') === 0) {
    stripString = 'parent-';
    srcArray = parents;
  }
  // convert id to int
  id = parseInt(id.replace(stripString, ''), 10);
  // look it up in the right src array
  return srcArray[id];
}

function plantDrop(ev) {
  ev.preventDefault();
  var draggingId = ev.dataTransfer.getData("text");
  var dropId = ev.currentTarget.id;
  if (ev.shiftKey === true) {
    swap(draggingId, dropId);
  } else {
    console.log('breed', draggingId, dropId);
    breed(draggingId, dropId);
  }
}

function breed(firstId, secondId) {
  var plant1Genes = getPlantById(firstId).genes.clone();
  var plant2Genes = getPlantById(secondId).genes.clone();

  for (var i=0; i<CONSTS.NUM_PLANTS; i++) {
    plants[i].genes = plant1Genes.breed(plant2Genes, xoverChance, 0.01);
    // clear out the svg so can redraw
    drawPlant(i);
  }
}

function swap(firstId, secondId) {
  var plant1 = getPlantById(firstId);
  var plant2 = getPlantById(secondId);
  plant1.swap(plant2);
  draw();
}

window.plantDrag = plantDrag;
window.plantDragOver = plantDragOver;
window.plantDrop = plantDrop;

function draw () {
  $('svg *').remove();

  for (var i=0; i<CONSTS.NUM_PLANTS; i++) {
    plants[i].draw();
  }
  for (i=0; i<5; i++) {
    parents[i].draw();
  }
}

function drawPlant (i) {
  $('#plant-' + i + ' svg *').remove();
  plants[i].draw();
}

function drawParent (i) {
  $('#parent-' + i + ' svg *').remove();
  parents[i].draw();
}

$(document).ready(() => {
  init();
  draw();
  console.log('ready');

  function randomize() {
    for (var i=0; i<CONSTS.NUM_PLANTS; i++) {
      plants[i].genes.randomize();
      // clear out the svg so can redraw
      drawPlant(i);
    }
  }

  $('#randomize').click(function(event) {
    randomize();
  });

  $('#breed').click(function(event) {
    breed('parent-1', 'parent-2');
  });

  $(document).keydown(function (ev) {
    var digit = ev.which - 48;
    // track which of the 1 -5 keys is down
    if (digit > 0 && digit < 6) {
      isDown[digit -1] = true;
      // selectParent(digit-1);
    }

  });

  $(document).keyup(function (ev) {
    var digit = ev.which - 48;
    // track which of the 1 -5 keys is down
    if (digit > 0 && digit < 6) {
      isDown[digit -1] = false;
      // selectParent(-1);
    } else {
      var char = String.fromCharCode(ev.which);
      console.log(char);
      if(char === 'B') {
        breed();
      }
      if(char === 'R') {
        randomize();
      }
    }
  });

  // function selectParent (id) {
  //   $('#parent-canvas .plant-container').removeClass('selected');
  //   $("#parent-" + id).addClass('selected');
  //   selectedParent = id;
  // }

  // $('.plant-container').click(function(event) {
  //   var elID = this.getAttribute('id');
  //   var parentid;
  //   var plant;
  //   var plantid;
  //   var isParent = false;
  //   var parentPlant;

  //   if (elID.indexOf('parent') === 0) {
  //     plantid = parseInt(elID.replace('parent-', ''), 10);
  //     selectParent(plantid);
  //     plant = parents[plantid];
  //   } else {
  //     plantid = parseInt(elID.replace('plant-', ''), 10);
  //     plant = plants[plantid];
  //     parentPlant = parents[selectedParent];
  //     plant.swap(parentPlant);
  //     drawParent(selectedParent);
  //     drawPlant(plantid);
  //   }
  //   console.log(JSON.stringify(plant.genes, null, 2));
  // });

});
