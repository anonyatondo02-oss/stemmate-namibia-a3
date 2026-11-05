// Automated tests T01, T02, T03, T07 (Test_Matrix). Run with: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePlan, validateCount } = require('../src/validation.js');

const completePlan = () => ({
  title: 'Paper bridge session', date: '2026-11-17', minutes: 35,
  materials: 'Paper\nCoins', steps: 'Fold the paper\nTest with coins',
  safety: 'Keep coins away from mouths.', inclusion: 'Offer pre-folded paper.'
});

test('T01 FR-03: a plan with every required field is valid', () => {
  const result = validatePlan(completePlan());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('T02 FR-03: a missing session date is rejected with a clear message', () => {
  const result = validatePlan({ ...completePlan(), date: '' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.date, 'Enter the session date.');
});

test('T02b FR-03: an impossible date (30 February) is rejected', () => {
  assert.equal(validatePlan({ ...completePlan(), date: '2026-02-30' }).valid, false);
});

test('T03 FR-03: durations outside 5 to 240 minutes are rejected', () => {
  for (const minutes of [0, 300, 2.5, 'abc']) {
    const result = validatePlan({ ...completePlan(), minutes });
    assert.equal(result.valid, false, `minutes=${minutes} should be invalid`);
    assert.match(result.errors.minutes, /between 5 and 240/);
  }
});

test('T07 FR-06: participation counts must be whole numbers from 0 to 500', () => {
  for (const bad of ['abc', '-1', '2.5', '501']) {
    assert.equal(validateCount(bad).valid, false, `${bad} should be rejected`);
  }
  assert.deepEqual(validateCount('24'), { valid: true, value: 24 });
  assert.deepEqual(validateCount(''), { valid: true, value: null });
});
