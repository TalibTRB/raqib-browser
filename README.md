# RAQİB — Halal Visual Browser for Android

<p align="center">
  <strong>Bilinçle gezin. Gözünü koru.</strong><br/>
  <em>Browse with purpose. Protect your gaze.</em>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.3.0-10B981?style=for-the-badge" />
  <img alt="Android" src="https://img.shields.io/badge/Android-8.0%20--%2016%20(API%2026--36)-1F242B?style=for-the-badge" />
  <img alt="APK Size" src="https://img.shields.io/badge/Signed%20APK-4.72%20MB-059669?style=for-the-badge" />
  <img alt="Edge Store" src="https://img.shields.io/badge/Microsoft%20Edge-Live%20in%20Store-0078D4?style=for-the-badge" />
  <img alt="Privacy" src="https://img.shields.io/badge/Developer%20Telemetry-0%20Bytes-0F172A?style=for-the-badge" />
  <img alt="Languages" src="https://img.shields.io/badge/Languages-TR%20%7C%20EN%20%7C%20AR%20%7C%20KU%20%7C%20DE-334155?style=for-the-badge" />
</p>

<p align="center">
  <img src="docs/assets/hero-showcase.png" alt="RAQİB v1.3.0 Android Interface Showcase" width="820" />
</p>

**RAQİB (الرقيب)** is an ultra-lightweight (`4.72 MB`), privacy-first visual protection browser for Android — plus official **Manifest V3 Browser Extensions for Microsoft Edge (Live on Microsoft Edge Add-ons Store!), Brave, and Firefox** — engineered for calm, distraction-free, and fast browsing.

> **Official Distribution & Documentation Repository:** This public repository hosts the 5-language interactive showcase site (Vercel & GitHub Pages), official signed release APKs, desktop browser extensions, SHA-256 checksums, 5-language Privacy Policy, and cryptographic verification details. Source code is proprietary (`All Rights Reserved`).

---

## Official Links

* **5-Language Showcase Website (Vercel):** https://raqib-browser.vercel.app/
* **Microsoft Edge Add-ons Store (Live 1-Click Install):** https://microsoftedge.microsoft.com/addons/detail/raqi%CC%87b-%E2%80%94-halal-visual-shie/gkebimegcelcjcanaogpkabbpgdakbce
* **Download Latest Release (`v1.3.0` — Signed Android APK + Extensions):** https://github.com/TalibTRB/raqib-browser/releases/latest
* **5-Language Privacy Policy (HTTPS):** https://raqib-browser.vercel.app/privacy
* **Security, Privacy & Network Transparency Policy:** [SECURITY.md](SECURITY.md)

---

## Complete Feature Overview

* **Instant Zero-Flash Strict Visual Blur (`t = 0 ms`):** Blurs `<img>`, `<picture>`, `<canvas>`, `<video>` thumbnails, avatars, CSS backgrounds, and Shadow DOM media before paint. Hold any blurred image for instant **Peek-to-Unblur**, or manage per-site whitelist/blacklist rules and blur intensity (`0–40 px`).
* **Mandatory Halal Shield & Safe Browsing:** Permanent network-level blocking for explicit, gambling, and malicious domains; SafeSearch enforcement; IDN homograph phishing alerts; anti-cryptojacking shield; and dangerous download inspection.
* **Fast Aho-Corasick Ad, Tracker & Annoyance Shield:** Offline compiled binary trie (`< 8 ms` load) blocks ads, trackers, cookie banners, pop-ups, and app-nag bars while stripping URL tracking parameters automatically.
* **Native In-Page DOM Translation Engine:** Translates webpages directly in-place without leaving the page or breaking logins, with an instant floating `Original ↔ Translated` toggle bar.
* **Clean Guest Session (*Misafir / Temiz Oturum*):** Isolated Chromium `MULTI_PROFILE` session for a 2nd/family account or unbiased lookups with zero saved history, zero cache, hardware `FLAG_SECURE`, and always-on Strict Blur + Halal Shield.
* **Unified Dark & Light Mode Sync:** Synchronizes browser chrome, dialogs, and websites cleanly between Dark (white ink) and Light (black ink) while preserving visual blur clarity.
* **Pro In-Site Search & Smart Quick-Search Bangs:** Diacritics-tolerant in-page search with jump list, instant Omnibox quick-search chips (`Google`, `YouTube`, `Turath`, `Tafsir`, `Hadith`, `Almaany`), `!t` / `!tf` / `!h` / `!a` / `!yt` bangs, and offline calculator/unit/timezone converter.
* **Scholar & Productivity Suite:**
  * Pure Offline **Hijri Calendar**, **Hatim Tracker**, **Zakat & Hijri Converter**, and optional **Arabic Istighfar Reminder** popup
  * **Screenshot Studio** (straight strip highlighter, censor box, crop, arrows, annotations) & **Auto-Fit Quote Card Studio**
  * **Reader Mode**, **Text-Only Mode**, **Dual Split View**, **Offline Notes**, **Internal PDF Viewer & Save as PDF**, **QR Scanner & Generator**, **Element Zapper**, and **Tab Workspaces**
  * **Uninterrupted Web Audio & Media3 Suite:** Background audio/lecture playback, Voice Boost, 5-Band WebAudio EQ, playback speed, customizable bottom toolbar, and a 7-step interactive first-launch guided tour (with long-press gesture shortcuts)
