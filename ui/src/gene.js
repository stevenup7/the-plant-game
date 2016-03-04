var randomInt = require('./util').randomInt;

class Gene {

  constructor (name, def) {
    this._name = name;
    this._defn = def;
    this._values = {};
  }

  randomize (randIntFunc) {
    _.each(this._defn, (value, attr) => {
      if (_.isArray(value)) {
        this._values[attr] = [];
        for(var i = 0; i < value[0]; i++) {
          this._values[attr].push(
            randIntFunc(0, Math.pow(2, value[1]))
          );
        }
      } else {
        console.log(attr);
        this._values[attr] = randIntFunc(0, Math.pow(2, value));
      }
    });
    delete this._defn;
  }

  get (attr) {
    return this._values[attr];
  }
}

class GeneSet {

  constructor (geneDefinition) {
    this._genes = {};
    _.each(geneDefinition, (attr, key) => {
      this._genes[key] = new Gene(key, attr);
    });
  }

  randomize (randIntFunc = randomInt) {
    _.each(this._genes, (gene) => {
      gene.randomize(randIntFunc);
    });
  }

  get (gene, attr) {
    return this._genes[gene].get(attr);
  }
}

module.exports = {
  GeneSet: GeneSet,
  Gene: Gene
};
