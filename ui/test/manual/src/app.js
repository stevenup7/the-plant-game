var SVGUtils = require ('../../../src/svgutils');
var Point = require ('../../../src/math2d').Point;
var Line = require ('../../../src/math2d').Line;

$(document).ready(() => {
  var drawing = Snap(750, 2000);
  drawing.prependTo($('#canvas')[0]);

  var svgu = new SVGUtils();

  svgu._canvas = drawing;
  svgu.stroke = '#333';
  svgu.num_iterations = 3;
  svgu.setJitter(7, 1);

  // svgu.drawLine(new Point(0,0), new Point(500,500));
  // svgu.drawOval(new Point(250,250), 50, 100, 70, 100, 'rgba(255,255,0,0.1)');
  // svgu.drawOval(new Point(80,20), 10, 10, 10, 10, 'rgba(255,255,0,0.1)');
  // svgu.drawOval(new Point(180,60), 50, 50, 50, 50, 'rgba(255,255,0,0.1)');
  // svgu.drawOval(new Point(480,200), 150, 50, 150, 50, 'rgba(255,255,0,0.1)');

  // svgu.drawOval(new Point(460,200), 150, 50, 150, 50, 'none', -180, 0);
  // svgu.drawOval(new Point(500,200), 150, 50, 150, 50, 'none', 0, 180);

  // svgu.stroke = '#333';
  // svgu.num_iterations = 1;
  // svgu.setJitter(10, 1);
  // svgu.drawOval(new Point(50,500), 100, 20, 100, 20, 'rgba(255,255,0,0.1)');

  // svgu.setJitter(15, 1);
  // svgu.drawOval(new Point(150,500), 100, 20, 100, 20, 'rgba(255,255,0,0.1)');

  svgu.setJitter(false);

  svgu.stroke = '#333';

  var genes = {
    "hasJitter": 0,
    "jitterLength": 25,
    "jitterSize": 1,
    "width": 61,
    "heightTop": 80,
    "heightBottom": 36
  };

  var hasJitter     = (genes.hasJitter === 1);
  var jitterLength  = genes.jitterLength;
  var jitterSize    = genes.jitterSize;

  if (hasJitter) {
    svgu.num_iterations = 1;
    svgu.setJitter(jitterLength, jitterSize);
  } else {
    svgu.num_iterations = 1;
    svgu.setJitter(false);
  }

  var _width = 200;
  var _height = 200;

  var width        = genes.width / 100 *  _width;
  var heightTop    = genes.heightTop / 100 * _height/2;
  var heightBottom = genes.heightBottom / 100 * _height/2;


  var c = new Point(400 ,1000);
  // svgu._canvas.line(c.x, 0, c.x, 500).attr({
  //   stroke: 'red',
  //   strokeWidth: 1
  // });
  // svgu._canvas.line(0, c.y, 500, c.y).attr({
  //   stroke: 'red',
  //   strokeWidth: 1
  // });

  svgu.drawOval(c, heightTop, width, heightBottom, width, '#FDEDD6');

  for(var x = 1; x < 5; x++) {

    for(var i = 0; i < 5; i++) {
      var c = new Point(20 + i * 100 ,600 + 100 * x);

      //svgu.drawOval(c, heightTop, width, heightBottom, width, 'rgba(155,155,0,0.1)');

    }
  }

});
