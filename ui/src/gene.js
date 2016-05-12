var randomInt = require('./util').randomInt;

class Gene {

  constructor (name, definition) {
    this._name = name;
    this._definition = definition;
    this._values = {};
  }

  randomRGBA () {
    return {
      r: randomInt(0,255),
      g: randomInt(0,255),
      b: randomInt(0,255),
      a: randomInt(0,100) / 100
    };
  }

  randomizeGene (definition, genename) {
    var type = definition[0];
    var min;
    var max;
    var i;
    switch (type) {
    case 'int':
      min = definition[1];
      max = definition[2];
      this._values[genename] = randomInt(min, max);
      break;
    case 'intArray':
      min = definition[2];
      max = definition[3];
      this._values[genename] = [];
      for(i = 0; i < definition[1]; i++) {
        this._values[genename][i] = randomInt(min, max);
      }
      break;
    case 'color':
      this._values[genename] = this.randomRGBA();
      break;
    case 'colorArray':
      this._values[genename] = [];
      for(i = 0; i < definition[1]; i++) {
        this._values[genename][i] = this.randomRGBA();
      }
      break;
    case 'default':
      throw('unknown type [' + type + ']');
    }

  }

  randomize () {
    _.each(this._definition, (definition, genename) => {
      this.randomizeGene(definition, genename);
    });
  }

  copyValue (attr) {
    return JSON.parse(JSON.stringify(this._values));
  }

  mutateInt (currVal, min, max) {
    var newVal = randomInt(min, max);
    return Math.round((currVal + newVal) / 2);
  }

  mutateColor (currVal) {
    return this.randomRGBA();
  }

  switchArrayEls (valuesArray) {
    var pos1 = randomInt(0, valuesArray.length -1);
    var pos2 = randomInt(0, valuesArray.length -1);
    var temp = valuesArray[pos1];
    valuesArray[pos1] = valuesArray[pos2];
    valuesArray[pos2] = temp;
  }

  mutateGene (genename, mutationChance) {
    var definition = this._definition[genename];
    var type = definition[0];
    var min;
    var max;
    var i;

    switch (type) {
    case 'int':
      min = definition[1];
      max = definition[2];
      if (Math.random() < mutationChance) {
        this._values[genename] = this.mutateInt(this._values[genename], min, max);
      }
      break;
    case 'intArray':
      min = definition[2];
      max = definition[3];
      if (Math.random > 0.5) {
        for(i = 0; i < definition[1]; i++) {
          if (Math.random() < mutationChance) {
            this._values[genename][i] = this.mutateInt(this._values[genename][i], min, max);
          }
        }
      } else {
        if (Math.random() < mutationChance) {
          this.switchArrayEls(this._values[genename]);
        }
      }
      break;
    case 'color':
      if (Math.random() < mutationChance) {
        this._values[genename] = this.mutateColor(this._values[genename]);
      }
      break;
    case 'colorArray':
      if (Math.random > 0.5) {
        for(i = 0; i < definition[1]; i++) {
          if (Math.random() < mutationChance) {
            this._values[genename][i] = this.mutateColor(this._values[genename][i]);
          }
        }
      } else {
        if (Math.random() < mutationChance) {
          this.switchArrayEls(this._values[genename]);
        }
      }
      break;
    case 'default':
      throw('unknown type [' + type + ']');
    }

  }

  mutate (mutationChance) {
    _.each(this._definition, (definitionValue, genename) => {
      this.mutateGene(genename, mutationChance);
    });

  }

  doBreed (otherGene, childGene, thisIsSource, xoverChance, mutationChance) {
    _.each(this._definition, (definition, genename) => {
      if (_.isArray(this._values[genename])) {
        var len = this._values[genename].length;
        childGene._values[genename] = [];
        for(var i = 0; i < len; i++) {
          if(thisIsSource) {
            childGene._values[genename].push(this._values[genename][i]);
          } else {
            childGene._values[genename].push(otherGene._values[genename][i]);
          }
          if (Math.random() < xoverChance) {
            thisIsSource = !thisIsSource;
          }
        }
      } else {
        if(thisIsSource) {
          childGene._values[genename] = this._values[genename];
        } else {
          childGene._values[genename] = otherGene._values[genename];
        }

        if (Math.random() < xoverChance) {
          thisIsSource = !thisIsSource;
        }
      }
    });
    childGene.mutate(mutationChance);
  }

  get (genename) {
    return this._values[genename];
  }

  clone () {
    // make a new clone
    var theClone = new Gene(this._name, this._definition);
    // clone values into new object
    theClone._values = _.clone(this._values);
    return theClone;
  }
}

class GeneSet {

  // initGenes false is used by clone
  constructor (geneDefinition, initGenes=true) {
    this._genes = {};
    if(geneDefinition) { // don't do anything if no definition is passed in
      this.parseDefinition(geneDefinition, initGenes);
    }
  }

  parseDefinition (geneDefinition, initGenes) {
    this._geneDefinition = geneDefinition;

    if(initGenes) {
      _.each(geneDefinition, (geneDefinition, geneName) => {
        this._genes[geneName] = new Gene(geneName, geneDefinition);
      });
    }
  }

  breed (otherGeneSet, xoverChance, mutationChance = 0) {
    var childGeneSet = new  GeneSet(this._geneDefinition);
    var thisIsSource = Math.random() > 0.5;

    _.each(this._geneDefinition, (attr, key) => {
      this._genes[key].doBreed(
        otherGeneSet._genes[key], childGeneSet._genes[key], thisIsSource, xoverChance, mutationChance);

      // crossing over
      if (Math.random() < xoverChance) {
        thisIsSource = !thisIsSource;
      }
    });
    return childGeneSet;
  }

  randomize () {
    _.each(this._genes, (gene) => {
      gene.randomize();
    });
  }

  clone () {
    var theClone = new GeneSet(this._geneDefinition, false);
    _.each(this._genes, (gene) => {
      theClone._genes[gene._name] = gene.clone();
    });
    return theClone;
  }

  toJSON () {
    var strobj = {
      definition: this._geneDefinition,
      geneValues: {}
    };
    _.each(this._genes, (gene) => {
      strobj.geneValues[gene._name] = gene._values;
    });
    return JSON.stringify(strobj);
  }

  fromJSON (jsonString) {
    var data = JSON.parse(jsonString);
    this.parseDefinition(data.definition, true);

    _.each(this._genes, (gene) => {

      gene._values = data.geneValues[gene._name];
    });

  }

  get (gene, attr) {
    return this._genes[gene].get(attr);
  }
}

module.exports = {
  GeneSet: GeneSet,
  Gene: Gene,
  randomInt: randomInt
};