* **100% On-Device Privacy & 5 Languages:** Zero accounts, zero analytics SDKs, hardware-backed Android Keystore (AES-GCM) encryption, `allowBackup=false`, built-in **Turkish (`tr`), English (`en`), Arabic (`ar` full RTL), Kurdish (`ku` Kurmancî), and German (`de`)**.

---

## Automatic Updates on Android (Obtainium)

You can track and install official signed RAQİB updates directly from GitHub Releases using **[Obtainium](https://obtainium.imranr.dev/)**:
1. Open Obtainium → **Add App**.
2. Enter: `https://github.com/TalibTRB/raqib-browser`
3. Obtainium automatically detects new signed APK releases and verifies cryptographic continuity against our permanent signing key.

---

## Verify Official Release Signatures

Every official APK published on GitHub Releases is signed with our permanent 4096-bit RSA key (`APK Signature Scheme v2 + v3`):

* **Package ID:** `com.raqib.browser`
* **Certificate `SHA-256`:** `F7:0D:88:EA:F2:AB:21:9C:2F:F8:72:6E:2C:D5:B6:EF:2F:9E:A7:93:0E:AF:5F:A8:D1:85:C3:13:95:BA:4C:A5`
* **Certificate `SHA-1`:** `26:CF:58:A0:70:C8:AD:52:54:1D:6F:A1:38:C2:F5:63:5F:8B:08:7C`

Verify locally:
```bash
sha256sum -c SHA256SUMS.txt
apksigner verify --verbose --print-certs RAQIB-v1.3.0-signed-release.apk
```

---

## Desktop Browser Extensions (Microsoft Edge Store • Brave • Firefox)

Both Manifest V3 packages include `t = 0 ms` Strict Visual Blur, Peek-to-Unblur (`Alt+Hover` or press & hold), **152** Mandatory Halal Shield + SafeSearch rules, **249** Ad & Tracker network rules, YouTube Focus Shield, and all 5 languages (`TR • EN • AR • KU • DE`):

* **Microsoft Edge (Official 1-Click Store Install — LIVE!):** [Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/raqi%CC%87b-%E2%80%94-halal-visual-shie/gkebimegcelcjcanaogpkabbpgdakbce)
* **Brave / Chromium Manual (`RAQIB-Extension-v1.0.0-Edge-Brave.zip`):** Unzip → open `brave://extensions` → enable **Developer Mode** → **Load unpacked**.
* **Mozilla Firefox (`RAQIB-Extension-v1.0.0-Firefox.zip`):** Submitted to Firefox Add-ons (AMO review in progress) — or load locally via `about:debugging#/runtime/this-firefox`.

---

## Changelog

### `v1.3.0` (2026-11-26)
* Comprehensive security hardening across URL validation, bridge isolation, PIN protection, and release checksum verification.
* Upgraded visual blur against tampering, kept auto-playing videos blurred, and added a new "Keep Playing Videos Blurred" strict toggle.
* Reduced ad-blocker memory usage and improved pop-up blocking, download handling, and background battery efficiency.

### `v1.2.0` (2026-11-26)
* Strengthened YouTube ad blocking, post-video playback protection, and Wi-Fi/mobile consistency.
* Rebuilt full-page Save as PDF for long articles and refined audio reader speed and voice controls.
* Streamlined menu search, upgraded home-screen shortcuts with 3D glass icons, and set quick-scroll buttons off by default.

### `v1.1.6` (2026-11-26)
* Added automatic in-app update pop-up alerts (checks anonymously at most once every 24 hours; toggleable in *Settings → System*).
* Upgraded in-page and selected-text translation with bilingual reading mode, optional hardware-encrypted AI / DeepL support, built-in API Setup Guide, and live active model discovery.

### `v1.1.2` (2026-11-26)
* Improved Google Sign-In & 2FA compatibility, public Downloads visibility for saved PDFs, and added zoom/pan + fast page scrubbing to the internal PDF viewer.

### `v1.1.1` (2026-11-26)
* Improved in-app APK update installation, clickable download notifications, and broad memory/performance optimizations.

### `v1.1.0` (2026-11-26)
* Added in-page selected text translation, upgraded Reader Mode (with automatic Arabic RTL), audio reading, Password Vault upgrades, and PDF highlighting tools.

### `v1.0.0` (2026-11-25)
* Initial signed Android release, uninterrupted background audio, and official desktop browser extensions for Edge, Brave, and Firefox.

---

## Deploy Showcase to Vercel (1 Click)

This repository ships with a pre-configured [`vercel.json`](vercel.json) (`"outputDirectory": "docs"`, `"cleanUrls": true`, security & asset cache headers). Simply import `TalibTRB/raqib-browser` in [Vercel](https://vercel.com/new) and click **Deploy** — zero build step required.

---

## License

Copyright © 2026 **RAQİB Browser (`TalibTRB`)**. All Rights Reserved. See [LICENSE](LICENSE).
