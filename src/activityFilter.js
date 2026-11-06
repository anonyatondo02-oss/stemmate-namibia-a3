/**
 * STEMMate activity filter (FR-01), added in v2.1 from evaluation finding F1.
 * v2.0 only showed an activity when EVERY one of its materials was ticked, so
 * ticking one or two items usually showed nothing. v2.1 splits the results:
 *  - ready:  activities the facilitator can run with exactly what is ticked
 *  - partly: activities that use at least one ticked item, with the missing
 *            items listed, fewest missing first
 * Pure function: no screen and no storage, so it is tested directly in Node.
 */
(function (root) {
  'use strict';

  function matchActivities(activities, filters = {}) {
    const q = String(filters.q || '').trim().toLowerCase();
    const have = filters.materials || [];
    const ready = [];
    const partly = [];
    for (const a of activities) {
      if (q && ![a.title, a.topic, ...a.materials].join(' ').toLowerCase().includes(q)) continue;
      if (filters.topic && a.topic !== filters.topic) continue;
      if (filters.level && a.level !== filters.level) continue;
      if (filters.maxMinutes && a.minutes > Number(filters.maxMinutes)) continue;
      if (!have.length) { ready.push(a); continue; }
      const missing = a.materials.filter(m => !have.includes(m));
      if (!missing.length) ready.push(a);
      else if (missing.length < a.materials.length) partly.push({ activity: a, missing });
    }
    partly.sort((x, y) => x.missing.length - y.missing.length);
    return { ready, partly };
  }

  // When nothing matches, suggest materials that would open up the most
  // activities under the other filters (finding P3: too few matches).
  function suggestMaterials(activities, filters = {}, limit = 3) {
    const have = filters.materials || [];
    const base = matchActivities(activities, { ...filters, materials: [] }).ready;
    const counts = {};
    for (const a of base) for (const m of a.materials) if (!have.includes(m)) counts[m] = (counts[m] || 0) + 1;
    return Object.entries(counts).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
      .slice(0, limit).map(([material, count]) => ({ material, count }));
  }
  const api = { matchActivities, suggestMaterials };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.STEMFilter = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
