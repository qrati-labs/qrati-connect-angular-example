# Angular cookie preferences audit

- Run: `20261017T204238Z-d48015a0ae2740d08b14ea53181525c6`
- Scope: Angular example cookie-preferences workflow, from footer button through initialization and persistence callbacks.
- Base: `origin/main` at `d4b48ec9fd6a0e86640e7c3900edc15112e37090`.
- Disposition: report-only; no confirmed defect.

## Trace and evidence

`src/app/home/home.html:315-322` exposes the Cookie Preferences button; `src/app/home/home.ts:31-33` calls `showCookiePreferences()`. `src/lib/cookieConsent.ts:252-261` initializes on demand and opens the preferences modal. The singleton promise at lines 115-126 prevents duplicate initializations; the geo decision is cached in session storage, with failures defaulting to required consent (lines 91-113). Initialization configures opt-in/opt-out and category defaults (lines 121-157), and first-consent/change callbacks map the accepted analytics category to Consent Mode updates (lines 158-168). The banner component initializes GTM and consent on application startup (`src/app/components/cookie-consent-banner.component.ts:10-21`).

The traced path presents preferences even when the geo decision has not yet been made: lazy initialization awaits that decision before invoking the modal. Failed geo lookup resolves conservatively to the required/opt-in path. Existing consent lifecycle is also covered by open PR #4, whose changed paths include `src/lib/cookieConsent.ts`; no overlapping code edits were made. Audited concern was whether a footer request could skip geo/consent setup or initialize twice; the awaited shared initializer prevents both in the inspected path. No reproducible invariant violation was established.

## Limits

CodeGraph reported that this checkout is not indexed; focused source inspection was used. Third-party `vanilla-cookieconsent` runtime behavior and live browser behavior were not independently exercised. No tests or builds were run.

## Verification and timing

- Test authored: none. No test command applicable.
- Tests/builds/lint/type-check: **NOT RUN BY BUGHUNTER**.
- Patch hygiene: `git diff --check`.
- Audit began in this continuation at 2026-10-17 20:43:48 UTC (2026-10-18 02:13:48 IST) and ended at 2026-10-17 20:44:00 UTC (2026-10-18 02:14:00 IST); measured duration: 12 seconds. This excludes preflight.
