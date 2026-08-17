const test = require('node:test');
const assert = require('node:assert/strict');

const {
  classifyParticleType,
  summarizeCsvRows,
  calculateRiskLevel,
} = require('../microplastic-analysis.js');

test('classifyParticleType identifies elongated fibers and compact pellets', () => {
  assert.equal(classifyParticleType({ circularity: 0.12, aspectRatio: 6.5 }), 'Fibers');
  assert.equal(classifyParticleType({ circularity: 0.87, aspectRatio: 1.2 }), 'Pellets');
});

test('summarizeCsvRows calculates totals and risk levels from Fiji measurements', () => {
  const rows = [
    { Area: 120, Circ: 0.82, Feret: 15, AR: 1.1 },
    { Area: 90, Circ: 0.10, Feret: 26, AR: 4.8 },
    { Area: 180, Circ: 0.70, Feret: 18, AR: 1.5 },
    { Area: 80, Circ: 0.91, Feret: 12, AR: 1.0 },
  ];

  const result = summarizeCsvRows(rows, ['Area', 'Circ', 'Feret', 'AR'], 1);

  assert.equal(result.totalParticles, 4);
  assert.equal(result.typeBreakdown.Fibers, 1);
  assert.equal(result.typeBreakdown.Pellets, 3);
  assert.equal(result.typeBreakdown.Fragments, 0);
  assert.equal(result.risk.level, 'LEVEL 1');
  assert.equal(result.risk.text, 'Low');
});

test('calculateRiskLevel returns a level for average particle count', () => {
  assert.deepEqual(calculateRiskLevel(8), { level: 'LEVEL 1', text: 'Low' });
  assert.deepEqual(calculateRiskLevel(22), { level: 'LEVEL 2', text: 'Moderate' });
  assert.deepEqual(calculateRiskLevel(45), { level: 'LEVEL 3', text: 'High' });
  assert.deepEqual(calculateRiskLevel(75), { level: 'LEVEL 4', text: 'Very High' });
});
