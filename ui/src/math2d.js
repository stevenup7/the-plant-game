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

class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  toString () {
    return '[' + this.x + ',' + this.y + ']';
  }

  pointAtAngleDeg (angleDeg, distance ) {
    return this.pointAtAngle(angleDeg * M.PI/180, distance);
  }

  pointAtAngle (angleRadians, distance) {
    var x = distance * M.round(M.cos(angleRadians + 1.5 * M.PI) * 1000) / 1000;
    var y = distance * M.round(M.sin(angleRadians + 1.5 * M.PI) * 1000) / 1000;
    return new Point(this.x + x, this.y + y);
  }

}

class Line {
  constructor (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  // get the angle that this line is at
  angleRad () {
    // this makes zero north 0,0 to 0,1 = 0
    var dy = this.p1.y - this.p2.y;
    var dx = this.p1.x - this.p2.x;
    var theta = M.atan2(dy, dx);
    return (theta + M.PI*1.5) % (2 * Math.PI);

  }
  // as above but degrees
  angleDeg () {
    return this.angleRad() * (180 / M.PI);
  }

  pointAtAngleDeg (angleDeg, distance ) {
    return this.pointAtAngle(angleDeg * M.PI/180, distance);
  }

  pointAtAngle (angleRadians, distance) {
    var ang = this.angleRad();
    angleRadians = angleRadians - ang;
    return this.p2.pointAtAngle(angleRadians, distance);
  }

  toString () {
    return '[' + this.p1.toString() + ',' + this.p2.toString() + ']';
  }

}

module.exports = {
  Point: Point,
  Line: Line
};
