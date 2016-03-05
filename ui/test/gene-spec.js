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
    Math.seedrandom("test");
    genes = new GeneSet(TEST_GENES);
    genes.randomize();
    var a11 = genes.get('a1', 'a11');
    var a12 = genes.get('a1', 'a12');
    expect(a11).toBe(224);
    expect(a12).toBe(103);
  });

  it('randomize the array genes' , function () {
    Math.seedrandom("test");
    genes = new GeneSet(TEST_GENES);
    genes.randomize( );
    var a14 = genes.get('a1', 'a14');
    expect(a14.length).toBe(4);
    expect(a14[0]).toBe(78);
  });

  it('to breed with another animal' , function () {
    Math.seedrandom("test");
    var genes1 = new GeneSet(TEST_GENES);
    genes1.randomize();

    var genes2 = new GeneSet(TEST_GENES);
    genes2.randomize();

    var newChild = genes1.breed(genes2, 0.5);
    expect(genes1.get('a1', 'a11')).toBe(224);
    expect(genes2.get('a1', 'a11')).toBe(186);
    expect(newChild.get('a1', 'a11')).toBe(186);

    expect(genes1.get('a1', 'a12')).toBe(103);
    expect(genes2.get('a1', 'a12')).toBe(108);
    expect(newChild.get('a1', 'a12')).toBe(103);  // <- xover happened

    expect(genes1.get('a1', 'a13')).toBe(247);
    expect(genes2.get('a1', 'a13')).toBe(127);
    expect(newChild.get('a1', 'a13')).toBe(247);

    expect(newChild.get('a1', 'a14').length).toBe(4);

    expect(genes1.get('a1', 'a14')[0]).toBe(78);
    expect(genes2.get('a1', 'a14')[0]).toBe(241);
    expect(newChild.get('a1', 'a14')[0]).toBe(78);

    expect(genes1.get('a1', 'a14')[3]).toBe(119);
    expect(genes2.get('a1', 'a14')[3]).toBe(202);
    expect(newChild.get('a1', 'a14')[3]).toBe(202);  // <- xover happened

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
