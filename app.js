/* Lexicon Latinum — app logic */
(function () {
  'use strict';
  const APP_BUILD = '2026-10-28.0159';
  const $ = s => document.querySelector(s);
  const view = $('#view');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const load = (k, d) => { try { const v = localStorage.getItem('lx.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem('lx.' + k, JSON.stringify(v)); } catch (e) { } };
  const S = { settings: Object.assign({ macrons: true, rare: false, cit: true, theme: 'auto', font: 'mixed', fs: 16, abridge: true }, load('settings', {})), history: load('history', []), favs: load('favs', []) };
  const norm = s => Morph.norm(s.normalize('NFD').replace(/[̀-ͯ]/g, '')).replace(/[^a-z' -]/g, '');
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // ---------------- IndexedDB cache for data chunks ----------------
  const DB = {
    db: null,
    open() { return new Promise(res => { if (this.db) return res(this.db); try { const r = indexedDB.open('lexicon', 1); r.onupgradeneeded = () => r.result.createObjectStore('chunks'); r.onsuccess = () => { this.db = r.result; res(this.db); }; r.onerror = () => res(null); } catch (e) { res(null); } }); },
    async get(k) { const db = await this.open(); if (!db) return null; return new Promise(res => { try { const r = db.transaction('chunks').objectStore('chunks').get(k); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); } catch (e) { res(null); } }); },
    async set(k, v) { const db = await this.open(); if (!db) return; try { db.transaction('chunks', 'readwrite').objectStore('chunks').put(v, k); } catch (e) { } },
    async clear() { const db = await this.open(); if (!db) return; try { db.transaction('chunks', 'readwrite').objectStore('chunks').clear(); } catch (e) { } },
  };
  const mem = {};
  async function getJSON(url) {
    if (mem[url]) return mem[url];
    let data = await DB.get(url);
    if (!data) {
      const r = await fetch(url, { cache: 'force-cache' });
      if (!r.ok) throw new Error('fetch ' + url + ' ' + r.status);
      data = await r.json();
      DB.set(url, data);
    }
    mem[url] = data;
    return data;
  }

  // ---------------- data access ----------------
  const Data = { ready: null, lsBounds: null, meta: null, wwIdx: {} };
  Data.ready = (async () => {
    const [infl, bounds, meta] = await Promise.all([getJSON('data/inflects.json'), getJSON('data/ls_index.json'), getJSON('data/meta.json').catch(() => ({}))]);
    Morph.load(infl); Macrons.setStemsFn(Morph.stems); Data.lsBounds = bounds; Data.meta = meta;
  })();
  const letterOf = s => { const c = norm(s)[0]; return c && /[a-z]/.test(c) ? c : '_'; };
  // data may be stored one file per letter, or grouped (meta.groups maps letter -> file holding {letter: [...]})
  const groupFile = L => (Data.meta && Data.meta.groups && Data.meta.groups[L]) || null;
  async function idx(L) { const g = groupFile(L); if (g) { const o = await getJSON(`data/idx/${g}.json`).catch(() => ({})); return o[L] || []; } return getJSON(`data/idx/${L}.json`).catch(() => []); }
  async function wwChunk(L) { const g = groupFile(L); let arr; if (g) { const o = await getJSON(`data/ww/${g}.json`).catch(() => ({})); arr = o[L] || []; } else arr = await getJSON(`data/ww/${L}.json`).catch(() => []); if (!arr._map) { Object.defineProperty(arr, '_map', { value: new Map(arr.map(e => [e.i, e])) }); } return arr; }
  async function enIndex(L) { const g = groupFile(L); if (g) { const o = await getJSON(`data/en/${g}.json`).catch(() => ({})); return o[L] || {}; } return getJSON(`data/en/${L}.json`).catch(() => ({})); }
  async function englishResults(q) {
    let w = q.toLowerCase().trim().replace(/^(to|a|an|the|be)\s+/, '').replace(/[^a-z' -]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (w.length < 2) return { word: w, list: [] };
    const L = /[a-z]/.test(w[0]) ? w[0] : '_';
    const en = await enIndex(L);
    const hits = (en[w] || []).map(([nk, sc]) => ({ nk, s: sc, key: w }));
    if (hits.length < 15) {
      const alt = []; if (w.endsWith('s')) alt.push(w.slice(0, -1)); if (w.endsWith('es')) alt.push(w.slice(0, -2)); if (w.endsWith('ies')) alt.push(w.slice(0, -3) + 'y'); if (w.endsWith('ed')) alt.push(w.slice(0, -2), w.slice(0, -1)); if (w.endsWith('ing')) alt.push(w.slice(0, -3), w.slice(0, -3) + 'e');
      for (const a of alt) for (const [nk, sc] of (en[a] || []).slice(0, 40)) hits.push({ nk, s: sc + 2, key: a });
      const keys = Object.keys(en).filter(k => k !== w && k.length > w.length && (k.startsWith(w) || k.startsWith(w + ' '))).sort((a, b) => a.length - b.length).slice(0, 15);
      for (const k of keys) for (const [nk, sc] of en[k].slice(0, 15)) hits.push({ nk, s: sc + 30 + (k.length - w.length), key: k });
    }
    const best = new Map(); for (const h of hits) { const p = best.get(h.nk); if (!p || h.s < p.s) best.set(h.nk, h); }
    const list = [...best.values()].sort((a, b) => a.s - b.s).slice(0, 60);
    const byL = {}; for (const h of list) (byL[letterOf(h.nk)] = byL[letterOf(h.nk)] || []).push(h);
    const recs = new Map();
    await Promise.all(Object.keys(byL).map(async L2 => { const arr = await idx(L2); const m = new Map(arr.map(r => [r[0], r])); for (const h of byL[L2]) { const r = m.get(h.nk); if (r) recs.set(h.nk, r); } }));
    return { word: w, list: list.map(h => ({ ...h, r: recs.get(h.nk) })).filter(h => h.r) };
  }
  async function wwIndex(L) { if (Data.wwIdx[L]) return Data.wwIdx[L]; const arr = await wwChunk(L); return (Data.wwIdx[L] = Morph.buildIndex(arr)); }
  function lsChunkFor(nk) { const b = Data.lsBounds; let lo = 0, hi = b.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (b[mid] <= nk) lo = mid; else hi = mid - 1; } return lo; }
  async function lsEntries(nk) {
    const ci = lsChunkFor(nk); const out = [];
    for (const c of [ci, ci + 1]) { if (c >= Data.lsBounds.length) continue; const chunk = await getJSON(`data/ls/${String(c).padStart(3, '0')}.json`).catch(() => []); for (const e of chunk) if (norm(e.k).replace(/\d+$/, '') === nk) out.push(e); }
    return out;
  }
  async function idxRecord(nk) { const arr = await idx(letterOf(nk)); return arr.find(r => r[0] === nk) || null; }

  // ---------------- helpers ----------------
  const fmt = (e) => x => S.settings.macrons ? Macrons.mac(e, x) : x.f;
  const PACKS_ALL = typeof PACKS !== 'undefined' ? PACKS : {};
  function packFor(e) {
    const [d, v] = e.c || [0, 0]; const g = e.g; const hw = norm(e.hw || '');
    if (e.p === 'N') {
      if (d === 1) return g === 'M' ? 'N-1-M' : 'N-1-F';
      if (d === 2) { if (v === 3) return 'N-2-ER'; if (v === 4 || v === 5) return 'N-2-IUS'; if (v >= 6) return 'N-GREEK'; return g === 'N' ? 'N-2-N' : 'N-2-M'; }
      if (d === 3) { if (v >= 6) return 'N-GREEK'; if (g === 'N') return v === 4 ? 'N-3-N-I' : 'N-3-N'; if (v === 3) return 'N-3-I'; return g === 'F' ? 'N-3-F' : 'N-3-M'; }
      if (d === 4) return g === 'N' ? 'N-4-N' : g === 'F' ? 'N-4-F' : 'N-4-M';
      if (d === 5) return g === 'M' ? 'N-5-M' : 'N-5-F';
      if (d === 9) return 'N-INDECL';
    }
    if (e.p === 'ADJ') {
      if (d === 0) return e.k === 'SUPER' ? 'ADJ-SUPER' : 'ADJ-COMP';
      if (d === 1) { if (v === 2) return 'ADJ-1-2-ER'; if (v === 3 || v === 4 || v === 5) return 'ADJ-PRONOMINAL'; return 'ADJ-1-2'; }
      if (d === 3) return v === 1 ? 'ADJ-3-1' : v === 3 ? 'ADJ-3-3' : 'ADJ-3-2';
      if (d === 9) return 'ADJ-INDECL';
      return 'ADJ-1-2';
    }
    if (e.p === 'V') {
      const k = e.k || 'X';
      if (d === 5) return v === 2 ? 'V-POSSUM' : 'V-SUM';
      if (d === 6) return v === 1 ? 'V-EO' : 'V-VOLO';
      if (d === 7) return v === 3 ? 'V-EDO' : 'V-DEFECTIVE';
      if (k === 'IMPERS') return 'V-IMPERS';
      if (k === 'PERFDEF') return 'V-PERFDEF';
      if (d === 3 && v === 2) return 'V-FERO';
      if (d === 3 && v === 3) return 'V-FIO';
      if (k === 'SEMIDEP') return 'V-SEMIDEP';
      const dep = k === 'DEP';
      if (d === 1 && (e.s[0] === 'd' || /d$/.test(e.s[0]) && e.s[2] && /ded$/.test(e.s[2]))) return 'V-DO';
      if (d === 1) return dep ? 'V-1-DEP' : 'V-1';
      if (d === 2) return dep ? 'V-2-DEP' : 'V-2';
      if (d === 3 && v === 4) return dep ? 'V-4-DEP' : 'V-4';
      const io = d === 3 && /i$/.test(e.s[0] || '') && !/i$/.test(e.s[1] || '');
      if (d === 3) return io ? (dep ? 'V-3IO-DEP' : 'V-3IO') : (dep ? 'V-3-DEP' : 'V-3');
    }
    if (e.p === 'PRON' || e.p === 'PACK') {
      const m = { ego: 'PRON-PERS', tu: 'PRON-PERS', nos: 'PRON-PERS', uos: 'PRON-PERS', sui: 'PRON-REFL', se: 'PRON-REFL', hic: 'PRON-HIC', ille: 'PRON-ILLE', iste: 'PRON-ISTE', is: 'PRON-IS', idem: 'PRON-IDEM', ipse: 'PRON-IPSE', qui: 'PRON-QUI', quis: 'PRON-QUIS', aliquis: 'PRON-INDEF', aliqui: 'PRON-INDEF', quidam: 'PRON-INDEF', quisque: 'PRON-INDEF', quisquam: 'PRON-INDEF', quiuis: 'PRON-INDEF', quilibet: 'PRON-INDEF' };
      return m[hw] || (e.k === 'PERS' ? 'PRON-PERS' : e.k === 'REL' ? 'PRON-QUI' : e.k === 'INTERR' ? 'PRON-QUIS' : e.k === 'INDEF' ? 'PRON-INDEF' : 'PRON-HIC');
    }
    if (e.p === 'NUM') return 'NUM';
    if (e.p === 'ADV') return 'ADV';
    return null;
  }
  const ORD = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' };
  function classLabel(e) {
    const [d, v] = e.c || [0, 0]; const parts = [CORE.pos[e.p] || e.p.toLowerCase()];
    if (e.p === 'N') { if (d >= 1 && d <= 5) parts.push(ORD[d] + ' declension' + (d === 3 && v === 3 ? ' (i-stem)' : d === 2 && v === 3 ? ' (-er)' : '')); else if (d === 9) parts.push(v === 8 ? 'abbreviation' : 'indeclinable'); parts.push({ M: 'masculine', F: 'feminine', N: 'neuter', C: 'masc./fem.' }[e.g] || ''); if (e.plOnly) parts.push('plural only'); }
    if (e.p === 'ADJ') { if (d === 1) parts.push('1st/2nd declension'); else if (d === 3) parts.push('3rd declension' + (v === 1 ? ', one termination' : v === 2 ? ', two terminations' : v === 3 ? ', three terminations' : '')); else if (d === 0) parts.push(e.k === 'SUPER' ? 'superlative' : 'comparative'); else if (d === 9) parts.push('indeclinable'); }
    if (e.p === 'V') { const k = e.k || 'X'; if (d === 1 || d === 2) parts.push(ORD[d] + ' conjugation'); else if (d === 3 && v === 4) parts.push('4th conjugation'); else if (d === 3 && v === 1) parts.push(/i$/.test(e.s[0] || '') && !/i$/.test(e.s[1] || '') ? '3rd conjugation (-iō)' : '3rd conjugation'); else if (d === 3 && v === 2) parts.push('irregular (ferō type)'); else if (d === 3 && v === 3) parts.push('irregular (fīō type)'); else if (d === 5) parts.push('irregular (sum type)'); else if (d === 6) parts.push('irregular'); else if (d === 7) parts.push('defective'); if (k === 'DEP') parts.push('deponent'); if (k === 'SEMIDEP') parts.push('semi-deponent'); if (k === 'IMPERS') parts.push('impersonal'); if (k === 'PERFDEF') parts.push('perfect-defective'); if (k === 'TRANS') parts.push('transitive'); if (k === 'INTRANS') parts.push('intransitive'); if (k === 'DAT') parts.push('takes the dative'); }
    if (e.p === 'PREP') parts.push('+ ' + ({ ACC: 'accusative', ABL: 'ablative', GEN: 'genitive' }[e.k] || ''));
    if (e.p === 'NUM') parts.push({ CARD: 'cardinal', ORD: 'ordinal', DIST: 'distributive', ADVERB: 'adverb' }[e.k] || '');
    return parts.filter(Boolean).join(' · ');
  }
  function flagsChips(e) {
    const a = e.f && e.f[0], fr = e.f && e.f[3]; const out = [];
    if (a && a !== 'X' && CORE.age[a]) out.push(`<span class="chip">${esc(CORE.age[a])}</span>`);
    if (fr && CORE.freq[fr] && 'ABCDEF'.includes(fr)) out.push(`<span class="chip">${esc(CORE.freq[fr])}</span>`);
    return out.join('');
  }
  const lsPosClass = (m) => { const ps = (m.ps || '').toLowerCase(), g = (m.g || '').toLowerCase(), it = strip(m.it || ''); if (/adj/.test(ps) || /^(a, um|e|is, e|ra, rum|cris, cre)$/.test(it)) return 'ADJ'; if (/^v\b|^v\./.test(ps)) return 'V'; if (/adv/.test(ps)) return 'ADV'; if (/prep|praep/.test(ps)) return 'PREP'; if (/conj/.test(ps)) return 'CONJ'; if (/interj/.test(ps)) return 'INTERJ'; if (/pron/.test(ps)) return 'PRON'; if (/num/.test(ps)) return 'NUM'; if (/^(m|f|n|comm|com)\./.test(g)) return 'N'; if (/p\. a\.|subst/.test(ps)) return 'ADJ'; if (/^(ae|i|ii|is|us|ei|onis|oris|atis|inis|idis|icis|itis|entis|orum|arum)$/.test(it)) return 'N'; if (/^[a-z]+is$/.test(it) && !ps) return 'N'; return ''; };
  function toast(msg, ms) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => t.hidden = true, ms || 1800); }
  function macHw(e) { if (!S.settings.macrons) return e.hw; const forms = Morph.generate(e); const x = forms.find(f => f.f === e.hw && f.common) || forms.find(f => f.f === e.hw); return x ? Macrons.mac(e, x) : e.hw; }
  function principalParts(e) {
    const forms = Morph.generate(e); const f = fmt(e);
    const hp = Morph.headwordAndParts(e, forms);
    const mapped = hp.parts.map(p => { if (p.endsWith(' sum')) { const base = p.slice(0, -4); const x = forms.find(y => y.f === base && y.r.p === 'VPAR') || forms.find(y => y.f === base); return (x ? f(x) : base) + ' sum'; } const x = forms.find(y => y.f === p && y.common) || forms.find(y => y.f === p); return x ? f(x) : p; });
    if (e.p === 'ADJ' && e.degrees) mapped.push(...e.degrees.map(p => { const x = forms.find(y => y.f === p && y.common) || forms.find(y => y.f === p); return x ? f(x) : p; }));
    return mapped;
  }

  // ---------------- table rendering ----------------
  function cellHTML(cell, e, hl) {
    const f = fmt(e); const show = S.settings.rare ? cell : cell.filter(x => x.common);
    const list = show.length ? show : cell.slice(0, 1);
    return list.map((x, i) => { const txt = f(x); const isHl = hl && norm(x.f) === hl; return `<span class="${x.common ? '' : 'rare'}${isHl ? ' hlf' : ''}">${esc(txt)}</span>`; }).join('<span class="alt"> / </span>');
  }
  const CASE_ABBR = { NOM: 'Nom.', GEN: 'Gen.', DAT: 'Dat.', ACC: 'Acc.', ABL: 'Abl.', VOC: 'Voc.', LOC: 'Loc.' };
  function ibtn(payload) { return `<button class="ibtn" data-info='${esc(JSON.stringify(payload))}' aria-label="Explain">i</button>`; }
  function nounTableHTML(e, forms, hl, ctx) {
    const t = Morph.nounTable(forms); const rows = [];
    const cases = Morph.CASES.filter(c => c !== 'LOC' || (S.settings.rare && t.hasLoc));
    if (t.indeclinable) return `<p class="muted small">Indeclinable: the same form <b class="la">${esc(macHw(e))}</b> is used in every case.</p>`;
    rows.push(`<tr><th></th><th>Singular</th><th>Plural</th></tr>`);
    for (const c of cases) {
      const S_ = t.cases[c].S, P_ = t.cases[c].P; if (!S_.length && !P_.length) continue;
      const hlS = hl && S_.some(x => norm(x.f) === hl), hlP = hl && P_.some(x => norm(x.f) === hl);
      rows.push(`<tr><th>${CASE_ABBR[c]}${ibtn({ kind: 'case', cs: c, nm: 'S', ctx })}</th><td class="la${hlS ? ' hl' : ''}">${cellHTML(S_, e, hl)}</td><td class="la${hlP ? ' hl' : ''}">${cellHTML(P_, e, hl)}</td></tr>`);
    }
    return `<table class="para">${rows.join('')}</table>`;
  }
  function adjDegreeTableHTML(e, deg, d, hl, ctx, posFilter) {
    const cases = Morph.CASES.filter(c => c !== 'LOC');
    const gens = ['M', 'F', 'N'];
    // merge identical gender columns
    const same = (g1, g2) => cases.every(c => ['S', 'P'].every(n => { const a = d.cases[c][n][g1].map(x => x.f).join('/'), b = d.cases[c][n][g2].map(x => x.f).join('/'); return a === b; }));
    let cols;
    if (same('M', 'F') && same('F', 'N')) cols = [['M', 'M/F/N']];
    else if (same('M', 'F')) cols = [['M', 'M/F'], ['N', 'N']];
    else cols = [['M', 'M'], ['F', 'F'], ['N', 'N']];
    let html = '';
    for (const n of ['S', 'P']) {
      const rows = [`<tr><th>${n === 'S' ? 'Singular' : 'Plural'}</th>${cols.map(c => `<th>${c[1]}</th>`).join('')}</tr>`];
      for (const c of cases) {
        if (cols.every(([g]) => !d.cases[c][n][g].length)) continue;
        rows.push(`<tr><th>${CASE_ABBR[c]}${ibtn({ kind: 'case', cs: c, nm: n, deg, ctx })}</th>${cols.map(([g]) => { const cell = d.cases[c][n][g]; const h = hl && cell.some(x => norm(x.f) === hl); return `<td class="la${h ? ' hl' : ''}">${cellHTML(cell, e, hl)}</td>`; }).join('')}</tr>`);
      }
      html += `<table class="para">${rows.join('')}</table>`;
    }
    return html;
  }
  function adjTableHTML(e, forms, hl, ctx) {
    const degrees = Morph.adjTable(forms);
    const order = ['POS', 'COMP', 'SUPER', 'CARD', 'ORD', 'DIST', 'ADVERB'].filter(k => degrees[k]);
    if (!order.length) return '';
    const id = 'deg' + Math.random().toString(36).slice(2, 7);
    let html = '';
    if (order.length > 1) html += `<div class="subtabs" data-group="${id}">${order.map((k, i) => `<button class="${i === 0 ? 'on' : ''}" data-show="${id}-${k}">${esc(Morph.LABEL[k] || k)}</button>`).join('')}</div>`;
    order.forEach((k, i) => { html += `<div id="${id}-${k}" class="degpane" ${i ? 'hidden' : ''}>${order.length > 1 && k !== 'POS' ? `<div class="toggle-row">${ibtn({ kind: 'degree', deg: k, ctx })}<span class="small muted">${esc((CORE.degrees[k] || {}).short || '')}</span></div>` : ''}${adjDegreeTableHTML(e, k, degrees[k], hl, ctx)}</div>`; });
    return html;
  }
  const TENSE_ORDER = ['PRES', 'IMPF', 'FUT', 'PERF', 'PLUP', 'FUTP'];
  const PERS_LABEL = ['1 sg.', '2 sg.', '3 sg.', '1 pl.', '2 pl.', '3 pl.'];
  function verbTableHTML(e, forms, hl, ctx) {
    const f = fmt(e); const t = Morph.verbTable(forms, e, f);
    const id = 'v' + Math.random().toString(36).slice(2, 7);
    const voices = ['ACTIVE', 'PASSIVE'].filter(v => Object.values(t.finite).some(b => b.vo === v) || Object.values(t.imperative).some(b => b.vo === v));
    const dep = e.k === 'DEP';
    const block = (b) => {
      if (!b) return '';
      const key = `${b.vo} ${b.md} ${b.t}`;
      const anyHl = hl && b.cells.some(c => c.some(x => norm(x.f.replace(/ .*$/, '')) === hl || norm(x.f) === hl));
      return `<div class="block"><h4>${esc(Morph.LABEL[b.t])}${b.peri ? ' <span class="muted small">(periphrastic)</span>' : ''}${ibtn({ kind: 'verb', key, ctx })}</h4><table class="para">${b.cells.map((c, i) => c.length ? `<tr><th>${PERS_LABEL[i]}</th><td class="la${hl && c.some(x => norm(x.f) === hl || norm(x.f.split(' ')[0]) === hl) ? ' hl' : ''}">${cellHTML(c, e, hl)}</td></tr>` : '').join('')}</table></div>`;
    };
    const moodPane = (md, vo) => { const blocks = TENSE_ORDER.map(tn => t.finite[`${vo} ${md} ${tn}`]).filter(Boolean); if (!blocks.length) return ''; return `<div class="grid2">${blocks.map(block).join('')}</div>`; };
    const impPane = (vo) => { const bl = ['PRES', 'FUT'].map(tn => t.imperative[`${vo} ${tn}`]).filter(Boolean); if (!bl.length) return ''; return `<div class="grid2">${bl.map(b => `<div class="block"><h4>${esc(Morph.LABEL[b.t])} imperative${ibtn({ kind: 'verb', key: `IMP ${b.vo} ${b.t}`, ctx })}</h4><table class="para">${Object.entries(b.cells).filter(([, c]) => c.length).map(([p, c]) => `<tr><th>${p[0]} ${p[1] === 'S' ? 'sg.' : 'pl.'}</th><td class="la${hl && c.some(x => norm(x.f) === hl) ? ' hl' : ''}">${cellHTML(c, e, hl)}</td></tr>`).join('')}</table></div>`).join('')}</div>`; };
    const infPane = () => {
      const infs = ['ACTIVE', 'PASSIVE'].flatMap(vo => ['PRES', 'PERF', 'FUT'].map(tn => t.infinitives[`${vo} ${tn}`]).filter(Boolean));
      const ppls = [['ACTIVE PRES', 'Present active participle'], ['PASSIVE PERF', dep ? 'Perfect participle (active sense)' : 'Perfect passive participle'], ['ACTIVE FUT', 'Future active participle'], ['PASSIVE FUT', 'Gerundive (future passive participle)']].filter(([k]) => t.participles[k]);
      let html = '';
      if (infs.length) html += `<div class="block"><h4>Infinitives</h4><table class="para">${infs.map(b => `<tr><th>${esc(Morph.LABEL[b.t])} ${b.vo.toLowerCase()}${ibtn({ kind: 'verb', key: `INF ${b.vo} ${b.t}`, ctx })}</th><td class="la${hl && b.cells.some(x => norm(x.f.split(' ')[0]) === hl) ? ' hl' : ''}">${cellHTML(b.cells, e, hl)}</td></tr>`).join('')}</table></div>`;
      if (ppls.length) html += `<div class="block"><h4>Participles</h4><table class="para">${ppls.map(([k, label]) => { const p = t.participles[k]; const nom = p.nom; const cellForms = p.forms.filter(x => x.r.cs === 'NOM' && x.r.nm === 'S'); const h = hl && p.forms.some(x => norm(x.f) === hl); return `<tr><th>${esc(label)}${ibtn({ kind: 'verb', key: `PPL ${k}`, ctx })}</th><td class="la${h ? ' hl' : ''}">${['M', 'F', 'N'].map(g => { const c = cellForms.filter(x => x.r.g === g || x.r.g === 'X' || (x.r.g === 'C' && g !== 'N')); return c.length ? cellHTML(c.slice(0, 1), e, hl) : ''; }).filter((v, i, a) => v && a.indexOf(v) === i).join(', ')} <button class="btn small decl" data-ppl="${k}" data-ctx="${esc(ctx)}">decline</button></td></tr>`; }).join('')}</table></div>`;
      if (t.supine.ACC || t.supine.ABL) html += `<div class="block"><h4>Supine${ibtn({ kind: 'verb', key: 'SUPINE', ctx })}</h4><table class="para">${['ACC', 'ABL'].filter(c => t.supine[c]).map(c => `<tr><th>${CASE_ABBR[c]}</th><td class="la">${cellHTML(t.supine[c], e, hl)}</td></tr>`).join('')}</table></div>`;
      const ger = t.participles['PASSIVE FUT'];
      if (ger) { const nN = ger.forms.filter(x => x.r.g === 'N' || x.r.g === 'X').filter(x => x.r.nm === 'S'); const get = cs => nN.filter(x => x.r.cs === cs); if (get('GEN').length) html += `<div class="block"><h4>Gerund${ibtn({ kind: 'verb', key: 'GERUND', ctx })}</h4><table class="para">${['GEN', 'DAT', 'ACC', 'ABL'].map(cs => `<tr><th>${CASE_ABBR[cs]}</th><td class="la">${cs === 'ACC' ? '(ad) ' : ''}${cellHTML(get(cs).slice(0, 1), e, hl)}</td></tr>`).join('')}</table></div>`; }
      return html;
    };
    const panes = [];
    for (const md of ['IND', 'SUB']) for (const vo of voices) { const h = moodPane(md, vo); if (h) panes.push([`${Morph.LABEL[md]}${voices.length > 1 ? ' ' + vo.toLowerCase() : ''}`, h]); }
    for (const vo of voices) { const h = impPane(vo); if (h) panes.push([`Imperative${voices.length > 1 ? ' ' + vo.toLowerCase() : ''}`, h]); }
    const ih = infPane(); if (ih) panes.push(['Infinitives & participles', ih]);
    if (!panes.length) return '';
    // open the pane containing the highlighted form, else the first
    let openIdx = 0; if (hl) { const i = panes.findIndex(p => / hl"/.test(p[1])); if (i >= 0) openIdx = i; }
    return `<div class="subtabs" data-group="${id}">${panes.map((p, i) => `<button class="${i === openIdx ? 'on' : ''}" data-show="${id}-${i}">${esc(p[0])}</button>`).join('')}</div>${panes.map((p, i) => `<div id="${id}-${i}" ${i === openIdx ? '' : 'hidden'}>${p[1]}</div>`).join('')}`;
  }
  function curatedTableHTML(tbl) {
    // {"NOM S": {M,F,N}} or nested by word
    const first = Object.values(tbl)[0];
    if (first && typeof first === 'object' && !('M' in first) && !('F' in first) && !('N' in first)) {
      return Object.entries(tbl).filter(([k, v]) => typeof v === 'object').map(([w, t]) => `<h3 class="la">${esc(w)}</h3>${curatedTableHTML(t)}`).join('');
    }
    const keys = Object.keys(tbl).filter(k => typeof tbl[k] === 'object');
    if (keys.some(k => /^(POS|COMP|SUPER)$/.test(k))) return `<table class="para">${keys.map(k => `<tr><th>${esc(Morph.LABEL[k] || k)}</th><td class="la">${esc(Object.values(tbl[k]).join(' / '))}</td></tr>`).join('')}</table>`;
    const gens = ['M', 'F', 'N'].filter(g => keys.some(k => tbl[k][g]));
    let html = '';
    for (const n of ['S', 'P']) {
      const rows = keys.filter(k => k.endsWith(' ' + n));
      if (!rows.length) continue;
      html += `<table class="para"><tr><th>${n === 'S' ? 'Singular' : 'Plural'}</th>${gens.map(g => `<th>${g}</th>`).join('')}</tr>${rows.map(k => `<tr><th>${CASE_ABBR[k.split(' ')[0]] || esc(k)}</th>${gens.map(g => `<td class="la">${esc(tbl[k][g] || '—')}</td>`).join('')}</tr>`).join('')}</table>`;
    }
    return html;
  }
  function tablesHTML(e, hl, ctx) {
    const forms = Morph.generate(e);
    if (e.p === 'N') return nounTableHTML(e, forms, hl, ctx);
    if (e.p === 'ADJ' || e.p === 'NUM') return adjTableHTML(e, forms, hl, ctx);
    if (e.p === 'PRON' || e.p === 'PACK') {
      const pid = packFor(e), pk = PACKS_ALL[pid];
      if (pk && pk.table) { const hw = norm(e.hw); const nested = Object.values(pk.table)[0] && !('M' in Object.values(pk.table)[0]); const t = nested ? (pk.table[Object.keys(pk.table).find(k => norm(k) === hw)] || pk.table) : pk.table; return curatedTableHTML(t) + `<p class="small muted">Curated table from the grammar pack <a href="#/p/${pid}">${esc(pk.title)}</a>.</p>`; }
      return adjTableHTML(e, forms, hl, ctx);
    }
    if (e.p === 'V') return verbTableHTML(e, forms, hl, ctx);
    if (e.p === 'ADV' && e.k === 'X') { const f = fmt(e); const deg = ['POS', 'COMP', 'SUPER']; return `<table class="para">${forms.map((x, i) => `<tr><th>${esc(Morph.LABEL[x.r.co === 'X' ? deg[x.r.k - 1] : x.r.co] || '')}${ibtn({ kind: 'degree', deg: x.r.co === 'X' ? deg[x.r.k - 1] : x.r.co, ctx })}</th><td class="la">${esc(f(x))}</td></tr>`).join('')}</table>`; }
    return '';
  }

  // ---------------- entry page ----------------
  const ctxStore = {};   // ctx id -> entry
  function entryCard(e, lsList, hl) {
    const ctx = 'c' + e.i; ctxStore[ctx] = e;
    const pid = packFor(e); const pk = PACKS_ALL[pid];
    const parts = principalParts(e);
    const gloss = (e.m || '').replace(/^\|+/, '');
    let html = `<div class="card entry" id="e${e.i}">`;
    html += `<div class="hwline"><span class="hw la">${esc(parts[0] || macHw(e))}</span>${parts.length > 1 ? `<span class="pp">${esc(parts.slice(1).join(', '))}</span>` : ''}</div>`;
    html += `<div class="meta">${esc(classLabel(e))}${flagsChips(e)}</div>`;
    if (gloss && !e.inf) html += `<p class="gloss">${esc(gloss)}</p>`;
    for (const ls of lsList) html += lsHTML(ls);
    const tbl = tablesHTML(e, hl, ctx);
    if (tbl) {
      html += `<h3>${e.p === 'V' ? 'Conjugation' : e.p === 'N' || e.p === 'ADJ' || e.p === 'PRON' || e.p === 'PACK' || e.p === 'NUM' ? 'Declension' : 'Forms'}${pk ? ` <span class="muted small">· like <a href="#/p/${pid}" class="la">${esc(pk.model.hw)}</a></span>` : ''}</h3>`;
      if (e.inf) html += `<p class="small muted">This paradigm was inferred from the Lewis &amp; Short principal parts; Whitaker's Words has no entry for this word.</p>`;
      html += tbl;
      if (pk) html += `<p class="small"><a href="#/p/${pid}">${esc(pk.title)} — full paradigm with example sentences →</a></p>`;
      if (e.p === 'V' && e.k && CORE.verb.kinds[e.k]) html += `<p class="small muted">${esc(CORE.verb.kinds[e.k])}</p>`;
    }
    html += `</div>`;
    return html;
  }
  function lsHTML(ls) {
    const n = ls.n ? `<sup class="muted">${esc(ls.n)}</sup>` : '';
    const typ = ls.t && ls.t !== 'main' ? `<span class="chip">${esc({ greek: 'Greek word', hapax: 'attested once', gloss: 'glossary word', spur: 'spurious', foreign: 'foreign word' }[ls.t] || ls.t)}</span>` : '';
    return `<details class="lsd" open><summary>Lewis &amp; Short${n} ${typ}</summary><div class="ls${S.settings.cit ? '' : ' nocit'}${S.settings.abridge ? ' abridged' : ''}">${ls.b}</div><div class="toggle-row"><button class="btn small toggleabr">${S.settings.abridge ? 'Show full entry' : 'Abridge'}</button><button class="btn small togglecit">${S.settings.cit ? 'Hide citations' : 'Show citations'}</button></div></details>`;
  }
  async function renderWord(nk, hlForm) {
    await Data.ready;
    view.innerHTML = `<div class="skel" style="width:40%;height:28px"></div><div class="card"><div class="skel" style="width:55%;height:22px"></div><div class="skel" style="width:90%"></div><div class="skel" style="width:70%"></div><div class="skel" style="width:85%"></div></div>`;
    const [rec, ww, lsList] = await Promise.all([idxRecord(nk), wwChunk(letterOf(nk)), lsEntries(nk)]);
    const entries = rec ? rec[5].map(id => ww._map.get(id)).filter(Boolean) : [];
    if (!rec && !lsList.length && !entries.length) { view.innerHTML = `<div class="empty">No entry for <b class="la">${esc(nk)}</b>.</div>`; return; }
    const hw = rec ? rec[1] : (lsList[0] && lsList[0].h) || nk;
    pushHistory(nk, hw, rec ? rec[3] : '');
    const fav = S.favs.some(f => f.nk === nk);
    let html = `<div class="hwline" style="justify-content:space-between"><h1 class="la" style="margin:4px 0">${esc(S.settings.macrons ? hw : strip(hw))}</h1><button class="iconbtn fav" data-nk="${esc(nk)}" data-hw="${esc(hw)}" aria-label="Save">${fav ? '★' : '☆'}</button></div>`;
    // pair L&S entries with Whitaker entries by part of speech; homonyms of the same class pair one-to-one in order
    const used = new Set();
    const groups = [];
    const lsSorted = lsList.slice().sort((a, b) => (a.t === 'main' ? 0 : 1) - (b.t === 'main' ? 0 : 1) || (a.n || '0').localeCompare(b.n || '0', undefined, { numeric: true }));
    const byClass = {};
    for (const e of entries) { const ep = e.p === 'PACK' ? 'PRON' : e.p; (byClass[ep] = byClass[ep] || []).push(e); }
    for (const ep in byClass) {
      const es = byClass[ep]; const ls = lsSorted.filter(l => !used.has(l.k) && lsPosClass(l) === ep);
      if (ls.length === es.length && es.length > 1) es.forEach((e, i) => { groups.push({ e, ls: [ls[i]] }); used.add(ls[i].k); });
      else { es.forEach((e, i) => groups.push({ e, ls: i === 0 ? ls : [] })); ls.forEach(l => used.add(l.k)); }
    }
    for (const l of lsSorted) { if (used.has(l.k) || lsPosClass(l) !== '') continue; const g = groups.find(x => !x.ls.length) || groups[0]; if (g) { g.ls.push(l); g.ls.sort((a, b) => (a.n || '0').localeCompare(b.n || '0', undefined, { numeric: true })); used.add(l.k); } }
    const frank = e => { const i = 'ABCDEFXIMN'.indexOf((e.f || 'X')[3]); return i < 0 ? 9 : i; };
    groups.sort((a, b) => frank(a.e) - frank(b.e));
    const rest = lsSorted.filter(l => !used.has(l.k));
    for (const g of groups) html += entryCard(g.e, g.ls, hlForm);
    for (const l of rest.filter(l => !used.has(l.k))) html += `<div class="card">${lsHTML(l)}</div>`;
    view.innerHTML = html;
    applyClamps();
    if (hlForm) { const el = view.querySelector('.hl'); if (el) el.scrollIntoView({ block: 'center' }); }
    else window.scrollTo(0, 0);
  }
  // Mark long senses; a clamped sense gets a "more" button
  function applyClamps() {
    view.querySelectorAll('.ls').forEach(ls => {
      ls.querySelectorAll('.sense').forEach(se => { if (se.textContent.length > 260) se.classList.add('long'); });
      ls.querySelectorAll('.morebtn').forEach(b => b.remove());
      if (!ls.classList.contains('abridged')) return;
      ls.querySelectorAll('.sense.long').forEach(se => { if (se.scrollHeight > se.clientHeight + 3) { const b = document.createElement('button'); b.className = 'morebtn'; b.textContent = 'more…'; b.onclick = () => { se.classList.toggle('open'); b.textContent = se.classList.contains('open') ? 'less' : 'more…'; }; se.after(b); } });
    });
  }

  // ---------------- search ----------------
  let searchTimer = null, lastQuery = '';
  const navStack = [];
  function noteSearchHash(h) { if (navStack.length && navStack[navStack.length - 1].startsWith('#/s/')) navStack[navStack.length - 1] = h; else navStack.push(h); }
  async function doSearch(q) {
    q = q.trim(); lastQuery = q;
    if (!q) { renderHome(); return; }
    await Data.ready;
    const nq = norm(q);
    if (!nq) { view.innerHTML = `<div class="empty">Type a Latin or English word.</div>`; return; }
    const L = letterOf(nq);
    const [arr, wIdx] = await Promise.all([idx(L), wwIndex(L)]);
    if (lastQuery !== q) return;
    // headword prefix matches
    const exact = arr.filter(r => r[0] === nq);
    const pre = arr.filter(r => r[0] !== nq && r[0].startsWith(nq)).slice(0, 60);
    // morphological analysis
    const an = Morph.analyze(nq, wIdx);
    const byEntry = new Map();
    for (const a of an) { const k = a.entry.i; if (!byEntry.has(k)) byEntry.set(k, { e: a.entry, descs: [], enc: a.enclitic, common: false }); const g = byEntry.get(k); const d = Morph.describe(a.r); if (!g.descs.includes(d)) g.descs.push(d); if (a.common) g.common = true; }
    const anal = [...byEntry.values()].filter(g => !exact.some(r => r[5].includes(g.e.i) && norm(g.e.hw) === nq)).sort((a, b) => (b.common - a.common) || ((b.e.f && 'ABC'.includes(b.e.f[3])) - (a.e.f && 'ABC'.includes(a.e.f[3]))));
    let html = '';
    const row = r => `<a class="row" href="#/w/${encodeURIComponent(r[0])}"><span class="hw">${esc(S.settings.macrons ? r[1] : strip(r[1]))}</span>${r[2].split(',').filter(Boolean).map(p => `<span class="posb">${esc(CORE.pos[p] || p.toLowerCase())}</span>`).join('')}<span class="gl">${esc(r[3])}</span></a>`;
    if (exact.length) html += `<div class="results">${exact.map(row).join('')}</div>`;
    if (anal.length) {
      html += `<div class="section-title">Forms of other words</div><div class="results analysis">` + anal.slice(0, 25).map(g => { const pid = packFor(g.e); return `<a class="row" href="#/w/${encodeURIComponent(norm(g.e.hw))}?f=${encodeURIComponent(nq)}"><span class="form la">${esc(S.settings.macrons ? macFormGuess(g.e, nq) : q)}</span>${g.enc ? `<span class="chip">+ ${esc(g.enc)}</span>` : ''} <span class="pos">${esc(g.descs.slice(0, 3).join('; '))}${g.descs.length > 3 ? ' …' : ''}</span><span class="gl"><b class="la">${esc(macHw(g.e))}</b> — ${esc((g.e.m || '').replace(/^\|+/, '').split(';').slice(0, 2).join(';'))}</span></a>`; }).join('') + `</div>`;
    }
    if (pre.length) html += `<div class="section-title">Headwords starting with “${esc(q)}”</div><div class="results">${pre.map(row).join('')}</div>`;
    const noLatin = !exact.length && !anal.length && !pre.length;
    const engBlock = `<div class="section-title">English → Latin</div><div class="results" id="engres"><p class="muted small">Searching English meanings…</p></div>`;
    html = noLatin ? engBlock + html : html + engBlock;
    view.innerHTML = html;
    englishResults(q).then(({ word, list }) => {
      if (lastQuery !== q) return; const box = $('#engres'); if (!box) return;
      if (!list.length) { box.innerHTML = noLatin ? `<div class="empty">Nothing found for <b>${esc(q)}</b> in Latin or English.</div>` : `<p class="muted small">No English meanings match “${esc(q)}”.</p>`; return; }
      const keys = [...new Set(list.map(h => h.key))].sort((a, b) => b.length - a.length);
      const re = new RegExp('(' + keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig');
      box.innerHTML = list.map(h => { const r = h.r; return `<a class="row" href="#/w/${encodeURIComponent(r[0])}"><span class="hw">${esc(S.settings.macrons ? r[1] : strip(r[1]))}</span> <span class="pos">${esc(r[2].split(',').map(p => CORE.pos[p] || p.toLowerCase()).join(', '))}</span><span class="gl">${esc(r[3]).replace(re, '<mark>$1</mark>')}</span></a>`; }).join('');
    }).catch(() => { const box = $('#engres'); if (box) box.innerHTML = ''; });
  }
  function macFormGuess(e, nq) { const forms = Morph.generate(e); const x = forms.find(f => norm(f.f) === nq && f.common) || forms.find(f => norm(f.f) === nq); return x ? Macrons.mac(e, x) : nq; }
  // ---------------- home / saved / settings ----------------
  const WOTD = ['amicus', 'virtus', 'tempus', 'fortuna', 'bellum', 'pax', 'gloria', 'sapientia', 'libertas', 'veritas', 'fides', 'spes', 'carpo', 'memini', 'festino', 'fero', 'audeo', 'amo', 'rex', 'lux', 'nox', 'mare', 'caelum', 'terra', 'ignis', 'aqua', 'ventus', 'flumen', 'mons', 'silva', 'urbs', 'domus', 'via', 'iter', 'exercitus', 'imperium', 'senatus', 'populus', 'civis', 'hostis', 'dux', 'miles', 'poeta', 'liber', 'verbum', 'vox', 'oculus', 'manus', 'cor', 'animus', 'mens', 'corpus', 'vita', 'mors', 'deus', 'dea', 'fatum', 'natura', 'ars', 'otium', 'labor', 'ludus', 'fenestra', 'flos', 'rosa', 'arbor', 'hortus', 'vinum', 'panis', 'mel', 'cena', 'villa', 'ianua', 'puella', 'puer', 'mater', 'pater', 'frater', 'soror', 'filius', 'filia', 'uxor', 'coniunx', 'canis', 'equus', 'avis', 'leo', 'lupus', 'ovis', 'bos', 'piscis', 'serpens', 'aper', 'cervus', 'aquila', 'columba', 'facio', 'dico', 'video', 'venio', 'duco', 'capio', 'mitto', 'pono', 'scribo', 'lego', 'habeo', 'teneo', 'moneo', 'sequor', 'loquor', 'patior', 'morior', 'nascor', 'utor', 'sum', 'possum', 'eo', 'volo', 'nolo', 'malo', 'fio', 'do', 'sto', 'maneo', 'cado', 'curro', 'vinco', 'rego', 'ago', 'peto', 'quaero', 'laudo', 'voco', 'porto', 'specto', 'ambulo', 'intellego', 'cogito', 'disco', 'doceo', 'scio', 'nescio', 'credo', 'timeo', 'gaudeo', 'doleo', 'rideo', 'fleo', 'dormio', 'sentio', 'aperio', 'invenio', 'finis', 'initium', 'causa', 'res', 'dies', 'spes', 'fides', 'acies', 'species', 'genu', 'cornu', 'fructus', 'exercitus', 'lacus', 'portus', 'senex', 'iuvenis', 'homo', 'mulier', 'femina', 'vir', 'nomen', 'carmen', 'flumen', 'lumen', 'opus', 'onus', 'tempus', 'pectus', 'litus', 'vulnus', 'genus', 'bonus', 'malus', 'magnus', 'parvus', 'multus', 'omnis', 'fortis', 'brevis', 'longus', 'altus', 'novus', 'vetus', 'pulcher', 'acer', 'celer', 'felix', 'audax', 'sapiens', 'ingens', 'dulcis', 'gravis', 'levis', 'facilis', 'difficilis', 'similis', 'liber', 'miser', 'niger', 'ruber', 'sacer', 'tener', 'ego', 'tu', 'nos', 'vos', 'hic', 'ille', 'iste', 'is', 'idem', 'ipse', 'qui', 'quis', 'aliquis', 'quidam', 'unus', 'duo', 'tres', 'mille', 'bene', 'male', 'saepe', 'semper', 'numquam', 'nunc', 'tunc', 'cras', 'heri', 'hodie', 'ubi', 'unde', 'quo', 'cur', 'ita', 'sic', 'non', 'ne', 'et', 'sed', 'atque', 'aut', 'nec', 'cum', 'ad', 'ab', 'ex', 'in', 'de', 'per', 'pro', 'sine', 'sub', 'super', 'inter', 'ante', 'post', 'propter', 'trans', 'apud', 'ob', 'circum', 'contra', 'erga', 'ultra', 'citra', 'prae', 'coram', 'palam', 'tenus'];
  const TIPS = ['Search any inflected form: amāverat, tulistī, puellaeque all find their dictionary word.', 'Tap the small (i) beside a case or tense to see what it does, with a sentence using a word of the same class as yours.', 'Macrons, i/j and u/v are optional when searching: amicus, amīcus and amicvs all work.', 'The enclitic -que ("and") is attached to the second of two words: senātus populusque.', 'Type an English word to go from English to Latin: "friend", "to fight", "kings".', 'Deponent verbs look passive but mean active: sequor "I follow", secūtus sum "I followed".', 'Settings → Download all stores the whole dictionary on your phone for use without a connection.', 'A neuter noun has identical nominative and accusative; in the plural both end in -a.', 'The genitive singular tells you the declension: -ae, -ī, -is, -ūs, -ēī.', 'Long entries in Lewis & Short are abridged to three lines per sense; tap "more" to unfold one, or switch it off in Settings.', 'Save a word with ☆ at the top of its entry; saved words and your history live in the Saved tab.', 'Each paradigm page in Grammar gives a sentence for every single form of its model word.'];
  const ICONS = {
    noun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M4 20h16M8 8h8M8 12h8M8 16h5"/></svg>',
    adj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18L10 4l6 14M6.5 13h7"/><path d="M17 10l3 3-3 3"/></svg>',
    pron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M17 5l4 4M21 5l-4 4"/></svg>',
    verb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h11"/><path d="M10 7l5 5-5 5"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>',
    syntax: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h13"/><circle cx="19" cy="12" r="2"/></svg>',
    ref: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v5h5M8 13h8M8 17h6"/></svg>',
    dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/></svg>',
  };
  const GROUP_INFO = { 'Nouns': ['noun', 'Five declensions, every case', 'Nouns'], 'Adjectives & Adverbs': ['adj', 'Agreement and the three degrees', 'Adjectives'], 'Pronouns': ['pron', 'ego, hic, ille, is, quī and friends', 'Pronouns'], 'Verbs': ['verb', 'Conjugations, tenses, moods, deponents, irregulars', 'Verbs'], 'Syntax': ['syntax', 'Ablative absolute, indirect statement, cum clauses, conditions…', 'Syntax'], 'Reference': ['ref', 'Reading an entry, abbreviations', 'Reference'] };
  async function renderHome() {
    const day = Math.floor(Date.now() / 86400000); const w = WOTD[day % WOTD.length]; const tip = TIPS[day % TIPS.length];
    const hist = S.history.slice(0, 12), favs = S.favs.slice(0, 12);
    let html = `<div class="card hero-card" id="wotd"><div class="wotd-head"><span class="section-title" style="margin:0">Word of the day</span><a class="btn small" href="#/w/${WOTD[Math.floor(Math.random() * WOTD.length)]}">${ICONS.dice.replace('<svg', '<svg width="16" height="16" style="vertical-align:-3px;margin-right:4px"')}Random</a></div><a class="wotd-hw" href="#/w/${w}">${esc(w)}</a><div class="skel" style="width:60%"></div></div>`;
    const mini = h => `<a class="mini" href="#/w/${encodeURIComponent(h.nk)}"><span class="hw">${esc(S.settings.macrons ? h.hw : strip(h.hw))}</span><span class="gl">${esc(h.gl || '')}</span></a>`;
    if (hist.length) html += `<div class="section-title">Recent</div><div class="hscroll">${hist.map(mini).join('')}</div>`;
    if (favs.length) html += `<div class="section-title">Saved</div><div class="hscroll">${favs.map(mini).join('')}</div>`;
    html += `<div class="section-title">Grammar</div><div class="tiles">${Object.entries(GROUP_INFO).map(([g, [ic, d, short]]) => `<a class="tile" href="#/gg/${encodeURIComponent(g)}">${ICONS[ic]}<b>${esc(short)}</b><span>${esc(d)}</span></a>`).join('')}</div>`;
    html += `<div class="card tip"><div class="k">Tip</div>${esc(tip)}</div>`;
    html += `<footer class="credits">Definitions: <b>A Latin Dictionary</b> by Charlton T. Lewis &amp; Charles Short (1879), digitised by the Perseus Digital Library (CC BY-SA 4.0). Stems, inflections and short glosses: <b>Whitaker's Words</b> (public domain). ${Data.meta ? `${Data.meta.headwords.toLocaleString()} headwords · ${Data.meta.ls.toLocaleString()} Lewis &amp; Short entries · ${Data.meta.ww.toLocaleString()} Whitaker entries.` : ''}</footer>`;
    view.innerHTML = html;
    try {
      await Data.ready; const rec = await idxRecord(norm(w)); const box = $('#wotd'); if (!box || !rec) return;
      box.querySelector('.wotd-hw').textContent = S.settings.macrons ? rec[1] : strip(rec[1]);
      box.querySelector('.skel').outerHTML = `<div class="muted small">${esc(rec[2].split(',').map(p => CORE.pos[p] || p.toLowerCase()).join(', '))}</div><div class="wotd-gl">${esc(rec[3])}</div><a class="btn primary" href="#/w/${w}">Open entry</a>`;
    } catch (e) { }
  }
  function pushHistory(nk, hw, gl) { S.history = [{ nk, hw, gl }].concat(S.history.filter(h => h.nk !== nk)).slice(0, 100); save('history', S.history); }
  function renderSaved() {
    let html = `<h1>Saved words</h1>`;
    html += S.favs.length ? `<div class="results">${S.favs.map(h => `<a class="row" href="#/w/${encodeURIComponent(h.nk)}"><span class="hw">${esc(S.settings.macrons ? h.hw : strip(h.hw))}</span></a>`).join('')}</div>` : `<div class="empty">Tap ☆ on a word to save it here.</div>`;
    html += `<h2>History</h2>`;
    html += S.history.length ? `<div class="results">${S.history.map(h => `<a class="row" href="#/w/${encodeURIComponent(h.nk)}"><span class="hw">${esc(S.settings.macrons ? h.hw : strip(h.hw))}</span></a>`).join('')}</div><p><button class="btn" id="clearhist">Clear history</button></p>` : `<div class="empty">No lookups yet.</div>`;
    view.innerHTML = html;
    const b = $('#clearhist'); if (b) b.onclick = () => { S.history = []; save('history', []); renderSaved(); };
  }
  function renderSettings() {
    const s = S.settings;
    view.innerHTML = `<h1>Settings</h1>
      <div class="setting"><div><b>Macrons</b><div class="d">Mark long vowels (ā ē ī ō ū) in headwords and tables.</div></div><button class="btn ${s.macrons ? 'on' : ''}" data-set="macrons">${s.macrons ? 'On' : 'Off'}</button></div>
      <div class="setting"><div><b>Rare &amp; archaic forms</b><div class="d">Show poetic, archaic and late variants (greyed) and the locative.</div></div><button class="btn ${s.rare ? 'on' : ''}" data-set="rare">${s.rare ? 'On' : 'Off'}</button></div>
      <div class="setting"><div><b>Abridged Lewis &amp; Short</b><div class="d">Show each sense trimmed to three lines with a "more" link; long entries become readable at a glance.</div></div><button class="btn ${s.abridge ? 'on' : ''}" data-set="abridge">${s.abridge ? 'On' : 'Off'}</button></div>
      <div class="setting"><div><b>Citations in Lewis &amp; Short</b><div class="d">Show the quotations and author references by default.</div></div><button class="btn ${s.cit ? 'on' : ''}" data-set="cit">${s.cit ? 'On' : 'Off'}</button></div>
      <h2>Theme</h2><div class="swatches">${SKINS.map(([id, name, desc]) => `<button class="swatch ${s.theme === id ? 'on' : ''}" data-skin="${id}" title="${esc(desc)}"><div class="pv" style="background:${SKIN_PREVIEW[id][0]};color:${SKIN_PREVIEW[id][1]}">Aa āē</div><div class="nm">${esc(name)}</div></button>`).join('')}</div>
      <h2>Typeface</h2><div class="fontpick">${[['mixed', 'Mixed', 'EB Garamond for Latin, system sans for the rest'], ['serif', 'Serif', 'EB Garamond everywhere'], ['sans', 'Sans', 'System sans everywhere']].map(([id, name, desc]) => `<button class="${s.font === id ? 'on' : ''}" data-font="${id}"><span class="big" style="font-family:${id === 'sans' ? 'var(--sans-stack)' : 'var(--serif-stack)'}">${esc(name)} · amīcus</span><span class="sm">${esc(desc)}</span></button>`).join('')}</div>
      <div class="setting"><div><b>Text size</b></div><input type="range" id="fs" min="14" max="22" step="1" value="${s.fs}"></div>
      <div class="setting"><div><b>Offline data</b><div class="d">Download the whole dictionary (about 80 MB) so lookups work without a connection. Looked-up words are cached automatically anyway.</div></div><button class="btn" id="dlall">Download all</button></div>
      <div class="setting"><div><b>App version</b><div class="d">Build ${esc(APP_BUILD)}. The app checks for a newer version each time it opens and reloads itself when one is found.</div></div><button class="btn" id="chkupd">Check for updates</button></div>
      <div class="setting"><div><b>Reload app</b><div class="d">Force a fresh copy of the app from the server (keeps your saved words and settings).</div></div><button class="btn" id="hardreload">Reload</button></div>
      <div class="setting"><div><b>Clear cached data</b><div class="d">Removes downloaded dictionary chunks (not your saved words).</div></div><button class="btn" id="clearcache">Clear</button></div>
      <h2>About</h2><p class="small">Lexicon Latinum combines <b>Lewis &amp; Short, A Latin Dictionary</b> (Oxford 1879; Perseus Digital Library edition, CC BY-SA 4.0) with the morphological data of <b>Whitaker's Words</b> (public domain). Every table is generated from Whitaker's stems and ending tables; vowel lengths on stems come from Lewis &amp; Short where the headwords match, and endings follow the standard quantities. Hidden quantities (as in rēxī) cannot be recovered automatically.</p><p class="small">Grammar notes and example sentences were written for this app and are keyed to the declension or conjugation of the word you look up.</p><p class="small muted">Data built ${Data.meta ? esc(Data.meta.built) : ''}.</p>`;
    view.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { s[b.dataset.set] = !s[b.dataset.set]; save('settings', s); renderSettings(); });
    view.querySelectorAll('.swatch').forEach(b => b.onclick = () => { s.theme = b.dataset.skin; save('settings', s); applyTheme(); view.querySelectorAll('.swatch').forEach(x => x.classList.toggle('on', x === b)); });
    view.querySelectorAll('.fontpick button').forEach(b => b.onclick = () => { s.font = b.dataset.font; save('settings', s); applyTheme(); view.querySelectorAll('.fontpick button').forEach(x => x.classList.toggle('on', x === b)); });
    $('#fs').oninput = ev => { s.fs = +ev.target.value; save('settings', s); applyTheme(); };
    $('#dlall').onclick = downloadAll;
    $('#chkupd').onclick = async () => { const b = $('#chkupd'); b.textContent = 'Checking…'; try { const r = await fetch('version.json', { cache: 'no-store' }).then(x => x.json()); if (r.build && r.build !== APP_BUILD) { toast('Update found, reloading…'); if (window.LX_REG) await window.LX_REG.update().catch(() => { }); setTimeout(() => location.reload(), 1200); return; } b.textContent = 'Up to date'; } catch (e) { b.textContent = 'Could not check'; } };
    $('#hardreload').onclick = async () => { try { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); } catch (e) { } location.reload(); };
    $('#clearcache').onclick = async () => { await DB.clear(); for (const k in mem) delete mem[k]; toast('Cache cleared'); };
  }
  async function downloadAll() {
    await Data.ready;
    const files = ['data/inflects.json', 'data/ls_index.json', 'data/meta.json'];
    const seen = new Set(); for (const L of 'abcdefghiklmnopqrstuwxyz_') { const g = groupFile(L) || L; if (seen.has(g)) continue; seen.add(g); files.push(`data/idx/${g}.json`, `data/ww/${g}.json`, `data/en/${g}.json`); }
    for (let i = 0; i < Data.lsBounds.length; i++) files.push(`data/ls/${String(i).padStart(3, '0')}.json`);
    let n = 0; const btn = $('#dlall');
    for (const f of files) { try { await getJSON(f); } catch (e) { } n++; if (btn) btn.textContent = `${Math.round(100 * n / files.length)}%`; }
    if (btn) btn.textContent = 'Done';
    toast('All data downloaded for offline use');
  }
  const SKINS = [['auto', 'Automatic', 'Parchment by day, Night in dark mode'], ['parchment', 'Parchment', 'Warm cream and oxblood'], ['night', 'Night', 'Dark, warm neutrals'], ['navy', 'Navy Neon', 'Deep blue with neon mint'], ['peach', 'Peach', 'Soft apricot and terracotta'], ['blush', 'Blush', 'Rose pink'], ['sage', 'Sage', 'Cool greens'], ['ember', 'Ember', 'Charcoal with amber'], ['rustic', 'Rustic', 'Parchment, Roman capitals, sketched icons'], ['illustrata', 'Per Se', 'Orange and white, in the manner of a well-known Latin course']];
  const SKIN_PREVIEW = { auto: ['#f6f1e7', '#8b2e2e'], parchment: ['#f6f1e7', '#8b2e2e'], night: ['#1b1a17', '#e08a8a'], navy: ['#0a1730', '#3dffc6'], peach: ['#fff0e4', '#df6b35'], blush: ['#fceff4', '#d4336e'], sage: ['#edf3ea', '#2e6b4e'], ember: ['#1d1a1f', '#ff9d3f'], rustic: ['#ece0c4', '#7a3b1e'], illustrata: ['#e0702f', '#ffffff'] };
  function applyTheme() {
    const r = document.documentElement; const t = S.settings.theme;
    if (t === 'auto' || t === 'light' || t === 'dark') { delete r.dataset.skin; if (t === 'light' || t === 'dark') { S.settings.theme = t === 'light' ? 'parchment' : 'night'; r.dataset.skin = S.settings.theme; } }
    else r.dataset.skin = t;
    if (S.settings.font === 'mixed') delete r.dataset.font; else r.dataset.font = S.settings.font;
    if (window.LX_EMBEDDED) r.dataset.embedded = '1';
    r.style.setProperty('--fs', S.settings.fs + 'px');
    requestAnimationFrame(() => { const bg = getComputedStyle(r).getPropertyValue('--bg').trim(); document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', bg)); });
  }

  // ---------------- grammar ----------------
  const GRAM = typeof GRAMMAR !== 'undefined' ? GRAMMAR : [];
  const PACK_GROUP = { 'Nouns': id => id.startsWith('N-'), 'Adjectives & Adverbs': id => id.startsWith('ADJ-') || id === 'ADV', 'Verbs': id => id.startsWith('V-'), 'Pronouns': id => id.startsWith('PRON') || id === 'NUM' };
  const blurb = c => c.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 110).replace(/\s\S*$/, '') + '…';
  function renderGrammarIndex(only) {
    const groups = {}; for (const c of GRAM) (groups[c.group] = groups[c.group] || []).push(c);
    let html = only ? `<p class="small muted"><a href="#/g">Grammar</a></p><h1>${esc(only)}</h1>` : `<h1>Grammar</h1><p class="small muted">Chapters to read, and a paradigm page for every declension and conjugation with a sentence for each form.</p>`;
    for (const g in groups) {
      if (only && g !== only) continue;
      const info = GROUP_INFO[g] || ['ref', '', g];
      html += `<section class="gsec"><h2>${ICONS[info[0]]}${esc(g)}</h2>`;
      const pred = PACK_GROUP[g]; const ids = pred ? Object.keys(PACKS_ALL).filter(pred) : [];
      if (ids.length) html += `<div class="section-title" style="margin-top:6px">Paradigms</div><div class="paras">${ids.map(id => `<a href="#/p/${id}">${esc(PACKS_ALL[id].title.replace(/\s*\(.*\)$/, ''))}<span class="la">${esc(PACKS_ALL[id].model ? PACKS_ALL[id].model.hw : '')}</span></a>`).join('')}</div>`;
      html += `<div class="section-title" style="margin-top:4px">Chapters</div><div class="chapters">${groups[g].map(c => `<a href="#/g/${c.id}">${esc(c.title)}<span class="muted">${esc(blurb(c))}</span></a>`).join('')}</div></section>`;
    }
    view.innerHTML = html;
  }
  function renderChapter(id) {
    const c = GRAM.find(x => x.id === id); if (!c) { view.innerHTML = `<div class="empty">Chapter not found.</div>`; return; }
    let html = `<div class="chapter"><p class="small muted">${esc(c.group)}</p><h1>${esc(c.title)}</h1>${c.html}`;
    if (c.packs && c.packs.length) { html += `<h2>Paradigms</h2>`; for (const pid of c.packs) { const pk = PACKS_ALL[pid]; if (!pk) continue; html += `<div class="card"><h3 style="margin-top:0"><a href="#/p/${pid}">${esc(pk.title)}</a> <span class="muted small la">${esc(pk.model.hw)}${pk.model.parts ? ', ' + esc(pk.model.parts.replace(/^[^,]*,\s*/, '')) : ''}</span></h3>${packTableHTML(pk, true)}</div>`; } }
    html += `</div>`;
    view.innerHTML = html; window.scrollTo(0, 0);
  }
  function modelEntry(pk) {
    if (!pk.modelEntry) return null;
    const e = Object.assign({ f: 'XXXAX', m: pk.model.gloss || '', i: 'm' + pk.id }, pk.modelEntry);
    e.s = (e.s || []).map(s => s === undefined ? null : s);
    const hp = Morph.headwordAndParts(e); e.hw = hp.hw || pk.model.hw;
    // macron stems aligned from the pack's macronized headword / principal parts
    const srcs = [pk.model.hw].concat((pk.model.parts || '').split(/,\s*/)).filter(Boolean).map(s => s.trim().split(' ')[0]);
    const st = Morph.stems(e); const ms = [null, null, null, null];
    const plainForms = Morph.generate(e);
    st.forEach((s, i) => { if (s == null) return; for (const src of srcs) { const plain = strip(src); const cand = plainForms.find(x => x.k === i + 1 && Morph.norm(x.f) === Morph.norm(plain)); if (cand) { ms[i] = [...src].slice(0, s.length).join(''); return; } } });
    e.ms = ms.some(Boolean) ? ms : undefined;
    return e;
  }
  function packTableHTML(pk, compact) {
    if (pk.table) return curatedTableHTML(pk.table) + (pk.table2 ? `<h3>${esc(pk.table2.title || '')}</h3>` + curatedTableHTML(Object.fromEntries(Object.entries(pk.table2).filter(([k, v]) => typeof v === 'object'))) : '');
    const e = modelEntry(pk); if (!e) return '';
    const ctx = 'p' + pk.id; ctxStore[ctx] = e;
    return tablesHTML(e, null, ctx);
  }
  function renderPack(id) {
    const pk = PACKS_ALL[id]; if (!pk) { view.innerHTML = `<div class="empty">Paradigm not found.</div>`; return; }
    let html = `<p class="small muted">${esc(CORE.pos[pk.pos] || '')} paradigm</p><h1>${esc(pk.title)}</h1>`;
    html += `<div class="hwline"><span class="hw la">${esc(pk.model.hw)}</span>${pk.model.parts ? `<span class="pp">${esc(pk.model.parts.replace(/^[^,]*,\s*/, ''))}</span>` : ''}${pk.model.gender ? `<span class="muted">${esc(pk.model.gender)}</span>` : ''}<span class="muted">— ${esc(pk.model.gloss || '')}</span></div>`;
    html += `<div class="card">${pk.intro || ''}${pk.formation ? `<details><summary>How the forms are built</summary>${pk.formation}</details>` : ''}</div>`;
    html += `<h2>Forms</h2>${packTableHTML(pk)}`;
    if (pk.numerals) html += `<h2>Numerals</h2><table class="para"><tr><th>#</th><th>Cardinal</th><th>Ordinal</th><th>Distributive</th><th>Adverb</th></tr>${pk.numerals.map(n => `<tr><th>${esc(n.n)}${n.roman ? ' ' + esc(n.roman) : ''}</th><td class="la">${esc(n.card)}</td><td class="la">${esc(n.ord)}</td><td class="la">${esc(n.dist)}</td><td class="la">${esc(n.adv)}</td></tr>`).join('')}</table>`;
    if (pk.rows) { html += `<h2>Every form in a sentence</h2><div class="exrows">${Object.entries(pk.rows).map(([k, r]) => `<div class="r"><div class="k">${esc(rowLabel(k))}${r.note ? ` · <span class="note">${esc(r.note)}</span>` : ''}</div><p class="ex">${esc(r.ex)}</p><p class="en">${esc(r.en)}</p></div>`).join('')}</div>`; }
    if (pk.tips && pk.tips.length) html += `<h2>Tips</h2><ul class="uses">${pk.tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
    if (pk.related && pk.related.length) html += `<div class="section-title">Compare</div><div class="pill-row">${pk.related.filter(r => PACKS_ALL[r]).map(r => `<a class="chip" href="#/p/${r}">${esc(PACKS_ALL[r].title)}</a>`).join('')}</div>`;
    view.innerHTML = html; window.scrollTo(0, 0);
  }
  function rowLabel(k) {
    const w = k.split(' ');
    const L = Morph.LABEL;
    if (w[0] === 'IMP') return `${L[w[2]] || w[2]} imperative ${(w[1] || '').toLowerCase()}`;
    if (w[0] === 'INF') return `${L[w[2]] || w[2]} ${(w[1] || '').toLowerCase()} infinitive`;
    if (w[0] === 'PPL') return (CORE.verb.participles[w.slice(1).join(' ')] || {}).title || k;
    if (w[0] === 'GERUND') return 'Gerund'; if (w[0] === 'SUPINE') return 'Supine';
    if (['ACTIVE', 'PASSIVE'].includes(w[0])) return `${L[w[2]] || w[2]} ${(L[w[1]] || w[1]).toLowerCase()} ${w[0].toLowerCase()}${w[3] ? ', ' + persLabel(w[3]) : ''}`;
    if (['POS', 'COMP', 'SUPER'].includes(w[0])) return `${L[w[0]]}${w[1] ? ' ' + (L[w[1]] || w[1]).toLowerCase() : ''}${w[2] ? ' ' + L[w[2]] : ''}${w[3] ? ' ' + (L[w[3]] || '').toLowerCase() : ''}`;
    if (L[w[0]] && w[1] && L[w[1]]) return `${L[w[0]]} ${L[w[1]]}${w[2] ? ' ' + (L[w[2]] || '').toLowerCase() : ''}`;
    return k;
  }
  function persLabel(p) { return { '1S': '1st person singular', '2S': '2nd person singular', '3S': '3rd person singular', '1P': '1st person plural', '2P': '2nd person plural', '3P': '3rd person plural' }[p] || p; }

  // ---------------- info sheet ----------------
  function findRow(pk, keys) { if (!pk || !pk.rows) return null; for (const k of keys) if (pk.rows[k]) return { key: k, ...pk.rows[k] }; return null; }
  function showInfo(p) {
    const e = ctxStore[p.ctx]; const pid = e ? packFor(e) : null; const pk = pid ? PACKS_ALL[pid] : null;
    const f = e ? fmt(e) : (x => x.f);
    let html = '';
    const yourWord = (pred) => { if (!e) return ''; const forms = Morph.generate(e).filter(pred); const show = forms.filter(x => x.common); const list = (show.length ? show : forms).map(f); const uniq = [...new Set(list)]; return uniq.length ? `<div class="yourword">${esc(e.hw === (pk && pk.model && strip(pk.model.hw)) ? 'Form' : 'Your word')}: <b>${esc(uniq.join(' / '))}</b></div>` : ''; };
    if (p.kind === 'case') {
      const c = CORE.cases[p.cs]; const numName = p.nm === 'S' ? 'singular' : 'plural';
      html += `<h2>${esc(c.title)} ${numName}</h2><p>${esc(c.short)}</p>`;
      html += yourWord(x => x.r.cs === p.cs && (x.r.nm === p.nm || x.r.nm === 'X') && (!p.deg || (x.r.co || 'POS') === p.deg || (x.r.so === p.deg)));
      const row = findRow(pk, [`${p.deg || 'POS'} ${p.cs} ${p.nm} M`, `${p.deg || 'POS'} ${p.cs} ${p.nm}`, `${p.cs} ${p.nm}`, `${p.cs} ${p.nm} M`]) || findRow(pk, Object.keys(pk && pk.rows || {}).filter(k => k.includes(`${p.cs} ${p.nm}`)));
      if (row) html += `<div class="card"><div class="small muted">Example with <b class="la">${esc(pk.model.hw)}</b> (${esc(pk.title.toLowerCase())})${row.note ? ` · <span class="note">${esc(row.note)}</span>` : ''}</div><p class="ex">${esc(row.ex)}</p><p class="en">${esc(row.en)}</p></div>`;
      if (c.uses) html += `<h3>Main uses</h3><ul class="uses">${c.uses.map(u => `<li><b>${esc(u.name)}</b>${u.desc ? ' — ' + esc(u.desc) : ''}${u.ex ? `<br><span class="la">${esc(u.ex)}</span> <span class="muted">${esc(u.en)}</span>` : ''}</li>`).join('')}</ul>`;
      if (c.formation) html += `<p class="small muted">${esc(c.formation)}</p>`;
    } else if (p.kind === 'degree') {
      const d = CORE.degrees[p.deg] || {}; html += `<h2>${esc(d.title || p.deg)}</h2><p>${esc(d.short || '')}</p>${d.ex ? `<p class="ex">${esc(d.ex)}</p><p class="en">${esc(d.en)}</p>` : ''}`;
      const row = findRow(pk, Object.keys(pk && pk.rows || {}).filter(k => k.startsWith(p.deg)));
      if (row) html += `<div class="card"><div class="small muted">Example with <b class="la">${esc(pk.model.hw)}</b>${row.note ? ` · <span class="note">${esc(row.note)}</span>` : ''}</div><p class="ex">${esc(row.ex)}</p><p class="en">${esc(row.en)}</p></div>`;
    } else if (p.kind === 'verb') {
      const w = p.key.split(' ');
      let title = rowLabel(p.key), body = '';
      if (['ACTIVE', 'PASSIVE'].includes(w[0])) {
        const [vo, md, tn] = w; const T = CORE.verb.tenses[tn], M = CORE.verb.moods[md], V = CORE.verb.voices[vo];
        body += `<p><b>${esc(T.title)}:</b> ${esc(T.short)}</p><p class="small muted">Formed from the ${esc(T.stem)}.</p>`;
        body += `<p><b>${esc(M.title)}:</b> ${esc(M.short)}</p>`;
        if (M.uses) body += `<details><summary>Common subjunctive constructions</summary><ul class="uses">${M.uses.map(u => `<li>${esc(u)}</li>`).join('')}</ul><p class="small">${esc(M.tenses)}</p></details>`;
        if (vo === 'PASSIVE') body += `<p><b>${esc(V.title)}:</b> ${esc(V.short)}</p>`;
        html += `<h2>${esc(title)}</h2>` + yourWord(x => x.r.p === 'V' && x.r.vo === vo && x.r.md === md && x.r.t === tn) + body;
        const row = findRow(pk, [p.key].concat(Object.keys(pk && pk.rows || {}).filter(k => k.startsWith(p.key + ' '))));
        if (row) html += exampleCard(pk, row);
        const peri = e && Morph.verbTable(Morph.generate(e), e, f).finite[p.key]; if (peri && peri.peri) html += `<p class="small muted">Periphrastic (compound) tense: perfect participle + the present/imperfect/future of <i>sum</i>. The participle agrees with the subject in gender and number (amāta est, amātī sunt).</p>`;
      } else if (w[0] === 'IMP') { html += `<h2>${esc(title)}</h2>` + yourWord(x => x.r.p === 'V' && x.r.md === 'IMP' && x.r.vo === w[1] && x.r.t === w[2]) + `<p>${esc(CORE.verb.moods.IMP.short)}</p>`; const row = findRow(pk, [p.key, `IMP ${w[1]} ${w[2]}`, `IMP ACTIVE ${w[2]}`, `IMP PASSIVE ${w[2]}`]); if (row) html += exampleCard(pk, row); }
      else if (w[0] === 'INF') { html += `<h2>${esc(title)}</h2>` + yourWord(x => x.r.p === 'V' && x.r.md === 'INF' && x.r.vo === w[1] && x.r.t === w[2]) + `<p>${esc(CORE.verb.moods.INF.short)}</p>`; const row = findRow(pk, [p.key]); if (row) html += exampleCard(pk, row); }
      else if (w[0] === 'PPL') { const P = CORE.verb.participles[w.slice(1).join(' ')] || {}; html += `<h2>${esc(P.title || title)}</h2>` + yourWord(x => x.r.p === 'VPAR' && x.r.vo === w[1] && x.r.t === w[2] && x.r.cs === 'NOM' && x.r.nm === 'S') + `<p>${esc(P.short || '')}</p>`; const row = findRow(pk, [p.key]); if (row) html += exampleCard(pk, row); }
      else if (w[0] === 'GERUND') { html += `<h2>Gerund</h2><p>${esc(CORE.verb.gerund.short)}</p>`; const row = findRow(pk, ['GERUND']); if (row) html += exampleCard(pk, row); }
      else if (w[0] === 'SUPINE') { html += `<h2>Supine</h2>` + yourWord(x => x.r.p === 'SUPINE') + `<p>${esc(CORE.verb.supine.short)}</p>`; const row = findRow(pk, ['SUPINE']); if (row) html += exampleCard(pk, row); }
    }
    if (pk) html += `<p class="small"><a href="#/p/${pid}">All forms of ${esc(pk.model.hw)} with example sentences →</a></p>`;
    $('#sheet .sheet-body').innerHTML = html; $('#sheet').hidden = false; document.body.style.overflow = 'hidden';
  }
  function exampleCard(pk, row) { return `<div class="card"><div class="small muted">Example with <b class="la">${esc(pk.model.hw)}</b> (${esc(pk.title.toLowerCase())})${row.note ? ` · <span class="note">${esc(row.note)}</span>` : ''}</div><p class="ex">${esc(row.ex)}</p><p class="en">${esc(row.en)}</p></div>`; }
  function closeSheet() { $('#sheet').hidden = true; document.body.style.overflow = ''; }

  // ---------------- participle declension popup ----------------
  function showPplDecl(ctx, key) {
    const e = ctxStore[ctx]; if (!e) return;
    const forms = Morph.generate(e).filter(x => x.r.p === 'VPAR' && (x.r.vo + ' ' + x.r.t) === key);
    const d = Morph.adjTable(forms, 'VPAR'); const P = CORE.verb.participles[key] || {};
    $('#sheet .sheet-body').innerHTML = `<h2>${esc(P.title || key)}</h2><p class="small muted">${esc(P.short || '')}</p>${adjDegreeTableHTML(e, 'POS', d.POS, null, ctx)}`;
    $('#sheet').hidden = false; document.body.style.overflow = 'hidden';
  }

  // ---------------- routing & events ----------------
  function setTab(name) { document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('active', a.dataset.tab === name)); }
  async function route() {
    const h = location.hash || '#/';
    const m = h.match(/^#\/(gg|w|g|p|s)?\/?([^?]*)(\?(.*))?$/);
    const kind = m && m[1], arg = m ? decodeURIComponent(m[2] || '') : '', qs = m && m[4] ? new URLSearchParams(m[4]) : null;
    closeSheet();
    try {
      if (h === '#/' || h === '') { setTab('home'); $('#q').value = ''; $('#clearq').hidden = true; renderHome(); }
      else if (h === '#/saved') { setTab('saved'); renderSaved(); }
      else if (h === '#/settings') { setTab('settings'); renderSettings(); }
      else if (h === '#/g') { setTab('grammar'); renderGrammarIndex(); window.scrollTo(0, 0); }
      else if (kind === 'w') { setTab('home'); await renderWord(norm(arg), qs && qs.get('f') ? norm(qs.get('f')) : null); }
      else if (kind === 's') { setTab('home'); $('#q').value = arg; $('#clearq').hidden = !arg; await doSearch(arg); }
      else if (h === '#/g') { setTab('grammar'); renderGrammarIndex(); window.scrollTo(0, 0); }
      else if (kind === 'gg') { setTab('grammar'); renderGrammarIndex(arg); window.scrollTo(0, 0); }
      else if (kind === 'g') { setTab('grammar'); renderChapter(arg); }
      else if (kind === 'p') { setTab('grammar'); renderPack(arg); }
      else if (h === '#/saved') { setTab('saved'); renderSaved(); }
      else if (h === '#/settings') { setTab('settings'); renderSettings(); }
      else { renderHome(); }
    } catch (err) { console.error(err); view.innerHTML = `<div class="empty">Something went wrong loading this page.<br><span class="small">${esc(err.message)}</span></div>`; }
  }
  window.addEventListener('hashchange', () => { const h = location.hash || '#/'; if (!navStack._back && navStack[navStack.length - 1] !== h) navStack.push(h); navStack._back = false; route(); });
  $('#q').addEventListener('input', ev => { const q = ev.target.value; $('#clearq').hidden = !q; clearTimeout(searchTimer); searchTimer = setTimeout(() => { if (!q.trim()) { if (location.hash.startsWith('#/s/')) location.hash = '#/'; else if (location.hash === '#/' || location.hash === '') renderHome(); return; } history.replaceState(null, '', '#/s/' + encodeURIComponent(q)); noteSearchHash('#/s/' + encodeURIComponent(q)); setTab('home'); doSearch(q); }, 160); });
  $('#searchform').addEventListener('submit', ev => { ev.preventDefault(); const q = $('#q').value.trim(); if (!q) return; $('#q').blur(); const first = view.querySelector('.results .row'); if (first && (norm(q) === (first.getAttribute('href') || '').replace(/^#\/w\//, '').split('?')[0] || view.querySelectorAll('.results .row').length === 1)) location.hash = first.getAttribute('href'); else { history.replaceState(null, '', '#/s/' + encodeURIComponent(q)); noteSearchHash('#/s/' + encodeURIComponent(q)); doSearch(q); } });
  $('#clearq').onclick = () => { $('#q').value = ''; $('#clearq').hidden = true; $('#q').focus(); location.hash = '#/'; };
  const backBtn = $('#back'); if (backBtn) backBtn.onclick = () => { navStack.pop(); const prev = navStack.pop(); navStack._back = false; if (prev) { navStack.push(prev); navStack._back = true; location.hash = prev; } else location.hash = '#/'; };
  document.addEventListener('click', ev => {
    const ib = ev.target.closest('.ibtn'); if (ib && ib.dataset.info) { ev.preventDefault(); showInfo(JSON.parse(ib.dataset.info)); return; }
    const tb = ev.target.closest('.subtabs button'); if (tb) { const grp = tb.parentElement; grp.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === tb)); grp.querySelectorAll('button').forEach(b => { const pane = document.getElementById(b.dataset.show); if (pane) pane.hidden = b !== tb; }); return; }
    const tc = ev.target.closest('.togglecit'); if (tc) { const ls = tc.closest('details').querySelector('.ls'); ls.classList.toggle('nocit'); tc.textContent = ls.classList.contains('nocit') ? 'Show citations' : 'Hide citations'; applyClamps(); return; }
    const ta = ev.target.closest('.toggleabr'); if (ta) { const ls = ta.closest('details').querySelector('.ls'); ls.classList.toggle('abridged'); ta.textContent = ls.classList.contains('abridged') ? 'Show full entry' : 'Abridge'; applyClamps(); return; }
    const fv = ev.target.closest('.fav'); if (fv) { const nk = fv.dataset.nk, hw = fv.dataset.hw; if (S.favs.some(f => f.nk === nk)) { S.favs = S.favs.filter(f => f.nk !== nk); fv.textContent = '☆'; toast('Removed from saved'); } else { const hh = S.history.find(h => h.nk === nk); S.favs.unshift({ nk, hw, gl: hh ? hh.gl : '' }); fv.textContent = '★'; toast('Saved'); } save('favs', S.favs); return; }
    const dc = ev.target.closest('.decl'); if (dc) { showPplDecl(dc.dataset.ctx, dc.dataset.ppl); return; }
    if (ev.target.closest('.sheet-bg') || ev.target.closest('.sheet-close')) closeSheet();
    const q = ev.target.closest('.ls q'); if (q && !ev.target.closest('a')) { /* tap a Latin quotation word to look it up */ }
  });
  // double-tap on a Latin word inside L&S quotes or tables: look it up
  view.addEventListener('dblclick', ev => { const sel = (window.getSelection() + '').trim(); if (sel && /^[A-Za-zāēīōūȳ]+$/.test(sel)) { location.hash = '#/s/' + encodeURIComponent(sel.toLowerCase()); } });
  // no pinch or double-tap zoom: the app sets its own text size in Settings
  document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
  let lastTap = 0; document.addEventListener('touchend', e => { const now = Date.now(); if (now - lastTap < 300 && !e.target.closest('input, textarea')) e.preventDefault(); lastTap = now; }, { passive: false });
  applyTheme();
  if (!window.LX_EMBEDDED && 'serviceWorker' in navigator) {
    let hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) { toast('Updating to the latest version…'); setTimeout(() => location.reload(), 600); } hadController = true; });
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
      window.LX_REG = reg;
      reg.update().catch(() => { });
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => { }); });
      setInterval(() => reg.update().catch(() => { }), 30 * 60 * 1000);
    }).catch(() => { });
  }
  navStack.push(location.hash || '#/');
  route();
})();
