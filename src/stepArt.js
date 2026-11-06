/* STEMMate Namibia: step-by-step picture guides for each activity.
   Drawn as small inline SVG (no image downloads), so they work offline and
   cost almost no data on shared phones (SU-01). One picture per step, in order.
   Each picture has a text alternative for screen readers. */
(function (root) {
  'use strict';
  const INK = '#24332f', ORANGE = '#c4622d', CARD = '#d9b98a', COIN = '#e3b341',
    WATER = '#6fa8c9', MUD = '#8a6a45', SAND = '#e6cf98', GRAVEL = '#9a9a8e',
    GREEN = '#4f8a3c', SUN = '#f2c230', PAPER = '#ffffff', MUTED = '#8c9a95';
  const S = `stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"`;

  // ---------- small drawing helpers ----------
  const table = (x1, x2, y) => `<path d="M${x1} ${y}H${x2}M${x1 + 8} ${y}v22M${x2 - 8} ${y}v22" ${S} fill="none"/>`;
  const ground = y => `<path d="M10 ${y}H190" ${S} fill="none"/><path d="M20 ${y + 6}h14M60 ${y + 6}h10M120 ${y + 6}h16M165 ${y + 6}h10" stroke="${MUTED}" stroke-width="2" stroke-linecap="round"/>`;
  const coin = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="${COIN}" ${S.replace('2.5', '1.5')}/>`;
  const coins = (x, y, n) => Array.from({ length: n }, (_, i) => coin(x, y - i * 4)).join('');
  const arrow = (x1, y1, x2, y2, c = ORANGE) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 7;
    const p1 = [x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)], p2 = [x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)];
    return `<path d="M${x1} ${y1}L${x2} ${y2}M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${x2} ${y2}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  };
  const dim = (x1, x2, y, label) => `<path d="M${x1} ${y}H${x2}M${x1} ${y - 5}v10M${x2} ${y - 5}v10" stroke="${ORANGE}" stroke-width="2" fill="none"/><text x="${(x1 + x2) / 2}" y="${y - 7}" text-anchor="middle" font-size="12" font-weight="700" fill="${ORANGE}">${label}</text>`;
  const t = (x, y, s, size = 16, c = INK) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${c}">${s}</text>`;
  const books = (x, y) => `<rect x="${x}" y="${y - 10}" width="26" height="10" rx="1" fill="#e9a37a" ${S.replace('2.5', '2')}/><rect x="${x + 2}" y="${y - 20}" width="24" height="10" rx="1" fill="#9cc3a8" ${S.replace('2.5', '2')}/><rect x="${x - 1}" y="${y - 30}" width="27" height="10" rx="1" fill="#f1d27a" ${S.replace('2.5', '2')}/>`;
  const zig = (x1, x2, y, h = 6, step = 6) => { let d = `M${x1} ${y}`; for (let x = x1, up = true; x < x2; x += step, up = !up) d += `L${Math.min(x + step, x2)} ${up ? y - h : y}`; return `<path d="${d}" ${S} fill="none"/>`; };
  const tick = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="${GREEN}"/><path d="M${x - 5} ${y}l3.5 4l6.5-8" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const cross = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="#b23a2a"/><path d="M${x - 4.5} ${y - 4.5}l9 9M${x + 4.5} ${y - 4.5}l-9 9" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
  const sun = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="${SUN}" ${S.replace('2.5', '1.5')}/>` + [0, 45, 90, 135, 180, 225, 270, 315].map(d => { const r = d * Math.PI / 180; return `<path d="M${(x + 14 * Math.cos(r)).toFixed(1)} ${(y + 14 * Math.sin(r)).toFixed(1)}L${(x + 19 * Math.cos(r)).toFixed(1)} ${(y + 19 * Math.sin(r)).toFixed(1)}" stroke="${SUN}" stroke-width="2.5" stroke-linecap="round"/>`; }).join('');
  const pencil = (x, y) => `<g transform="rotate(-35 ${x} ${y})"><rect x="${x}" y="${y}" width="40" height="7" fill="${SUN}" ${S.replace('2.5', '1.5')}/><path d="M${x + 40} ${y}l9 3.5l-9 3.5z" fill="${CARD}" ${S.replace('2.5', '1.5')}/></g>`;
  const sheet = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${PAPER}" ${S.replace('2.5', '2')}/>`;
  const glass = (x, y, fill) => `<path d="M${x} ${y}l4 40h22l4-40" ${S} fill="none"/><path d="M${x + 2.6} ${y + 14}l2.4 25h21l2.4-25z" fill="${fill}"/><path d="M${x} ${y}l4 40h22l4-40" ${S} fill="none"/>`;
  const noDrink = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="#b23a2a" stroke-width="3"/><path d="M${x - 5} ${y - 6}l2 12h6l2-12z" fill="${WATER}" stroke="${INK}" stroke-width="1.5"/><path d="M${x - 9} ${y - 9}l18 18" stroke="#b23a2a" stroke-width="3"/>`;
  const drop = (x, y, c = WATER) => `<path d="M${x} ${y - 9}c5 6 7 9 7 12a7 7 0 0 1-14 0c0-3 2-6 7-12z" fill="${c}" ${S.replace('2.5', '1.5')}/>`;
  const battery = (x, y) => `<rect x="${x}" y="${y}" width="40" height="18" rx="3" fill="#3d4a47" ${S.replace('2.5', '2')}/><rect x="${x + 40}" y="${y + 5}" width="5" height="8" fill="${INK}"/><rect x="${x}" y="${y}" width="12" height="18" rx="3" fill="${ORANGE}"/>${t(x + 26, y + 14, '1.5V', 10, '#fff')}`;
  const bulb = (x, y, on) => (on ? `<circle cx="${x}" cy="${y}" r="20" fill="${SUN}" opacity=".35"/>` : '') + `<circle cx="${x}" cy="${y}" r="10" fill="${on ? SUN : PAPER}" ${S.replace('2.5', '2')}/><rect x="${x - 6}" y="${y + 9}" width="12" height="9" fill="${GRAVEL}" ${S.replace('2.5', '1.5')}/><path d="M${x - 4} ${y + 2}q4-7 8 0" stroke="${INK}" stroke-width="1.5" fill="none"/>`;
  const pot = (x, y, label) => `<path d="M${x} ${y}l5 34h30l5-34z" fill="${CARD}" ${S.replace('2.5', '2')}/><path d="M${x + 2} ${y + 6}h36" stroke="${MUD}" stroke-width="5"/>${t(x + 20, y + 26, label, 14)}`;
  const car = (x, y, sail) => `<rect x="${x}" y="${y}" width="50" height="10" rx="2" fill="${CARD}" ${S.replace('2.5', '2')}/><circle cx="${x + 10}" cy="${y + 14}" r="6" fill="#d94b3d" ${S.replace('2.5', '2')}/><circle cx="${x + 40}" cy="${y + 14}" r="6" fill="#d94b3d" ${S.replace('2.5', '2')}/>` +
    (sail ? `<path d="M${x + 25} ${y}V${y - sail - 6}" ${S}/><path d="M${x + 25} ${y - sail - 4}q${sail * 0.55} ${sail / 2} 0 ${sail}" fill="${PAPER}" ${S.replace('2.5', '2')}/>` : '');
  const fan = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#cfe3ee" ${S.replace('2.5', '2')}/><path d="M${x} ${y}l-6-9M${x} ${y}l9 3M${x} ${y}l-3 9" ${S.replace('2.5', '2')}/><path d="M${x} ${y + 13}v18h-6" ${S} fill="none"/>`;
  const wind = (x, y) => `<path d="M${x} ${y - 8}q8-4 16 0t16 0M${x} ${y}q8-4 16 0t16 0M${x} ${y + 8}q8-4 16 0t16 0" stroke="${WATER}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const stick = (x, y, h = 45) => `<path d="M${x} ${y}V${y - h}" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/>`;
  const chalkX = (x, y) => `<path d="M${x - 4} ${y - 4}l8 8M${x + 4} ${y - 4}l-8 8" stroke="${ORANGE}" stroke-width="2.5" stroke-linecap="round"/>`;
  const truss = (x, y, w) => { let d = `M${x} ${y}H${x + w}M${x} ${y}`; const n = 4, s = w / n; for (let i = 0; i < n; i++) d += `L${x + s * i + s / 2} ${y - 20}L${x + s * (i + 1)} ${y}`; d += `M${x + s / 2} ${y - 20}H${x + w - s / 2}`; return `<path d="${d}" ${S} fill="none"/>`; };
  const bubble = (x, y, s) => `<path d="M${x - 18} ${y - 14}h36a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-22l-8 7v-7h-6a6 6 0 0 1-6-6v-14a6 6 0 0 1 6-6z" fill="#fff" ${S.replace('2.5', '2')}/>${t(x, y + 7, s, 15, ORANGE)}`;
  const art = (alt, body) => ({ alt, svg: `<svg viewBox="0 0 200 130" role="img" aria-label="${alt}" focusable="false" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="198" height="128" rx="10" fill="#f7f4ee" stroke="#e3ddd2"/>${body}</svg>` });

  const ART = {
    bridge: [
      art('A real bridge, and a flat sheet of paper next to a folded sheet with a question mark: which is stronger?',
        `<path d="M15 60h60M22 60q23-30 46 0M30 60v10M60 60v10" ${S} fill="none"/>${t(45, 95, 'bridge', 12, MUTED)}${sheet(100, 45, 30, 4)}${t(115, 75, 'flat', 12, MUTED)}${zig(145, 185, 50)}${t(165, 75, 'folded', 12, MUTED)}${t(140, 30, '?', 26, ORANGE)}`),
      art('Two stacks of books the same height on a table, 15 centimetres apart.',
        `${table(20, 180, 95)}${books(40, 95)}${books(134, 95)}${dim(66, 134, 52, '15 cm')}`),
      art('A flat sheet across the gap sags to the table when a few coins are added to the middle.',
        `${table(20, 180, 100)}${books(40, 100)}${books(134, 100)}<path d="M40 70H66Q100 100 134 70H160" ${S} fill="none"/>${coins(100, 82, 3)}${arrow(100, 40, 100, 62)}${cross(170, 30)}`),
      art('Fold a sheet forwards and backwards about 1 centimetre each time until it is pleated like an accordion.',
        `${sheet(15, 45, 50, 40)}<path d="M25 45v40M35 45v40M45 45v40M55 45v40" stroke="${MUTED}" stroke-width="1.5" stroke-dasharray="3 3"/>${dim(25, 35, 38, '1 cm')}${arrow(75, 65, 105, 65)}${zig(115, 185, 75, 14, 7)}`),
      art('Coins stacked on the folded paper bridge: it holds many more coins than the flat sheet.',
        `${table(20, 180, 100)}${books(40, 100)}${books(134, 100)}${zig(40, 160, 70, 7, 6)}${coins(100, 62, 9)}${tick(170, 25)}`),
      art('The folds stand up like small walls. Real bridges use folds and triangles too.',
        `${zig(15, 85, 70, 18, 10)}${arrow(50, 30, 50, 48)}${truss(110, 80, 80)}<path d="M110 80v15M190 80v15" ${S}/>${bubble(150, 30, '?')}`)
    ],
    water: [
      art('A glass of clear water and a glass of muddy water. Do not drink or taste either.',
        `${glass(40, 45, WATER)}${glass(95, 45, MUD)}${noDrink(160, 60)}`),
      art('An adult cuts the bottle. Turn the top upside down and fill it with cloth, then sand, then gravel.',
        `<path d="M25 40h30v60h-30zM30 40v-10h20v10" ${S} fill="#eaf3f7"/><path d="M20 62h40" stroke="${ORANGE}" stroke-width="2.5" stroke-dasharray="5 4"/>${arrow(70, 70, 95, 70)}<path d="M110 30h60l-22 50h-16z" fill="#eaf3f7" ${S}/><path d="M112 33h56l-5 11h-46z" fill="${GRAVEL}"/><path d="M117 44h46l-6 13h-34z" fill="${SAND}"/><path d="M123 57h34l-6 13h-22z" fill="#f4f0e8" stroke="${MUTED}"/><path d="M110 30h60l-22 50h-16z" ${S} fill="none"/>${t(185, 42, 'G', 11, MUTED)}${t(185, 55, 'S', 11, MUTED)}${t(185, 68, 'C', 11, MUTED)}`),
      art('Pour a little muddy water into the filter. Cleaner water drips into a container below.',
        `<path d="M25 25h28l-3 30h-22z" fill="${MUD}" ${S.replace('2.5', '2')} transform="rotate(35 39 40)"/><path d="M62 52q6 6 10 14" stroke="${MUD}" stroke-width="3" fill="none"/><path d="M80 50h60l-22 40h-16z" fill="${SAND}" ${S}/><path d="M83 52h54l-4 8h-46z" fill="${GRAVEL}"/>${drop(110, 104, '#a9cde0')}<path d="M90 100h40v22h-40z" ${S} fill="#d7e9f2"/>`),
      art('Compare the water before and after. It looks cleaner but it is still not safe to drink.',
        `${glass(35, 50, MUD)}${t(50, 115, 'before', 11, MUTED)}${arrow(75, 75, 100, 75)}${glass(110, 50, '#b8d7e6')}${t(125, 115, 'after', 11, MUTED)}${noDrink(170, 55)}`)
    ],
    shadow: [
      art('Stand a stick straight up on flat ground outside in the sun.',
        `${sun(165, 30)}${ground(105)}${stick(80, 105, 55)}${arrow(115, 60, 88, 60)}`),
      art('Mark the tip of the shadow with chalk, then lay string along the shadow to measure it.',
        `${sun(30, 25)}${ground(100)}${stick(70, 100, 50)}<path d="M72 96L150 96" stroke="#5c5c5c" stroke-width="7" opacity=".5" stroke-linecap="round"/>${chalkX(150, 100)}<path d="M70 92q40-6 80 0" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="4 3" fill="none"/>`),
      art('Come back later. The sun has moved, so the shadow points a new way and has a new length. Mark it again.',
        `${sun(165, 22)}<circle cx="35" cy="45" r="8" fill="none" stroke="${SUN}" stroke-width="2" stroke-dasharray="3 3"/>${arrow(48, 38, 145, 24, MUTED)}${ground(105)}${stick(100, 105, 45)}<path d="M102 101L175 101" stroke="#5c5c5c" stroke-width="6" opacity=".3" stroke-linecap="round"/>${chalkX(175, 105)}<path d="M98 101L45 101" stroke="#5c5c5c" stroke-width="6" opacity=".55" stroke-linecap="round"/>${chalkX(45, 105)}`),
      art('Draw the stick and both shadows on paper and talk about what changed.',
        `${sheet(30, 25, 110, 85)}<path d="M85 90V55" stroke="#8a5a2b" stroke-width="3"/><path d="M85 90H125M85 90H55" stroke="#5c5c5c" stroke-width="4" opacity=".5"/>${t(60, 105, '1', 11, ORANGE)}${t(122, 105, '2', 11, ORANGE)}${pencil(140, 95)}`)
    ],
    circuit: [
      art('Lay out a battery, a small bulb and two wires.',
        `${battery(20, 55)}${bulb(110, 55, false)}<path d="M145 40q20 10 0 25M160 55q20 10 0 25" stroke="#d94b3d" stroke-width="3" fill="none" stroke-linecap="round"/>`),
      art('Join the battery to the bulb with two wires to make a loop. The bulb lights up.',
        `${battery(30, 85)}${bulb(130, 45, true)}<path d="M30 94H18V45H120" stroke="#d94b3d" stroke-width="3" fill="none"/><path d="M75 94H130V63" stroke="#2f2f2f" stroke-width="3" fill="none"/>${tick(175, 30)}`),
      art('Take one wire off. The loop is open and the bulb goes out. Then join it again.',
        `${battery(30, 85)}${bulb(130, 45, false)}<path d="M30 94H18V45H60M80 45H120" stroke="#d94b3d" stroke-width="3" fill="none"/><path d="M75 94H130V63" stroke="#2f2f2f" stroke-width="3" fill="none"/>${t(70, 38, '?', 20, ORANGE)}${cross(175, 30)}`),
      art('Draw the circuit on paper and trace the complete path around the loop with your finger.',
        `${sheet(25, 20, 150, 95)}<path d="M55 45H145V95H55Z" ${S} fill="none"/><path d="M90 95v-10M100 95v-18" stroke="${INK}" stroke-width="3"/><circle cx="100" cy="45" r="9" fill="#fff" ${S.replace('2.5', '2')}/><path d="M94 39l12 12M106 39l-12 12" stroke="${INK}" stroke-width="2"/>${arrow(150, 60, 150, 82)}${arrow(50, 80, 50, 58)}`)
    ],
    seed: [
      art('Look at the seeds. What do they need to grow? Water? Sun?',
        `<ellipse cx="45" cy="70" rx="9" ry="6" fill="${CARD}" ${S.replace('2.5', '2')}/><ellipse cx="65" cy="80" rx="9" ry="6" fill="${CARD}" ${S.replace('2.5', '2')}/><ellipse cx="50" cy="90" rx="9" ry="6" fill="${CARD}" ${S.replace('2.5', '2')}/>${bubble(110, 45, '?')}${drop(150, 85)}${sun(175, 80)}`),
      art('Put the same number of seeds in two containers labelled A and B.',
        `${pot(40, 60, 'A')}${pot(120, 60, 'B')}<circle cx="52" cy="40" r="3" fill="${MUD}"/><circle cx="60" cy="34" r="3" fill="${MUD}"/><circle cx="68" cy="40" r="3" fill="${MUD}"/><circle cx="132" cy="40" r="3" fill="${MUD}"/><circle cx="140" cy="34" r="3" fill="${MUD}"/><circle cx="148" cy="40" r="3" fill="${MUD}"/>${t(60, 25, '3', 13, ORANGE)}${t(140, 25, '3', 13, ORANGE)}`),
      art('Water container A. Do not water container B.',
        `${pot(40, 75, 'A')}${pot(120, 75, 'B')}<path d="M30 30h30v20H30zM60 35l20 10M30 35q-10 5 0 12" fill="${WATER}" ${S.replace('2.5', '2')}/><path d="M80 48v6M74 52v8M86 52v6" stroke="${WATER}" stroke-width="2.5" stroke-linecap="round"/>${drop(140, 50)}<path d="M128 38l24 24" stroke="#b23a2a" stroke-width="3"/>`),
      art('Check every day and draw what you see in a simple table: day 1, day 2, day 3.',
        `${sheet(20, 25, 160, 85)}<path d="M20 50h160M73 25v85M127 25v85" stroke="${MUTED}" stroke-width="1.5"/>${t(46, 43, '1', 13)}${t(100, 43, '2', 13)}${t(153, 43, '3', 13)}<path d="M36 95h20M90 95h20M143 95h20" stroke="${MUD}" stroke-width="3"/><path d="M100 95v-10" stroke="${GREEN}" stroke-width="2.5"/><path d="M153 95v-30M153 75q-10-6-12 2M153 70q10-6 12 2" stroke="${GREEN}" stroke-width="2.5" fill="none"/>`)
    ],
    wind: [
      art('Sketch a model car on paper. Collect cardboard, bottle caps, straws and paper to reuse.',
        `${sheet(15, 25, 80, 70)}<g transform="translate(25 62) scale(.9)">${car(0, 0, 18)}</g>${pencil(70, 100)}<rect x="115" y="30" width="45" height="25" fill="${CARD}" ${S.replace('2.5', '2')}/><circle cx="125" cy="78" r="8" fill="#d94b3d" ${S.replace('2.5', '2')}/><circle cx="148" cy="78" r="8" fill="#2f78b7" ${S.replace('2.5', '2')}/><path d="M168 30v60M178 30v60" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round"/>`),
      art('Push straws through the adult-made holes in the cardboard base and fix a bottle-cap wheel on each end.',
        `<rect x="55" y="50" width="90" height="16" rx="2" fill="${CARD}" ${S.replace('2.5', '2')}/><circle cx="70" cy="58" r="2.5" fill="${INK}"/><circle cx="130" cy="58" r="2.5" fill="${INK}"/><path d="M70 92V24M130 92V24" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="18" r="8" fill="#d94b3d" ${S.replace('2.5', '2')}/><circle cx="130" cy="18" r="8" fill="#d94b3d" ${S.replace('2.5', '2')}/><circle cx="70" cy="104" r="8" fill="#d94b3d" ${S.replace('2.5', '2')}/><circle cx="130" cy="104" r="8" fill="#d94b3d" ${S.replace('2.5', '2')}/>${t(170, 64, 'top', 11, MUTED)}`),
      art('Attach a paper sail. Put a fan a fixed distance behind the car, switch it on and see how far the car goes.',
        `${fan(25, 70)}${wind(45, 70)}<g transform="translate(95 80)">${car(0, 0, 30)}</g>${arrow(150, 105, 190, 105)}<path d="M10 101H190" stroke="${MUTED}" stroke-width="1.5"/>${dim(25, 95, 25, '50 cm')}`),
      art('Change one thing about the sail, for example make it bigger. Test again and compare how far each car goes.',
        `<g transform="translate(15 45)">${car(0, 0, 14)}</g>${arrow(70, 50, 110, 50)}<g transform="translate(15 105)">${car(0, 0, 30)}</g>${arrow(70, 110, 175, 110)}${t(120, 40, 'small', 11, MUTED)}${t(185, 95, 'big', 11, MUTED)}`)
    ]
  };

  function stepArt(activityId, index) {
    const list = ART[activityId];
    return list && list[index] ? list[index] : null;
  }
  const api = { stepArt, ART };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.STEMArt = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
