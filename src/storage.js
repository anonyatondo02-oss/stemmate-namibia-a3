/**
 * STEMMate storage module: a Repository for session plans (FR-04, QR-02).
 * The repository is given a "store" object with getItem/setItem/removeItem.
 * In the app that is the browser's localStorage, so plans survive a restart.
 * In tests it is an in-memory store, so tests run in Node without a browser.
 * Every read and write is wrapped, so a full or blocked store returns an error
 * result instead of crashing the app.
 */
(function (root) {
  'use strict';

  // A store that lives in memory only. Used by tests and as a fallback.
  function createMemoryStore() {
    const map = new Map();
    return {
      getItem: k => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => { map.set(k, String(v)); },
      removeItem: k => { map.delete(k); }
    };
  }

  function createPlanRepository(store, key = 'stemmate-v2-plans') {
    function readAll() {
      try {
        const raw = store.getItem(key);
        if (!raw) return { ok: true, plans: [] };
        const parsed = JSON.parse(raw);
        return { ok: true, plans: Array.isArray(parsed) ? parsed : [] };
      } catch (e) {
        return { ok: false, plans: [], error: 'Saved plans could not be read on this device.' };
      }
    }

    function writeAll(plans) {
      try {
        store.setItem(key, JSON.stringify(plans));
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          error: 'This device could not save your plan. Storage may be full or blocked. ' +
                 'Your changes are still on screen; export the plan to keep a copy.'
        };
      }
    }

    return {
      // Every read parses fresh copies, so callers cannot change stored data by accident.
      list() { return readAll().plans; },
      get(id) { return readAll().plans.find(p => p.id === id) || null; },
      save(plan) {
        const current = readAll();
        if (!current.ok) return current;
        const plans = current.plans;
        const i = plans.findIndex(p => p.id === plan.id);
        if (i >= 0) plans[i] = plan; else plans.push(plan);
        return writeAll(plans);
      },
      remove(id) {
        const current = readAll();
        if (!current.ok) return current;
        return writeAll(current.plans.filter(p => p.id !== id));
      },
      // Sign-out purge (QR-02): removes every plan from this device.
      clear() {
        try { store.removeItem(key); return { ok: true }; }
        catch (e) { return { ok: false, error: 'Plans could not be removed from this device.' }; }
      }
    };
  }

  const api = { createMemoryStore, createPlanRepository };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.STEMStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
