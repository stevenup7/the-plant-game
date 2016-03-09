var TEST_GENES = {
  a1: {
    a1int: ["int", 1, 10],
    a1intArray: ["intArray", 50, 0, 100],
    a1int2: ["int", 1, 1000],
    a1color: ["color", 1],
    a1colorArray: ["colorArray", 3],
    a1int1: ["int", 1, 10],
    a1int2: ["int", 1, 10],
    a1int3: ["int", 1, 10],
    a1int4: ["int", 1, 10],
    a1int5: ["int", 1, 10]
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
    expect(typeof genes._genes.a1).toBe('object');
  });

  it('randomize the genes' , function () {
    Math.seedrandom("test");
    genes = new GeneSet(TEST_GENES);
    genes.randomize();
    var a11 = genes.get('a1', 'a1int');
    var a12 = genes.get('a1', 'a1intArray');
    var a1color = genes.get('a1', 'a1color');
    var a1colorArray = genes.get('a1', 'a1colorArray');
    expect(a11).toBe(9);
    expect(a12[30]).toBe(62);
    expect(a1color.r).toBe(246);
    expect(a1color.a).toBe(0.14);
    expect(a1colorArray[1].g).toBe(107);
  });


  it('to breed with another animal' , function () {
    Math.seedrandom("test");
    var genes1 = new GeneSet(TEST_GENES);
    genes1.randomize();

    var genes2 = new GeneSet(TEST_GENES);
    genes2.randomize();

    var newChild = genes1.breed(genes2, 0.5);

    expect(genes1.get('a1', 'a1int')).toBe(9);
    expect(genes2.get('a1', 'a1int')).toBe(3);
    expect(newChild.get('a1', 'a1int')).toBe(9);

    expect(genes1.get('a1', 'a1intArray')).toBe(11);
    expect(genes2.get('a1', 'a1intArray')).toBe(12);
    expect(newChild.get('a1', 'a1intArray')).toBe(13);  // <- xover happened


    // expect(genes1.get('a1', 'a13')).toBe(247);
    // expect(genes2.get('a1', 'a13')).toBe(127);
    // expect(newChild.get('a1', 'a13')).toBe(247);

    // expect(newChild.get('a1', 'a14').length).toBe(4);

    // expect(genes1.get('a1', 'a14')[0]).toBe(78);
    // expect(genes2.get('a1', 'a14')[0]).toBe(241);
    // expect(newChild.get('a1', 'a14')[0]).toBe(78);

    // expect(genes1.get('a1', 'a14')[3]).toBe(119);
    // expect(genes2.get('a1', 'a14')[3]).toBe(202);
    // expect(newChild.get('a1', 'a14')[3]).toBe(202);  // <- xover happened
  });


  // it('should be able to clone itself', function () {
  //   Math.seedrandom("test");
  //   var genes1 = new GeneSet(TEST_GENES);
  //   genes1.randomize();

  //   var genes2 = genes1.clone();

  //   expect(genes1.get('a1', 'a11')).toBe(genes2.get('a1', 'a11'));
  //   expect(genes1.get('a1', 'a12')).toBe(genes2.get('a1', 'a12'));
  //   expect(genes1.get('a1', 'a13')).toBe(genes2.get('a1', 'a13'));

  //   expect(genes1.get('a1', 'a14')[0]).toBe(genes2.get('a1', 'a14')[0]);
  //   expect(genes1.get('a1', 'a14')[3]).toBe(genes2.get('a1', 'a14')[3]);

  //   expect(genes1.get('a2', 'a21')).toBe(genes2.get('a2', 'a21'));
  // });

  // it('should load and save from JSON' , function () {
  //   Math.seedrandom("test");
  //   var genes1 = new GeneSet(TEST_GENES);
  //   genes1.randomize();
  //   var jsonString  = genes1.toJSON();
  //   var objectifiedVersion = JSON.parse(jsonString);

  //   expect(objectifiedVersion.definition.a1.a11).toBe(8);
  //   expect(objectifiedVersion.geneValues.a1.a11).toBe(224);
  //   expect(objectifiedVersion.geneValues.a1.a14[0]).toBe(78);

  //   console.log("objectifiedVersion", JSON.stringify(objectifiedVersion, null,2));


  //   var genes2 = new GeneSet();
  //   genes2.fromJSON(jsonString);

  //   expect(genes1.get('a1', 'a11')).toBe(genes2.get('a1', 'a11'));
  //   expect(genes1.get('a1', 'a12')).toBe(genes2.get('a1', 'a12'));
  //   expect(genes1.get('a1', 'a13')).toBe(genes2.get('a1', 'a13'));
  //   expect(genes1.get('a1', 'a14')[0]).toBe(genes2.get('a1', 'a14')[0]);
  //   expect(genes1.get('a1', 'a14')[3]).toBe(genes2.get('a1', 'a14')[3]);

  //   expect(genes1.get('a2', 'a21')).toBe(genes2.get('a2', 'a21'));

  // });




});
