'use strict';

const { Attribute, AttributeFormula } = require('./Attribute');

/**
 * @property {Map} attributes
 */
class AttributeFactory {
  constructor() {
    this.attributes = new Map();
  }

  /**
   * @param {string} name
   * @param {number} base
   * @param {AttributeFormula} formula
   */
  add(name, base, formula = null) {
    if (formula && !(formula instanceof AttributeFormula)) {
      throw new TypeError('Formula not instance of AttributeFormula');
    }

    this.attributes.set(name, {
      name,
      base,
      formula,
    });
  }

  /**
   * @see Map#has
   */
  has(name) {
    return this.attributes.has(name);
  }

  /**
   * Get a attribute definition. Use `create` if you want an instance of a attribute
   * @param {string} name
   * @return {object}
   */
  get(name) {
    return this.attributes.get(name);
  }

  /**
   * @param {string} name
   * @param {number} delta
   * @return {Attribute}
   */
  create(name, base = null, delta = 0) {
    if (!this.has(name)) {
      throw new RangeError(`No attribute definition found for [${name}]`);
    }

    const def = this.attributes.get(name);
    return new Attribute(name, base || def.base, delta, def.formula);
  }

  /**
   * Make sure there are no circular dependencies between attributes
   * @throws Error
   */
  validateAttributes() {
    const references = [...this.attributes].reduce((acc, [ attrName, { formula } ]) => {
      if (!formula) {
        return acc;
      }

      acc[attrName] = formula.requires;

      return acc;
    }, {});

    for (const attrName in references) {
      const requires = references[attrName];
      for (const req of requires) {
        if (req in references && references[req].includes(attrName)) {
          throw new Error(`Attribute formula for [${attrName}] has circular dependency with [${req}]`);
        }
      }
    }
  }
}

module.exports = AttributeFactory;
