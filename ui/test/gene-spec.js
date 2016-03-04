describe('Genes Module', function () {
  var genes;
  var GeneSet;

  beforeEach (function () {
    GeneSet = require('../src/Gene').GeneSet;
  });

  it('to do the first parse of the definition correctly' , function () {
    genes = new GeneSet(TEST_GENES);
    expect(typeof genes._genes.a1).toBe('object');
  });

  it('randomize the genes' , function () {
    genes = new GeneSet(TEST_GENES);
    genes.randomize(function () {
      return 1
    });
    var a11 = genes.get('a1', 'a11');
    var a12 = genes.get('a1', 'a12');
    expect(a11).toBe(1);
    expect(a12).toBe(1);
  });

  it('randomize the array genes' , function () {
    genes = new GeneSet(TEST_GENES);
    genes.randomize(function () {return 1} );
    var a14 = genes.get('a1', 'a14');
    expect(a14.length).toBe(4);
    expect(a14[0]).toBe(1);
  });

  var TEST_GENES = {
    a1: {
      a11: 8,
      a12: 8,
      a13: 8,
      a14: [4,8]
    },
    a2: {
      thickness: 8
    }
  };


});
