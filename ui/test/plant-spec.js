import { describe, it, expect } from 'vitest';
import Plant from '../src/plant.js';

describe('Plants', function () {

  it('creates a Plant instance', function () {
    var p = new Plant();
    expect(p).toBeInstanceOf(Plant);
  });

  it('has the expected gene groups', function () {
    var p = new Plant();
    expect(p.genes._genes).toHaveProperty('general');
    expect(p.genes._genes).toHaveProperty('stem');
  });

  it('randomizes to valid gene values', function () {
    var p = new Plant();
    var depth = p.genes.get('stem', 'depth');
    expect(depth).toBeGreaterThanOrEqual(1);
    expect(depth).toBeLessThanOrEqual(4);

    var thickness = p.genes.get('stem', 'thickness');
    expect(Array.isArray(thickness)).toBe(true);
    thickness.forEach(function (v) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(10);
    });

    var colors = p.genes.get('stem', 'colors');
    expect(Array.isArray(colors)).toBe(true);
    colors.forEach(function (c) {
      expect(c).toHaveProperty('r');
      expect(c).toHaveProperty('g');
      expect(c).toHaveProperty('b');
    });
  });

  it('can clone its genes', function () {
    var p1 = new Plant();
    var cloned = p1.genes.clone();
    expect(cloned.get('stem', 'depth')).toEqual(p1.genes.get('stem', 'depth'));
    expect(cloned.get('stem', 'thickness')[0]).toEqual(p1.genes.get('stem', 'thickness')[0]);
  });

  it('can serialize and deserialize genes via JSON', function () {
    var p = new Plant();
    var json = p.genes.toJSON();
    var parsed = JSON.parse(json);
    expect(parsed.definition).toHaveProperty('stem');
    expect(parsed.geneValues.stem.depth).toEqual(p.genes.get('stem', 'depth'));
  });
});
