
var Plant;
var mockCanvas;

describe('Plants', function () {

  beforeEach (function () {
    Plant = require('../src/Plant');
    mockCanvas = {
      lines: [],
      node: {
        clientWidth: 100,
        clientHeight: 100
      },
      line: () => {
        console.log('line');
      }
    };
  });

  it('to do the first parse of the definition correctly' , function () {
    var p = new Plant();
    expect(typeof p).toEqual('object');
  });

  it('to draw properly ' , function () {
    var p = new Plant(mockCanvas);
    var g = p.genes;
    // console.log(g.toJSON());
    // p.draw();
  });






});
