# Qrati Connect — Angular Example

An Angular example that embeds the **Qrati Connect** web component from the CDN inside a branded host page.

The current demo includes:

- A host-side light/dark mode toggle that updates the widget `theme`
- External links to the example source and web editors
- Footer marketing links
- Support for both standard Qrati auth and host-provided custom auth

## Quick Start

```bash
pnpm install
cp .env.example .env   # then edit as needed
pnpm start
```

Open [http://localhost:4200](http://localhost:4200) to view the example.

The app redirects to `/login` on first load. Enter any email and full name to log in — no real credentials are required.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values. The app reads config from `src/app/config.ts` using Angular Vite env variables with sensible defaults.

```bash
NG_APP_ORGANIZATION_ID=your_organization_id
NG_APP_CDN_URL=https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect@latest/element/web.es.js
NG_APP_API_ENDPOINT=https://your-backend.example.com/api/qrati/demo-login
```

| Variable | Required | Description |
| --- | --- | --- |
| `NG_APP_ORGANIZATION_ID` | No | Organization ID for the embedded widget. Falls back to the demo org ID if omitted. |
| `NG_APP_CDN_URL` | No | CDN URL for the Qrati Connect element bundle. Falls back to the public jsDelivr URL if omitted. |
| `NG_APP_API_ENDPOINT` | No | URL to POST login data (`userId`, `email`, `fullName`) to on form submit. Falls back to `https://qrati.com/api/qrati/demo-login` if omitted. The response body is ignored — auth state is set from form data regardless of the API result. |

## How It Works

### 1. Resolve config in `config.ts`

```ts
const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

export const EXAMPLE_ORG_ID   = env['NG_APP_ORGANIZATION_ID'] || 'your_default_org_id';
export const QRATI_SCRIPT_URL = env['NG_APP_CDN_URL'] || 'https://cdn.jsdelivr.net/...';
export const USER_LOGIN_API   = env['NG_APP_API_ENDPOINT'] || 'https://qrati.com/api/qrati/demo-login';
```

### 2. Login flow

The app uses an `AuthService` backed by Angular Signals and `localStorage`.

**Login page** (`/login`) collects email and full name, then:

1. Computes a deterministic `userId` from the email using a djb2 hash — same email always produces the same 8-character hex string, with no async round-trip needed.
2. POSTs `{ userId, email, fullName }` to `NG_APP_API_ENDPOINT`.
3. Sets the `AuthUser` signal regardless of the API response (the response body is ignored; a network error falls back silently).
4. Persists `{ email, fullName, userId }` to `localStorage` under `qc-auth-user`.
5. Navigates to `/`.

**Auth guard** on `/` redirects to `/login` if no user is present. On page refresh, `AuthService` rehydrates from `localStorage` automatically.

**Logout** clears the signal and `localStorage`, then navigates back to `/login`.

### 3. Pass user identity to the widget

After login the `HomeComponent` reads the auth signal and passes user attributes down to the widget:

```html
<qrati-connect
  [attr.organization-id]="orgId"
  [attr.theme]="themeMode()"
  [attr.user-id]="userId()"
  [attr.fname]="fname()"
  [attr.lname]="lname()"
  router="hash"
></qrati-connect>
```

`fname` is the first whitespace-delimited word of `fullName`; `lname` is the remainder. All three attributes are omitted from the DOM (bound to `null`) when no user is logged in.

### 4. Register the web component bundle

The `HomeComponent` injects the CDN script once on `ngAfterViewInit` and removes it on `ngOnDestroy`:

```ts
ngAfterViewInit(): void {
  const s = document.createElement('script');
  s.type = 'module';
  s.src = QRATI_SCRIPT_URL;
  document.head.appendChild(s);
}
```

`CUSTOM_ELEMENTS_SCHEMA` is enabled so Angular accepts the `<qrati-connect>` custom element.

### 5. Control theme from the host page

The Angular host page maintains its own `light` or `dark` state, stores it in `localStorage` under `qc-theme`, toggles the document theme class, and passes the same value down to the widget through `[attr.theme]`.

## Props

### Core Props

Use these in every integration.

| Prop | Required | Default | Description |
| --- | --- | --- | --- |
| `organization-id` | Yes | — | Your Qrati organization ID |
| `theme` | No | `light` | Widget theme: `light` or `dark` |
| `router` | No | `memory` | Navigation mode: `memory` or `hash` |

### Custom Auth Props

Use these only when the target Qrati organization is configured for custom auth.

| Prop | Required in Custom Auth Mode | Description |
| --- | --- | --- |
| `user-id` | Yes | Stable user ID from your host application |
| `fname` | Yes | User first name |
| `lname` | Yes | User last name |

When custom auth is enabled, pass all three props together:

```html
<qrati-connect
  [attr.organization-id]="orgId"
  [attr.user-id]="userId()"
  [attr.fname]="fname()"
  [attr.lname]="lname()"
  [attr.theme]="themeMode()"
  router="hash"
></qrati-connect>
```

If custom auth is enabled and one of `user-id`, `fname`, or `lname` is missing, the widget treats the configuration as invalid.

## Authentication Modes

### Standard Qrati Auth

If you only provide `organization-id` and optional UI props such as `theme` and `router`, Qrati Connect uses its built-in authentication flow.

### Custom Auth

If your organization is configured for custom auth, the host Angular app must provide `uid`, `fname`, and `lname`. Qrati Connect then uses that host-provided identity rather than the built-in login flow.

## Tech Stack

- **Angular 21** — standalone components, `provideRouter`, `provideHttpClient`
- **TypeScript 5**
- **Angular Signals** — auth state, theme state, derived computed values
- **Angular Router** — `/login` + `/` with functional auth guard
- **HttpClient** — login API POST with RxJS `catchError` fallback
- **localStorage** — auth and theme persistence across page refreshes
- **Qrati Connect web component** loaded from CDN

## Learn More

- [Qrati Connect on npm](https://www.npmjs.com/package/@qratilabs/qrati-connect)
- [Angular documentation](https://angular.dev)
- [Qrati website](https://qrati.com)

---

### Open It In

[View on GitHub](https://github.com/qrati-labs/qrati-connect-angular-example)

[Open in StackBlitz](https://stackblitz.com/github/qrati-labs/qrati-connect-angular-example)

[Open in CodeSandbox](https://codesandbox.io/s/github/qrati-labs/qrati-connect-angular-example)

[Open in VS Code](https://vscode.dev/github/qrati-labs/qrati-connect-angular-example)

---

### About Qrati

**Qrati** helps organizations run more engaging event experiences with embeddable discovery, participation, and feedback tools that fit directly into their own products.
