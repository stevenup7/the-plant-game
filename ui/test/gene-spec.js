var TEST_GENES = {
  a1: {
    a1int: ["int", 1, 10],
    a1intArray: ["intArray", 50, 0, 100],
    a1color: ["color", 1],
    a1colorArray: ["colorArray", 3],
    a1int1: ["int", 1, 10],
    a1int2: ["int", 1, 10],
    a1int3: ["int", 1, 10],
    a1int4: ["int", 1, 10],
    a1int5: ["int", 1, 10],
    a1int6: ["int", 1, 10],
    a1int7: ["int", 1, 10],
    a1int8: ["int", 1, 10],
    a1int9: ["int", 1, 10],
    a1int10: ["int", 1, 10]
  },
  a2: {
    a21: ["int", 1, 100]
  }
};

describe('Genes Module', function () {
  var genes;
  var GeneSet;

  beforeEach (function () {
    GeneSet = require('../src/Gene').GeneSet;
  });

  it('to do the first parse of the definition correctly' , function () {
    genes = new GeneSet(TEST_GENES);
    expect(typeof genes._genes.a1).toEqual('object');
  });

  it('randomize the genes' , function () {
    Math.seedrandom("test");
    genes = new GeneSet(TEST_GENES);
    genes.randomize();
    var a11 = genes.get('a1', 'a1int');
    var a12 = genes.get('a1', 'a1intArray');
    var a1color = genes.get('a1', 'a1color');
    var a1colorArray = genes.get('a1', 'a1colorArray');
    expect(a11).toEqual(9);
    expect(a12[30]).toEqual(62);
    expect(a1color.r).toEqual(232);
    expect(a1color.a).toEqual(0.48);
    expect(a1colorArray[1].g).toEqual(104);
  });


  it('to breed with another animal and do crossing over' , function () {
    Math.seedrandom("test");
    var genes1 = new GeneSet(TEST_GENES);
    genes1.randomize();
    var genes2 = new GeneSet(TEST_GENES);
    genes2.randomize();
    var newChild = genes1.breed(genes2, 0.5);
    var counts = [0,0];

    for(var i = 1; i < 10; i++) {
      var g1 = genes1.get('a1', 'a1int' + i);
      var g2 = genes2.get('a1', 'a1int' + i);
      var gc = newChild.get('a1', 'a1int' + i);
      if (gc === g1) {
        counts[0]++;
      } else if (gc === g2) {
        counts[1]++;
      } else {
        throw('bad');
      }
    }

    expect(counts[0] > 1).toEqual(true);
    expect(counts[1] > 1).toEqual(true);
  });

  it('to breed with another animal and do crossing over in array types' , function () {
    Math.seedrandom("test");
    var genes1 = new GeneSet(TEST_GENES);
    genes1.randomize();
    var genes2 = new GeneSet(TEST_GENES);
    genes2.randomize();
    var newChild = genes1.breed(genes2, 0.5);
    var counts = [0,0];


    var g1 = genes1.get('a1', 'a1intArray');
    var g2 = genes2.get('a1', 'a1intArray');
    var gChild = newChild.get('a1', 'a1intArray');

    for(var i = 0; i < g1.length; i++) {
      if (g1[i] === gChild[i]) {
        counts[0] ++;
      } else if (g2[i] === gChild[i]) {
        counts[1] ++;
      } else {
        throw('bad array');
      }
    }
    expect(counts[0] > 1).toEqual(true);
    expect(counts[1] > 1).toEqual(true);
  });


  it('should be able to clone itself', function () {
    Math.seedrandom("test");
    var genes1 = new GeneSet(TEST_GENES);
    genes1.randomize();

    var genes2 = genes1.clone();

    expect(genes1.get('a1', 'a1int')).toEqual(genes2.get('a1', 'a1int'));
    expect(genes1.get('a1', 'a1color').b).toEqual(genes2.get('a1', 'a1color').b);
    expect(genes1.get('a1', 'a1color').b).not.toEqual(genes2.get('a1', 'a1color').g);

    expect(genes1.get('a1', 'a1intArray')[0]).toEqual(genes2.get('a1', 'a1intArray')[0]);
    expect(genes1.get('a1', 'a1intArray')[3]).toEqual(genes2.get('a1', 'a1intArray')[3]);

    expect(genes1.get('a2', 'a21')).toEqual(genes2.get('a2', 'a21'));
  });


  it('should convert to json' , function () {
    Math.seedrandom("test");
    var g1 = new GeneSet(TEST_GENES);
    g1.randomize();
    var jsonString  = g1.toJSON();
    var objectifiedVersion = JSON.parse(jsonString);

    expect(objectifiedVersion.definition.a1.a1int[0]).toEqual('int');
    expect(objectifiedVersion.geneValues.a1.a1int)
      .toEqual(g1.get('a1', 'a1int'));
    expect(objectifiedVersion.geneValues.a1.a1intArray[3])
      .toEqual(g1.get('a1', 'a1intArray')[3]);
  });

  it('should convert back from json' , function () {
    Math.seedrandom("test");
    var g1 = new GeneSet(TEST_GENES);
    g1.randomize();
    var jsonString  = g1.toJSON();

    var g2 = new GeneSet();
    g2.fromJSON(jsonString);

    expect(g1.get('a1', 'a1int')).toEqual(g2.get('a1', 'a1int'));
    expect(g1.get('a1', 'a1color')).toEqual(g2.get('a1', 'a1color'));
    expect(g1.get('a1', 'a1int2')).toEqual(g2.get('a1', 'a1int2'));
    expect(g1.get('a1', 'a1intArray')[0]).toEqual(g2.get('a1', 'a1intArray')[0]);
    expect(g1.get('a2', 'a21')).toEqual(g2.get('a2', 'a21'));
  });


  it('do mutation' , function () {
    Math.seedrandom("test");
    var g1 = new GeneSet(TEST_GENES);
    g1.randomize();


  });

});
