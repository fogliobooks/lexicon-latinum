# Lexicon Latinum – native apps (iOS and Android)

This folder wraps the web app in a native shell with [Capacitor](https://capacitorjs.com). The whole dictionary, reader, grammar and games are bundled inside the app, so it works entirely offline and makes no network requests.

## What you need

- A Mac with **Xcode 16 or newer** (App Store) for the iPhone/iPad app.
- **Android Studio** (any platform) for the Android app.
- **Node.js 20 or newer**.
- An **Apple Developer Program** membership (USD 99/year) and a **Google Play Console** developer account (one-time USD 25).

## One-time setup

```bash
git clone https://github.com/fogliobooks/lexicon-latinum.git
cd lexicon-latinum/native
npm install
node build-www.js        # copies the web app into native/www
npx cap sync             # copies www into the iOS and Android projects
```

Run `node build-www.js && npx cap sync` again every time the web app changes.

## iOS: build and submit

1. `npx cap open ios` (opens `ios/App/App.xcodeproj` in Xcode; dependencies come through Swift Package Manager, no CocoaPods needed).
2. Select the **App** target → **Signing & Capabilities** → tick *Automatically manage signing* and choose your team. Change the bundle identifier if you want something other than `com.fogliobooks.lexiconlatinum` (do this before the first upload; it cannot change afterwards).
3. In **General**, set *Version* (e.g. 1.0.0) and *Build* (1). Increase *Build* for every upload.
4. Choose *Any iOS Device (arm64)* as the destination, then **Product → Archive**.
5. In the Organizer window, **Distribute App → App Store Connect → Upload**.
6. In [App Store Connect](https://appstoreconnect.apple.com): create the app (same bundle id), fill in the listing (see `STORE.md`), add screenshots, choose the uploaded build, answer App Privacy (*Data Not Collected*), set the age rating (4+), and **Submit for Review**.

To test on your own iPhone first: plug it in, pick it as the destination and press Run. Xcode will ask you to trust the developer certificate on the phone.

## Android: build and submit

1. `npx cap open android` (opens the project in Android Studio; let it sync Gradle and install the SDK it asks for).
2. **Build → Generate Signed App Bundle / APK → Android App Bundle**. Create a new keystore the first time and keep it safe (back it up; losing it means you can no longer update the app unless Play App Signing is enabled, which it is by default for new apps).
3. In the [Play Console](https://play.google.com/console): create the app, complete *Set up your app* (privacy policy, app access, ads, content rating, target audience, data safety, government apps, financial features, health), see `STORE.md` for the answers.
4. Upload the `.aab` to **Testing → Internal testing** first, then promote to **Production**.
5. New personal developer accounts must run a **closed test with at least 12 testers for 14 days** before they are allowed to publish to production. Start that early.

Version numbers for Android live in `android/app/build.gradle` (`versionCode` must increase on every upload; `versionName` is the visible version).

## What the native shell does

- Bundles all data and fonts (no network use, so no privacy or tracking questions).
- Disables the web-page feel: no swipe-back, no rubber-band bounce, no pinch zoom, no link previews, no text-selection callouts on buttons; internal scrolling only.
- Matches the status bar to the current theme colour.
- Android hardware back button walks back through the app's own history and exits at the home screen.
- External links (sources, credits) open in the system browser.
- Hides the web-only settings (Download all, Check for updates, Reload).

## Files

- `capacitor.config.json` – app id, name, native options.
- `build-www.js` – assembles `www/` from the built web app.
- `assets/` – source icon and splash images; `npx capacitor-assets generate` regenerates every size.
- `ios/`, `android/` – the native projects (commit them; `www`, `public` and build outputs are ignored).
