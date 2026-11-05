// Automated tests T04, T05, T06, T08 (Test_Matrix). Run with: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const validation = require('../src/validation.js');
const { createMemoryStore, createPlanRepository } = require('../src/storage.js');
const { createPlanService } = require('../src/planService.js');

function setup(store = createMemoryStore()) {
  let n = 0;
  const repo = createPlanRepository(store);
  const service = createPlanService(repo, validation, { newId: () => 'p' + (++n), now: () => '2026-11-05T08:00:00Z' });
  return { store, repo, service };
}

const fullPlan = () => ({
  title: 'Water filter session', date: '2026-11-17', minutes: 40,
  materials: 'Bottle\nSand', steps: 'Layer the sand\nPour slowly',
  safety: 'Do not drink the water.', inclusion: 'Use large scoops.'
});

test('T04 FR-03: completing an incomplete plan keeps it as a Draft', () => {
  const { service } = setup();
  const result = service.completePlan({ ...fullPlan(), safety: '' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.safety, 'safety error returned');
  assert.equal(service.get(result.plan.id).status, 'Draft');
});

test('T05 FR-04: a draft with only a title is saved as a Draft', () => {
  const { service } = setup();
  const result = service.saveDraft({ title: 'Unfinished idea' });
  assert.equal(result.ok, true);
  const saved = service.get(result.plan.id);
  assert.equal(saved.status, 'Draft');
  assert.equal(saved.title, 'Unfinished idea');
});

test('T05b: a complete plan is stored as Completed and queued for sync', () => {
  const { service } = setup();
  const result = service.completePlan(fullPlan());
  assert.equal(result.ok, true);
  assert.equal(service.get(result.plan.id).status, 'Completed');
  assert.equal(service.get(result.plan.id).sync, 'pending');
});

test('T06 FR-04 (integration): plans survive a restart of the app', () => {
  const store = createMemoryStore();
  const first = setup(store).service;
  const draft = first.saveDraft({ title: 'Draft before restart' }).plan;
  const done = first.completePlan(fullPlan()).plan;
  // "Restart": build a brand-new repository and service over the same storage.
  const second = setup(store).service;
  assert.equal(second.get(draft.id).status, 'Draft');
  assert.equal(second.get(done.id).status, 'Completed');
  assert.equal(second.get(done.id).title, 'Water filter session');
});

test('T06b: editing a Completed plan reopens it as a Draft', () => {
  const { service } = setup();
  const done = service.completePlan(fullPlan()).plan;
  const edited = service.saveDraft({ ...done, title: 'Changed title' });
  assert.equal(edited.reopened, true);
  assert.equal(service.get(done.id).status, 'Draft');
});

test('T08 resilience: a store that fails to write returns an error instead of crashing', () => {
  const broken = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); }, removeItem: () => {} };
  const { service } = setup(broken);
  const result = service.saveDraft({ title: 'Will not fit' });
  assert.equal(result.ok, false);
  assert.match(result.error, /could not save your plan/);
});

test('QR-02: sign-out purge removes every plan from the device', () => {
  const { service } = setup();
  service.saveDraft({ title: 'A' });
  service.completePlan(fullPlan());
  service.clear();
  assert.equal(service.list().length, 0);
});
