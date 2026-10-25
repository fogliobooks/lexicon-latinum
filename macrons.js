/* Macron overlay: marks long vowels on forms generated from Whitaker's stems + endings.
   Stems: entry.ms (from Lewis & Short headword/principal parts) when available. Endings: explicit tables per class.
   Works in browser (window.Macrons) and Node. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Macrons = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const LONG = { a: 'ā', e: 'ē', i: 'ī', o: 'ō', u: 'ū', y: 'ȳ' };
  // Build {plainEnding: macronEnding} from a space-separated list of macronized endings ("" allowed as "-")
  const T = (s) => { const m = {}; for (const w of s.split(/\s+/)) { if (!w) continue; const k = w === '-' ? '' : strip(w); m[k] = w === '-' ? '' : w; } return m; };

  // ---------- nouns ----------
  function nounEnding(d, cs, nm, g, e, stem) {
    if (!e) return e;
    if (d === 1) {
      if (e === 'a') return cs === 'ABL' && nm === 'S' ? 'ā' : 'a';
      return T('ae am ās ārum īs āī ābus ēs ēn ān ē um ās')[e] || e;
    }
    if (d === 2) return T('us ī ō um e ōrum ōs īs a er ir iī ius ium on eī ēa eōs ēum om')[e] || e;
    if (d === 3) {
      if (e === 'i') return 'ī';
      if (e === 'is') return cs === 'ACC' && nm === 'P' ? 'īs' : 'is';
      return T('ēs e em um ium ibus ia a im us eī eīs in on os ȳs yn ȳ')[e] || e;
    }
    if (d === 4) {
      if (e === 'us') return (cs === 'NOM' || cs === 'VOC') && nm === 'S' ? 'us' : 'ūs';
      return T('uī ū um uum ibus ubus ua')[e] || e;
    }
    if (d === 5) {
      if (e === 'ei') return /[aeiou]$/.test(stem || '') ? 'ēī' : 'eī';
      return T('ēs em ē ērum ēbus iēs iēī iem iē iērum iēbus')[e] || e;
    }
    return e;
  }
  const FIRST = new Set(['a', 'ae', 'am', 'as', 'arum', 'abus']);
  function adj12(e, cs, nm, g) { return nounEnding((g === 'F' && e !== 'is') || FIRST.has(e) && g !== 'N' ? 1 : 2, cs, nm, g, e); }
  const COMP = T('ior ius iōris iōrī iōrem iōre iōrēs iōra iōrum iōribus iōrīs');
  const PRON = T('īus ī ō ōrum ārum īs ōs ās ae am um e ud ic aec oc unc anc uius uic ujus jus uī ibus em');

  // ---------- verbs: explicit tables keyed "MOOD TENSE VOICE" -> {plain: macron} ----------
  const PERF = {
    'IND PERF ACTIVE': T('ī istī it imus istis ērunt ēre'),
    'IND PLUP ACTIVE': T('eram erās erat erāmus erātis erant'),
    'IND FUTP ACTIVE': T('erō eris erit erimus eritis erint'),
    'SUB PERF ACTIVE': T('erim erīs erit erīmus erītis erint'),
    'SUB PLUP ACTIVE': T('issem issēs isset issēmus issētis issent'),
    'INF PERF ACTIVE': T('isse'),
  };
  const G1 = {
    'IND PRES ACTIVE': T('ō ās at āmus ātis ant'), 'IND IMPF ACTIVE': T('ābam ābās ābat ābāmus ābātis ābant'), 'IND FUT ACTIVE': T('ābō ābis ābit ābimus ābitis ābunt'),
    'SUB PRES ACTIVE': T('em ēs et ēmus ētis ent'), 'SUB IMPF ACTIVE': T('ārem ārēs āret ārēmus ārētis ārent'),
    'IND PRES PASSIVE': T('or āris āre ātur āmur āminī antur'), 'IND IMPF PASSIVE': T('ābar ābāris ābāre ābātur ābāmur ābāminī ābantur'), 'IND FUT PASSIVE': T('ābor āberis ābere ābitur ābimur ābiminī ābuntur'),
    'SUB PRES PASSIVE': T('er ēris ēre ētur ēmur ēminī entur'), 'SUB IMPF PASSIVE': T('ārer ārēris ārēre ārētur ārēmur ārēminī ārentur'),
    'IMP PRES ACTIVE': T('ā āte'), 'IMP FUT ACTIVE': T('ātō ātōte antō'), 'IMP PRES PASSIVE': T('āre āminī'), 'IMP FUT PASSIVE': T('ātor antor'),
    'INF PRES ACTIVE': T('āre'), 'INF PRES PASSIVE': T('ārī ārier'),
  };
  const G2 = {
    'IND PRES ACTIVE': T('eō ēs et ēmus ētis ent'), 'IND IMPF ACTIVE': T('ēbam ēbās ēbat ēbāmus ēbātis ēbant'), 'IND FUT ACTIVE': T('ēbō ēbis ēbit ēbimus ēbitis ēbunt'),
    'SUB PRES ACTIVE': T('eam eās eat eāmus eātis eant'), 'SUB IMPF ACTIVE': T('ērem ērēs ēret ērēmus ērētis ērent'),
    'IND PRES PASSIVE': T('eor ēris ēre ētur ēmur ēminī entur'), 'IND IMPF PASSIVE': T('ēbar ēbāris ēbāre ēbātur ēbāmur ēbāminī ēbantur'), 'IND FUT PASSIVE': T('ēbor ēberis ēbere ēbitur ēbimur ēbiminī ēbuntur'),
    'SUB PRES PASSIVE': T('ear eāris eāre eātur eāmur eāminī eantur'), 'SUB IMPF PASSIVE': T('ērer ērēris ērēre ērētur ērēmur ērēminī ērentur'),
    'IMP PRES ACTIVE': T('ē ēte'), 'IMP FUT ACTIVE': T('ētō ētōte entō'), 'IMP PRES PASSIVE': T('ēre ēminī'), 'IMP FUT PASSIVE': T('ētor entor'),
    'INF PRES ACTIVE': T('ēre'), 'INF PRES PASSIVE': T('ērī ērier'),
  };
  const G3 = {   // regō and capiō (V 3 1), ferō (V 3 2), fīō (V 3 3) share the shared V 3 0 endings
    'IND PRES ACTIVE': T('ō is it imus itis unt s t tis -'), 'IND IMPF ACTIVE': T('ēbam ēbās ēbat ēbāmus ēbātis ēbant'), 'IND FUT ACTIVE': T('am ēs et ēmus ētis ent'),
    'SUB PRES ACTIVE': T('am ās at āmus ātis ant'), 'SUB IMPF ACTIVE': T('erem erēs eret erēmus erētis erent rem rēs ret rēmus rētis rent'),
    'IND PRES PASSIVE': T('or eris ere itur imur iminī untur ris re tur mur'), 'IND IMPF PASSIVE': T('ēbar ēbāris ēbāre ēbātur ēbāmur ēbāminī ēbantur'), 'IND FUT PASSIVE': T('ar ēris ēre ētur ēmur ēminī entur'),
    'SUB PRES PASSIVE': T('ar āris āre ātur āmur āminī antur'), 'SUB IMPF PASSIVE': T('erer erēris erēre erētur erēmur erēminī erentur rer rēris rēre rētur rēmur rēminī rentur'),
    'IMP PRES ACTIVE': T('e - ite te'), 'IMP FUT ACTIVE': T('itō itōte untō tō tōte'), 'IMP PRES PASSIVE': T('ere iminī re'), 'IMP FUT PASSIVE': T('itor untor tor'),
    'INF PRES ACTIVE': T('ere re'), 'INF PRES PASSIVE': T('ī ier rī rier'),
  };
  const G3F = { // fīō specifics (V 3 3): fīs fīt fīmus fītis, fierī
    'IND PRES ACTIVE': T('ō īs īt īmus ītis unt'), 'INF PRES ACTIVE': T('ierī iere'), 'IMP PRES ACTIVE': T('ī īte'), 'IMP FUT ACTIVE': T('ītō ītōte'),
  };
  const G4 = {   // 4th conjugation = Whitaker V 3 4 (audi / aud)
    'IND PRES ACTIVE': T('ō īs it īmus ītis unt'), 'IND IMPF ACTIVE': T('ēbam ēbās ēbat ēbāmus ēbātis ēbant'), 'IND FUT ACTIVE': T('am ēs et ēmus ētis ent'),
    'SUB PRES ACTIVE': T('am ās at āmus ātis ant'), 'SUB IMPF ACTIVE': T('īrem īrēs īret īrēmus īrētis īrent'),
    'IND PRES PASSIVE': T('or īris īre ītur īmur īminī untur'), 'IND IMPF PASSIVE': T('ēbar ēbāris ēbāre ēbātur ēbāmur ēbāminī ēbantur'), 'IND FUT PASSIVE': T('ar ēris ēre ētur ēmur ēminī entur'),
    'SUB PRES PASSIVE': T('ar āris āre ātur āmur āminī antur'), 'SUB IMPF PASSIVE': T('īrer īrēris īrēre īrētur īrēmur īrēminī īrentur'),
    'IMP PRES ACTIVE': T('ī īte'), 'IMP FUT ACTIVE': T('ītō ītōte untō'), 'IMP PRES PASSIVE': T('īre īminī'), 'IMP FUT PASSIVE': T('ītor untor'),
    'INF PRES ACTIVE': T('īre'), 'INF PRES PASSIVE': T('īrī īrier'),
  };
  const G5 = {   // sum / possum
    'IND PRES ACTIVE': T('um es est umus estis unt'), 'IND IMPF ACTIVE': T('eram erās erat erāmus erātis erant'), 'IND FUT ACTIVE': T('erō eris erit erimus eritis erunt erint'),
    'SUB PRES ACTIVE': T('im īs it īmus ītis int'), 'SUB IMPF ACTIVE': T('essem essēs esset essēmus essētis essent forem forēs foret forēmus forētis forent em ēs et ēmus ētis ent'),
    'IMP PRES ACTIVE': T('es este'), 'IMP FUT ACTIVE': T('estō estōte untō'), 'INF PRES ACTIVE': T('esse e'), 'INF FUT ACTIVE': T('fore'),
  };
  const G6 = {   // eō (V 6 1): stem 2 "i" is long before consonants (handled in mac); volō (V 6 2)
    'IND PRES ACTIVE': T('ō s t mus tis unt umus'), 'IND IMPF ACTIVE': T('bam bās bat bāmus bātis bant ēbam ēbās ēbat ēbāmus ēbātis ēbant'), 'IND FUT ACTIVE': T('bō bis bit bimus bitis bunt am ēs et ēmus ētis ent'),
    'SUB PRES ACTIVE': T('am ās at āmus ātis ant im īs it īmus ītis int'), 'SUB IMPF ACTIVE': T('rem rēs ret rēmus rētis rent lem lēs let lēmus lētis lent'),
    'IND PRES PASSIVE': T('or ris re tur mur minī untur'), 'IND IMPF PASSIVE': T('bar bāris bāre bātur bāmur bāminī bantur'), 'IND FUT PASSIVE': T('bor beris bere bitur bimur biminī buntur ar ēris ēre ētur ēmur ēminī entur'),
    'SUB PRES PASSIVE': T('ar āris āre ātur āmur āminī antur'), 'SUB IMPF PASSIVE': T('rer rēris rēre rētur rēmur rēminī rentur'),
    'IMP PRES ACTIVE': T('- te ī īte'), 'IMP FUT ACTIVE': T('tō tōte untō ītō ītōte'), 'IMP PRES PASSIVE': T('ere minī'), 'IMP FUT PASSIVE': T('tor untor'),
    'INF PRES ACTIVE': T('re le'), 'INF PRES PASSIVE': T('rī rier'),
  };
  const G7 = {   // aiō, inquam
    'IND PRES ACTIVE': T('ō is it unt am imus itis'), 'IND IMPF ACTIVE': T('ēbam ēbās ēbat ēbāmus ēbātis ēbant ībam ībās ībat ībāmus ībātis ībant'), 'IND FUT ACTIVE': T('ēs et'),
    'SUB PRES ACTIVE': T('iās iat iant'), 'IND PERF ACTIVE': T('it ī istī'), 'IMP PRES ACTIVE': T('e ī'), 'IMP FUT ACTIVE': T('itō'),
  };
  function groupOf(entry) {
    const c = entry.c || [0, 0]; const [d, v] = c;
    if (d === 1) return G1; if (d === 2) return G2;
    if (d === 3) return v === 4 ? G4 : v === 3 ? Object.assign({}, G3, G3F) : G3;
    if (d === 5) return G5; if (d === 6) return G6; if (d === 7) return G7;
    return {};
  }
  function verbEnding(entry, r, e) {
    if (e === '' || e == null) return e;
    const key = (r.md === 'INF' ? 'INF' : r.md) + ' ' + r.t + ' ' + r.vo;
    if (r.k === 3 && PERF[key]) return PERF[key][e] || e;
    const g = groupOf(entry);
    if (g[key] && g[key][e] !== undefined) return g[key][e];
    return e;
  }
  function pplEnding(entry, r, e) {
    let m;
    if (r.p === 'SUPINE') return e === 'u' ? 'ū' : e;
    if ((m = /^(i?)(a|e|u)(ns|nt)(.*)$/.exec(e))) {   // present participle
      const [, i, vow, nt, rest] = m;
      if (nt === 'ns') return i + LONG[vow] + 'ns';
      return i + vow + 'nt' + nounEnding(3, r.cs, r.nm, r.g, rest);
    }
    if ((m = /^(i?)(a|e|u)nd(.*)$/.exec(e))) return m[1] + m[2] + 'nd' + adj12(m[3], r.cs, r.nm, r.g);   // gerundive
    if ((m = /^ur(.*)$/.exec(e))) return 'ūr' + adj12(m[1], r.cs, r.nm, r.g);                               // future participle
    return adj12(e, r.cs, r.nm, r.g);                                                                      // perfect participle
  }

  let stemsFn = e => e.s;
  function setStemsFn(fn) { stemsFn = fn; }

  /** x = {f, r, k} from Morph.generate. Returns the macronized form. */
  function mac(entry, x) {
    if (!x) return '';
    if (x.peri || !x.r) return x.f;
    const r = x.r;
    const plainStems = stemsFn(entry);
    let stem = (entry.ms && entry.ms[x.k - 1]) || plainStems[x.k - 1] || '';
    const e = r.e || '';
    let me = e;
    const p = r.p;
    if (p === 'N') me = nounEnding(entry.c ? entry.c[0] : r.d, r.cs, r.nm, r.g, e, stem);
    else if (p === 'ADJ') {
      if (r.co === 'COMP' && r.k === 3) me = COMP[e] || e;
      else if (r.co === 'SUPER' && r.k === 4) me = adj12(e, r.cs, r.nm, r.g);
      else {
        const d = entry.c ? entry.c[0] : r.d;
        me = d === 3 ? nounEnding(3, r.cs, r.nm, r.g, e) : adj12(e, r.cs, r.nm, r.g);
      }
    } else if (p === 'PRON' || p === 'PACK') me = PRON[e] || e;
    else if (p === 'NUM') me = (['ibus', 'ium', 'es', 'ia', 'em'].includes(e) ? nounEnding(3, r.cs, r.nm, r.g, e) : adj12(e, r.cs, r.nm, r.g)).replace(/^ius$/, 'īus');
    else if (p === 'V') {
      me = verbEnding(entry, r, e);
      // eō and compounds: stem 2 "i" is long before a consonant ending (īs, īt, ībam, īre)
      if (entry.c && entry.c[0] === 6 && entry.c[1] === 1 && x.k === 2 && /i$/.test(stem) && e && !/^[aeiou]/.test(e)) stem = stem.replace(/i$/, 'ī');
    } else if (p === 'VPAR' || p === 'SUPINE') me = pplEnding(entry, r, e);
    return stem + me;
  }
  return { mac, setStemsFn, strip };
}));
