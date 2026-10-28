# Store listing and compliance notes

## Identity

- Name: **Lexicon Latinum**
- Subtitle (App Store, 30 chars): *Latin dictionary and grammar*
- Short description (Play, 80 chars): *Lewis & Short dictionary, every form of every word, graded reader and games.*
- Category: Education (secondary: Reference)
- Age rating: 4+ (Apple) / Everyone (Google, IARC questionnaire: no violence, no user content, no ads, no purchases)
- Bundle id / application id: `com.fogliobooks.lexiconlatinum`
- Privacy policy URL: https://fogliobooks.github.io/lexicon-latinum/privacy.html
- Support URL: https://fogliobooks.github.io/lexicon-latinum/
- Support email: contact@foglioprint.com
- Price: free (no in-app purchases, no ads, no accounts)

## Description (both stores)

Lexicon Latinum is a complete Latin–English and English–Latin dictionary that fits in your pocket and works without a connection.

• The full text of Lewis & Short, A Latin Dictionary (1879), the standard reference, with abridged entries for reading at a glance and every citation a tap away.
• Every form of every word: type any inflected form (amāverat, tulistī, puellaeque) and the app finds the dictionary word and names the form. Full declension and conjugation tables for each entry, with long vowels marked.
• Grammar explained where you need it: tap the (i) beside any case or tense for an explanation and an example sentence using a word of the same class.
• A grammar reference with 25 chapters and a paradigm page for every declension and conjugation.
• English to Latin: type an English word and find the Latin.
• A Latin thesaurus: Döderlein's Hand-book of Latin Synonymes, keyed to the entries.
• A graded reader: 25 passages from the Vulgate, Phaedrus, Caesar, Catullus, Cicero, Pliny, Horace, Ovid, Virgil, Lucretius and Tacitus, every word tappable, with translations and notes.
• Seven word games: Verbum (a daily five-letter word), Nexus (find the four groups), Corōna (a ring of letters and a crossword), matching, anagrams, hangman and fill-the-blanks.
• Nine colour themes, three typeface settings, adjustable text size.

No account, no ads, no tracking. The app contains everything it needs and never sends data anywhere.

Sources: Lewis & Short (Perseus Digital Library, CC BY-SA 4.0), Whitaker's Words (public domain), Döderlein (public domain). Paintings are public domain.

## Keywords (App Store, 100 chars)

latin,dictionary,lewis short,declension,conjugation,grammar,vulgate,caesar,virgil,latin games

## App Privacy (App Store Connect)

- Data collection: **Data Not Collected** (no data types; no tracking; no third-party SDKs).
- App Tracking Transparency: not used.
- Export compliance: `ITSAppUsesNonExemptEncryption` is set to false in Info.plist (the app uses no encryption and makes no network calls), so no yearly self-classification report is needed.
- Content rights: tick *yes, I have the rights*: Lewis & Short via Perseus is CC BY-SA 4.0 and attributed in the app's About section and here; the rest is public domain or written for the app.
- Review notes: "Fully offline dictionary and reader. No login. All features are available immediately. Tap any word in Read to see its gloss; Settings has nine themes."

## Data safety (Play Console)

- Does your app collect or share any of the required user data types? **No**.
- Is all user data encrypted in transit? Not applicable (no data leaves the device).
- Do you provide a way for users to request deletion? Not applicable (no data collected); deleting the app removes local settings.
- Ads: **No ads**. App access: **All functionality available without special access**. Government app: No. Financial features: None. Health: None. News: No. COVID: No.
- Target audience: 13 and over is simplest (choosing under 13 adds Families policy requirements). The content is suitable for all ages either way.

## Screenshots to take

App Store: 6.9-inch iPhone (1320×2868) and 13-inch iPad (2064×2752) are enough; Apple scales them for other sizes. Google Play: phone (at least 2, 16:9 or 9:16), 7-inch and 10-inch tablet, plus a 1024×500 feature graphic.

Suggested shots: the home screen (Per Sē theme), an entry with its declension table, the (i) explanation sheet, the Reader with a word popover, Verbum, Nexus, Corōna, the theme grid.

## Guideline checklist

Apple
- 4.2 Minimum functionality: the app is a full offline reference with native navigation, games and a reader, not a wrapped website.
- 5.1.1 Privacy: no data collected; privacy policy linked in the listing and inside Settings → About.
- 2.5.1 / 2.5.6: only public WebKit APIs; no remote code loading (all scripts are bundled).
- 1.2 / 1.1: no user-generated content, no objectionable content.
- Launch screen and icons for all sizes are generated; iPad orientation support is on.

Google
- Target API level: 36 (current requirement is met).
- 64-bit: the shell has no native code of its own; the bundle is architecture-independent.
- Permissions: only INTERNET (needed to open external links in the browser).
- App bundle (.aab) is required for new apps; Play App Signing is on by default.
- Content rating questionnaire: Reference/Education, no sensitive content.
- Privacy policy URL must be entered in *App content* and is also shown in the app.
