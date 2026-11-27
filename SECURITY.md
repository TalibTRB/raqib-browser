# Security Policy — RAQİB Browser

## Supported Versions

| Version | Supported |
| :--- | :--- |
| `1.4.x` | Yes (Active Release — `v1.4.2`, `versionCode 38`) |
| `1.3.x` | Security maintenance — please upgrade to `v1.4.2` |
| `1.2.x` | Security maintenance — please upgrade to `v1.4.2` |
| `1.1.x` | Security maintenance — please upgrade to `v1.4.2` |
| `1.0.x` | Security maintenance — please upgrade to `v1.4.2` |
| `< 1.0.0` | Pre-launch development builds (unsupported) |

## Official Release Signing Verification

Official RAQİB Android releases are signed with our permanent 4096-bit RSA key (`APK Signature Scheme v2 + v3`):

* **Package ID:** `com.raqib.browser`
* **Signer DN:** `CN=RAQIB Browser, OU=Mobile Engineering, O=RAQIB, L=Istanbul, ST=Istanbul, C=TR`
* **Certificate SHA-256:** `F7:0D:88:EA:F2:AB:21:9C:2F:F8:72:6E:2C:D5:B6:EF:2F:9E:A7:93:0E:AF:5F:A8:D1:85:C3:13:95:BA:4C:A5`
* **Certificate SHA-1:** `26:CF:58:A0:70:C8:AD:52:54:1D:6F:A1:38:C2:F5:63:5F:8B:08:7C`

Never install APK files whose certificate fingerprint does not match the values above.

## Security, Privacy & Transparent Network Architecture

* **0 Byte Developer Telemetry:** Zero analytics SDKs, zero ad SDKs, zero accounts, and zero developer telemetry servers.
* **User-Initiated External Network Requests Only:** Zero unsolicited background prefetch or cold-start DNS warmups (`v1.1.1+`). Outside of websites you explicitly visit, network requests occur only for user-initiated or toggleable features: optional text-only Google search autocomplete while typing in normal tabs (cookie-less, always off in Clean Guest Session, toggleable in *Settings → Search & Home*), In-Page / Selected-Text Translation (sends visible text snippets over HTTPS without cookies or user IDs), optional DNS-over-HTTPS (DoH), optional filter list updates, or *Check for Updates* (GitHub Releases API).
* **Zero-Flash Strict Blur Everywhere:** Document-start CSS & Constructable Shadow DOM blur (`t = 0 ms`) is enforced across normal tabs, Clean Guest Sessions, and OAuth child popups (`v1.1.0+`).
* **On-Device Encrypted Vault:** Saved credentials are encrypted on-device with hardware-backed **Android Keystore (AES-256-GCM)**.
* **No Cloud Leakage:** Automatic cloud backup is disabled (`android:allowBackup="false"`).
* **Isolated Clean Guest Session:** Uses a separate Chromium profile (`MULTI_PROFILE`) with hardware `FLAG_SECURE` and full data wipe on session close.

## Reporting a Vulnerability or Bug

If you discover a security bug, visual blur bypass, or domain shield issue:

1. **Do not** disclose exploitable details publicly before a fix is available.
2. Use GitHub’s **Security → Advisories → Report a vulnerability** feature on this repository.
3. Include steps to reproduce, Android version, WebView version, and affected URL pattern (if applicable).
