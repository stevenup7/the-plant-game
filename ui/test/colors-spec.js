describe('Colors Module', function () {
  var SColor = require('../src/colors').SColor;

  beforeEach (function () {

  });

  it('to convert RGBA to HSL', function () {
    var s = new SColor(255, 255, 255, 1); // white
    var c = s.toHSLa();
    expect(c.h).toBe(0);
    expect(c.s).toBe(0);
    expect(c.l).toBe(1);
    expect(c.a).toBe(1);

    s = new SColor(0 ,0 ,0 ,1); // black
    c = s.toHSLa();
    expect(c.h).toBe(0);
    expect(c.s).toBe(0);
    expect(c.l).toBe(0);
    expect(c.a).toBe(1);


    s = new SColor(255 ,0 ,0 ,1); // red
    c = s.toHSLa();
    expect(c.h).toBe(0);
    expect(c.s).toBe(1);
    expect(c.l).toBe(0.5);
    expect(c.a).toBe(1);

    s = new SColor(0 ,255 ,0 ,1); // green
    c = s.toHSLa();
    expect(Math.round(c.h * 1000) / 1000).toBe(0.333);
    expect(c.s).toBe(1);
    expect(c.l).toBe(0.5);
    expect(c.a).toBe(1);

    s = new SColor(0 ,0 ,255 ,1); // blue
    c = s.toHSLa();
    expect(Math.round(c.h * 1000) / 1000).toBe(0.667);
    expect(c.s).toBe(1);
    expect(c.l).toBe(0.5);
    expect(c.a).toBe(1);

    s = new SColor(127 ,127, 127 ,1); // grey
    c = s.toHSLa();
    expect(c.h).toBe(0);
    expect(c.s).toBe(0);
    expect(Math.round(c.l * 100) / 100).toBe(0.5);
    expect(c.a).toBe(1);

  });

  it('to do all the things', function () {
    var s = new SColor(255,255,255,1); // white
    var s2 = new SColor(0,0,0,1);      // black
    var scale = s.scaleToColor(s2, 3);
    expect(scale.length).toEqual(3);
    expect(scale[1].r).toBe(127);      // wrong but close enough ?

    s = new SColor(0,0,0,0);       // transparent
    s2 = new SColor(0,0,0,1);      // opaque
    scale = s.scaleToColor(s2, 5);
    expect(scale.length).toEqual(5);
    expect(scale[2].a).toBe(.5);
  });


});
