describe('Math2d', function () {
  var Point = require('../src/math2d').Point;
  var Line  = require('../src/math2d').Line;
  beforeEach (function () {
  });

  // it('give proper angles for lines' , function () {
  //   var points  = [[0,1], [1,0], [0,-1], [-1,0]];
  //   var expectedDegrees = [180,  90, 0,  270];
  //   var p1;
  //   var p2;
  //   var l;
  //   var angleRad;
  //   var angle;

  //   for(var i=0; i < points.length; i++) {
  //     p1 = new Point(0,0);
  //     p2 = new Point(
  //       points[i][0],
  //       points[i][1]
  //     );
  //     l = new Line(p1, p2);
  //     angleRad = l.angleRad();
  //     angle = l.angleDeg();
  //     expect(angle).toBe(expectedDegrees[i]);
  //   }
  // });



  it('to give the proper points for a point at angle' , function () {
    var pOrig = new Point(0,0);

    var angles = [0, 0.5 *Math.PI, Math.PI, 1.5 *Math.PI, 2 * Math.PI];
    var anglesDeg = [0, 90, 180, 270, 360];
    var expectedResults = [[0,-1], [1,0], [0,1], [-1,0], [0,-1]];
    var pDeg;
    var p;

    for(var i = 0; i < expectedResults.length; i++) {
      pDeg = pOrig.pointAtAngleDeg(anglesDeg[i], 1);
      p = pOrig.pointAtAngle(angles[i], 1);

      expect(pDeg.x).toBe(expectedResults[i][0]);
      expect(pDeg.y).toBe(expectedResults[i][1]);
      expect(p.x).toBe(expectedResults[i][0]);
      expect(p.y).toBe(expectedResults[i][1]);
    }

  });


  it('to werk', function () {
    var point = new Point(1,0);   // --------> (1,0)
    var pointAtAngle = point.pointAtAngleDeg(90, 1); // ---> (1,0) -- +1 --> (2,0)
    expect(pointAtAngle.x).toBe(2);
    expect(pointAtAngle.y).toBe(0);
  });

  it('to be able to add points at angles from the end of the line' , function () {
    var l = new Line(new Point(0,0), new Point(0, -1)); // line pointing up
    var p = l.pointAtAngleDeg(0, 1);

    expect(p.x).toBe(0);
    expect(p.y).toBe(-2);

    l = new Line(new Point(0,0), new Point(0, -1)); // line pointing up
    p = l.pointAtAngleDeg(90, 1);

    expect(p.x).toBe(1);
    expect(p.y).toBe(-1);

    l = new Line(new Point(0,0), new Point(0, -1)); // line pointing up
    p = l.pointAtAngleDeg(-90, 1);

    expect(p.x).toBe(-1);
    expect(p.y).toBe(-1);

    l = new Line(new Point(0,0), new Point(1, 0)); // line pointing right
    p = l.pointAtAngleDeg(0, 1);

    expect(p.x).toBe(2);
    expect(p.y).toBe(0);

  });

});
