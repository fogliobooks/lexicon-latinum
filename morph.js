/* Latin morphology engine: generates paradigms from Whitaker's Words stems + inflection table,
   and analyses inflected forms. Works in browser (window.Morph) and Node (module.exports). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Morph = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let INFL = [];               // all inflection records
  let BY_POS = {};             // eff pos -> records
  let BY_END = {};             // pos -> ending(normalized) -> records
  const CASES = ['NOM', 'GEN', 'DAT', 'ACC', 'ABL', 'VOC', 'LOC'];
  const TENSES = ['PRES', 'IMPF', 'FUT', 'PERF', 'PLUP', 'FUTP'];
  const PERSONS = [[1, 'S'], [2, 'S'], [3, 'S'], [1, 'P'], [2, 'P'], [3, 'P']];
  const SUM = {
    PRES: ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'],
    IMPF: ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'],
    FUT: ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erunt'],
    SUBPRES: ['sim', 'sīs', 'sit', 'sīmus', 'sītis', 'sint'],
    SUBIMPF: ['essem', 'essēs', 'esset', 'essēmus', 'essētis', 'essent'],
  };

  function norm(s) { return (s || '').toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u'); }

  function load(inflects) {
    INFL = inflects; BY_POS = {}; BY_END = {};
    for (const r of INFL) {
      const ep = effPos(r.p);
      (BY_POS[ep] = BY_POS[ep] || []).push(r);
      const e = norm(r.e);
      ((BY_END[ep] = BY_END[ep] || {})[e] = BY_END[ep][e] || []).push(r);
    }
  }
  function effPos(p) { return (p === 'VPAR' || p === 'SUPINE') ? 'V' : (p === 'PACK' ? 'PRON' : p); }

  // ---- matching rules (ported from Whitaker's Words) ----
  function declMatch(code, r) {
    if (!code) return r.d === 0 && r.v === 0;
    return (r.d === 0 && r.v === 0) || (r.d === code[0] && (r.v === 0 || r.v === code[1]));
  }
  function genderMatch(eg, rg) { return rg === eg || rg === 'X' || (rg === 'C' && eg !== 'N'); }

  // stems as positioned by Whitaker (comparative-only adjectives live at key 3, superlative at 4)
  function stems(entry) {
    const s = entry.s.slice();
    if (entry.p === 'ADJ' && entry.k === 'COMP' && s[2] == null) return [null, null, s[0], null];
    if (entry.p === 'ADJ' && entry.k === 'SUPER' && s[3] == null) return [null, null, null, s[0]];
    return s;
  }
  function comparisonOf(entry, r) {
    if (entry.p === 'ADJ') {
      if (entry.k === 'POS' || entry.k === 'COMP' || entry.k === 'SUPER') return entry.k;
      return r.k <= 2 ? 'POS' : r.k === 3 ? 'COMP' : 'SUPER';
    }
    if (entry.p === 'ADV') {
      if (entry.k === 'POS' || entry.k === 'COMP' || entry.k === 'SUPER') return entry.k;
      return r.k === 1 ? 'POS' : r.k === 2 ? 'COMP' : 'SUPER';
    }
    return null;
  }

  function numSortFromKey(k) { return k === 1 ? 'CARD' : k === 2 ? 'ORD' : k === 3 ? 'DIST' : 'ADVERB'; }
  function verbAllowed(entry, r) {
    const kind = entry.k || 'X';
    if (r.p === 'V') {
      // imperative persons
      if (r.md === 'IMP') {
        if (r.t === 'PRES' && r.pe !== 2) return false;
        if (r.t === 'FUT' && !(r.pe === 2 || r.pe === 3)) return false;
      }
      // shortened imperative dic/duc/fac/fer
      if (r.d === 3 && r.v === 1 && r.t === 'PRES' && r.vo === 'ACTIVE' && r.md === 'IMP' && r.pe === 2 && r.nm === 'S' && r.e === '') {
        const st = entry.s[1] || '';
        if (!/(dic|duc|fac|fer)$/.test(st)) return false;
      }
      if (kind === 'IMPERS' && r.pe !== 3 && r.md !== 'INF') return false;
      if ((kind === 'TO_BE' || kind === 'TO_BEING') && r.vo === 'PASSIVE') return false;
      if (kind === 'DEP') {
        if (r.vo === 'ACTIVE' && r.md === 'INF' && r.t === 'FUT') { /* allowed: future active infinitive */ }
        else if (r.vo === 'ACTIVE' && ['IND', 'SUB', 'IMP', 'INF'].includes(r.md)) return false;
      }
      if (kind === 'SEMIDEP' && ['IND', 'SUB', 'IMP'].includes(r.md)) {
        if ((r.vo === 'PASSIVE' && ['PRES', 'IMPF', 'FUT'].includes(r.t)) ||
            (r.vo === 'ACTIVE' && ['PERF', 'PLUP', 'FUTP'].includes(r.t))) return false;
      }
    }
    if ((entry.k === 'TO_BE' || entry.k === 'TO_BEING') && (r.p === 'SUPINE' || (r.p === 'VPAR' && !(r.t === 'FUT' && r.vo === 'ACTIVE')))) return false;
    return true;
  }

  function matches(entry, r) {
    const ep = effPos(r.p);
    if (ep !== effPos(entry.p)) return false;
    if (entry.p === 'N') return declMatch(entry.c, r) && genderMatch(entry.g, r.g);
    if (entry.p === 'ADJ') {
      if (!declMatch(entry.c, r)) return false;
      if (entry.k === 'POS' || entry.k === 'COMP' || entry.k === 'SUPER') return r.co === entry.k;
      return comparisonOf(entry, r) === r.co;    // X: degree from stem key
    }
    if (entry.p === 'ADV') {
      if (entry.k === 'POS' || entry.k === 'COMP' || entry.k === 'SUPER') return r.co === entry.k || (r.co === 'X' && r.k === 1);
      return r.co === 'X';
    }
    if (entry.p === 'V') return declMatch(entry.c, r) && verbAllowed(entry, r);
    if (entry.p === 'PRON' || entry.p === 'PACK') return declMatch(entry.c, r);
    if (entry.p === 'NUM') {
      if (!declMatch(entry.c, r)) return false;
      if (entry.k === 'X') return r.so === numSortFromKey(r.k) || r.so === 'X';
      return r.so === entry.k || r.so === 'X';
    }
    if (entry.p === 'PREP') return r.cs === entry.k;
    return true;
  }

  function isCommon(r) { return r.a === 'X' && 'XAB'.includes(r.fr); }

  /** Generate every form of an entry. Returns [{f: form, r: inflection, k: stemkey, common}] */
  function generate(entry) {
    const st = stems(entry);
    const out = [];
    const recs = BY_POS[effPos(entry.p)] || [];
    for (const r of recs) {
      if (!matches(entry, r)) continue;
      const s = st[r.k - 1];
      if (s == null) continue;
      out.push({ f: s + r.e, r, k: r.k, common: isCommon(r) });
    }
    return out;
  }

  // ---- analysis (parse an inflected form) ----
  /** index: Map normStem -> [{e: entry, k: stemKey}] */
  function buildIndex(entries) {
    const idx = new Map();
    for (const e of entries) {
      const st = stems(e);
      st.forEach((s, i) => {
        if (s == null) return;
        const n = norm(s);
        if (!idx.has(n)) idx.set(n, []);
        idx.get(n).push({ e, k: i + 1 });
      });
    }
    return idx;
  }
  const ENCLITICS = ['que', 'ne', 've'];
  function analyze(word, idx, opts) {
    opts = opts || {};
    const w = norm(word.trim());
    let res = analyzeOne(w, idx);
    if (!opts.noEnclitic) {
      for (const enc of ENCLITICS) {
        if (w.length > enc.length + 1 && w.endsWith(enc)) {
          const r2 = analyzeOne(w.slice(0, -enc.length), idx);
          for (const a of r2) a.enclitic = '-' + enc;
          res = res.concat(r2);
        }
      }
    }
    return res;
  }
  function analyzeOne(w, idx) {
    const results = [];
    const seen = new Set();
    for (let cut = w.length; cut >= Math.max(0, w.length - 8); cut--) {
      const stemN = w.slice(0, cut), end = w.slice(cut);
      const cands = idx.get(stemN);
      if (!cands) continue;
      for (const { e, k } of cands) {
        const ep = effPos(e.p);
        const recs = (BY_END[ep] || {})[end];
        if (!recs) continue;
        for (const r of recs) {
          if (r.k !== k) continue;
          if (!matches(e, r)) continue;
          const key = e.i + '|' + e.p + '|' + JSON.stringify(r);
          if (seen.has(key)) continue; seen.add(key);
          results.push({ entry: e, r, form: stems(e)[k - 1] + r.e, common: isCommon(r) });
        }
      }
    }
    return results;
  }

  // ---- table builders ----
  function cellPush(cell, item) {
    if (!cell.some(x => x.f === item.f)) cell.push(item);
  }
  function nounTable(forms) {
    const t = { cases: {}, hasLoc: false };
    for (const c of CASES) t.cases[c] = { S: [], P: [] };
    for (const x of forms) {
      if (x.r.p !== 'N') continue;
      const c = x.r.cs, n = x.r.nm;
      if (c === 'X') { // indeclinable
        for (const cc of CASES.slice(0, 6)) for (const nn of ['S', 'P']) cellPush(t.cases[cc][nn], x);
        t.indeclinable = true; continue;
      }
      if (!t.cases[c]) continue;
      if (c === 'LOC') t.hasLoc = true;
      if (n === 'X') { cellPush(t.cases[c].S, x); cellPush(t.cases[c].P, x); }
      else cellPush(t.cases[c][n], x);
    }
    return t;
  }
  /** adjective-like forms (ADJ, VPAR, PRON, NUM) -> {degrees:{POS:{cases:{NOM:{S:{M:[],F:[],N:[]},P:{...}}}}}} */
  function adjTable(forms, posFilter) {
    const degrees = {};
    for (const x of forms) {
      if (posFilter && x.r.p !== posFilter) continue;
      if (!['ADJ', 'VPAR', 'PRON', 'NUM', 'PACK'].includes(x.r.p)) continue;
      const deg = x.r.co || (x.r.so && x.r.so !== 'X' ? x.r.so : null) || 'POS';
      const d = degrees[deg] = degrees[deg] || { cases: {} };
      for (const c of CASES) d.cases[c] = d.cases[c] || { S: { M: [], F: [], N: [] }, P: { M: [], F: [], N: [] } };
      const cs = x.r.cs === 'X' ? CASES.slice(0, 6) : [x.r.cs];
      const nums = x.r.nm === 'X' ? ['S', 'P'] : [x.r.nm];
      const gens = x.r.g === 'X' ? ['M', 'F', 'N'] : x.r.g === 'C' ? ['M', 'F'] : [x.r.g];
      for (const c of cs) { if (!d.cases[c]) continue; for (const n of nums) for (const g of gens) cellPush(d.cases[c][n][g], x); }
    }
    return degrees;
  }
  function verbTable(forms, entry, fmt) {
    fmt = fmt || (x => x.f);
    const kind = entry.k || 'X';
    const t = { finite: {}, imperative: {}, infinitives: {}, participles: {}, supine: {}, periphrastic: [] , kind };
    const key = (vo, md, tn) => vo + ' ' + md + ' ' + tn;
    for (const x of forms) {
      const r = x.r;
      if (r.p === 'V') {
        if (r.md === 'IND' || r.md === 'SUB') {
          const k = key(r.vo, r.md, r.t);
          const b = t.finite[k] = t.finite[k] || { vo: r.vo, md: r.md, t: r.t, cells: [[], [], [], [], [], []] };
          const pi = PERSONS.findIndex(p => p[0] === r.pe && p[1] === r.nm);
          if (pi >= 0) cellPush(b.cells[pi], x);
        } else if (r.md === 'IMP') {
          const k = r.vo + ' ' + r.t;
          const b = t.imperative[k] = t.imperative[k] || { vo: r.vo, t: r.t, cells: { '2S': [], '3S': [], '2P': [], '3P': [] } };
          const pk = r.pe + r.nm; if (b.cells[pk]) cellPush(b.cells[pk], x);
        } else if (r.md === 'INF') {
          const k = r.vo + ' ' + r.t;
          const b = t.infinitives[k] = t.infinitives[k] || { vo: r.vo, t: r.t, cells: [] };
          cellPush(b.cells, x);
        }
      } else if (r.p === 'VPAR') {
        const k = r.vo + ' ' + r.t;
        const b = t.participles[k] = t.participles[k] || { vo: r.vo, t: r.t, forms: [] };
        b.forms.push(x);
      } else if (r.p === 'SUPINE') {
        (t.supine[r.cs] = t.supine[r.cs] || []).push(x);
      }
    }
    // participle summaries (nom sg M/F/N) and declension tables
    for (const k in t.participles) {
      const p = t.participles[k];
      p.table = adjTable(p.forms, 'VPAR');
      const nom = p.table.POS && p.table.POS.cases.NOM.S;
      p.nom = nom ? { M: nom.M.map(f => f.f), F: nom.F.map(f => f.f), N: nom.N.map(f => f.f) } : null;
    }
    // periphrastic perfect passive system (ppp + sum) — also the perfect system of deponents
    const ppp = t.participles['PASSIVE PERF'];
    const pppObj = ppp && ppp.forms.find(x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.g === 'M' && x.common) || (ppp && ppp.forms.find(x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.g === 'M'));
    const pppNomM = pppObj && fmt(pppObj);
    if (pppNomM) {
      const base = pppNomM.replace(/us$/, '');
      const mk = (sumForms, tense, mood) => ({
        vo: 'PASSIVE', md: mood, t: tense, peri: true,
        cells: sumForms.map((s, i) => [{ f: base + (i < 3 ? 'us' : 'ī') + ' ' + s, peri: true, common: true, r: { p: 'V', vo: 'PASSIVE', md: mood, t: tense, pe: PERSONS[i][0], nm: PERSONS[i][1], a: 'X', fr: 'A' } }])
      });
      const skipPassive = (kind === 'INTRANS' && false);
      if (!skipPassive) {
        t.finite['PASSIVE IND PERF'] = t.finite['PASSIVE IND PERF'] || mk(SUM.PRES, 'PERF', 'IND');
        t.finite['PASSIVE IND PLUP'] = t.finite['PASSIVE IND PLUP'] || mk(SUM.IMPF, 'PLUP', 'IND');
        t.finite['PASSIVE IND FUTP'] = t.finite['PASSIVE IND FUTP'] || mk(SUM.FUT, 'FUTP', 'IND');
        t.finite['PASSIVE SUB PERF'] = t.finite['PASSIVE SUB PERF'] || mk(SUM.SUBPRES, 'PERF', 'SUB');
        t.finite['PASSIVE SUB PLUP'] = t.finite['PASSIVE SUB PLUP'] || mk(SUM.SUBIMPF, 'PLUP', 'SUB');
        t.infinitives['PASSIVE PERF'] = t.infinitives['PASSIVE PERF'] || { vo: 'PASSIVE', t: 'PERF', peri: true, cells: [{ f: base + 'us esse', peri: true, common: true, r: { p: 'V', vo: 'PASSIVE', md: 'INF', t: 'PERF', a: 'X', fr: 'A' } }] };
      }
      const sup = t.supine.ACC && t.supine.ACC[0];
      if (sup && kind !== 'DEP' && kind !== 'SEMIDEP') {
        t.infinitives['PASSIVE FUT'] = t.infinitives['PASSIVE FUT'] || { vo: 'PASSIVE', t: 'FUT', peri: true, cells: [{ f: fmt(sup) + ' īrī', peri: true, common: true, r: { p: 'V', vo: 'PASSIVE', md: 'INF', t: 'FUT', a: 'X', fr: 'A' } }] };
      }
    }
    // future active infinitive periphrastic (-urus esse) if missing
    const fap = t.participles['ACTIVE FUT'];
    const fapObj = fap && (fap.forms.find(x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.g === 'M' && x.common) || fap.forms.find(x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.g === 'M'));
    if (fapObj && !t.infinitives['ACTIVE FUT']) {
      t.infinitives['ACTIVE FUT'] = { vo: 'ACTIVE', t: 'FUT', peri: true, cells: [{ f: fmt(fapObj) + ' esse', peri: true, common: true, r: { p: 'V', vo: 'ACTIVE', md: 'INF', t: 'FUT', a: 'X', fr: 'A' } }] };
    }
    return t;
  }

  // ---- principal parts / headword ----
  function pick(forms, pred) {
    const m = forms.filter(pred);
    if (!m.length) return null;
    const c = m.filter(x => x.common);
    return (c.length ? c : m)[0].f;
  }
  function headwordAndParts(entry, forms) {
    forms = forms || generate(entry);
    const p = entry.p;
    let hw = null, parts = [];
    if (p === 'N') {
      const nomS = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S');
      const genS = pick(forms, x => x.r.cs === 'GEN' && x.r.nm === 'S');
      const nomP = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'P');
      const genP = pick(forms, x => x.r.cs === 'GEN' && x.r.nm === 'P');
      if (nomS) { hw = nomS; parts = [nomS, genS].filter(Boolean); }
      else if (nomP) { hw = nomP; parts = [nomP, genP].filter(Boolean); entry.plOnly = true; }
      else if (entry.s[0]) { hw = entry.s[0]; parts = [hw]; }
    } else if (p === 'ADJ') {
      const deg = entry.k === 'COMP' ? 'COMP' : entry.k === 'SUPER' ? 'SUPER' : 'POS';
      const nm = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.co === deg && (x.r.g === 'M' || x.r.g === 'X' || x.r.g === 'C'));
      const nf = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.co === deg && x.r.g === 'F');
      const nn = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.co === deg && (x.r.g === 'N' || x.r.g === 'X'));
      const gen = pick(forms, x => x.r.cs === 'GEN' && x.r.nm === 'S' && x.r.co === deg);
      hw = nm || nn || entry.s[0];
      if (nf && nf !== nm) parts = [nm, nf, nn];
      else if (nn && nn !== nm) parts = [nm, nn];
      else parts = [nm, gen].filter(Boolean);
      parts = parts.filter(Boolean);
      if (deg === 'POS' && entry.k === 'X') {
        const comp = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.co === 'COMP' && (x.r.g === 'M' || x.r.g === 'C' || x.r.g === 'X'));
        const sup = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.co === 'SUPER' && (x.r.g === 'M' || x.r.g === 'X'));
        entry.degrees = [comp, sup].filter(Boolean);
      }
    } else if (p === 'V') {
      const kind = entry.k || 'X';
      const dep = kind === 'DEP';
      const pres1 = pick(forms, x => x.r.p === 'V' && x.r.t === 'PRES' && x.r.md === 'IND' && x.r.vo === (dep ? 'PASSIVE' : 'ACTIVE') && x.r.pe === (kind === 'IMPERS' ? 3 : 1) && x.r.nm === 'S');
      const inf = pick(forms, x => x.r.p === 'V' && x.r.t === 'PRES' && x.r.md === 'INF' && x.r.vo === (dep ? 'PASSIVE' : 'ACTIVE'));
      const perf1 = pick(forms, x => x.r.p === 'V' && x.r.t === 'PERF' && x.r.md === 'IND' && x.r.vo === 'ACTIVE' && x.r.pe === (kind === 'IMPERS' ? 3 : 1) && x.r.nm === 'S');
      const ppp = pick(forms, x => x.r.p === 'VPAR' && x.r.t === 'PERF' && x.r.vo === 'PASSIVE' && x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.g === 'M');
      const sup = pick(forms, x => x.r.p === 'SUPINE' && x.r.cs === 'ACC');
      hw = pres1 || inf || (kind === 'PERFDEF' ? perf1 : null) || entry.s[0];
      parts = [pres1, inf];
      if (dep || kind === 'SEMIDEP') parts.push(ppp ? ppp + ' sum' : null);
      else { parts.push(perf1); parts.push(sup || ppp); }
      parts = parts.filter(Boolean);
    } else if (p === 'PRON' || p === 'PACK' || p === 'NUM') {
      if (p === 'NUM') forms = forms.filter(x => !x.r.so || x.r.so === 'CARD' || x.r.so === 'X' || (entry.k !== 'X' && x.r.so === entry.k));
      const nm = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && (x.r.g === 'M' || x.r.g === 'X' || x.r.g === 'C'));
      const nf = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && x.r.g === 'F');
      const nn = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'S' && (x.r.g === 'N'));
      const np = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'P');
      if (p === 'NUM' && !nm && np) { const nfp = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'P' && x.r.g === 'F'); const nnp = pick(forms, x => x.r.cs === 'NOM' && x.r.nm === 'P' && x.r.g === 'N'); return { hw: np, parts: [np, nfp, nnp].filter(Boolean) }; }
      hw = nm || nn || np || entry.s[0];
      parts = [nm, nf, nn].filter(Boolean);
      if (!parts.length && np) parts = [np];
    } else if (p === 'ADV') {
      hw = entry.s[0];
      parts = entry.k === 'X' ? entry.s.filter(Boolean) : [entry.s[0]];
    } else {
      hw = entry.s[0]; parts = [hw];
    }
    return { hw, parts };
  }

  // Human labels
  const LABEL = {
    NOM: 'Nominative', GEN: 'Genitive', DAT: 'Dative', ACC: 'Accusative', ABL: 'Ablative', VOC: 'Vocative', LOC: 'Locative',
    S: 'singular', P: 'plural', M: 'masculine', F: 'feminine', N: 'neuter', C: 'common', X: '—',
    PRES: 'Present', IMPF: 'Imperfect', FUT: 'Future', PERF: 'Perfect', PLUP: 'Pluperfect', FUTP: 'Future perfect',
    IND: 'Indicative', SUB: 'Subjunctive', IMP: 'Imperative', INF: 'Infinitive', PPL: 'Participle',
    ACTIVE: 'Active', PASSIVE: 'Passive', POS: 'Positive', COMP: 'Comparative', SUPER: 'Superlative',
    CARD: 'Cardinal', ORD: 'Ordinal', DIST: 'Distributive', ADVERB: 'Numeral adverb',
  };
  function describe(r) {
    const parts = [];
    if (r.p === 'N' || r.p === 'PRON' || r.p === 'PACK' || r.p === 'ADJ' || r.p === 'NUM' || r.p === 'VPAR' || r.p === 'SUPINE') {
      if (r.cs && r.cs !== 'X') parts.push(LABEL[r.cs].toLowerCase());
      if (r.nm && r.nm !== 'X') parts.push(LABEL[r.nm]);
      if (r.g && r.g !== 'X' && r.p !== 'N') parts.push(r.g === 'C' ? 'masc./fem.' : LABEL[r.g]);
      if (r.co && r.co !== 'POS' && r.co !== 'X') parts.push(LABEL[r.co].toLowerCase());
      if (r.p === 'VPAR') parts.push(LABEL[r.t].toLowerCase() + ' ' + LABEL[r.vo].toLowerCase() + ' participle');
      if (r.p === 'SUPINE') parts.push('supine');
    } else if (r.p === 'V') {
      if (r.md === 'INF') parts.push(LABEL[r.t].toLowerCase(), LABEL[r.vo].toLowerCase(), 'infinitive');
      else {
        parts.push(r.pe + (r.pe === 1 ? 'st' : r.pe === 2 ? 'nd' : 'rd') + ' person', LABEL[r.nm]);
        parts.push(LABEL[r.t].toLowerCase(), LABEL[r.vo].toLowerCase(), LABEL[r.md].toLowerCase());
      }
    } else if (r.p === 'ADV') {
      if (r.co && r.co !== 'X') parts.push(LABEL[r.co].toLowerCase());
      parts.push('adverb');
    } else if (r.p === 'PREP') parts.push('preposition + ' + LABEL[r.cs].toLowerCase());
    else if (r.p === 'CONJ') parts.push('conjunction');
    else if (r.p === 'INTERJ') parts.push('interjection');
    return parts.join(' ');
  }

  const POSNAME = { N: 'noun', ADJ: 'adjective', V: 'verb', ADV: 'adverb', PREP: 'preposition', CONJ: 'conjunction', INTERJ: 'interjection', PRON: 'pronoun', PACK: 'pronoun', NUM: 'numeral' };

  return { load, norm, generate, matches, stems, buildIndex, analyze, nounTable, adjTable, verbTable, headwordAndParts, describe, LABEL, POSNAME, CASES, TENSES, PERSONS, isCommon, effPos };
}));
