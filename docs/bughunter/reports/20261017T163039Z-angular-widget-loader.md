# Angular example: widget loader workflow audit

- **Run:** `20261017T163039Z-c726fefcf1f0420faa09d5556967e4c8`
- **Scope:** `Home.ngAfterViewInit` loads the Qrati web-component stylesheet and script; `Home.ngOnDestroy` removes a script it owns. Configuration comes from `src/app/config.ts`; the root route mounts `Home`.
- **Base:** `origin/main` at `d4b48ec9fd6a0e86640e7c3900edc15112e37090`.
- **Disposition:** Report-only; no confirmed defect. No issue or source changes.

## Trace and evidence

- `src/app/app.routes.ts` routes `/` to `Home`, so the loader is reached on the primary example page.
- `src/app/home/home.ts:35-56` derives the stylesheet URL by replacing the terminal `/web.es.js`, inserts a missing stylesheet link, checks for an existing script with the exact configured URL, otherwise appends a module script and records ownership.
- `src/app/home/home.ts:58-62` removes only a script created by this component. A pre-existing script is left intact.
- `src/app/config.ts:3-6` selects the organization ID and CDN URL from build-time environment values, falling back to the jsDelivr `@latest` URL. The empty organization ID is passed through to the widget as an attribute; available repository evidence does not specify the widget's behavior for that value.
- The route inventory contains only the home page and wildcard redirect. No alternate in-repository route/caller or local integration contract establishes a failing behavior for this loader. The Angular example PRs inspected were the theme-toggle audit (#5), whose changed paths are report/index docs only, and consent fix (#4), whose source changes are consent-specific; neither establishes an overlapping widget-loader defect. Theme and consent are not part of this audit.

## Finding

No confirmed defect. The loader behavior and cleanup are internally consistent for the single routed `Home` component. The external CDN request, custom-element registration semantics, and behavior on network/load failure are outside this source tree and were not experimentally tested; these remain limitations, not findings.

## Tests and validation

No regression test was authored because no defect was confirmed. Tests, builds, lint, type checks, installs, and package-manager commands were **NOT RUN BY BUGHUNTER**. `git diff --check` is the only patch-hygiene validation intended.

## Timing

- Run start: `2026-10-17T16:30:39Z` (22:00:39 IST)
- Report completion: `2026-10-17T16:32:38Z` (22:02:38 IST)
- Measured total: `00:01:59` (22:00:39–22:02:38 IST)
- Phase breakdown: not recorded at phase boundaries; intentionally not estimated or backfilled.
