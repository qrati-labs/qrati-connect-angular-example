# BugHunter: Angular consent startup overrides saved analytics rejection

- Run: `20261016T173938Z-2a918f30e4524d07b517542139d664b6`
- Repository: `qrati-labs/qrati-connect-angular-example`
- Workflow boundary: startup cookie-consent initialization and Consent Mode updates (`src/app/components/cookie-consent-banner.component.ts` → `src/lib/cookieConsent.ts`).
- Base: `origin/main` at `d4b48ec9fd6a0e86640e7c3900edc15112e37090`.
- Related open PR #2 changes only BugHunter docs; no runtime-path overlap. Its checks were both successful when observed (GitGuardian Security Checks; Workers Builds).
- Issue: https://github.com/qrati-labs/qrati-connect-angular-example/issues/3

## Finding

**[P2] Startup overwrites saved analytics opt-out outside opt-in regions.** On page startup the app initializes GTM before geo lookup and consent-library initialization. `initGtm()` previously issued global `granted` defaults and then regional EEA/UK/CH denials. For a non-opt-in region, `ensureCookieConsentInitialized(false)` additionally issued an unconditional analytics/ad grant before `CookieConsent.run()` read the visitor's saved category. This could reactivate tracking against a previously saved reject choice.

Evidence: `src/lib/cookieConsent.ts` (GTM defaults in `initGtm`; unconditional grant before `CookieConsent.run`; consent callbacks use `acceptedCategory('analytics')`). The banner component calls `initGtm()` before checking geo and initializing CookieConsent (`src/app/components/cookie-consent-banner.component.ts:10-21`). The CookieConsent configuration reference documents `onConsent` as running on the initial consent action and subsequent page loads: https://cookieconsent.orestbida.com/reference/configuration-reference.html. Callback semantics: https://cookieconsent.orestbida.com/advanced/callbacks-events.html.

## Fix

Set all Consent Mode defaults to denied globally before appending GTM. After consent initialization, map the stored analytics category to both analytics and ad signals; for a first-time visitor in an opt-out region, apply the enabled category only when no consent cookie existed before initialization. This preserves stored rejection and keeps first-visit opt-out behavior.

## Regression coverage

Added `src/lib/cookieConsent.spec.ts`:
- asserts Consent Mode starts denied and no grant/update occurs before consent initialization, then verifies persisted rejection remains denied;
- verifies persisted acceptance is restored through the consent callback;
- verifies an opt-out-region first visit receives a grant only when no consent cookie existed before initialization.

Intended command: `pnpm exec vitest run src/lib/cookieConsent.spec.ts` — **NOT RUN BY BUGHUNTER**. No tests, builds, lint, type-checks, installs, or package manager commands were run. `git diff --cached --check` passed.

- PR: https://github.com/qrati-labs/qrati-connect-angular-example/pull/4 (open; mergeability `UNKNOWN` on final read-back; base `main` at `d4b48ec9fd6a0e86640e7c3900edc15112e37090`; head `01b06d2b8c3f164a96b8ccfb37609d77726df853`; verified `Fixes #3` and closing issue reference).

## Limitations and disposition

The regression tests were authored but not executed per BugHunter's execution boundary. The PR's Workers Builds check was in progress at the one observed PR check read (started `2026-10-16T17:44:57Z`); no test result was available. A documentation-only follow-up may trigger another check run; that later state was not checked. No production state was changed and the PR will not be merged.

## Timing

- Start: `2026-10-16T17:39:38Z` / `2026-10-16 23:09:38 IST` (injected preflight start).
- End: `2026-10-16T17:45:42Z` / `2026-10-16 23:15:42 IST`.
- Total elapsed: 364 seconds (6m 04s).
- Phase-level durations: not captured; not estimated or backfilled.
