# Publishing Lexicon Latinum as a paid app, from zero

A first-timer's walkthrough for both stores. Read `README.md` in this folder for the build commands and `STORE.md` for the listing text and the answers to the stores' questionnaires.

## 0. Decide three things first

1. **Seller name.** Enrolling as an individual is quick (a day or two) and the store shows your personal name as the seller. Enrolling as an organisation shows a company name (e.g. Foglio Books) but needs a registered legal entity, a D-U-N-S number (free from Dun & Bradstreet, takes about a week) and someone with legal authority to sign. Apple does not let you change from individual to organisation later without a transfer.
2. **Price.** Paid-upfront is the simplest model and needs no code: the store charges once and installs the app. Pick a tier (Apple has fixed tiers; USD 4.99 or 6.99 is typical for a reference app). The alternative, free with an in-app purchase to unlock, needs billing code in the app and is a later project.
3. **The free web version.** The same app is public at https://fogliobooks.github.io/lexicon-latinum/ and the repository is public. If you sell the app, decide whether the web version stays up as a free demo, moves behind a different address, or comes down. GitHub Pages on a private repository needs a paid GitHub plan.

## 1. Accounts and money (do this first, it has waiting time)

**Apple**
- Enrol in the Apple Developer Program at developer.apple.com/programs (USD 99 per year). Use your Apple ID with two-factor authentication on. Individuals are usually approved within 48 hours.
- Sign in to App Store Connect (appstoreconnect.apple.com) → **Business** (called *Agreements, Tax, and Banking* in older layouts). Accept the **Paid Apps Agreement**, add a bank account, and fill in the tax form (W-9 if you are a US person, W-8BEN otherwise). Until this is complete you cannot sell anything; Apple pays monthly, about 33 days after the end of each fiscal month, minus its 15% commission (Small Business Program; you must apply for it once at developer.apple.com/app-store/small-business-program).

**Google**
- Create a Google Play Console developer account at play.google.com/console (one-time USD 25). Google verifies identity with an ID document and, for a personal account, a phone number and a payment card; this takes a few days.
- In Play Console → **Setup → Payments profile**, create a Google Payments merchant account: bank details and tax information. Paid apps cannot be published without it. Google pays monthly and takes 15% on the first USD 1 million a year.
- New personal accounts must run a **closed test with at least 12 testers for 14 continuous days** and then apply for production access. Start recruiting testers (friends, family, a Latin class) now.

## 2. Build the apps

Follow `README.md`: on a Mac, clone the repository, `cd native`, `npm install`, `node build-www.js`, `npx cap sync`. Open the iOS project with `npx cap open ios` and the Android one with `npx cap open android`.

Before the first upload, set the bundle identifier you will keep forever (default `com.fogliobooks.lexiconlatinum`) in Xcode under the App target → Signing & Capabilities, and in `android/app/build.gradle` as `applicationId`. Both stores lock it after the first upload.

## 3. iOS: from Xcode to the App Store

1. **Xcode signing**: App target → Signing & Capabilities → tick *Automatically manage signing*, choose your team. Xcode creates the certificates and profiles.
2. **Test on your iPhone**: plug it in, choose it as the destination, press Run. Check the status bar, scrolling, games and reader on the real device.
3. **TestFlight** (optional but recommended): Product → Archive → Distribute App → App Store Connect → Upload. In App Store Connect → TestFlight, add yourself and friends as internal testers; they install through the TestFlight app. Fix anything you find, bump the Build number, archive and upload again.
4. **Create the App Store record**: App Store Connect → Apps → + → New App. Platform iOS, name *Lexicon Latinum*, primary language English, bundle id from step 2, SKU anything unique (e.g. `lexicon-latinum-1`).
5. **Pricing and Availability**: choose the price tier, tick all territories you want (all by default), and leave pre-orders off.
6. **App Information**: subtitle, category (Education, secondary Reference), privacy policy URL, age rating questionnaire (all "none" → 4+), content rights (you have the rights; L&S is CC BY-SA and credited).
7. **Version page**: description, keywords, support URL, screenshots (6.9-inch iPhone and 13-inch iPad; take them in the Xcode simulator with ⌘S), promotional text, "What's New" (first version: anything), copyright (your name/company), the build you uploaded, and App Review notes (see STORE.md).
8. **App Privacy**: Get Started → "Do you collect data?" → No → publish.
9. **Submit for Review**. Typical first review is one to three days. If rejected, the reason is in Resolution Center; fix, upload a new build, reply, resubmit. Choose *Manually release* if you want to pick the launch day, otherwise it goes live automatically on approval.

## 4. Android: from Android Studio to Google Play

1. **Build a signed bundle**: Android Studio → Build → Generate Signed App Bundle / APK → *Android App Bundle* → Create new keystore (store the `.jks` file and both passwords in a password manager; never commit it). Choose *release*. The output is `android/app/release/app-release.aab`.
2. **Create the app**: Play Console → Create app → name, default language, *App*, *Paid*. (A paid app can later become free, but a free app can never become paid, so choose Paid now.)
3. **Set up your app** (the dashboard checklist): privacy policy URL; app access (all functionality available without login); ads (no); content rating questionnaire (Education/Reference, everything "no" → Everyone); target audience (13 and over); news app (no); COVID (no); data safety (no data collected, no data shared); government app (no); financial features (none); health (none).
4. **Store listing**: short and full description (STORE.md), app icon 512×512 (`native/assets/icon.png` scaled), feature graphic 1024×500, at least two phone screenshots, tablet screenshots if you have them.
5. **Pricing**: Monetise → Products → App pricing → set the price; Google converts it per country, and you can adjust each country.
6. **Testing**: Testing → Closed testing → create a track, upload the `.aab`, add testers by email or a Google Group, start the test, share the opt-in link. After 14 days with 12 opted-in testers, Dashboard → *Apply for production access* and answer the short questionnaire.
7. **Production**: Release → Production → create release → upload the same or newer `.aab` → review the release → Start rollout. First review usually takes a few days, occasionally a week.

## 5. After launch

- **Updates**: change the web app, `node build-www.js && npx cap sync`, raise the version/build in Xcode and `versionCode`/`versionName` in `build.gradle`, archive and upload again. Both stores review updates, usually quickly.
- **Reviews and crashes**: App Store Connect and Play Console both show ratings, reviews and crash reports; reply to reviews from there.
- **Money**: Apple pays by bank transfer monthly once the balance passes the minimum; Google pays monthly around the 15th. Keep the statements for tax.
- **Keep safe**: the Android keystore, your Apple ID recovery details, and the exact bundle id. Losing the keystore without Play App Signing (which is on by default) would make updates impossible.

## 6. Licence note

Lewis & Short via Perseus is CC BY-SA 4.0, which permits commercial use provided the source is credited and any modified version of the dictionary data stays under the same licence. The app credits it in Settings → About and the store listing text repeats the credit. Whitaker's Words, Döderlein and the texts and paintings are public domain. This is a plain reading of the licence, not legal advice.
