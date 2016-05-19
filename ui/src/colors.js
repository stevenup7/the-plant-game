
class SColor {

  constructor (r =0, g=0, b=0, a=0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  fromRGBAObject (o) {
    this.r = o.r;
    this.g = o.g;
    this.b = o.b;
    this.a = o.a;
    return this;
  }

  toRGBAString (color) {
    return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
  }

  toRGBString (color) {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  }

  toHSLa () {
    return rgbToHsl(this);
  }

  scaleToColor (otherColor, num) {
    var rslt = [];
    var c1 = this.toHSLa();
    var c2= otherColor.toHSLa();

    var hStep = (c1.h - c2.h) / (num - 1);
    var sStep = (c1.s - c2.s) / (num - 1);
    var lStep = (c1.l - c2.l) / (num - 1);
    var aStep = (c1.a - c2.a) / (num - 1);

    rslt.push(hslToRgb(c1));

    for(var i = 1; i < num -1; i++) {
      c1.h -= hStep;
      c1.s -= sStep;
      c1.l -= lStep;
      c1.a -= aStep;
      rslt.push(hslToRgb(c1));
    }

    rslt.push(hslToRgb(c2));
    return rslt;

  }

}

module.exports = {
  SColor: SColor
};


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(hsl){
  var r, g, b;

  if(hsl.s === 0){
    r = g = b = hsl.l; // achromatic
  }else{
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    var q = hsl.l < 0.5 ? hsl.l * (1 + hsl.s) : hsl.l + hsl.s - hsl.l * hsl.s;
    var p = 2 * hsl.l - q;
    r = hue2rgb(p, q, hsl.h + 1/3);
    g = hue2rgb(p, q, hsl.h);
    b = hue2rgb(p, q, hsl.h - 1/3);
  }


  return {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255),
    a: hsl.a
  };

  //  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(c){
  var r = c.r/255;
  var g = c.g/255;
  var b = c.b/255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max === min){
    h = s = 0; // achromatic
  }else{
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: h,
    s: s,
    l: l,
    a: c.a
  };

}
