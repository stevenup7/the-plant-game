describe('SVG Utils', function () {
  var SVGUtils = require('../src/svgutils');
  var Point = require('../src/math2d').Point;
  var s;

  beforeEach (function () {
    s = new SVGUtils();
  });

  it('to draw ovals', function () {
    var o = s.drawOval(new Point(10, 10), 10,10,10,10);
  });


  it('stuff', function () {
    var genes = {
      "hasJitter": 0,
      "jitterLength": 25,
      "jitterSize": 1,
      "width": 61,
      "heightTop": 80,
      "heightBottom": 36
    };

    var _width = 200;
    var _height = 200;

    var width        = genes.width / 100 *  _width;
    var heightTop    = genes.heightTop / 100 * _height/2;
    var heightBottom = genes.heightBottom / 100 * _height/2;

    console.log('ht', heightTop, 'hb', heightBottom, 'width', width);

    var c = new Point(0 ,0);
    // svgu._canvas.line(c.x, 0, c.x, 500).attr({
    //   stroke: 'red',
    //   strokeWidth: 1
    // });
    // svgu._canvas.line(0, c.y, 500, c.y).attr({
    //   stroke: 'red',
    //   strokeWidth: 1
    // });

    var o = s.drawOval(c, heightTop, width, heightBottom, width, '#FDEDD6');
    console.log(o);
  });

});
