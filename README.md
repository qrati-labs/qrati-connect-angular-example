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
pnpm start
```

Open [http://localhost:4200](http://localhost:4200) to view the example.

## Environment Variables

The app reads its runtime config from `src/app/config.ts`, which in turn uses Angular Vite env variables with sensible defaults.

```bash
NG_APP_EXAMPLE_ORG_ID=your_organization_id
NG_APP_QRATI_SCRIPT_URL=https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect@latest/element/web.es.js
```

| Variable | Required | Description |
| --- | --- | --- |
| `NG_APP_EXAMPLE_ORG_ID` | No | Organization ID for the embedded widget. Falls back to the demo org ID if omitted. |
| `NG_APP_QRATI_SCRIPT_URL` | No | CDN URL for the Qrati Connect element bundle. Falls back to the public jsDelivr URL if omitted. |

## How It Works

### 1. Resolve config in `config.ts`

```ts
const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;

export const EXAMPLE_ORG_ID = env['NG_APP_EXAMPLE_ORG_ID'] || 'your_default_org_id';
export const QRATI_SCRIPT_URL =
  env['NG_APP_QRATI_SCRIPT_URL'] ||
  'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect@latest/element/web.es.js';
```

### 2. Register the web component bundle

The app injects the CDN script after the root component mounts:

```ts
ngAfterViewInit(): void {
  const s = document.createElement('script');
  s.type = 'module';
  s.src = QRATI_SCRIPT_URL;
  document.head.appendChild(s);
}
```

`CUSTOM_ELEMENTS_SCHEMA` is enabled so Angular accepts the `<qrati-connect>` custom element.

### 3. Bind the element attributes from Angular

```html
<qrati-connect
  [attr.organization-id]="orgId"
  [attr.theme]="theme()"
  router="hash"
></qrati-connect>
```

### 4. Control theme from the host page

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
| `uid` | Yes | Stable user ID from your host application |
| `fname` | Yes | User first name |
| `lname` | Yes | User last name |

When custom auth is enabled, pass all three props together:

```html
<qrati-connect
  [attr.organization-id]="orgId"
  uid="user_123"
  fname="Ada"
  lname="Lovelace"
  [attr.theme]="theme()"
  router="hash"
></qrati-connect>
```

If custom auth is enabled and one of `uid`, `fname`, or `lname` is missing, the widget treats the configuration as invalid.

## Authentication Modes

### Standard Qrati Auth

If you only provide `organization-id` and optional UI props such as `theme` and `router`, Qrati Connect uses its built-in authentication flow.

### Custom Auth

If your organization is configured for custom auth, the host Angular app must provide `uid`, `fname`, and `lname`. Qrati Connect then uses that host-provided identity rather than the built-in login flow.

## Tech Stack

- **Angular 21**
- **TypeScript 5**
- **Signals** for host-side theme state
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
