// Automated tests T18 to T21 (FR-01), added in v2.1 for evaluation finding F1.
const test = require('node:test');
const assert = require('node:assert/strict');
const { matchActivities } = require('../src/activityFilter.js');

const acts = [
  { id: 'bridge', title: 'Build a paper bridge', topic: 'Engineering', level: 'Upper primary', minutes: 35, materials: ['Paper', 'Reused cardboard', 'Coins', 'Tape'] },
  { id: 'wind', title: 'Design a wind-powered car', topic: 'Engineering', level: 'Secondary', minutes: 50, materials: ['Reused cardboard', 'Bottle caps', 'Straws', 'Paper'] },
  { id: 'shadow', title: 'Measure moving shadows', topic: 'Mathematics', level: 'Lower primary', minutes: 30, materials: ['Stick', 'String', 'Chalk'] }
];

test('T18 FR-01: with nothing ticked, every activity is ready', () => {
  const r = matchActivities(acts, {});
  assert.equal(r.ready.length, 3);
  assert.equal(r.partly.length, 0);
});

test('T19 FR-01 (F1): ticking one item shows partial matches with the missing items listed', () => {
  const r = matchActivities(acts, { materials: ['Paper'] });
  assert.equal(r.ready.length, 0);
  assert.deepEqual(r.partly.map(p => p.activity.id).sort(), ['bridge', 'wind']);
  const bridge = r.partly.find(p => p.activity.id === 'bridge');
  assert.deepEqual(bridge.missing, ['Reused cardboard', 'Coins', 'Tape']);
});

test('T20 FR-01: ticking every material of an activity makes it ready, others stay partial', () => {
  const r = matchActivities(acts, { materials: ['Paper', 'Reused cardboard', 'Coins', 'Tape'] });
  assert.deepEqual(r.ready.map(a => a.id), ['bridge']);
  assert.deepEqual(r.partly.map(p => p.activity.id), ['wind']);
  assert.deepEqual(r.partly[0].missing, ['Bottle caps', 'Straws']);
});

test('T21 FR-01: other filters still apply, and unrelated activities are not shown', () => {
  const r = matchActivities(acts, { materials: ['Paper'], level: 'Secondary' });
  assert.deepEqual(r.partly.map(p => p.activity.id), ['wind']);
  const none = matchActivities(acts, { materials: ['Chalk'], topic: 'Engineering' });
  assert.equal(none.ready.length + none.partly.length, 0);
});

const { ART, stepArt } = require('../src/stepArt.js');
test('T22 FR-02: every activity step has a picture with a text alternative', () => {
  const html = require('fs').readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
  for (const id of ['bridge', 'water', 'shadow', 'circuit', 'seed', 'wind']) {
    const steps = (html.match(new RegExp(`id:'${id}'[^\\n]*?steps:\\[(.*?)\\],safety`)) || [])[1];
    const count = steps.split("','").length;
    assert.equal(ART[id].length, count, id + ' picture count');
    for (let i = 0; i < count; i++) assert.ok(stepArt(id, i).alt.length > 20 && stepArt(id, i).svg.includes('role="img"'));
  }
});

test('T23 FR-01 (P3): when nothing matches, suggest materials that open up the most activities', () => {
  const { suggestMaterials } = require('../src/activityFilter.js');
  const acts = [
    { title: 'A', topic: 'Physics', level: 'Primary', minutes: 30, materials: ['Tape', 'Paper'] },
    { title: 'B', topic: 'Physics', level: 'Primary', minutes: 30, materials: ['Tape', 'Cup'] },
    { title: 'C', topic: 'Biology', level: 'Primary', minutes: 30, materials: ['Seeds'] }];
  const s = suggestMaterials(acts, { materials: ['Chalk'] });
  assert.deepEqual(s[0], { material: 'Tape', count: 2 });
  assert.equal(suggestMaterials(acts, { topic: 'Biology', materials: ['Chalk'] })[0].material, 'Seeds');
  assert.ok(!suggestMaterials(acts, { materials: ['Tape'] }).some(x => x.material === 'Tape'));
});
