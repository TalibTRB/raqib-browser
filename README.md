# RAQİB — Halal Visual Browser for Android

<p align="center">
  <strong>Bilinçle gezin. Gözünü koru.</strong><br/>
  <em>Browse with purpose. Protect your gaze.</em>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-5.5.1-10B981?style=for-the-badge" />
  <img alt="Android" src="https://img.shields.io/badge/Android-8.0%20--%2016%20(API%2026--36)-1F242B?style=for-the-badge" />
  <img alt="APK Size" src="https://img.shields.io/badge/Signed%20APK-4.56%20MB-059669?style=for-the-badge" />
  <img alt="Privacy" src="https://img.shields.io/badge/Telemetry-Zero%20Data%20Collection-0F172A?style=for-the-badge" />
  <img alt="Languages" src="https://img.shields.io/badge/Languages-TR%20%7C%20EN%20%7C%20AR%20%7C%20KU%20%7C%20DE-334155?style=for-the-badge" />
</p>

**RAQİB (الرقيب)** is an ultra-lightweight (`4.56 MB`), privacy-first Android web browser designed for mindful, distraction-free, and fast browsing. It combines **instant zero-flash visual blur** with built-in ad, tracker, and explicit-domain protection, native in-page translation, and 100% on-device privacy.

> **Official Distribution & Documentation Repository:** This public repository hosts official signed release APKs, SHA-256 checksums, our 5-language Privacy Policy, and security verification information. Source code is proprietary (`All Rights Reserved`).

---

## Official Links

* **Download Latest Signed APK:** https://github.com/TalibTRB/raqib-browser/releases/latest
* **Showcase Page:** https://talibtrb.github.io/raqib-browser/
* **5-Language Privacy Policy (HTTPS):** https://talibtrb.github.io/raqib-browser/privacy.html
* **Security & Verification Policy:** [SECURITY.md](SECURITY.md)

---

## Key Features

* **Instant Zero-Flash Visual Blur:** Blurs web photos, avatars, video thumbnails, and CSS backgrounds before they appear on screen. Hold any blurred image for instant **Peek-to-Unblur**, or customize per-site rules and blur intensity (`0–40 px`).
* **Mandatory Halal Shield & Safe Browsing:** Permanent network-level protection against explicit, gambling, phishing (IDN homograph), and malicious domains, plus SafeSearch enforcement and suspicious download warnings.
* **Fast Ad, Tracker & Annoyance Shield:** Blocks intrusive ads, third-party trackers, cookie-banner popups, and URL tracking parameters on-device.
* **Native In-Page Translation:** Translate pages directly in place with a one-tap floating `Original ↔ Translated` toggle — no broken external proxy redirects.
* **Clean Guest Session (*Misafir / Temiz Oturum*):** Isolated browsing session for a second/family account or unbiased lookups with zero saved history, screen-capture protection (`FLAG_SECURE`), and always-on Strict Blur + Halal Shield.
* **Unified Dark / Light Mode:** Synchronizes browser UI and web pages smoothly for comfortable day and night reading.
* **Scholar & Productivity Toolkit:**
  * Pure Offline Prayer Times & Hijri Calendar (zero GPS required)
  * Pro In-Site Search (Arabic/Turkish diacritics-tolerant matching + jump list)
  * Screenshot Studio & Auto-Fit Quote Card Studio
  * Reader Mode, Text-Only Mode, Dual Split View, Offline Notes, Save as PDF, QR Scanner & Generator
  * Built-in 5 languages: Turkish (`tr`), English (`en`), Arabic (`ar` full RTL), Kurdish (`ku` Kurmancî), German (`de`)

---

## Verify Official Release Signatures

Every official APK published on GitHub Releases is signed with our permanent 4096-bit RSA key (`APK Signature Scheme v2 + v3`):

* **Package ID:** `com.raqib.browser`
* **Certificate `SHA-256`:** `F7:0D:88:EA:F2:AB:21:9C:2F:F8:72:6E:2C:D5:B6:EF:2F:9E:A7:93:0E:AF:5F:A8:D1:85:C3:13:95:BA:4C:A5`
* **Certificate `SHA-1`:** `26:CF:58:A0:70:C8:AD:52:54:1D:6F:A1:38:C2:F5:63:5F:8B:08:7C`

Verify any downloaded APK locally:
```bash
sha256sum -c SHA256SUMS.txt
apksigner verify --verbose --print-certs RAQIB-v5.5.1-signed-release.apk
```

---

## License

Copyright © 2026 **RAQİB Browser (`TalibTRB`)**. All Rights Reserved. See [LICENSE](LICENSE).
