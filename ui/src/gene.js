var randomInt = require('./util').randomInt;

class Gene {

  constructor (name, def) {
    this._name = name;
    this._defn = def;
    this._values = {};
  }

  randomize () {
    _.each(this._defn, (definitionValue, subUnitName) => {
      if (_.isArray(definitionValue)) {
        this._values[subUnitName] = [];
        for(var i = 0; i < definitionValue[0]; i++) {
          this._values[subUnitName].push(
            randomInt(0, Math.pow(2, definitionValue[1]))
          );
        }
      } else {
        this._values[subUnitName] = randomInt(0, Math.pow(2, definitionValue));
      }
    });
  }

  copyValue (attr) {
    return JSON.parse(JSON.stringify(this._values));
  }

  mutate (mutationChance) {
    _.each(this._defn, (definitionValue, subUnitName) => {
      if (_.isArray(definitionValue)) {
        for(var i = 0; i < definitionValue[0]; i++) {
          if(Math.random() < mutationChance) {
            console.log('mutation');
            this._values[subUnitName][i] = randomInt(0, Math.pow(2, definitionValue[1]));
          }
        }
      } else {
        if(Math.random() < mutationChance) {
          // randomize the value
          console.log('mutation');
          this._values[subUnitName] = randomInt(0, Math.pow(2, definitionValue));
        }

      }
    });

  }

  doBreed (otherGene, childGene, thisIsSource, xoverChance, mutationChance) {
    _.each(this._defn, (value, attr) => {
      if (_.isArray(this._values[attr])) {
        var arrayLen = value[0];
        childGene._values[attr] = [];
        for(var i = 0; i < arrayLen; i++) {
          if(thisIsSource) {
            childGene._values[attr].push(this._values[attr][i]);
          } else {
            childGene._values[attr].push(otherGene._values[attr][i]);
          }

          if (Math.random() < xoverChance) {
            thisIsSource = !thisIsSource;
          }
        }
      } else {
        if(thisIsSource) {
          childGene._values[attr] = this._values[attr];
        } else {
          childGene._values[attr] = otherGene._values[attr];
        }

        if (Math.random() < xoverChance) {
          thisIsSource = !thisIsSource;
        }
      }
    });
    childGene.mutate(mutationChance);
  }

  get (attr) {
    return this._values[attr];
  }

  clone () {
    // make a new clone
    var theClone = new Gene(this._name, this._defn);
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
      _.each(geneDefinition, (attr, key) => {
        this._genes[key] = new Gene(key, attr);
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
