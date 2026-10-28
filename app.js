/* Lexicon Latinum — app logic */
(function () {
  'use strict';
  const APP_BUILD = '2026-10-28.1233';
  const $ = s => document.querySelector(s);
  const view = $('#view');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const load = (k, d) => { try { const v = localStorage.getItem('lx.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem('lx.' + k, JSON.stringify(v)); } catch (e) { } };
  const S = { settings: Object.assign({ macrons: true, rare: false, cit: true, theme: 'illustrata', font: 'mixed', fs: 16, abridge: true }, load('settings', {})), history: load('history', []), favs: load('favs', []) };
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
  let SYN = null;
  async function synData() {
    if (SYN) return SYN;
    const d = await getJSON('data/syn.json').catch(() => null); if (!d) return (SYN = { entries: [], refs: {}, byWord: new Map(), byMention: new Map() });
    d.byWord = new Map(); d.byMention = new Map();
    d.entries.forEach((e, i) => { e.h.forEach(w => { if (!d.byWord.has(w)) d.byWord.set(w, i); }); for (const m of e.t.matchAll(/<b class="syn">([^<]+)<\/b>/g)) { const w = norm(m[1]); if (!d.byMention.has(w)) d.byMention.set(w, new Set()); d.byMention.get(w).add(i); } });
    return (SYN = d);
  }
  async function synonymsFor(nk) {
    const d = await synData(); const ids = new Set();
    const cands = [nk, nk.replace(/us$/, 'a'), nk.replace(/o$/, 'are'), nk.replace(/o$/, 'ere'), nk.replace(/o$/, 'ire'), nk.replace(/eo$/, 'ere'), nk.replace(/io$/, 'ire'), nk.replace(/or$/, 'ari'), nk.replace(/or$/, 'i'), nk.replace(/or$/, 'iri'), nk.replace(/is$/, 'e')];
    for (const c of cands) { if (d.byWord.has(c)) ids.add(d.byWord.get(c)); const r = d.refs[c]; if (r && d.byWord.has(r)) ids.add(d.byWord.get(r)); }
    for (const c of cands) if (d.byMention.has(c)) for (const i of d.byMention.get(c)) ids.add(i);
    return [...ids].slice(0, 3).map(i => d.entries[i]);
  }
  const synLinkify = t => t.replace(/<b class="syn">([^<]+)<\/b>/g, (m, w) => `<a class="synlink" href="#/s/${encodeURIComponent(w.toLowerCase())}">${w}</a>`);
  async function similarWords(rec) {
    if (!rec) return [];
    const STOP = new Set(['the', 'and', 'with', 'from', 'that', 'this', 'into', 'upon', 'over', 'also', 'very', 'make', 'thing', 'things', 'person', 'one', 'who', 'which']);
    const words = rec[3].toLowerCase().replace(/\(.*?\)/g, ' ').split(/[^a-z]+/).filter(w => w.length >= 4 && !STOP.has(w)).slice(0, 4);
    const tally = new Map();
    await Promise.all(words.map(async (w, wi) => { const en = await enIndex(w[0]); for (const [nk, sc] of (en[w] || []).slice(0, 40)) { if (nk === rec[0]) continue; const t = tally.get(nk) || { n: 0, s: 0, first: false }; t.n++; t.s += sc + wi * 2; if (wi === 0) t.first = true; tally.set(nk, t); } }));
    const list = [...tally.entries()].filter(([, t]) => t.n >= 2 || t.first).sort((a, b) => (b[1].n - a[1].n) || (a[1].s - b[1].s)).slice(0, 8);
    const byL = {}; for (const [nk] of list) (byL[letterOf(nk)] = byL[letterOf(nk)] || []).push(nk);
    const recs = new Map();
    await Promise.all(Object.keys(byL).map(async L => { const arr = await idx(L); const m = new Map(arr.map(r => [r[0], r])); for (const nk of byL[L]) { const r = m.get(nk); if (r) recs.set(nk, r); } }));
    return list.map(([nk]) => recs.get(nk)).filter(Boolean);
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
    return `<details class="lsd" open><summary>Lewis &amp; Short${n} ${typ}</summary><div class="ls${S.settings.cit ? '' : ' nocit'}${S.settings.abridge ? ' abridged' : ''}">${ls.b}</div><div class="toggle-row"><button type="button" class="btn small toggleabr">${S.settings.abridge ? 'Show full entry' : 'Abridge'}</button><button type="button" class="btn small togglecit">${S.settings.cit ? 'Hide citations' : 'Show citations'}</button></div></details>`;
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
    let html = `<div class="hwline"><h1 class="la" style="margin:4px 0">${esc(S.settings.macrons ? hw : strip(hw))}</h1><span class="share"></span>${navigator.share ? `<button class="iconbtn sharebtn" data-hw="${esc(hw)}" data-nk="${esc(nk)}" aria-label="Share"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/></svg></button>` : ''}<button class="iconbtn fav" data-nk="${esc(nk)}" data-hw="${esc(hw)}" aria-label="Save">${fav ? '★' : '☆'}</button></div>`;
    html += `<div class="jump"><a href="#" data-jump="e${entries[0] ? entries[0].i : ''}">Meaning</a>${entries.some(e => ['N', 'ADJ', 'V', 'PRON', 'NUM'].includes(e.p)) ? '<a href="#" data-jump="forms">Forms</a>' : ''}${lsList.length ? '<a href="#" data-jump="lsd">Lewis &amp; Short</a>' : ''}<a href="#" data-jump="extra">Synonyms</a></div>`;
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
    html += `<div id="extra"><div class="skel" style="width:50%"></div></div>`;
    view.innerHTML = html;
    applyClamps();
    (async () => {
      const [syns, sim] = await Promise.all([synonymsFor(nk).catch(() => []), similarWords(rec).catch(() => [])]);
      const box = $('#extra'); if (!box || norm(location.hash.replace(/^#\/w\//, '').split('?')[0]) !== nk) return;
      let x = '';
      if (sim.length) x += `<div class="section-title">Similar words</div><div class="similar">${sim.map(r => `<a href="#/w/${encodeURIComponent(r[0])}"><span class="la">${esc(S.settings.macrons ? r[1] : strip(r[1]))}</span><span class="gl">${esc(r[3].split(/[;,]/)[0].slice(0, 28))}</span></a>`).join('')}</div>`;
      if (syns.length) x += `<div class="section-title">Synonyms distinguished</div>` + syns.map(e => `<div class="card syncard"><h3 style="margin-top:0" class="la">${esc(e.d.join(' · '))}</h3><p>${synLinkify(e.t)}</p></div>`).join('') + `<p class="small muted">From Döderlein's <i>Hand-book of Latin Synonymes</i> (1875), public domain. Tap a bold word to look it up.</p>`;
      if (!x) x = `<p class="small muted">No synonym notes for this word.</p>`;
      box.innerHTML = x;
    })();
    if (hlForm) { const el = view.querySelector('.hl'); if (el) el.scrollIntoView({ block: 'center' }); }
    else view.scrollTo(0, 0);
  }
  // Mark long senses; a clamped sense gets a "more" button
  function applyClamps() {
    view.querySelectorAll('.ls').forEach(ls => {
      ls.querySelectorAll('.sense').forEach(se => { if (se.textContent.length > 260) se.classList.add('long'); });
      ls.querySelectorAll('.morebtn').forEach(b => b.remove());
      if (!ls.classList.contains('abridged')) return;
      ls.querySelectorAll('.sense.long').forEach(se => { if (se.scrollHeight > se.clientHeight + 3) { const b = document.createElement('button'); b.className = 'morebtn'; b.type = 'button'; b.textContent = 'more…'; const tog = () => { se.classList.toggle('open'); b.textContent = se.classList.contains('open') ? 'less' : 'more…'; }; b.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); tog(); }); se.addEventListener('click', ev => { if (!se.classList.contains('open') && !ev.target.closest('a')) tog(); }); se.after(b); } });
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
  const TIPS = ['Search any inflected form: amāverat, tulistī, puellaeque all find their dictionary word.', 'Tap the small (i) beside a case or tense to see what it does, with a sentence using a word of the same class as yours.', 'Macrons, i/j and u/v are optional when searching: amicus, amīcus and amicvs all work.', 'The enclitic -que ("and") is attached to the second of two words: senātus populusque.', 'Type an English word to go from English to Latin: "friend", "to fight", "kings".', 'Deponent verbs look passive but mean active: sequor "I follow", secūtus sum "I followed".', 'Settings → Download all stores the whole dictionary on your phone for use without a connection.', 'A neuter noun has identical nominative and accusative; in the plural both end in -a.', 'The genitive singular tells you the declension: -ae, -ī, -is, -ūs, -ēī.', 'Long entries in Lewis & Short are abridged to three lines per sense; tap "more" to unfold one, or switch it off in Settings.', 'Save a word with ☆ at the top of its entry; the bookmark at the top of the screen opens your lexicon and history.', 'Each paradigm page in Grammar gives a sentence for every single form of its model word.'];
  const ICONS = {
    noun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M4 20h16M8 8h8M8 12h8M8 16h5"/></svg>',
    adj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18L10 4l6 14M6.5 13h7"/><path d="M17 10l3 3-3 3"/></svg>',
    pron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M17 5l4 4M21 5l-4 4"/></svg>',
    verb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h11"/><path d="M10 7l5 5-5 5"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>',
    syntax: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h13"/><circle cx="19" cy="12" r="2"/></svg>',
    ref: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v5h5M8 13h8M8 17h6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v14"/></svg>',
    dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/></svg>',
    verbum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="9.5" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="3" y="9.5" width="5" height="5" rx="1" fill="currentColor"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><rect x="16" y="9.5" width="5" height="5" rx="1" fill="currentColor"/><rect x="3" y="16" width="5" height="5" rx="1"/><rect x="9.5" y="16" width="5" height="5" rx="1" fill="currentColor"/><rect x="16" y="16" width="5" height="5" rx="1"/></svg>',
    nexus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7"/></svg>',
    corona: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="4.5" r="1.4" fill="currentColor"/><circle cx="19" cy="8.5" r="1.4" fill="currentColor"/><circle cx="19" cy="15.5" r="1.4" fill="currentColor"/><circle cx="12" cy="19.5" r="1.4" fill="currentColor"/><circle cx="5" cy="15.5" r="1.4" fill="currentColor"/><circle cx="5" cy="8.5" r="1.4" fill="currentColor"/><path d="M12 4.5L19 15.5L5 15.5z"/></svg>',
    anagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h4l4 10h4"/><path d="M3 17h4l4-10h4"/><path d="M18 5l3 2-3 2M18 15l3 2-3 2"/></svg>',
    hang: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21h8M7 21V3h9v3"/><circle cx="16" cy="9.5" r="2.5"/><path d="M16 12v5M13 14.5l3-1.5 3 1.5M16 17l-2 3M16 17l2 3"/></svg>',
  };
  const GROUP_INFO = { 'Nouns': ['noun', 'Five declensions, every case', 'Nouns'], 'Adjectives & Adverbs': ['adj', 'Agreement and the three degrees', 'Adjectives'], 'Pronouns': ['pron', 'ego, hic, ille, is, quī and friends', 'Pronouns'], 'Verbs': ['verb', 'Conjugations, tenses, moods, deponents, irregulars', 'Verbs'], 'Syntax': ['syntax', 'Ablative absolute, indirect statement, cum clauses, conditions…', 'Syntax'], 'Reference': ['ref', 'Reading an entry, abbreviations', 'Reference'] };
  async function renderHome() {
    const day = Math.floor(Date.now() / 86400000); const w = WOTD[day % WOTD.length]; const tipsNow = IS_NATIVE ? TIPS.filter(t => !/Download all/.test(t)) : TIPS; const tip = tipsNow[day % tipsNow.length];
    const hist = S.history.slice(0, 12), favs = S.favs.slice(0, 12);
    const banners = Object.keys(ART).filter(k => k.startsWith('rome')); const bk = banners.length ? banners[day % banners.length] : null;
    let html = (bk ? artHTML(bk) : '') + `<div class="card hero-card" id="wotd"><div class="wotd-head"><span class="section-title" style="margin:0">Word of the day</span><a class="btn small" href="#/w/${WOTD[Math.floor(Math.random() * WOTD.length)]}">${ICONS.dice.replace('<svg', '<svg width="16" height="16" style="vertical-align:-3px;margin-right:4px"')}Random</a></div><a class="wotd-hw" href="#/w/${w}">${esc(w)}</a><div class="skel" style="width:60%"></div></div>`;
    const mini = h => `<a class="mini" href="#/w/${encodeURIComponent(h.nk)}"><span class="hw">${esc(S.settings.macrons ? h.hw : strip(h.hw))}</span><span class="gl">${esc(h.gl || '')}</span></a>`;
    if (hist.length) html += `<div class="section-title">Recent</div><div class="hscroll">${hist.map(mini).join('')}</div>`;
    if (favs.length) html += `<div class="section-title">My lexicon <a class="small" href="#/saved" style="font-weight:400;text-transform:none;letter-spacing:0;margin-left:8px">all ${S.favs.length} ›</a></div><div class="hscroll">${favs.map(mini).join('')}</div>`;
    html += `<div class="section-title">Grammar</div><div class="tiles">${Object.entries(GROUP_INFO).map(([g, [ic, d, short]]) => `<a class="tile" href="#/gg/${encodeURIComponent(g)}">${ICONS[ic]}<b>${esc(short)}</b><span>${esc(d)}</span></a>`).join('')}</div>`;
    const rd = load('read', { done: [], last: null }); const lastP = rd.last && READ.find(x => x.id === rd.last);
    html += `<a class="tile wide" href="#/r${lastP ? '/' + lastP.id : ''}">${ICONS.book}<div><b>${lastP ? 'Continue reading' : 'Reader'}</b><span>${lastP ? esc(lastP.title) + ' <i>· ' + esc(lastP.author) + '</i>' : 'Graded passages from the Vulgate to Virgil, every word tappable'}</span>${rd.done.length ? `<div class="meta2"><em>${rd.done.length} of ${READ.length} read</em></div>` : ''}</div></a>`;
    const st = load('stats', { rounds: 0, best: 0 });
    html += `<a class="tile wide" href="#/play">${ICONS.dice}<div><b>Games</b><span>Verbum, Nexus, Corōna, matching and more</span>${st.rounds ? `<div class="meta2"><em>${st.rounds} round${st.rounds === 1 ? '' : 's'} played</em>${st.best ? `<em>best ${st.best.toFixed(1)}s</em>` : ''}</div>` : ''}</div></a>`;
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
    let html = `<h1>My lexicon</h1><p class="lexintro">A <i>lexicon</i> is a word-hoard. Every word you save here becomes part of your own: look it up, read it in context, practise it until it is yours. The app is built around that single idea, enlarging the store of words you truly know.</p>`;
    html += S.favs.length ? `${S.favs.length >= 4 ? '<p><a class="btn primary" href="#/play/saved">Play with these words</a></p>' : ''}<div class="results">${S.favs.map(h => `<a class="row" href="#/w/${encodeURIComponent(h.nk)}"><span class="hw">${esc(S.settings.macrons ? h.hw : strip(h.hw))}</span><span class="gl">${esc(h.gl || '')}</span></a>`).join('')}</div>` : `<div class="empty">Tap ☆ on a word to save it here.</div>`;
    html += `<h2>History</h2>`;
    html += S.history.length ? `<div class="results">${S.history.map(h => `<a class="row" href="#/w/${encodeURIComponent(h.nk)}"><span class="hw">${esc(S.settings.macrons ? h.hw : strip(h.hw))}</span><span class="gl">${esc(h.gl || '')}</span></a>`).join('')}</div><p><button class="btn" id="clearhist">Clear history</button></p>` : `<div class="empty">No lookups yet.</div>`;
    view.innerHTML = html;
    const b = $('#clearhist'); if (b) b.onclick = () => { S.history = []; save('history', []); renderSaved(); };
  }
  function renderSettings() {
    const s = S.settings;
    view.innerHTML = `<h1>Settings</h1><div class="settings-h">Dictionary</div>
      <div class="setting"><div><b>Macrons</b><div class="d">Mark long vowels (ā ē ī ō ū) in headwords and tables.</div></div><button class="btn ${s.macrons ? 'on' : ''}" data-set="macrons">${s.macrons ? 'On' : 'Off'}</button></div>
      <div class="setting"><div><b>Rare &amp; archaic forms</b><div class="d">Show poetic, archaic and late variants (greyed) and the locative.</div></div><button class="btn ${s.rare ? 'on' : ''}" data-set="rare">${s.rare ? 'On' : 'Off'}</button></div>
      <div class="setting"><div><b>Abridged Lewis &amp; Short</b><div class="d">Show each sense trimmed to three lines with a "more" link; long entries become readable at a glance.</div></div><button class="btn ${s.abridge ? 'on' : ''}" data-set="abridge">${s.abridge ? 'On' : 'Off'}</button></div>
      <div class="setting"><div><b>Citations in Lewis &amp; Short</b><div class="d">Show the quotations and author references by default.</div></div><button class="btn ${s.cit ? 'on' : ''}" data-set="cit">${s.cit ? 'On' : 'Off'}</button></div>
      <div class="settings-h">Appearance</div><h2>Theme</h2><div class="swatches">${SKINS.map(([id, name, desc]) => `<button class="swatch ${s.theme === id ? 'on' : ''}" data-skin="${id}" title="${esc(desc)}"><div class="pv" style="background:${SKIN_PREVIEW[id][0]};color:${SKIN_PREVIEW[id][1]}">Aa āē</div><div class="nm">${esc(name)}</div></button>`).join('')}</div>
      <h2>Typeface</h2><div class="fontpick">${[['mixed', 'Mixed', 'EB Garamond for Latin, system sans for the rest'], ['serif', 'Serif', 'EB Garamond everywhere'], ['sans', 'Sans', 'System sans everywhere']].map(([id, name, desc]) => `<button class="${s.font === id ? 'on' : ''}" data-font="${id}"><span class="big" style="font-family:${id === 'sans' ? 'var(--sans-stack)' : 'var(--serif-stack)'}">${esc(name)} · amīcus</span><span class="sm">${esc(desc)}</span></button>`).join('')}</div>
      <div class="setting"><div><b>Text size</b></div><input type="range" id="fs" min="14" max="22" step="1" value="${s.fs}"></div>
      <div class="settings-h">Data &amp; updates</div>
      <div class="setting webonly"><div><b>Offline data</b><div class="d">Download the whole dictionary (about 80 MB) so lookups work without a connection. Looked-up words are cached automatically anyway.</div></div><button class="btn" id="dlall">Download all</button></div>
      <div class="setting webonly"><div><b>App version</b><div class="d">Build ${esc(APP_BUILD)}. The app checks for a newer version each time it opens and reloads itself when one is found.</div></div><button class="btn" id="chkupd">Check for updates</button></div>
      <div class="setting webonly"><div><b>Reload app</b><div class="d">Force a fresh copy of the app from the server (keeps your saved words and settings).</div></div><button class="btn" id="hardreload">Reload</button></div>
      <div class="setting webonly"><div><b>Clear cached data</b><div class="d">Removes downloaded dictionary chunks (not your saved words).</div></div><button class="btn" id="clearcache">Clear</button></div>
      <h2>About</h2><p class="small">Lexicon Latinum combines <b>Lewis &amp; Short, A Latin Dictionary</b> (Oxford 1879; Perseus Digital Library edition, CC BY-SA 4.0) with the morphological data of <b>Whitaker's Words</b> (public domain). Every table is generated from Whitaker's stems and ending tables; vowel lengths on stems come from Lewis &amp; Short where the headwords match, and endings follow the standard quantities. Hidden quantities (as in rēxī) cannot be recovered automatically.</p><p class="small">Grammar notes and example sentences were written for this app and are keyed to the declension or conjugation of the word you look up.</p><p class="small muted">Data built ${Data.meta ? esc(Data.meta.built) : ''}. · <a href="https://fogliobooks.github.io/lexicon-latinum/privacy.html">Privacy policy</a> · Contact: contact@foglioprint.com</p>`;
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
    const files = ['data/inflects.json', 'data/ls_index.json', 'data/meta.json', 'data/syn.json'];
    const seen = new Set(); for (const L of 'abcdefghiklmnopqrstuwxyz_') { const g = groupFile(L) || L; if (seen.has(g)) continue; seen.add(g); files.push(`data/idx/${g}.json`, `data/ww/${g}.json`, `data/en/${g}.json`); }
    for (let i = 0; i < Data.lsBounds.length; i++) files.push(`data/ls/${String(i).padStart(3, '0')}.json`);
    let n = 0; const btn = $('#dlall');
    for (const f of files) { try { await getJSON(f); } catch (e) { } n++; if (btn) btn.textContent = `${Math.round(100 * n / files.length)}%`; }
    if (btn) btn.textContent = 'Done';
    toast('All data downloaded for offline use');
  }
  const SKINS = [['candida', 'Candida', 'Plain white'], ['illustrata', 'Per Sē', 'Orange and white, in the manner of a well-known Latin course'], ['rustic', 'Rūstica', 'Parchment, a handwritten title, sketched icons'], ['navy', 'Nox', 'Deep blue night with neon mint'], ['peach', 'Persica', 'Soft apricot and terracotta'], ['blush', 'Rosea', 'Rose pink'], ['sage', 'Salvia', 'Cool sage greens'], ['ember', 'Favilla', 'Charcoal with glowing amber'], ['purpura', 'Purpura', 'Imperial purple with gold']];
  const SKIN_PREVIEW = { auto: ['#f6f1e7', '#8b2e2e'], parchment: ['#f6f1e7', '#8b2e2e'], night: ['#1b1a17', '#e08a8a'], navy: ['#0a1730', '#3dffc6'], peach: ['#fff0e4', '#df6b35'], blush: ['#fceff4', '#d4336e'], sage: ['#edf3ea', '#2e6b4e'], ember: ['#1d1a1f', '#ff9d3f'], rustic: ['#ece0c4', '#7a3b1e'], illustrata: ['#db7537', '#ffffff'], candida: ['#ffffff', '#8b2e2e'], purpura: ['#2a1033', '#e4b84a'] };
  const IS_NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  function applyTheme() {
    const r = document.documentElement; let t = S.settings.theme;
    if (IS_NATIVE) r.dataset.native = '1';
    if (!SKINS.some(k => k[0] === t)) { t = (t === 'night' || t === 'dark') ? 'ember' : 'illustrata'; S.settings.theme = t; save('settings', S.settings); }
    r.dataset.skin = t;
    if (S.settings.font === 'mixed') delete r.dataset.font; else r.dataset.font = S.settings.font;
    if (window.LX_EMBEDDED) r.dataset.embedded = '1';
    r.style.setProperty('--fs', S.settings.fs + 'px');
    requestAnimationFrame(() => { const cs = getComputedStyle(r); const bg = (cs.getPropertyValue('--hdr') || cs.getPropertyValue('--bg')).trim() || cs.getPropertyValue('--bg').trim(); document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', bg)); });
    if (window.LXNative) try { window.LXNative.theme(getComputedStyle(r).getPropertyValue('--hdr').trim() || getComputedStyle(r).getPropertyValue('--bg').trim(), getComputedStyle(r).colorScheme === 'dark'); } catch (e) { }
  }

  // ---------------- artwork ----------------
  const ART = (typeof ARTWORK !== 'undefined') ? ARTWORK : {};
  const artHTML = (key, cls) => { const a = ART[key]; if (!a) return ''; return `<figure class="art ${cls || ''}"><img src="art/${a.file}" alt="${esc(a.title)}" loading="lazy"><figcaption class="cap">${esc(a.artist)}, <i>${esc(a.title)}</i>${a.year ? ' (' + esc(a.year) + ')' : ''} · public domain</figcaption></figure>`; };
  // ---------------- reader ----------------
  const READ = typeof READER !== 'undefined' ? READER : [];
  const LEVELS = { 1: ['First steps', 'Short sentences, common words'], 2: ['Easy', 'Fables, epigrams, simple narrative'], 3: ['Intermediate', 'Caesar, Seneca, letters'], 4: ['Advanced', 'Oratory, lyric, Ovid'], 5: ['Expert', 'Epic, Lucretius, Tacitus'] };
  function renderReader() {
    const rd = load('read', { done: [], last: null });
    let html = `<h1>Reader</h1>${artHTML('reader')}<p class="small muted">Real Latin, graded from easiest to hardest. Tap any word for its meaning and form; show the translation sentence by sentence. All texts are in the public domain.</p><div class="progress"><i style="width:${Math.round(100 * rd.done.length / READ.length)}%"></i></div>`;
    for (const l of [1, 2, 3, 4, 5]) {
      const ps = READ.filter(p => p.level === l); if (!ps.length) continue;
      html += `<div class="lvlhead"><span class="lvl l${l}">Level ${l}</span><div><h2>${esc(LEVELS[l][0])}</h2><div class="d">${esc(LEVELS[l][1])}</div></div></div>`;
      html += ps.map(p => `<a class="card pcard ${rd.done.includes(p.id) ? 'read' : ''}" href="#/r/${p.id}">${ART[p.art || p.id] ? `<img src="art/${ART[p.art || p.id].file}" alt="" loading="lazy">` : '<span></span>'}<span><span class="t">${esc(p.title)}</span><span class="a">${esc(p.author)} · ${esc(p.work)} · ${p.la.join(' ').split(/\s+/).length} words</span></span></a>`).join('');
    }
    view.innerHTML = html; view.scrollTo(0, 0);
  }
  const wordify = txt => esc(txt).replace(/([A-Za-zÀ-ÿ]+)/g, m => `<span class="w" data-w="${m}">${m}</span>`);
  function renderPassage(id) {
    const p = READ.find(x => x.id === id); if (!p) { view.innerHTML = `<div class="empty">Passage not found.</div>`; return; }
    const rd = load('read', { done: [], last: null }); rd.last = id; save('read', rd);
    const i = READ.indexOf(p); const prev = READ[i - 1], next = READ[i + 1]; const done = rd.done.includes(id);
    let html = `<p class="small muted"><a href="#/r">Reader</a> · <span class="lvl l${p.level}">Level ${p.level}</span></p><h1>${esc(p.title)}</h1><p class="muted">${esc(p.author)}, <i>${esc(p.work)}</i></p>${artHTML(p.art || p.id)}<p class="small">${esc(p.intro)}</p>`;
    html += `<div class="rtools"><button class="btn" id="trbtn">Show translation</button><button class="btn ${done ? 'on' : ''}" id="donebtn">${done ? 'Read ✓' : 'Mark as read'}</button><a class="btn" href="#/play/cloze/${p.id}">Fill the blanks</a></div><p class="small muted" style="margin:2px 0 0">Tap a word to look it up.</p>`;
    html += `<div class="passage ${p.verse ? 'verse' : ''}" id="passage">${p.la.map((para, k) => `<p>${wordify(para)}</p><div class="tr"><div>${esc(p.en[k] || '')}</div></div>`).join('')}</div>`;
    if (p.notes && p.notes.length) html += `<h2>Notes</h2><dl class="notes">${p.notes.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
    html += `<div class="pnav">${prev ? `<a class="btn" href="#/r/${prev.id}">‹ ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="btn primary" href="#/r/${next.id}">${esc(next.title)} ›</a>` : ''}</div>`;
    view.innerHTML = html; view.scrollTo(0, 0);
    $('#trbtn').onclick = () => { const ps = $('#passage'); ps.classList.toggle('showtr'); $('#trbtn').textContent = ps.classList.contains('showtr') ? 'Hide translation' : 'Show translation'; };
    $('#donebtn').onclick = () => { const r = load('read', { done: [], last: null }); if (r.done.includes(id)) r.done = r.done.filter(x => x !== id); else r.done.push(id); save('read', r); const on = r.done.includes(id); $('#donebtn').textContent = on ? 'Read ✓' : 'Mark as read'; $('#donebtn').classList.toggle('on', on); if (on) toast('Marked as read'); };
    $('#passage').onclick = ev => { const w = ev.target.closest('.w'); if (!w) return; ev.stopPropagation(); if (w.classList.contains('on') && popEl) { closePop(); return; } $('#passage').querySelectorAll('.w.on').forEach(x => x.classList.remove('on')); w.classList.add('on'); wordPop(w); };
  }
  async function glossData(word) {
    await Data.ready; const nq = norm(word); const L = letterOf(nq);
    const [arr, wIdx] = await Promise.all([idx(L), wwIndex(L)]);
    const an = Morph.analyze(nq, wIdx); const byEntry = new Map();
    for (const a of an) { const k = a.entry.i; if (!byEntry.has(k)) byEntry.set(k, { e: a.entry, descs: [], enc: a.enclitic, common: a.common, rank: 'ABCDEFXIMN'.indexOf((a.entry.f || 'X')[3]) }); const g = byEntry.get(k); const d = Morph.describe(a.r); if (!g.descs.includes(d)) g.descs.push(d); if (a.common) g.common = true; }
    const list = [...byEntry.values()].sort((a, b) => (b.common - a.common) || (a.rank - b.rank) || ((a.enc ? 1 : 0) - (b.enc ? 1 : 0)));
    const exact = arr.find(r => r[0] === nq);
    return { nq, list, exact };
  }
  let popEl = null;
  function closePop() { if (popEl) { popEl.remove(); popEl = null; } view.querySelectorAll('.passage .w.on').forEach(x => x.classList.remove('on')); }
  async function wordPop(wEl) {
    const word = wEl.dataset.w;
    if (!popEl) { popEl = document.createElement('div'); popEl.id = 'pop'; document.body.appendChild(popEl); popEl.addEventListener('click', ev => ev.stopPropagation()); }
    popEl.innerHTML = `<div class="ph"><span class="phw">${esc(word)}</span></div><div class="skel" style="width:70%;margin:6px 0 2px"></div>`;
    placePop(wEl);
    const token = (popEl._t = (popEl._t || 0) + 1);
    try {
      const { nq, list, exact } = await glossData(word);
      if (!popEl || popEl._t !== token) return;
      let html;
      if (list.length) {
        const g = list[0]; const nk = norm(g.e.hw); const gl = (g.e.m || '').replace(/^\|+/, '').split(';').slice(0, 2).join(';');
        html = `<div class="ph"><span class="phw">${esc(macHw(g.e))}${g.enc ? ` <span class="chip">+${esc(g.enc)}</span>` : ''}</span><a class="pgo" href="#/w/${encodeURIComponent(nk)}?f=${encodeURIComponent(nq)}">Entry ›</a></div><div class="pgl">${esc(gl)}</div><div class="pgr"><b>${esc(g.descs.slice(0, 2).join('; '))}</b> · ${esc(classLabel(g.e))}${list.length > 1 ? `<span class="palt">or <a href="#/w/${encodeURIComponent(norm(list[1].e.hw))}?f=${encodeURIComponent(nq)}">${esc(macHw(list[1].e))}</a>, ${esc(list[1].descs[0])}</span>` : ''}</div>`;
      } else if (exact) html = `<div class="ph"><span class="phw">${esc(exact[1])}</span><a class="pgo" href="#/w/${encodeURIComponent(exact[0])}">Entry ›</a></div><div class="pgl">${esc(exact[3])}</div>`;
      else html = `<div class="ph"><span class="phw">${esc(word)}</span><a class="pgo" href="#/s/${encodeURIComponent(nq)}">Search ›</a></div><div class="pgl muted">Not found as a form; perhaps a name or a variant spelling.</div>`;
      popEl.innerHTML = html; placePop(wEl);
      requestAnimationFrame(() => { const g = popEl && popEl.querySelector('.pgr'); if (g) g.classList.add('in'); });
    } catch (e) { if (popEl) popEl.innerHTML = `<div class="pgl muted">Could not look that up.</div>`; }
  }
  function placePop(wEl) {
    let r = wEl.getBoundingClientRect(); const pw = popEl.offsetWidth || 300; const ph = popEl.offsetHeight || 80;
    const barTop = window.innerHeight - (tabsOn ? 96 : 22) - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0);
    if (r.bottom > barTop - 8) { view.scrollBy({ top: r.bottom - (barTop - 8), left: 0, behavior: 'instant' }); r = wEl.getBoundingClientRect(); }
    const vw = document.documentElement.clientWidth; const headerH = ($('#top') ? $('#top').getBoundingClientRect().bottom : 0);
    let left = r.left + r.width / 2 - pw / 2; left = Math.max(12, Math.min(vw - pw - 12, left));
    const above = r.top - headerH > ph + 14;
    const top = above ? r.top - ph - 10 : r.bottom + 10;
    popEl.style.left = left + 'px'; popEl.style.top = top + 'px'; popEl.className = above ? 'above' : 'below';
    popEl.style.setProperty('--ax', (r.left + r.width / 2 - left) + 'px');
  }
  document.addEventListener('click', ev => { if (popEl && !ev.target.closest('.passage .w')) closePop(); });
  window.addEventListener('hashchange', closePop);
  view.addEventListener('scroll', () => { if (popEl) closePop(); }, { passive: true });
  async function quickGloss(word) {
    const body = $('#sheet .sheet-body'); body.innerHTML = `<div class="gloss-hw">${esc(word)}</div><div class="skel" style="width:50%"></div><div class="skel"></div>`; $('#sheet').hidden = false; document.body.style.overflow = 'hidden';
    try {
      await Data.ready; const nq = norm(word); const L = letterOf(nq);
      const [arr, wIdx] = await Promise.all([idx(L), wwIndex(L)]);
      const an = Morph.analyze(nq, wIdx);
      const byEntry = new Map();
      for (const a of an) { const k = a.entry.i; if (!byEntry.has(k)) byEntry.set(k, { e: a.entry, descs: [], enc: a.enclitic, common: a.common, rank: 'ABCDEFXIMN'.indexOf((a.entry.f || 'X')[3]) }); const g = byEntry.get(k); const d = Morph.describe(a.r); if (!g.descs.includes(d)) g.descs.push(d); if (a.common) g.common = true; }
      const list = [...byEntry.values()].sort((a, b) => (b.common - a.common) || (a.rank - b.rank) || ((a.enc ? 1 : 0) - (b.enc ? 1 : 0)));
      const exact = arr.find(r => r[0] === nq);
      let html = '';
      if (list.length) {
        const g = list[0]; const nk = norm(g.e.hw);
        html += `<div class="gloss-hw">${esc(macHw(g.e))}${g.enc ? ` <span class="chip">+ ${esc(g.enc)}</span>` : ''}</div><div class="gloss-form">${esc(g.descs.slice(0, 2).join('; '))}</div><p>${esc((g.e.m || '').replace(/^\|+/, ''))}</p><p class="small muted">${esc(classLabel(g.e))}</p><p><a class="btn primary" href="#/w/${encodeURIComponent(nk)}?f=${encodeURIComponent(nq)}">Full entry</a></p>`;
        if (list.length > 1) html += `<div class="gloss-alt"><div class="section-title" style="margin-top:0">Could also be</div>${list.slice(1, 4).map(g2 => `<div><a href="#/w/${encodeURIComponent(norm(g2.e.hw))}?f=${encodeURIComponent(nq)}" class="la"><b>${esc(macHw(g2.e))}</b></a> <span class="muted small">${esc(g2.descs[0])} — ${esc((g2.e.m || '').replace(/^\|+/, '').split(';')[0])}</span></div>`).join('')}</div>`;
      } else if (exact) {
        html += `<div class="gloss-hw">${esc(exact[1])}</div><p>${esc(exact[3])}</p><p><a class="btn primary" href="#/w/${encodeURIComponent(exact[0])}">Full entry</a></p>`;
      } else {
        html += `<div class="gloss-hw">${esc(word)}</div><p class="muted">Not in the dictionary as a form. It may be a proper name or a spelling variant.</p><p><a class="btn" href="#/s/${encodeURIComponent(nq)}">Search</a></p>`;
      }
      body.innerHTML = html;
    } catch (e) { body.innerHTML = `<p class="muted">Could not look that up.</p>`; }
  }
  // ---------------- practice: matching game ----------------
  const G = { mode: 'words', source: 'common', pairs: [], left: null, right: null, matched: 0, start: 0, timer: null, wrong: 0 };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  async function makeWordPairs() {
    const pool = G.source === 'saved' && S.favs.length >= 4 ? S.favs.map(f => f.nk) : WOTD.slice();
    const picks = shuffle(pool.slice()).slice(0, 12); const pairs = [];
    for (const nk of picks) { const r = await idxRecord(norm(nk)); if (!r) continue; const en = r[3].split(/;/)[0].split(/,/)[0].replace(/\(.*?\)/g, '').split('/').slice(0, 2).map(x => x.trim()).filter(Boolean).join(', ').trim(); if (!en || en.length > 26) continue; const la = S.settings.macrons ? r[1] : strip(r[1]); if (pairs.some(p => p.en.toLowerCase() === en.toLowerCase() || p.la === la)) continue; pairs.push({ la, en, nk: r[0] }); if (pairs.length === 5) break; }
    return pairs;
  }
  async function makeFormPairs() {
    const cand = shuffle(WOTD.slice());
    for (const w of cand) {
      const rec = await idxRecord(norm(w)); if (!rec) continue; const ww = await wwChunk(letterOf(rec[0])); const e = rec[5].map(id => ww._map.get(id)).find(e => e && (e.p === 'N' || e.p === 'V' || e.p === 'ADJ')); if (!e) continue;
      const forms = Morph.generate(e).filter(x => x.common && (x.r.p === 'N' || x.r.p === 'V' || x.r.p === 'ADJ') && !(x.r.p === 'ADJ' && x.r.co !== 'POS'));
      const f = fmt(e); const seen = new Set(), byLabel = new Set(), pairs = [];
      for (const x of shuffle(forms)) { const la = f(x); const en = Morph.describe(x.r); if (seen.has(x.f) || byLabel.has(en) || forms.filter(y => y.f === x.f).length > 1) continue; seen.add(x.f); byLabel.add(en); pairs.push({ la, en, nk: rec[0] }); if (pairs.length === 5) break; }
      if (pairs.length === 5) { G.word = S.settings.macrons ? rec[1] : strip(rec[1]); return pairs; }
    }
    return [];
  }
  async function newRound() {
    G.pairs = []; G.left = G.right = null; G.matched = 0; G.wrong = 0; G.word = null;
    $('#board').innerHTML = `<div class="skel"></div><div class="skel"></div>`;
    await Data.ready;
    G.pairs = G.mode === 'forms' ? await makeFormPairs() : await makeWordPairs();
    if (G.pairs.length < 4) { $('#board').innerHTML = `<div class="empty">Could not build a round. Check your connection.</div>`; return; }
    const L = G.pairs.map((p, i) => ({ i, t: p.la })), R = shuffle(G.pairs.map((p, i) => ({ i, t: p.en })));
    $('#board').innerHTML = `${G.word ? `<p class="small muted" style="grid-column:1/-1;margin:0">Forms of <b class="la">${esc(G.word)}</b></p>` : ''}<div class="col">${L.map(x => `<button class="tilebtn la" data-side="l" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div><div class="col">${R.map(x => `<button class="tilebtn" data-side="r" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div>`;
    clearInterval(G.timer); G.running = false; const t0 = $('#gtime'); if (t0) t0.textContent = '0s';
    $('#board').insertAdjacentHTML('beforeend', `<div class="veil" id="veil"><button class="btn primary" id="gstart">Start</button><span class="small muted">The clock starts when you do</span></div>`);
    $('#board').classList.add('covered');
    $('#gstart').onclick = () => { $('#veil').remove(); $('#board').classList.remove('covered'); G.running = true; G.start = Date.now(); G.timer = setInterval(() => { const t = $('#gtime'); if (t) t.textContent = ((Date.now() - G.start) / 1000).toFixed(0) + 's'; }, 500); };
  }
  function tileTap(btn) {
    if (!G.running) return;
    const side = btn.dataset.side, i = +btn.dataset.i;
    $('#board').querySelectorAll(`.tilebtn[data-side="${side}"].sel`).forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel'); if (side === 'l') G.left = i; else G.right = i;
    if (G.left === null || G.right === null) return;
    const l = $('#board').querySelector('.tilebtn[data-side="l"].sel'), r = $('#board').querySelector('.tilebtn[data-side="r"].sel');
    if (G.left === G.right) { l.classList.remove('sel'); r.classList.remove('sel'); l.classList.add('ok'); r.classList.add('ok'); G.matched++; if (navigator.vibrate) navigator.vibrate(10); if (G.matched === G.pairs.length) finishRound(); }
    else { G.wrong++; l.classList.add('bad'); r.classList.add('bad'); setTimeout(() => { l.classList.remove('sel', 'bad'); r.classList.remove('sel', 'bad'); }, 380); }
    G.left = G.right = null;
  }
  function finishRound() {
    clearInterval(G.timer); const secs = (Date.now() - G.start) / 1000; const st = load('stats', { rounds: 0, best: 0, today: '', streak: 0 });
    st.rounds++; if (!st.best || secs < st.best) st.best = secs; const today = new Date().toISOString().slice(0, 10); if (st.today !== today) { const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10); st.streak = st.today === y ? st.streak + 1 : 1; st.today = today; } save('stats', st);
    $('#board').innerHTML = `<div class="done" style="grid-column:1/-1"><div class="big">${secs.toFixed(1)}s</div><p>${G.wrong ? `${G.wrong} slip${G.wrong === 1 ? '' : 's'}` : 'Perfect round!'} · best ${st.best.toFixed(1)}s</p><p><button class="btn primary" id="again">Next round</button> ${G.pairs[0] && G.mode === 'words' ? `<a class="btn" href="#/w/${encodeURIComponent(G.pairs[0].nk)}">Look up a word</a>` : ''}</p><p class="similar">${G.pairs.map(p => `<a href="#/w/${encodeURIComponent(p.nk)}"><span class="la">${esc(p.la)}</span><span class="gl">${esc(p.en)}</span></a>`).join('')}</p></div>`;
    $('#again').onclick = newRound; renderStats();
  }
  function renderStats() { const st = load('stats', { rounds: 0, best: 0, streak: 0 }); const el = $('#gstats'); if (el) el.innerHTML = `<div><b>${st.rounds}</b><span>rounds</span></div><div><b>${st.best ? st.best.toFixed(1) + 's' : '—'}</b><span>best</span></div><div><b>${st.streak || 0}</b><span>streak</span></div><div><b id="gtime">0s</b><span>time</span></div>`; }
  // ---- cloze (fill the blanks) ----
  const C = { p: null, blanks: [], cur: 0, right: 0, wrong: 0 };
  function renderCloze(id) {
    const pool = READ.filter(p => !id || p.id === id); const p = id ? READ.find(x => x.id === id) : pool[Math.floor(Math.random() * pool.length)];
    if (!p) { view.innerHTML = `<div class="empty">No passage.</div>`; return; }
    C.p = p; C.cur = 0; C.right = 0; C.wrong = 0;
    const tokens = []; p.la.forEach((para, pi) => { para.split(/(\s+)/).forEach(t => tokens.push({ t, pi })); });
    const cands = tokens.map((x, i) => ({ i, w: x.t.replace(/[^A-Za-z]/g, '') })).filter(x => x.w.length >= 4);
    const n = Math.min(8, Math.max(4, Math.floor(cands.length / 6)));
    const chosen = shuffle(cands.slice()).slice(0, n).sort((a, b) => a.i - b.i);
    C.blanks = chosen.map((c, k) => { const alts = shuffle(cands.filter(o => o.w.toLowerCase() !== c.w.toLowerCase() && Math.abs(o.w.length - c.w.length) <= 2).map(o => o.w)); const opts = [c.w]; for (const a of alts) { if (opts.length >= 4) break; if (!opts.some(o => o.toLowerCase() === a.toLowerCase())) opts.push(a); } return { i: c.i, w: c.w, opts: shuffle(opts), k }; });
    let html = `<p class="small muted"><a href="#/play">Games</a> · Lacūnae · <span class="lvl l${p.level}">Level ${p.level}</span></p><h1>${esc(p.title)}</h1><p class="muted">${esc(p.author)}, <i>${esc(p.work)}</i></p><p class="small">Pick the word that belongs in each gap. The sense of the sentence, and the endings around it, are your clues.</p>`;
    const paras = p.la.map((_, pi) => tokens.map((x, i) => { const b = C.blanks.find(b => b.i === i); if (x.pi !== pi) return ''; if (!b) return esc(x.t); return x.t.replace(b.w, `<span class="blank" data-k="${b.k}" id="bl${b.k}">&nbsp;</span>`); }).join(''));
    html += `<div class="cloze ${p.verse ? 'verse' : ''}">${paras.map(x => `<p>${x}</p>`).join('')}</div><div class="choices" id="choices"></div><div id="cresult"></div>`;
    view.innerHTML = html; view.scrollTo(0, 0);
    view.querySelector('.cloze').onclick = ev => { const b = ev.target.closest('.blank'); if (b && !b.classList.contains('ok') && !b.classList.contains('bad')) { C.cur = +b.dataset.k; showChoices(); } };
    showChoices();
  }
  function showChoices() {
    const b = C.blanks[C.cur]; const box = $('#choices'); view.querySelectorAll('.blank.cur').forEach(x => x.classList.remove('cur'));
    if (!b) { box.innerHTML = ''; return; }
    const el = document.getElementById('bl' + b.k); el.classList.add('cur'); el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    box.innerHTML = b.opts.map(o => `<button data-o="${esc(o)}">${esc(o)}</button>`).join('');
    box.onclick = ev => { const btn = ev.target.closest('button'); if (!btn) return; const pick = btn.dataset.o; const ok = pick.toLowerCase() === b.w.toLowerCase(); el.textContent = ok ? b.w : pick; el.classList.add(ok ? 'ok' : 'bad'); if (ok) { C.right++; if (navigator.vibrate) navigator.vibrate(8); } else { C.wrong++; setTimeout(() => { el.textContent = b.w; el.classList.remove('bad'); el.classList.add('ok'); el.title = 'You chose ' + pick; }, 900); }
      const next = C.blanks.findIndex((x, i) => i > C.cur && !document.getElementById('bl' + x.k).classList.contains('ok') && !document.getElementById('bl' + x.k).classList.contains('bad')); const any = C.blanks.findIndex(x => { const e = document.getElementById('bl' + x.k); return !e.classList.contains('ok') && !e.classList.contains('bad'); });
      C.cur = next >= 0 ? next : any; if (C.cur < 0) { box.innerHTML = ''; const st = load('stats', { rounds: 0, best: 0 }); st.cloze = (st.cloze || 0) + 1; save('stats', st); $('#cresult').innerHTML = `<div class="card done"><div class="big">${C.right}/${C.blanks.length}</div><p>${C.right === C.blanks.length ? 'Every gap right.' : `${C.wrong} to look at again.`}</p><p><a class="btn primary" href="#/play/cloze">Another passage</a> <a class="btn" href="#/play">Games</a> <a class="btn" href="#/r/${C.p.id}">Read it with translation</a></p></div>`; } else setTimeout(showChoices, ok ? 250 : 950); };
  }
  function renderMatch(kind) {
    if (kind === 'saved') G.source = 'saved'; if (kind === 'forms') G.mode = 'forms'; if (kind === 'match') G.mode = 'words';
    view.innerHTML = `${crumb('Pāria')}<div class="game-top"><h1 style="margin:0">Pāria</h1><div class="seg" id="modeseg"><button data-m="words" class="${G.mode === 'words' ? 'on' : ''}">Words</button><button data-m="forms" class="${G.mode === 'forms' ? 'on' : ''}">Forms</button></div></div><div class="game-top"><p class="small muted" style="margin:0">${G.mode === 'words' ? 'Tap a Latin word, then its meaning.' : 'Tap a form, then the case or tense it belongs to.'}</p>${G.mode === 'words' ? `<div class="seg" id="srcseg"><button data-s="common" class="${G.source === 'common' ? 'on' : ''}">Common</button><button data-s="saved" class="${G.source === 'saved' ? 'on' : ''}" ${S.favs.length < 4 ? 'disabled title="Save at least 4 words first"' : ''}>Saved</button></div>` : ''}</div><div class="stat" id="gstats"></div><div class="grow"><div class="board" id="board"></div></div>`;
    renderStats();
    $('#modeseg').onclick = ev => { const b = ev.target.closest('button'); if (!b) return; G.mode = b.dataset.m; renderMatch(); };
    const ss = $('#srcseg'); if (ss) ss.onclick = ev => { const b = ev.target.closest('button'); if (!b || b.disabled) return; G.source = b.dataset.s; renderMatch(); };
    $('#board').onclick = ev => { const b = ev.target.closest('.tilebtn'); if (b && !b.classList.contains('ok')) tileTap(b); };
    newRound();
  }
  // ---------------- games hub ----------------
  const dayIndex = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const seeded = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const gstat = () => load('games', {}); const gsave = g => save('games', g);
  const VERBA_ALL = typeof VERBA !== 'undefined' ? VERBA : [], CORONA_ALL = typeof CORONA !== 'undefined' ? CORONA : [], NEXUS_ALL = typeof NEXUS !== 'undefined' ? NEXUS : [];
  const GAMES = [
    ['verbum', 'Verbum', 'Guess the five-letter Latin word in six tries. A new word every day.', 'verbum'],
    ['nexus', 'Nexus', 'Sixteen words, four hidden groups of four. Find them all.', 'nexus'],
    ['corona', 'Corōna', 'A ring of letters: make every word you can and fill the crossword.', 'corona'],
    ['match', 'Pāria', 'Match Latin words with their meanings against the clock.', 'dice'],
    ['anagram', 'Anagramma', 'Unscramble the letters to make the Latin word for the meaning shown.', 'anagram'],
    ['hang', 'Pendulus', 'Guess a word one letter at a time before the drawing is finished.', 'hang'],
    ['cloze', 'Lacūnae', 'Put the missing words back into a passage from the Reader.', 'book'],
  ];
  const dayDone = (g, k) => g[k] && g[k].lastDay === dayIndex();
  function renderGamesHub() {
    const g = gstat(); const st = load('stats', { rounds: 0, best: 0 });
    const status = {
      match: st.rounds ? `${st.rounds} round${st.rounds === 1 ? '' : 's'} · best ${st.best.toFixed(1)}s` : 'Words or forms',
      verbum: dayDone(g, 'verbum') ? (g.verbum.lastWon ? 'Solved today ✓' : 'Played today') : 'Today’s word is waiting',
      nexus: dayDone(g, 'nexus') ? (g.nexus.lastWon ? 'Solved today ✓' : 'Played today') : 'Today’s puzzle is waiting',
      corona: `${Object.keys((g.corona || {}).solved || {}).length} of ${CORONA_ALL.length} rings solved`,
      anagram: g.anagram && g.anagram.best ? `best ${g.anagram.best} of 10` : 'Ten words a round',
      hang: g.hang && g.hang.played ? `${g.hang.won || 0} won of ${g.hang.played}` : 'Seven wrong letters allowed',
      cloze: st.cloze ? `${st.cloze} passage${st.cloze === 1 ? '' : 's'} done` : `${READ.length} passages`,
    };
    view.innerHTML = `<h1>Games</h1><p class="small muted">Play with the words. Verbum and Nexus bring a new puzzle every day; the rest are endless.</p><div class="tiles games">${GAMES.map(([id, name, desc, icon]) => `<a class="tile ${id === 'cloze' ? 'wide' : ''}" href="#/play/${id}">${ICONS[icon]}<${id === 'cloze' ? 'div><b' : 'b'}>${name}</b><span>${desc}</span><em class="gchip">${esc(status[id])}</em>${id === 'cloze' ? '</div>' : ''}</a>`).join('')}</div>`;
  }
  const crumb = (name) => `<p class="small muted gcrumb"><a href="#/play">Games</a> · ${name}</p>`;
  function bump(key, f) { const g = gstat(); g[key] = g[key] || {}; f(g[key]); gsave(g); return g[key]; }
  function keyboardHTML(rows, states) { return `<div class="kb">${rows.map(r => `<div class="kbrow">${r.map(k => `<button data-k="${k}" class="${k === '⏎' || k === '⌫' ? 'wide ' : ''}${states && states[k] ? states[k] : ''}">${k}</button>`).join('')}</div>`).join('')}</div>`; }
  const KB_ROWS = [['q', 'u', 'e', 'r', 't', 'y', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'k', 'l'], ['⏎', 'z', 'x', 'c', 'b', 'n', 'm', '⌫']];
  async function wordInfo(nk) { const r = await idxRecord(nk); if (!r) return null; return { nk: r[0], hw: S.settings.macrons ? r[1] : strip(r[1]), gl: r[3].split(/;/)[0].replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').split('/').slice(0, 3).map(x => x.trim()).filter(Boolean).join(', ').replace(/\s+/g, ' ').trim().slice(0, 48), pos: r[2].split(',')[0] }; }
  // ---- Verbum (five letters, six tries) ----
  const VB = { ans: null, rows: [], cur: '', done: false, daily: true, keys: {} };
  function verbumStart(daily) {
    VB.daily = daily; VB.rows = []; VB.cur = ''; VB.done = false; VB.keys = {};
    const i = daily ? Math.floor(seeded(dayIndex() * 131 + 7)() * VERBA_ALL.length) : Math.floor(Math.random() * VERBA_ALL.length);
    VB.ans = VERBA_ALL[i];
    const g = gstat().verbum; if (daily && g && g.lastDay === dayIndex() && g.rows) { VB.rows = g.rows; VB.done = g.done; for (const r of VB.rows) verbumKeyStates(r); }
    verbumDraw();
  }
  function verbumScore(guess) { const a = VB.ans[0].split(''), s = Array(5).fill('x'); const left = []; for (let i = 0; i < 5; i++) { if (guess[i] === a[i]) s[i] = 'g'; else left.push(a[i]); } for (let i = 0; i < 5; i++) { if (s[i] === 'g') continue; const j = left.indexOf(guess[i]); if (j >= 0) { s[i] = 'y'; left.splice(j, 1); } } return s.join(''); }
  function verbumKeyStates(row) { const sc = verbumScore(row); for (let i = 0; i < 5; i++) { const k = row[i], v = sc[i]; const cur = VB.keys[k]; if (v === 'g' || (v === 'y' && cur !== 'g') || (!cur)) VB.keys[k] = v; } }
  function verbumDraw() {
    const g = gstat().verbum || {};
    let grid = '';
    for (let r = 0; r < 6; r++) {
      const row = VB.rows[r]; const sc = row ? verbumScore(row) : null; const typing = !row && r === VB.rows.length && !VB.done ? VB.cur : '';
      grid += `<div class="vrow ${row ? 'filled' : ''}">${[0, 1, 2, 3, 4].map(i => `<div class="vcell ${sc ? sc[i] : (typing[i] ? 'typed' : '')}" style="--d:${i * 70}ms">${row ? row[i] : (typing[i] || '')}</div>`).join('')}</div>`;
    }
    const stats = `<div class="stat"><div><b>${g.played || 0}</b><span>played</span></div><div><b>${g.played ? Math.round(100 * (g.won || 0) / g.played) : 0}%</b><span>won</span></div><div><b>${g.streak || 0}</b><span>streak</span></div><div><b>${g.maxStreak || 0}</b><span>best streak</span></div></div>`;
    let end = '';
    if (VB.done) {
      const won = VB.rows[VB.rows.length - 1] === VB.ans[0];
      end = `<div class="card done gend"><div class="big la">${esc(VB.ans[1])}</div><p>${esc(VB.ans[2])}</p><p class="small muted">${won ? `Solved in ${VB.rows.length} ${VB.rows.length === 1 ? 'try' : 'tries'}.` : 'Not this time.'}</p><p><a class="btn primary" href="#/w/${encodeURIComponent(norm(VB.ans[1]))}">Open entry</a> <button class="btn" id="vshare">Share</button> ${VB.daily ? '<button class="btn" id="vrandom">Play a random word</button>' : '<button class="btn" id="vrandom">Another word</button>'}</p></div>`;
    }
    view.innerHTML = `${crumb('Verbum')}<div class="game-top"><h1 style="margin:0">Verbum</h1><div class="seg" id="vseg"><button data-d="1" class="${VB.daily ? 'on' : ''}">Daily</button><button data-d="0" class="${VB.daily ? '' : 'on'}">Random</button></div></div><p class="small muted one">Five letters, six tries. Any Latin form counts; write u for v and i for j.</p><div class="grow"><div class="vgrid" id="vgrid">${grid}</div></div>${VB.done ? end + stats : keyboardHTML(KB_ROWS, VB.keys)}`;
    fitCells($('#vgrid'), 6, 5, 6, 60, '--vc');
    $('#vseg').onclick = ev => { const b = ev.target.closest('button'); if (b) verbumStart(b.dataset.d === '1'); };
    view.querySelector('.kb').onclick = ev => { const b = ev.target.closest('button'); if (b) verbumKey(b.dataset.k); };
    const sh = $('#vshare'); if (sh) sh.onclick = () => { const txt = `Verbum ${VB.daily ? 'diēī ' + new Date().toISOString().slice(0, 10) : ''} ${VB.rows[VB.rows.length - 1] === VB.ans[0] ? VB.rows.length : 'X'}/6\n` + VB.rows.map(r => verbumScore(r).replace(/g/g, '🟩').replace(/y/g, '🟨').replace(/x/g, '⬜')).join('\n') + '\nlexicon latinum'; if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else if (navigator.clipboard) { navigator.clipboard.writeText(txt); toast('Copied'); } };
    const rn = $('#vrandom'); if (rn) rn.onclick = () => verbumStart(false);
  }
  async function verbumKey(k) {
    if (VB.done) return;
    if (k === '⌫') { VB.cur = VB.cur.slice(0, -1); verbumDraw(); return; }
    if (k === '⏎') {
      if (VB.cur.length < 5) { shakeRow(); toast('Five letters'); return; }
      const w = VB.cur; const ok = VERBA_ALL.some(x => x[0] === w) || await (async () => { const arr = await idx(w[0]); if (arr.some(r => r[0] === w)) return true; const wi = await wwIndex(w[0]); return Morph.analyze(w, wi).length > 0; })();
      if (!ok) { shakeRow(); toast('Not a Latin form I know'); return; }
      VB.rows.push(w); VB.cur = ''; verbumKeyStates(w);
      if (w === VB.ans[0] || VB.rows.length === 6) {
        VB.done = true; const won = w === VB.ans[0];
        if (VB.daily) bump('verbum', s => { const d = dayIndex(); s.played = (s.played || 0) + 1; if (won) { s.won = (s.won || 0) + 1; s.streak = s.lastDay === d - 1 ? (s.streak || 0) + 1 : 1; s.maxStreak = Math.max(s.maxStreak || 0, s.streak); } else s.streak = 0; s.lastDay = d; s.lastWon = won; s.rows = VB.rows; s.done = true; s.dist = s.dist || {}; if (won) s.dist[VB.rows.length] = (s.dist[VB.rows.length] || 0) + 1; });
        if (won && navigator.vibrate) navigator.vibrate([10, 40, 10]);
      } else if (VB.daily) bump('verbum', s => { s.lastDay = dayIndex(); s.rows = VB.rows; s.done = false; });
      verbumDraw(); return;
    }
    if (/^[a-z]$/.test(k) && VB.cur.length < 5) { VB.cur += k === 'v' ? 'u' : k === 'j' ? 'i' : k; verbumDraw(); }
  }
  function shakeRow() { const r = view.querySelectorAll('.vrow')[VB.rows.length]; if (r) { r.classList.remove('shake'); void r.offsetWidth; r.classList.add('shake'); } }
  document.addEventListener('keydown', ev => { if (!$('#vgrid') || ev.metaKey || ev.ctrlKey) return; const k = ev.key.toLowerCase(); if (k === 'enter') verbumKey('⏎'); else if (k === 'backspace') verbumKey('⌫'); else if (/^[a-z]$/.test(k)) verbumKey(k); });
  // ---- Nexus (four groups of four) ----
  const NX = { p: null, i: 0, daily: true, sel: [], solved: [], mistakes: 0, order: [], over: false };
  function nexusStart(daily, idx) {
    NX.daily = daily; NX.i = daily ? dayIndex() % NEXUS_ALL.length : (idx != null ? idx : Math.floor(Math.random() * NEXUS_ALL.length)); NX.p = NEXUS_ALL[NX.i];
    NX.sel = []; NX.solved = []; NX.mistakes = 0; NX.over = false;
    NX.order = shuffle(NX.p.groups.flatMap((g, gi) => g[2].map(w => ({ w, gi }))));
    const g = gstat().nexus; if (daily && g && g.lastDay === dayIndex() && g.state) { NX.solved = g.state.solved; NX.mistakes = g.state.mistakes; NX.over = g.state.over; }
    nexusDraw();
  }
  function nexusDraw() {
    const p = NX.p; const left = NX.order.filter(x => !NX.solved.includes(x.gi));
    let html = `${crumb('Nexus')}<div class="game-top"><h1 style="margin:0">Nexus</h1><div class="seg" id="nseg"><button data-d="1" class="${NX.daily ? 'on' : ''}">Daily</button><button data-d="0" class="${NX.daily ? '' : 'on'}">Random</button></div></div><p class="small muted one">Find four groups of four. Four mistakes allowed.</p>`;
    html += `<div class="grow" style="--nxr:${4 - NX.solved.length}"><div class="nxsolved">${NX.solved.map(gi => `<div class="nxgroup l${p.groups[gi][1]}"><b>${esc(p.groups[gi][0])}</b><span class="la">${p.groups[gi][2].map(esc).join(', ')}</span></div>`).join('')}</div>`;
    if (!NX.over) {
      html += `<div class="nxgrid">${left.map(x => `<button class="nxw la ${NX.sel.includes(x.w) ? 'sel' : ''}" data-w="${esc(x.w)}">${esc(x.w)}</button>`).join('')}</div>`;
      html += `</div><p class="small muted nxlives">Mistakes left: ${'●'.repeat(4 - NX.mistakes)}${'○'.repeat(NX.mistakes)}</p><p class="nxbtns"><button class="btn" id="nxshuf">Shuffle</button><button class="btn" id="nxclear">Deselect</button><button class="btn primary" id="nxsub" ${NX.sel.length === 4 ? '' : 'disabled'}>Submit</button></p>`;
    } else {
      const won = NX.solved.length === 4; const g = gstat().nexus || {};
      html += `</div><div class="card done gend"><div class="big">${won ? (NX.mistakes === 0 ? 'Perfect!' : 'Solved') : 'Next time'}</div><p class="small muted">${won ? `${NX.mistakes} mistake${NX.mistakes === 1 ? '' : 's'}.` : 'The groups are shown above.'}</p><p><button class="btn primary" id="nxanother">${NX.daily ? 'Play a random puzzle' : 'Another puzzle'}</button></p></div><div class="stat"><div><b>${g.played || 0}</b><span>played</span></div><div><b>${g.won || 0}</b><span>solved</span></div><div><b>${g.perfect || 0}</b><span>perfect</span></div><div><b>${g.streak || 0}</b><span>streak</span></div></div>`;
    }
    view.innerHTML = html;
    $('#nseg').onclick = ev => { const b = ev.target.closest('button'); if (b) nexusStart(b.dataset.d === '1'); };
    const grid = view.querySelector('.nxgrid'); if (grid) grid.onclick = ev => { const b = ev.target.closest('.nxw'); if (!b) return; const w = b.dataset.w; if (NX.sel.includes(w)) NX.sel = NX.sel.filter(x => x !== w); else if (NX.sel.length < 4) NX.sel.push(w); b.classList.toggle('sel', NX.sel.includes(w)); $('#nxsub').disabled = NX.sel.length !== 4; };
    const sh = $('#nxshuf'); if (sh) sh.onclick = () => { shuffle(NX.order); nexusDraw(); };
    const cl = $('#nxclear'); if (cl) cl.onclick = () => { NX.sel = []; nexusDraw(); };
    const sb = $('#nxsub'); if (sb) sb.onclick = nexusSubmit;
    const an = $('#nxanother'); if (an) an.onclick = () => nexusStart(false);
  }
  function nexusSave(done, won) {
    bump('nexus', s => {
      const d = dayIndex();
      if (NX.daily) { s.lastDay = d; s.state = { solved: NX.solved, mistakes: NX.mistakes, over: NX.over }; }
      if (done && (!NX.daily || s.countedDay !== d)) {
        s.played = (s.played || 0) + 1;
        if (won) { s.won = (s.won || 0) + 1; if (NX.mistakes === 0) s.perfect = (s.perfect || 0) + 1; }
        if (NX.daily) { s.streak = won ? (s.prevWinDay === d - 1 ? (s.streak || 0) + 1 : 1) : 0; if (won) s.prevWinDay = d; s.countedDay = d; s.lastWon = won; }
      }
    });
  }
  function nexusSubmit() {
    if (NX.sel.length !== 4) return;
    const gis = NX.sel.map(w => NX.order.find(x => x.w === w).gi); const counts = {}; for (const gi of gis) counts[gi] = (counts[gi] || 0) + 1;
    const best = Math.max(...Object.values(counts));
    if (best === 4) { NX.solved.push(gis[0]); NX.sel = []; if (navigator.vibrate) navigator.vibrate(12); if (NX.solved.length === 4) { NX.over = true; nexusSave(true, true); } else nexusSave(false); nexusDraw(); return; }
    NX.mistakes++; view.querySelectorAll('.nxw.sel').forEach(b => { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); });
    toast(best === 3 ? 'One away…' : 'Not a group');
    if (NX.mistakes >= 4) { NX.over = true; for (let gi = 0; gi < 4; gi++) if (!NX.solved.includes(gi)) NX.solved.push(gi); nexusSave(true, false); setTimeout(nexusDraw, 500); return; }
    nexusSave(false); setTimeout(() => { $('.nxlives') && ($('.nxlives').textContent = `Mistakes left: ${'●'.repeat(4 - NX.mistakes)}${'○'.repeat(NX.mistakes)}`); }, 0);
  }
  // ---- Corona (letter ring crossword) ----
  const CR = { i: 0, p: null, found: new Set(), bonus: new Set(), cur: [], letters: [], drag: false, revealed: new Set() };
  function coronaStart(i) {
    const g = gstat().corona || { solved: {} };
    if (i == null) { i = 0; while (i < CORONA_ALL.length - 1 && g.solved[i]) i++; }
    CR.i = Math.max(0, Math.min(CORONA_ALL.length - 1, i)); CR.p = CORONA_ALL[CR.i]; CR.found = new Set(); CR.bonus = new Set(); CR.cur = []; CR.letters = CR.p.letters.split(''); CR.revealed = new Set();
    const prog = (g.progress || {})[CR.i]; if (prog) { CR.found = new Set(prog.f); CR.bonus = new Set(prog.b || []); CR.revealed = new Set(prog.r || []); }
    coronaDraw();
  }
  function coronaSave() { bump('corona', s => { s.solved = s.solved || {}; s.progress = s.progress || {}; s.progress[CR.i] = { f: [...CR.found], b: [...CR.bonus], r: [...CR.revealed] }; if (CR.p.grid.every(w => CR.found.has(w.w))) s.solved[CR.i] = true; }); }
  function coronaDraw() {
    const p = CR.p; const g = gstat().corona || { solved: {} }; const done = p.grid.every(w => CR.found.has(w.w));
    const cells = new Map(); for (const w of p.grid) for (let k = 0; k < w.w.length; k++) { const x = w.d ? w.x : w.x + k, y = w.d ? w.y + k : w.y; const key = x + ',' + y; const c = cells.get(key) || { ch: w.w[k], on: false }; if (CR.found.has(w.w) || CR.revealed.has(key)) c.on = true; cells.set(key, c); }
    let grid = `<div class="cwgrid" style="grid-template-columns:repeat(${p.w},1fr);--cols:${p.w}">`;
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = cells.get(x + ',' + y); grid += c ? `<div class="cwc ${c.on ? 'on' : ''}">${c.on ? c.ch : ''}</div>` : '<div class="cwe"></div>'; }
    grid += '</div>';
    const n = CR.letters.length; const R = 92;
    const ring = `<div class="ring" id="ring">${CR.letters.map((ch, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / n; return `<button class="rl ${CR.cur.includes(k) ? 'on' : ''}" data-k="${k}" style="left:${(50 + 50 * Math.cos(a) * R / 110).toFixed(1)}%;top:${(50 + 50 * Math.sin(a) * R / 110).toFixed(1)}%">${ch}</button>`; }).join('')}<div class="ringc">${done ? '✓' : ''}</div></div>`;
    const foundList = [...CR.found, ...CR.bonus].sort().map(w => `<span class="chip la" title="${esc((p.dict[w] || [])[1] || '')}"><b>${esc(w)}</b> ${esc((p.dict[w] || [])[1] || '')}</span>`).join('');
    view.innerHTML = `${crumb('Corōna')}<div class="game-top"><h1 style="margin:0">Corōna <span class="muted small">${CR.i + 1}/${CORONA_ALL.length} · ${p.grid.filter(w => CR.found.has(w.w)).length} of ${p.grid.length}${CR.bonus.size ? ` +${CR.bonus.size}` : ''}</span></h1><div class="seg"><button id="crprev" ${CR.i === 0 ? 'disabled' : ''}>‹</button><button id="crnext" ${CR.i >= CORONA_ALL.length - 1 ? 'disabled' : ''}>›</button></div></div><div class="grow">${grid}</div><div class="crword la" id="crword">${CR.cur.map(k => CR.letters[k]).join('') || '&nbsp;'}</div>${ring}<p class="crbtns"><button class="btn" id="crshuf">Shuffle</button><button class="btn" id="crdel">Delete</button><button class="btn" id="crhint">Hint</button><button class="btn primary" id="crenter">Enter</button></p><div class="crfound hscroll">${done ? `<span class="chip"><b>Corōna complēta!</b> <a href="#/play/corona/${CR.i + 2}">Next ring ›</a></span>` : ''}${foundList}</div>`;
    fitCells(view.querySelector('.cwgrid'), p.h, p.w, 3, 36, '--cwc');
    $('#crprev').onclick = () => coronaStart(CR.i - 1); $('#crnext').onclick = () => coronaStart(CR.i + 1);
    $('#crshuf').onclick = () => { CR.letters = shuffle(CR.letters.slice()); CR.cur = []; coronaDraw(); };
    $('#crdel').onclick = () => { CR.cur.pop(); coronaWord(); };
    $('#crenter').onclick = coronaSubmit;
    $('#crhint').onclick = () => { const hidden = [...cells.entries()].filter(([k, c]) => !c.on); if (!hidden.length) return; const [k] = hidden[Math.floor(Math.random() * hidden.length)]; CR.revealed.add(k); coronaSave(); coronaDraw(); };
    const ring_ = $('#ring');
    const pick = el => { const b = el && el.closest && el.closest('.rl'); if (!b) return; const k = +b.dataset.k; if (CR.cur.includes(k)) { if (CR.cur[CR.cur.length - 2] === k) { CR.cur.pop(); coronaWord(); } return; } CR.cur.push(k); b.classList.add('on'); coronaWord(); };
    ring_.addEventListener('pointerdown', ev => { const b = ev.target.closest('.rl'); if (!b) return; ev.preventDefault(); CR.drag = true; CR.tapped = +b.dataset.k; ring_.setPointerCapture(ev.pointerId); pick(b); });
    ring_.addEventListener('pointermove', ev => { if (!CR.drag) return; const el = document.elementFromPoint(ev.clientX, ev.clientY); if (el && el.closest('.rl') && +el.closest('.rl').dataset.k !== CR.tapped) { CR.moved = true; pick(el); } });
    const up = ev => { if (!CR.drag) return; CR.drag = false; if (CR.moved) coronaSubmit(); CR.moved = false; };
    ring_.addEventListener('pointerup', up); ring_.addEventListener('pointercancel', up);
  }
  function coronaWord() { const el = $('#crword'); if (el) el.innerHTML = CR.cur.map(k => CR.letters[k]).join('') || '&nbsp;'; view.querySelectorAll('.rl').forEach(b => b.classList.toggle('on', CR.cur.includes(+b.dataset.k))); }
  function coronaSubmit() {
    const w = CR.cur.map(k => CR.letters[k]).join(''); CR.cur = []; if (w.length < 3) { coronaWord(); return; }
    const p = CR.p; const inGrid = p.grid.some(x => x.w === w);
    if (CR.found.has(w) || CR.bonus.has(w)) { toast('Already found'); coronaWord(); return; }
    if (inGrid) { CR.found.add(w); if (navigator.vibrate) navigator.vibrate(10); coronaSave(); coronaDraw(); if (p.grid.every(x => CR.found.has(x.w))) { toast('Corōna complēta!'); } return; }
    if (p.bonus.includes(w)) { CR.bonus.add(w); toast(`Bonus: ${w} — ${(p.dict[w] || [])[1] || ''}`); coronaSave(); coronaDraw(); return; }
    const el = $('#crword'); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); setTimeout(coronaWord, 350);
  }
  // ---- Anagramma ----
  const AN = { list: [], i: 0, score: 0, cur: [], tiles: [] };
  async function anagramStart() {
    view.innerHTML = `${crumb('Anagramma')}<h1>Anagramma</h1><div class="skel"></div>`;
    await Data.ready; AN.list = []; AN.i = 0; AN.score = 0;
    for (const w of shuffle(WOTD.slice())) { const info = await wordInfo(norm(w)); if (!info || info.nk.length < 4 || info.nk.length > 9 || /[^a-z]/.test(info.nk)) continue; if (AN.list.some(x => x.nk === info.nk)) continue; AN.list.push(info); if (AN.list.length === 10) break; }
    anagramNext();
  }
  function anagramNext() {
    const w = AN.list[AN.i]; if (!w) { const best = bump('anagram', s => { s.played = (s.played || 0) + 1; s.best = Math.max(s.best || 0, AN.score); }).best; view.innerHTML = `${crumb('Anagramma')}<h1>Anagramma</h1><div class="card done gend"><div class="big">${AN.score} / 10</div><p class="small muted">best ${best} of 10</p><p><button class="btn primary" id="anagain">Another round</button></p><p class="similar">${AN.list.map(x => `<a href="#/w/${encodeURIComponent(x.nk)}"><span class="la">${esc(x.hw)}</span><span class="gl">${esc(x.gl)}</span></a>`).join('')}</p></div>`; $('#anagain').onclick = anagramStart; return; }
    AN.cur = []; let tiles = w.nk.split(''); let tries = 0; do { tiles = shuffle(tiles.slice()); } while (tiles.join('') === w.nk && tries++ < 10); AN.tiles = tiles;
    view.innerHTML = `${crumb('Anagramma')}<div class="game-top"><h1 style="margin:0">Anagramma</h1><span class="muted small">${AN.i + 1} / 10 · ${AN.score} right</span></div><p class="small muted">Tap the letters in order to spell the Latin word that means:</p><p class="anhint">${esc(w.gl)} <span class="muted small">(${esc(CORE.pos[w.pos] || w.pos.toLowerCase())})</span></p><div class="grow"><div class="anslots" id="anslots">${w.nk.split('').map(() => `<span></span>`).join('')}</div><div class="antiles" id="antiles">${tiles.map((ch, k) => `<button class="la" data-k="${k}">${ch}</button>`).join('')}</div></div><p class="crbtns"><button class="btn" id="anclear">Clear</button><button class="btn" id="anskip">Skip</button></p>`;
    const draw = () => { const slots = view.querySelectorAll('#anslots span'); slots.forEach((s, i) => { s.textContent = AN.cur[i] != null ? AN.tiles[AN.cur[i]] : ''; }); view.querySelectorAll('#antiles button').forEach(b => b.classList.toggle('used', AN.cur.includes(+b.dataset.k))); };
    $('#antiles').onclick = ev => { const b = ev.target.closest('button'); if (!b || AN.cur.includes(+b.dataset.k)) return; AN.cur.push(+b.dataset.k); draw(); if (AN.cur.length === w.nk.length) { const got = AN.cur.map(k => AN.tiles[k]).join(''); const sl = $('#anslots'); if (got === w.nk) { sl.classList.add('ok'); AN.score++; if (navigator.vibrate) navigator.vibrate(10); AN.i++; setTimeout(anagramNext, 600); } else { sl.classList.add('shake'); setTimeout(() => { sl.classList.remove('shake'); AN.cur = []; draw(); }, 400); } } };
    $('#anclear').onclick = () => { AN.cur = []; draw(); };
    $('#anskip').onclick = () => { const sl = $('#anslots'); sl.querySelectorAll('span').forEach((s, i) => s.textContent = w.nk[i]); sl.classList.add('bad'); AN.i++; setTimeout(anagramNext, 900); };
  }
  // ---- Pendulus (hangman) ----
  const HG = { w: null, guessed: new Set(), wrong: 0 };
  const HANG_PARTS = ['<line x1="10" y1="110" x2="90" y2="110"/>', '<line x1="30" y1="110" x2="30" y2="10"/>', '<line x1="30" y1="10" x2="75" y2="10"/>', '<line x1="75" y1="10" x2="75" y2="25"/>', '<circle cx="75" cy="35" r="10"/>', '<line x1="75" y1="45" x2="75" y2="75"/>', '<path d="M75 52l-14 14M75 52l14 14"/>', '<path d="M75 75l-12 20M75 75l12 20"/>'];
  async function hangStart() {
    view.innerHTML = `${crumb('Pendulus')}<h1>Pendulus</h1><div class="skel"></div>`; await Data.ready;
    let info = null; for (const w of shuffle(WOTD.slice())) { info = await wordInfo(norm(w)); if (info && info.nk.length >= 4 && !/[^a-z]/.test(info.nk)) break; info = null; }
    HG.w = info; HG.guessed = new Set(); HG.wrong = 0; hangDraw();
  }
  function hangDraw() {
    const w = HG.w; const letters = w.nk.split(''); const lost = HG.wrong >= 8; const won = letters.every(ch => HG.guessed.has(ch)); const over = lost || won;
    const states = {}; for (const k of HG.guessed) states[k] = letters.includes(k) ? 'g' : 'x';
    const g = gstat().hang || {};
    view.innerHTML = `${crumb('Pendulus')}<div class="game-top"><h1 style="margin:0">Pendulus</h1><span class="muted small">${8 - HG.wrong} left</span></div><div class="grow"><div class="hang"><svg viewBox="0 0 110 120" class="gallows">${HANG_PARTS.slice(0, HG.wrong).join('')}</svg><div><p class="small muted">A ${esc(CORE.pos[w.pos] || w.pos.toLowerCase())} meaning</p><p class="anhint">${esc(w.gl)}</p><div class="hword la">${letters.map(ch => `<span class="${HG.guessed.has(ch) ? 'on' : lost ? 'miss' : ''}">${HG.guessed.has(ch) || lost ? ch : ''}</span>`).join('')}</div></div></div></div>${over ? `<div class="card done gend"><div class="big la">${esc(w.hw)}</div><p class="small muted">${won ? `Saved, with ${HG.wrong} wrong letter${HG.wrong === 1 ? '' : 's'}.` : 'Too late.'}</p><p><a class="btn" href="#/w/${encodeURIComponent(w.nk)}">Open entry</a> <button class="btn primary" id="hgagain">Another word</button></p></div><div class="stat"><div><b>${g.played || 0}</b><span>played</span></div><div><b>${g.won || 0}</b><span>won</span></div><div><b>${g.streak || 0}</b><span>streak</span></div></div>` : keyboardHTML([['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'], ['t', 'u', 'x', 'y', 'z']], states)}`;
    const kb = view.querySelector('.kb'); if (kb) kb.onclick = ev => { const b = ev.target.closest('button'); if (!b || HG.guessed.has(b.dataset.k)) return; const k = b.dataset.k; HG.guessed.add(k); if (!letters.includes(k)) HG.wrong++; const nowWon = letters.every(ch => HG.guessed.has(ch)), nowLost = HG.wrong >= 8; if (nowWon || nowLost) bump('hang', s => { s.played = (s.played || 0) + 1; if (nowWon) { s.won = (s.won || 0) + 1; s.streak = (s.streak || 0) + 1; } else s.streak = 0; }); if (nowWon && navigator.vibrate) navigator.vibrate([10, 40, 10]); hangDraw(); };
    const ag = $('#hgagain'); if (ag) ag.onclick = hangStart;
  }
  let refit = null; window.addEventListener('resize', () => { if (refit) refit(); });
  function fitCells(el, rows, cols, gap, max, name) {
    if (!el) return;
    const run = () => { if (!el.isConnected) return; const box = el.closest('.grow') || el.parentElement; const h = box.clientHeight, w = box.clientWidth; const size = Math.max(14, Math.min(max, Math.floor((h - gap * (rows - 1)) / rows), Math.floor((w - gap * (cols - 1)) / cols))); document.documentElement.style.setProperty(name, size + 'px'); };
    run(); refit = run; requestAnimationFrame(run); setTimeout(run, 120); if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  }
  function renderPlay(arg) {
    const [game, sub] = (arg || '').split('/');
    if (game === 'cloze') return renderCloze(sub);
    if (game) view.classList.add('fit');
    if (game === 'match' || game === 'forms' || game === 'saved') return renderMatch(game);
    if (game === 'verbum') return verbumStart(sub !== 'r');
    if (game === 'nexus') return nexusStart(sub !== 'r');
    if (game === 'corona') return coronaStart(sub ? +sub - 1 : null);
    if (game === 'anagram') return anagramStart();
    if (game === 'hang') return hangStart();
    renderGamesHub();
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
    view.innerHTML = html; view.scrollTo(0, 0);
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
    view.innerHTML = html; view.scrollTo(0, 0);
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
  // ---- tab bar: hidden on content pages and when scrolling down; swipe up from the bottom or tap the handle to bring it back ----
  const tabsEl = $('#tabs'); let tabsOn = true, lastY = 0;
  function setTabs(on) { tabsOn = on; tabsEl.classList.toggle('off', !on); document.body.classList.toggle('tabs-off', !on); document.documentElement.style.setProperty('--barspace', on ? '96px' : '22px'); }
  view.addEventListener('scroll', () => { const y = view.scrollTop; const dy = y - lastY; if (view.classList.contains('fit')) return; if (dy > 8 && tabsOn && y > 24) setTabs(false); else if (dy < -10 && !tabsOn) setTabs(true); lastY = y; }, { passive: true });
  $('#tabhandle').addEventListener('click', () => setTabs(true));
  let swipeY = null; document.addEventListener('touchstart', ev => { const t = ev.touches[0]; swipeY = t.clientY > window.innerHeight - 70 ? t.clientY : null; }, { passive: true });
  document.addEventListener('touchmove', ev => { if (swipeY === null) return; if (swipeY - ev.touches[0].clientY > 24) { setTabs(true); swipeY = null; } }, { passive: true });
  const BAR_SHOW = h => h === '#/' || h === '' || h === '#/g' || h === '#/r' || h === '#/play' || h === '#/settings' || h === '#/saved' || /^#\/(gg|s)\//.test(h);
  async function route() {
    const h = location.hash || '#/';
    view.classList.remove('fit'); lastY = 0; setTabs(BAR_SHOW(h));
    const m = h.match(/^#\/(play|gg|w|g|p|s|r)?\/?([^?]*)(\?(.*))?$/);
    if (m && m[1] === 'play' && /^cloze/.test(m[2] || '')) { /* keep cloze/<id> in arg */ }
    const kind = m && m[1], arg = m ? decodeURIComponent(m[2] || '') : '', qs = m && m[4] ? new URLSearchParams(m[4]) : null;
    closeSheet();
    view.style.animation = 'none'; void view.offsetWidth; view.style.animation = '';
    try {
      if (h === '#/' || h === '') { setTab('home'); $('#q').value = ''; $('#clearq').hidden = true; renderHome(); }
      else if (h === '#/saved') { setTab(''); renderSaved(); }
      else if (h === '#/settings') { setTab(''); renderSettings(); }
      else if (h === '#/play' || kind === 'play') { setTab('play'); renderPlay(arg); }
      else if (h === '#/r' || kind === 'r') { setTab('read'); arg ? renderPassage(arg) : renderReader(); }
      else if (h === '#/g') { setTab('grammar'); renderGrammarIndex(); view.scrollTo(0, 0); }
      else if (kind === 'w') { setTab('home'); await renderWord(norm(arg), qs && qs.get('f') ? norm(qs.get('f')) : null); }
      else if (kind === 's') { setTab('home'); $('#q').value = arg; $('#clearq').hidden = !arg; await doSearch(arg); }
      else if (h === '#/g') { setTab('grammar'); renderGrammarIndex(); view.scrollTo(0, 0); }
      else if (kind === 'gg') { setTab('grammar'); renderGrammarIndex(arg); view.scrollTo(0, 0); }
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
    const ext = ev.target.closest('a[href^="http"]'); if (ext && IS_NATIVE) { ev.preventDefault(); if (window.LXNative) window.LXNative.open(ext.href); return; }
    const ib = ev.target.closest('.ibtn'); if (ib && ib.dataset.info) { ev.preventDefault(); showInfo(JSON.parse(ib.dataset.info)); return; }
    const tb = ev.target.closest('.subtabs button'); if (tb) { const grp = tb.parentElement; grp.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === tb)); grp.querySelectorAll('button').forEach(b => { const pane = document.getElementById(b.dataset.show); if (pane) pane.hidden = b !== tb; }); return; }
    const tc = ev.target.closest('.togglecit'); if (tc) { const ls = tc.closest('details').querySelector('.ls'); ls.classList.toggle('nocit'); tc.textContent = ls.classList.contains('nocit') ? 'Show citations' : 'Hide citations'; applyClamps(); return; }
    const ta = ev.target.closest('.toggleabr'); if (ta) { const ls = ta.closest('details').querySelector('.ls'); ls.classList.toggle('abridged'); ta.textContent = ls.classList.contains('abridged') ? 'Show full entry' : 'Abridge'; applyClamps(); return; }
    const jp = ev.target.closest('[data-jump]'); if (jp) { ev.preventDefault(); const id = jp.dataset.jump; const el = id === 'forms' ? view.querySelector('.entry table.para, .entry .subtabs') : id === 'lsd' ? view.querySelector('.lsd') : document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const sh = ev.target.closest('.sharebtn'); if (sh) { navigator.share({ title: sh.dataset.hw + ' — Lexicon Latinum', text: sh.dataset.hw, url: location.href }).catch(() => { }); return; }
    const fv = ev.target.closest('.fav'); if (fv) { const nk = fv.dataset.nk, hw = fv.dataset.hw; if (S.favs.some(f => f.nk === nk)) { S.favs = S.favs.filter(f => f.nk !== nk); fv.textContent = '☆'; toast('Removed from my lexicon'); } else { const hh = S.history.find(h => h.nk === nk); S.favs.unshift({ nk, hw, gl: hh ? hh.gl : '' }); fv.textContent = '★'; toast('Added to my lexicon'); } save('favs', S.favs); return; }
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
  if (!window.LX_EMBEDDED && !IS_NATIVE && 'serviceWorker' in navigator) {
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
