# Angular host theme toggle audit

- Run: `20261017T151239Z-55d949525fa149fc99020b05e3d5ac30`
- Scope: Angular example root-route host theme toggle and propagation to the embedded Qrati component.
- Base: `origin/main` at `d4b48ec9fd6a0e86640e7c3900edc15112e37090`.
- Disposition: Report-only; no confirmed defect.

## Workflow and evidence

The `/` route renders `Home` (`src/app/app.routes.ts:4-6`). The theme button calls `Home.toggleTheme()` (`src/app/home/home.html:2-9`, `src/app/home/home.ts:27-29`). `ThemeService` initializes from a valid saved `qc-theme` value, otherwise checks the system preference, and safely defaults to light when browser media-query support is absent (`src/app/theme/theme.service.ts:17-28`). Toggle updates the Angular signal, document root class and `data-theme`, then attempts to persist the value (`:30-41`). Storage exceptions are intentionally tolerated. The same signal binds to the widget's `theme` attribute (`src/app/home/home.html:56-61`), giving the host and embedded widget one selected mode.

Traced browser path: bootstrap (`src/main.ts`) → root router outlet (`src/app/app.html`) → home component → theme service → document state/storage and widget attribute. The relevant current open PR #4 modifies only `src/lib/cookieConsent.ts`, its spec, and consent docs; PR #2 is consent audit documentation. Neither overlaps this theme workflow. No source/test edits were warranted.

## Finding

No confirmed defect. The reachable normal and storage-unavailable paths maintain a coherent selected theme across the host and widget. This review did not establish behavior for a live system-preference change after initial load; the feature exposes an explicit toggle and initializes from the current preference, so absence of a `matchMedia` change listener is not established as a contract violation. No issue created.

## Tests and limitations

No regression test authored: no confirmed bug. Existing application spec coverage does not directly assert the theme workflow; adding test coverage without a defect was outside this narrow audit. Tests/build/lint/type-check were **NOT RUN BY BUGHUNTER**.

## Timing

- Preflight: 2026-10-17 15:12:18–15:12:39 UTC (20:42:18–20:42:39 IST), 21 seconds, supplied by the run preflight.
- Audit and delivery preparation: 2026-10-17 15:12:39–15:13:44 UTC (20:42:39–20:43:44 IST), 65 seconds, measured from run start and terminal timestamp.
- Total: 2026-10-17 15:12:18–15:13:44 UTC (20:42:18–20:43:44 IST), 86 seconds.

## Delivery

Report-only PR; no issue link. CI/check results are recorded separately from local execution and must be read back from the PR after opening.
