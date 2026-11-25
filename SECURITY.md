# Security Policy — RAQİB Browser

## Supported Versions

| Version | Supported |
| :--- | :--- |
| `5.6.x` | Yes (Active Release) |
| `< 5.6.0` | Please upgrade to the latest signed release |

## Official Release Signing Verification

Official RAQİB Android releases are signed with our permanent 4096-bit RSA key (`APK Signature Scheme v2 + v3`):

* **Package ID:** `com.raqib.browser`
* **Signer DN:** `CN=RAQIB Browser, OU=Mobile Engineering, O=RAQIB, L=Istanbul, ST=Istanbul, C=TR`
* **Certificate SHA-256:** `F7:0D:88:EA:F2:AB:21:9C:2F:F8:72:6E:2C:D5:B6:EF:2F:9E:A7:93:0E:AF:5F:A8:D1:85:C3:13:95:BA:4C:A5`
* **Certificate SHA-1:** `26:CF:58:A0:70:C8:AD:52:54:1D:6F:A1:38:C2:F5:63:5F:8B:08:7C`

Never install APK files whose certificate fingerprint does not match the values above.

## Security & Privacy Guarantees

* Zero analytics SDKs, zero ad SDKs, zero developer telemetry servers.
* Saved credentials are encrypted on-device with hardware-backed **Android Keystore (AES-GCM)**.
* Automatic cloud backup is disabled (`android:allowBackup="false"`).
* Clean Guest Session tabs use an isolated Chromium profile with `FLAG_SECURE` and full data wipe on session close.

## Reporting a Vulnerability or Bug

If you discover a security bug, visual blur bypass, or domain shield issue:

1. **Do not** disclose exploitable details publicly before a fix is available.
2. Use GitHub’s **Security → Advisories → Report a vulnerability** feature on this repository.
3. Include steps to reproduce, Android version, WebView version, and affected URL pattern (if applicable).
