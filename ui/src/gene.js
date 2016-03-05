var randomInt = require('./util').randomInt;

class Gene {

  constructor (name, def) {
    this._name = name;
    this._defn = def;
    this._values = {};
  }

  randomize () {
    _.each(this._defn, (value, attr) => {
      if (_.isArray(value)) {
        this._values[attr] = [];
        for(var i = 0; i < value[0]; i++) {
          this._values[attr].push(
            randomInt(0, Math.pow(2, value[1]))
          );
        }
      } else {
        this._values[attr] = randomInt(0, Math.pow(2, value));
      }
    });
  }

  copyValue (attr) {
    return JSON.parse(JSON.stringify(this._values));
  }

  mutate (mutationChance) {

  }

  doBreed (otherGene, childGene, thisIsSource, xoverChance) {
    _.each(this._defn, (value, attr) => {

      if (_.isArray(this._values[attr])) {
        childGene._values[attr] = [];
        for(var i = 0; i < value[0]; i++) {
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
  }

  get (attr) {
    return this._values[attr];
  }
}

class GeneSet {

  constructor (geneDefinition) {
    this._genes = {};
    this._geneDefinition = geneDefinition;

    _.each(geneDefinition, (attr, key) => {
      this._genes[key] = new Gene(key, attr);
    });
  }

  breed (otherGeneSet, xoverChance, mutationChance) {
    var childGeneSet = new  GeneSet(this._geneDefinition);
    var thisIsSource = Math.random() > 0.5;

    _.each(this._geneDefinition, (attr, key) => {
      this._genes[key].doBreed(
        otherGeneSet._genes[key], childGeneSet._genes[key], thisIsSource, xoverChance);

      childGeneSet._genes[key].mutate(mutationChance);

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

  get (gene, attr) {
    return this._genes[gene].get(attr);
  }
}

module.exports = {
  GeneSet: GeneSet,
  Gene: Gene,
  randomInt: randomInt
};
