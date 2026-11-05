/**
 * STEMMate plan service: the application logic for session plans.
 * A plan is either a Draft or Completed (A3 feedback: make this difference clear).
 *  - saveDraft never refuses: incomplete work is always kept (FR-04).
 *  - completePlan only succeeds when validation passes (FR-03); if it fails,
 *    the plan is kept as a Draft and the errors are returned for the screen.
 * The service is given its repository and validator, so tests can pass in
 * an in-memory repository and check behaviour without a browser.
 */
(function (root) {
  'use strict';

  const PLAN_FIELDS = ['activityId', 'title', 'date', 'venue', 'level', 'minutes',
                       'materials', 'steps', 'safety', 'inclusion'];

  function pick(fields) {
    const out = {};
    for (const f of PLAN_FIELDS) if (fields && fields[f] !== undefined) out[f] = fields[f];
    if (out.minutes !== undefined && out.minutes !== '') out.minutes = Number(out.minutes);
    return out;
  }

  function createPlanService(repo, validation, options = {}) {
    const now = options.now || (() => new Date().toISOString());
    const newId = options.newId ||
      (() => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));

    function base(id) {
      const existing = id ? repo.get(id) : null;
      return existing || { id: newId(), createdAt: now(), version: 0, participation: {} };
    }

    // Save whatever has been entered so far, as a Draft. Editing a Completed plan
    // reopens it as a Draft until it is completed again.
    function saveDraft(fields) {
      const before = base(fields && fields.id);
      const reopened = before.status === 'Completed';
      const plan = { ...before, ...pick(fields), status: 'Draft', sync: 'local', updatedAt: now() };
      delete plan.completedAt;
      const result = repo.save(plan);
      return result.ok ? { ok: true, plan, reopened } : { ok: false, plan, error: result.error };
    }

    // Mark a plan Completed, but only if it passes validation.
    function completePlan(fields) {
      const check = validation.validatePlan(fields);
      if (!check.valid) {
        const draft = saveDraft(fields);
        return { ok: false, errors: check.errors, plan: draft.plan, saved: draft.ok, error: draft.error };
      }
      const plan = {
        ...base(fields.id), ...pick(fields),
        status: 'Completed', sync: 'pending', completedAt: now(), updatedAt: now()
      };
      const result = repo.save(plan);
      return result.ok ? { ok: true, plan } : { ok: false, plan, error: result.error };
    }

    // Record a participation count by category (FR-06). Counts only.
    function recordParticipation(id, category, value) {
      const check = validation.validateCount(value);
      if (!check.valid) return { ok: false, error: check.error };
      const plan = repo.get(id);
      if (!plan) return { ok: false, error: 'Plan not found.' };
      plan.participation = { ...(plan.participation || {}), [category]: check.value };
      if (plan.status === 'Completed' && plan.sync === 'synced') plan.sync = 'pending';
      plan.updatedAt = now();
      const result = repo.save(plan);
      return result.ok ? { ok: true, plan } : { ok: false, error: result.error };
    }

    // Used by the (simulated) sync queue to record a plan's sync state.
    function setSync(id, sync, changes = {}) {
      const plan = repo.get(id);
      if (!plan) return { ok: false, error: 'Plan not found.' };
      const updated = { ...plan, ...changes, sync };
      const result = repo.save(updated);
      return result.ok ? { ok: true, plan: updated } : { ok: false, error: result.error };
    }

    return {
      saveDraft, completePlan, recordParticipation, setSync,
      list: () => repo.list(),
      get: id => repo.get(id),
      remove: id => repo.remove(id),
      clear: () => repo.clear()
    };
  }

  const api = { PLAN_FIELDS, createPlanService };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.STEMPlans = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
