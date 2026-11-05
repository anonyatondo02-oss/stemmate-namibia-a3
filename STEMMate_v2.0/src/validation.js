/**
 * STEMMate validation module (FR-03, FR-06).
 * Pure functions: no screen, no storage. That is what makes them easy to test.
 * Works in the browser (as window.STEMValidation) and in Node tests (via require).
 */
(function (root) {
  'use strict';

  // The fields a plan needs before it can be marked Completed (FR-03).
  const REQUIRED_FIELDS = {
    title: 'Session title',
    date: 'Session date',
    minutes: 'Total time in minutes',
    materials: 'Materials',
    steps: 'Steps and timings',
    safety: 'Safety notes',
    inclusion: 'Inclusion and adaptations'
  };

  // Split a text box into non-empty lines ("one item per line").
  function lines(text) {
    return String(text ?? '').split('\n').map(s => s.trim()).filter(Boolean);
  }

  // True only for a real calendar date in the YYYY-MM-DD form a date input gives.
  function isRealDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return false;
    const d = new Date(value + 'T00:00:00Z');
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
  }

  /**
   * Check a plan against FR-03.
   * Returns { valid, errors } where errors maps a field name to a message
   * that says what to do, so the screen can show it next to that field.
   */
  function validatePlan(plan) {
    const p = plan || {};
    const errors = {};
    if (!String(p.title ?? '').trim()) errors.title = 'Enter a session title.';
    if (!isRealDate(p.date)) errors.date = 'Enter the session date.';
    const minutes = Number(p.minutes);
    if (!Number.isInteger(minutes) || minutes < 5 || minutes > 240) {
      errors.minutes = 'Enter a duration between 5 and 240 minutes.';
    }
    if (!lines(p.materials).length) errors.materials = 'List the materials needed, or write None.';
    if (!lines(p.steps).length) errors.steps = 'Add at least one step.';
    if (!String(p.safety ?? '').trim()) {
      errors.safety = 'Add at least one safety note. If there are no hazards, write: No special hazards.';
    }
    if (!String(p.inclusion ?? '').trim()) errors.inclusion = 'Add at least one inclusion prompt.';
    return { valid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Check one participation count (FR-06): a whole number from 0 to 500, or blank.
   * Counts only. There is deliberately no way to record a learner's name.
   */
  function validateCount(value) {
    const s = String(value ?? '').trim();
    if (s === '') return { valid: true, value: null };
    if (!/^\d+$/.test(s)) return { valid: false, error: 'Enter a whole number, 0 or more.' };
    const n = Number(s);
    if (n > 500) return { valid: false, error: 'Enter a number no larger than 500.' };
    return { valid: true, value: n };
  }

  const api = { REQUIRED_FIELDS, lines, isRealDate, validatePlan, validateCount };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.STEMValidation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
