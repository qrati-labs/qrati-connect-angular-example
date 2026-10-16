# BugHunter audit: Angular example cookie-consent initialization

- Run ID: `20261016T095038Z-e895c2d343724765a85bf5f30b2d0616`
- Reviewed repository: `qrati-labs/qrati-connect-angular-example`
- Reviewed base: `origin/main` at `d4b48ec9fd6a0e86640e7c3900edc15112e37090`
- Workflow: visitor geo lookup → GTM Consent Mode defaults → consent UI initialization and updates.
- Selection: clean, freshly fetched Angular example with no open PRs in preflight inventory; its workflow provides a bounded cross-layer consent journey. No overlap was identified. Branch: `bughunter/angular-login-audit-20261016`.
- Scope: `src/app/components/cookie-consent-banner.component.ts`, `src/lib/cookieConsent.ts`, app mounting, and `src/app/app.spec.ts`. No API implementation exists in this example; geo lookup calls the cross-repository `qrati.com/api/cookie-consent-geo` contract. No production or server-side behavior was modified.

## Result

No confirmed defect was established. The loader queues a global default and an EU/EEA/UK/CH regional denied default before appending GTM; region-specific defaults are an explicitly supported Consent Mode approach, and Google describes the unscoped default as applying outside regions covered by a regional rule.[1] This audit did not independently validate the geo endpoint's response or actual geographic targeting in a browser, so those remain outside scope rather than assumed correct.

Severity: none confirmed. Disposition: report-only; no issue or code change created. An all-in-one `initPromise` means consent initialization is shared within the page lifetime; no reachable conflicting caller was demonstrated in the inspected usage, so this was not elevated to a finding.

## Evidence and coverage

- `CookieConsentBannerComponent.ngOnInit` invokes `initGtm` before geo resolution, then initializes consent with the resolved `required` value; its fallback selects `true`.
- `checkConsentRequired` reads a session cache, fetches the geo endpoint with `cache: 'no-store'`, caches successful responses, and fails closed to `true` on exceptions or non-OK HTTP responses.
- `ensureCookieConsentInitialized` runs the consent library once and maps analytics choices to Consent Mode updates.
- `src/app/app.spec.ts` only checks app creation; focused consent logic has no direct regression tests in the inspected test inventory. This is a test gap, not evidence of incorrect runtime behavior.
- Unit: app smoke test exists; no dedicated consent tests found. Integration/E2E: none found in this repository. No coverage measurement available.

## Research

Google Tag Platform documentation says to scope default settings to regions where consent banners apply and explains that a default command without a region covers visitors not covered by a regional command.[1] This contextualizes the source implementation; it is not a legal compliance opinion. Accessed 2026-10-16. The configured web extractor could not fetch page body, so research is limited to the official documentation search result description.

## Validation

- `git diff --check`: permitted patch-hygiene check only; to be run before commit.
- Tests/build/lint/type-check/package-manager commands: NOT RUN BY BUG HUNTER (cron policy).
- Intended developer/CI test command: `pnpm test` (script resolves to `ng test --watch=false`; not run here).
- Issue: none (report-only).
- PR: [#2](https://github.com/qrati-labs/qrati-connect-angular-example/pull/2), open. At final read-back, GitHub PR API still reported head `7c6bcbb49f111b7cf838e7b820432648aa5c75a7` while `git ls-remote` confirmed the pushed branch at `5d5d2a61b81bf8a1751adf246f54dd3ade0fad37`; API head is stale relative to remote branch. Mergeability was `MERGEABLE`. Current `gh pr checks` response: no checks reported. No issue linkage applies (report-only).

## Timing

Elapsed wall time, UTC; boundary begins at the injected preflight start (`2026-10-16T09:50:39Z`) and ends at `2026-10-16T09:53:53Z`, when the timing record was finalized. Phase durations are recorded by the run timer; no duration is estimated.

| Phase | Elapsed |
|---|---:|
| Preflight | 00:01:08 |
| Graph/scope | 00:00:45 |
| Source review | 00:00:08 |
| Report/PR | 00:00:58 |
| Issue search/create, research, test authoring, implementation, patch review | 00:00:00 (not applicable; report-only) |
| Unclassified gaps | 00:00:16 |
| Total elapsed wall time | 00:03:14 (2026-10-16T09:50:39Z–2026-10-16T09:53:53Z) |

## Sources

[1] https://developers.google.com/tag-platform/security/guides/consent — Set up consent mode on websites | Google for Developers
