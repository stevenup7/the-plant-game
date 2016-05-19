var seedrandom = require('../vendor/seedrandom.min');

function toBinaryStr (num, bits=32) {
  var x = 0;
  var op = '';
  for(x=0; x < bits; x ++) {
    op = (num & 1) + op;
    num = num >>> 1;
  }
  return op;
}

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
  seedrandom: seedrandom,
  randomInt: randomInt,
  toBinary: toBinaryStr
};
