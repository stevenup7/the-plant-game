(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Plant = require('./plant');

var CONSTS = {
  NUM_PLANTS: 100
};

var plants = [];

function init() {
  var canvasContainer = document.getElementById('main-canvas');
  var plantCanvas;
  var svgEl;
  var width;
  var height;

  for (var i = 0; i < CONSTS.NUM_PLANTS; i++) {
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

function draw() {
  for (var i = 0; i < CONSTS.NUM_PLANTS; i++) {
    plants[i].draw();
  }
}

$(document).ready(function () {
  init();
  draw();
  console.log('ready');

  $('.plant-container').click(function (el) {
    var plantid = parseInt(this.getAttribute('id').replace('plant-', ''), 10);
    var plant = plants[plantid];
    console.log(plant);
    console.log(JSON.stringify(plant.genes, null, 2));
  });
});

},{"./plant":4}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var randomInt = require('./util').randomInt;

var Gene = function () {
  function Gene(name, def) {
    _classCallCheck(this, Gene);

    this._name = name;
    this._defn = def;
    this._values = {};
  }

  _createClass(Gene, [{
    key: 'randomize',
    value: function randomize(randIntFunc) {
      var _this = this;

      _.each(this._defn, function (value, attr) {
        if (_.isArray(value)) {
          _this._values[attr] = [];
          for (var i = 0; i < value[0]; i++) {
            _this._values[attr].push(randIntFunc(0, Math.pow(2, value[1])));
          }
        } else {
          _this._values[attr] = randIntFunc(0, Math.pow(2, value));
        }
      });
      delete this._defn;
    }
  }, {
    key: 'get',
    value: function get(attr) {
      return this._values[attr];
    }
  }]);

  return Gene;
}();

var GeneSet = function () {
  function GeneSet(geneDefinition) {
    var _this2 = this;

    _classCallCheck(this, GeneSet);

    this._genes = {};
    _.each(geneDefinition, function (attr, key) {
      _this2._genes[key] = new Gene(key, attr);
    });
  }

  _createClass(GeneSet, [{
    key: 'randomize',
    value: function randomize() {
      var randIntFunc = arguments.length <= 0 || arguments[0] === undefined ? randomInt : arguments[0];

      _.each(this._genes, function (gene) {
        gene.randomize(randIntFunc);
      });
    }
  }, {
    key: 'get',
    value: function get(gene, attr) {
      return this._genes[gene].get(attr);
    }
  }]);

  return GeneSet;
}();

module.exports = {
  GeneSet: GeneSet,
  Gene: Gene
};

},{"./util":5}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
          ^  0, -1                    ^  0 deg
          |                           |
          |                           |
          |                  -90      |
<-------------------->      <-------------------->
-1, 0     |         1, 0     270      |         90
          |                           |
          |                           |
          v  0, 1                     v  180

*/

var M = Math;

var Point = function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: 'toString',
    value: function toString() {
      return '[' + this.x + ',' + this.y + ']';
    }
  }, {
    key: 'pointAtAngleDeg',
    value: function pointAtAngleDeg(angleDeg, distance) {
      return this.pointAtAngle(angleDeg * M.PI / 180, distance);
    }
  }, {
    key: 'pointAtAngle',
    value: function pointAtAngle(angleRadians, distance) {
      var x = distance * M.round(M.cos(angleRadians + 1.5 * M.PI) * 1000) / 1000;
      var y = distance * M.round(M.sin(angleRadians + 1.5 * M.PI) * 1000) / 1000;
      return new Point(this.x + x, this.y + y);
    }
  }]);

  return Point;
}();

