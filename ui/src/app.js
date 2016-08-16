var Drawing = require('./face');


var CONSTS = {
  NUM_DRAWINGS: 25,
  NUM_PARENTS: 15
};

var drawings = [];
var parents = [];
var selectedParent = 0;
var xoverChance = 0.1;

function init () {
  var filter = Snap.filter.grayscale(0.5);
  console.log(filter);
  var canvasContainer = document.getElementById('main-canvas');
  var parentContainer = document.getElementById('parent-canvas');
  createDrawingSet(parentContainer, CONSTS.NUM_PARENTS, 'parent-', parents);
  createDrawingSet(canvasContainer, CONSTS.NUM_DRAWINGS, 'drawing-', drawings);

  var data = getCurrData();
  var saveSet;
  for (saveSet in data) {
    if(data.hasOwnProperty(saveSet)) {
      $('select').append($('<option>', {value:saveSet, text:saveSet}));
    }
  }

  $('.show-hide .show').hide();
  $('.show-hide .show, .show-hide .hide').click(function (e) {
    var showHideWrapper = $(this).parent();
    var state = showHideWrapper.data('show-hide');
    state = !state;
    showHideWrapper.data('show-hide', state);
    if (state) {
      showHideWrapper.siblings().show();
      $('.show-hide .show').hide();
      $('.show-hide .hide').show();
    } else {
      showHideWrapper.siblings().hide();
      $('.show-hide .hide').hide();
      $('.show-hide .show').show();
    }
  });
  showPane('main');
}

function showPane(pane) {
  $('#main-pane').hide();
  $('#edit-pane').hide();
  $('#about-pane').hide();
  $('#' + pane + '-pane').show();
}

$('#show-about').click(function () {
  showPane('about');
});

$('#edit').click(function () {
  showPane('edit');
  var stringData = getDrawingById('parent-1').genes.toJSON();
  stringData = JSON.stringify(JSON.parse(stringData, stringData), null, 2);
  stringData = stringData.replace(/\s*([A-Za-z]*,)[\s]/gi, '$1');
  stringData = stringData.replace(/(\[)[\s]/gi, '$1');
  stringData = stringData.replace(/\s*\]\s*,/gi, '],\r');
  $('#edit-data').val(stringData);
});


$('#save-edit').click(function () {
  var storeString = $('#edit-data').val();
  getDrawingById('parent-1').genes.fromJSON(storeString);
  drawParent(1);
  showPane('main');
});

function getCurrData () {
  var data = window.localStorage.getItem('drawings');
  if (data === '') {
    return {};
  } else {
    return JSON.parse(data);
  }
}

function createDrawingSet (containerEl, numDrawings, elementIdPrefix, holdingArray) {
  var drawingCanvas;
  var svgEl;
  var width;
  var height;

  for (var i=0; i<numDrawings; i++) {
    drawingCanvas = document.createElement('div');
    drawingCanvas.setAttribute('id', elementIdPrefix + i);
    drawingCanvas.className = 'drawing-container pure-u-1-5';
    drawingCanvas.setAttribute('draggable', true);
    drawingCanvas.setAttribute('ondragstart', 'drawingDrag(event)');
    drawingCanvas.setAttribute('ondrop', 'drawingDrop(event)');
    drawingCanvas.setAttribute('ondragover', 'drawingDragOver(event)');
    containerEl.appendChild(drawingCanvas);
    width = drawingCanvas.clientWidth;
    height = drawingCanvas.clientHeight;

    svgEl = Snap(width, height);
    svgEl.prependTo(drawingCanvas);

    holdingArray[i] = new Drawing(svgEl);
  }
}

function getDrawingById (id) {
  var stripString = 'drawing-';
  var srcArray = drawings;
  if(id.indexOf('parent') === 0) {
    stripString = 'parent-';
    srcArray = parents;
  }
  // convert id to int
  id = parseInt(id.replace(stripString, ''), 10);
  // look it up in the right src array
  return srcArray[id];
}

function drawingDrag(ev) {
  //console.log(arguments);
  ev.dataTransfer.dropEffect ='move';
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function drawingDragOver(ev) {
  ev.preventDefault();
  var draggingId = ev.dataTransfer.getData("text");
  var dropId = ev.target.id;
}

window.drawingDrag = drawingDrag;
window.drawingDragOver = drawingDragOver;
window.drawingDrop = drawingDrop;

function drawingDrop(ev) {
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

function breed(firstId, secondId, mutation=0.01) {
  var drawing1Genes = getDrawingById(firstId).genes.clone();
  var drawing2Genes = getDrawingById(secondId).genes.clone();

  for (var i=0; i<CONSTS.NUM_DRAWINGS; i++) {
    drawings[i].genes = drawing1Genes.breed(drawing2Genes, xoverChance, mutation);
    // clear out the svg so can redraw
    drawDrawing(i);
  }
}

function swap(firstId, secondId) {
  var drawing1 = getDrawingById(firstId);
  var drawing2 = getDrawingById(secondId);
  drawing1.swap(drawing2);
  // todo only draw changed
  $("#" + firstId + ' svg *').remove();
  $("#" + secondId + ' svg *').remove();
  drawing1.draw();
  drawing2.draw();
}

function draw () {
  $('svg *').remove();

  for (var i=0; i<CONSTS.NUM_DRAWINGS; i++) {
    drawings[i].draw();
  }
  for (i=0; i< CONSTS.NUM_PARENTS; i++) {
    parents[i].draw();
  }
}

function drawDrawing (i) {
  $('#drawing-' + i + ' svg *').remove();
  drawings[i].draw();
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
    for (var i=0; i<CONSTS.NUM_DRAWINGS; i++) {
      drawings[i].genes.randomize();
      // clear out the svg so can redraw
      drawDrawing(i);
    }
  }

  $('#randomize').click(function(event) {
    randomize();
  });

  $('#breed').click(function(event) {
    breed('parent-0', 'parent-1');
  });

  $('#breedHighMutation').click(function(event) {
    breed('parent-0', 'parent-1', 0.1);
  });

  $('#save-set-list').change(function (event) {
    $('#save-set-name').val($(this).val());
  });

  function getSaveSetName() {
    var name = $('#save-set-name').val();
    if (name ===  ""){
      name = "default";
    }
    return name;
  }

  $('#save').click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    var currData = getCurrData();
    var saveName = getSaveSetName();

    var storeObj = {};
    for(var i = 0; i < parents.length; i++) {
      storeObj['parent' + i] = parents[i].genes.toJSON();
    }
    currData[saveName] = storeObj;
    var storeString = JSON.stringify(currData);
    window.localStorage.setItem('drawings', storeString);
  });

  $('#load').click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    var currData = getCurrData();
    var saveName = getSaveSetName();
    var data = currData[saveName];

    for(var i = 0; i < parents.length; i++) {
      parents[i].genes.fromJSON(data['parent' + i]);
    }
    draw();
  });

  $(document).keyup(function (ev) {
    var char = String.fromCharCode(ev.which);
    console.log(char);
    if(char === 'B') {
      breed('parent-0', 'parent-1', 0.01);
    }
    if(char === 'N') {
      breed('parent-0', 'parent-1', 0.1);
    }
    if(char === 'M') {
      breed('parent-0', 'parent-1', 0.2);
    }
    if(char === 'R') {
      randomize();
    }
  });


});
