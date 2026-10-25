# Lexicon Latinum

A Latin–English dictionary app with every declension and conjugation generated for each word, example sentences matched to the word's own class, and a grammar reference.

## What is inside

| Part | Source | Notes |
|---|---|---|
| Definitions | Lewis & Short, *A Latin Dictionary* (1879), Perseus Digital Library edition (CC BY-SA 4.0) | 51,645 entries, full sense hierarchy and citations |
| Stems, endings, short glosses | Whitaker's Words (public domain) | 39,336 entries, 1,797 ending rules |
| Paradigm packs, grammar chapters, example sentences | written for this app | `content/` |

Every table is generated at run time from Whitaker's stems and ending rules (`web/morph.js`), following the same matching rules as the original program (declension/variant wildcards, gender, deponent and impersonal filters). Vowel lengths on stems come from the Lewis & Short headword when the two sources agree; endings follow the standard quantities (`web/macrons.js`). For about 12,000 words that only Lewis & Short has, the paradigm is inferred from the principal parts in the entry and marked as such.

## Layout

```
build/      parsers and build scripts (Python + Node)
  parse_whitaker.py   DICTLINE.GEN / INFLECTS.LAT -> JSON
  parse_ls.py         Lewis & Short TEI XML -> 220 compact HTML chunks
  link.js             headword index, L&S <-> Whitaker linking, macron stems, inferred paradigms
  publish.js          bundles web/ into dist/index.html for artifact hosting
  test_morph.js, test_macrons.js, smoke.js   checks
content/    paradigm packs (nouns, adjectives, verbs, pronouns), shared explanations, grammar chapters
web/        the app (index.html, app.js, morph.js, macrons.js, style.css, manifest, service worker, data/)
dist/       single-file bundle
```

## Running it yourself (true installable PWA)

Serve the `web/` folder from any static host (GitHub Pages, Netlify, Cloudflare Pages, or `python3 -m http.server --directory web`). The service worker then caches the app shell, the manifest makes "Add to Home Screen" install it as a standalone app, and "Download all" in Settings stores the full dictionary (about 80 MB) for offline use.

To rebuild the data from scratch, download `DICTLINE.GEN`, `INFLECTS.LAT`, `UNIQUES.LAT` (Whitaker's Words) and `lat.ls.perseus-eng2.xml` (PerseusDL/lexica), then:

```
python3 build/parse_whitaker.py <whitaker-dir> build/out web/data
python3 build/parse_ls.py <path-to-lat.ls.perseus-eng2.xml> build/out web/data
node build/link.js
node build/publish.js
```

## Limits worth knowing

- Hidden vowel quantities (rēxī, fēlīx) cannot be recovered from the sources and are left unmarked.
- Whitaker's pronoun data is fragmentary; the main pronouns use curated tables from the grammar packs instead.
- Rare, archaic and late forms are hidden by default (Settings → Rare & archaic forms).