var Line = function () {
  function Line(p1, p2) {
    _classCallCheck(this, Line);

    this.p1 = p1;
    this.p2 = p2;
  }

  // get the angle that this line is at


  _createClass(Line, [{
    key: 'angleRad',
    value: function angleRad() {
      // this makes zero north 0,0 to 0,1 = 0
      var dy = this.p1.y - this.p2.y;
      var dx = this.p1.x - this.p2.x;
      var theta = M.atan2(dy, dx);
      return (theta + M.PI * 1.5) % (2 * Math.PI);
    }
    // as above but degrees

  }, {
    key: 'angleDeg',
    value: function angleDeg() {
      return this.angleRad() * (180 / M.PI);
    }
  }, {
    key: 'pointAtAngleDeg',
    value: function pointAtAngleDeg(angleDeg, distance) {
      return this.pointAtAngle(angleDeg * M.PI / 180, distance);
    }
  }, {
    key: 'pointAtAngle',
    value: function pointAtAngle(angleRadians, distance) {
      var ang = this.angleRad();
      angleRadians = angleRadians - ang;
      return this.p2.pointAtAngle(angleRadians, distance);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[' + this.p1.toString() + ',' + this.p2.toString() + ']';
    }
  }]);

  return Line;
}();

module.exports = {
  Point: Point,
  Line: Line
};

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneSet = require('./gene').GeneSet;
var Point = require('./math2d').Point;
var Line = require('./math2d').Line;

var Plant = function () {
  function Plant(canvas) {
    var randomInit = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Plant);

    this._canvas = canvas;
    this.genes = new GeneSet(PLANT_GENES);

    if (randomInit) {
      this.genes.randomize();
    }
  }

  _createClass(Plant, [{
    key: 'recurseDrawStems',
    value: function recurseDrawStems(level, start, thickness) {
      var branches = [];
      var angle = this.genes.get('stem', 'angle')[level];
      var count = this.genes.get('stem', 'counts')[level] & 7;
      var length = this.genes.get('stem', 'lengths')[level] & 63;
      var startAngle = (count - 1) * angle / -2;

      for (var x = 0; x < count; x++) {
        branches[x] = new Line(start.p2, start.pointAtAngleDeg(startAngle, length));
        startAngle = startAngle + angle;
        this.drawLine(branches[x], thickness, level);
        if (level < 4) {
          this.recurseDrawStems(level + 1, branches[x], thickness);
        }
      }
    }
  }, {
    key: 'drawLine',
    value: function drawLine(l, thickness, level) {
      var line = this._canvas.line(l.p1.x, l.p1.y, l.p2.x, l.p2.y);
      line.attr('strokeWidth', thickness + 1);
      line.attr('stroke', 'rgba(' + this.stemColors[level].r + ',' + this.stemColors[level].g + ',' + this.stemColors[level].b + ',' + this.stemColors[level].a / 100 + ')');
    }
  }, {
    key: 'drawStem',
    value: function drawStem() {
      this.root = new Line(new Point(this._width / 2, this._height), new Point(this._width / 2, this._height - 20));

      this.drawLine(this.root, 10, 1);

      var thickness = this.genes.get('stem', 'thickness') & 3;
      this.recurseDrawStems(1, this.root, thickness);
    }
  }, {
    key: 'draw',
    value: function draw() {
      this._width = this._canvas.node.clientWidth;
      this._height = this._canvas.node.clientHeight;
      this.stemColors = [];
      for (var i = 0; i < MAX_DEPTH; i++) {
        this.stemColors.push({
          r: this.genes.get('stem', 'colors')[i * 3] & 255,
          g: this.genes.get('stem', 'colors')[i * 3 + 1] & 255,
          b: this.genes.get('stem', 'colors')[i * 3 + 2] & 255,
          a: this.genes.get('stem', 'alphas')[i] % 100
        });
      }
      this.drawStem();
    }
  }]);

  return Plant;
}();

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
    number: 8
  }
};

module.exports = Plant;

},{"./gene":2,"./math2d":3}],5:[function(require,module,exports){
'use strict';

function toBinaryStr(num) {
  var bits = arguments.length <= 1 || arguments[1] === undefined ? 32 : arguments[1];

  var x = 0;
  var op = '';
  for (x = 0; x < bits; x++) {
    op = (num & 1) + op;
    num = num >>> 1;
  }
  return op;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  randomInt: randomInt,
  toBinary: toBinaryStr
};

},{}]},{},[1]);
