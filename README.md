# Qrati Connect — Angular Example

[![Qrati Connect — embeddable event photo galleries](public/qrati-connect-og.png)](https://qrati.com/connect)

Build live event photo galleries into Angular applications with guest uploads, full-screen lightbox, emoji reactions, and photo-contest leaderboards. [Explore Qrati Connect](https://qrati.com/connect) or [view the live Angular example](https://qrati.com/connect/angular-example).

Embeds [Qrati Connect](https://qrati.com) into an Angular application using the
framework-agnostic **web component** (`<qrati-connect>`), with host-controlled
light/dark theme synchronization, full SEO optimization, and zero backend configuration.

## Integration method: Web Component

Angular supports custom elements natively via `CUSTOM_ELEMENTS_SCHEMA`. Load the web component bundle and styles once on `ngAfterViewInit`, then render `<qrati-connect>` directly in your Angular template:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { ORGANIZATION_ID, QRATI_SCRIPT_URL } from './config';

@Component({
  selector: 'app-event-gallery',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <qrati-connect
      [attr.organization-id]="orgId"
      [attr.theme]="theme()"
      router="hash"
    ></qrati-connect>
  `,
})
export class EventGalleryComponent implements AfterViewInit, OnDestroy {
  readonly orgId = ORGANIZATION_ID;
  readonly theme = signal<'light' | 'dark'>('light');

  private scriptEl?: HTMLScriptElement;

  ngAfterViewInit(): void {
    const styleUrl = QRATI_SCRIPT_URL.replace(/\/web\.es\.js$/, '/styles.css');
    if (!document.querySelector(`link[href="${styleUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleUrl;
      document.head.appendChild(link);
    }

    const s = document.createElement('script');
    s.type = 'module';
    s.src = QRATI_SCRIPT_URL;
    document.head.appendChild(s);
    this.scriptEl = s;
  }

  ngOnDestroy(): void {
    this.scriptEl?.remove();
  }
}
```

## Features

- **Drop-in Web Component**: Native Angular support for custom elements via `CUSTOM_ELEMENTS_SCHEMA` with reactive attribute bindings.
- **Live Event Photo Wall**: Responsive masonry grid layout, blurhash loading placeholders, and full-screen lightbox with keyboard navigation.
- **Guest Media Uploads**: Attendees scan a QR code to upload photos and videos directly with automatic client-side compression and HEIC conversion.
- **Interactive Reactions & Leaderboards**: Live emoji reactions, star ratings, and real-time contest rankings.
- **Host Theme Control**: Signal-based light and dark mode synchronization.
- **GDPR & Consent Mode v2**: Integrated cookie consent banner with EU/EEA geo-lookup and Google Consent Mode v2 support.
- **Cloudflare Subpath Routing**: Configured for `/connect/angular-example/` with SPA fallback and runtime GTM handling.

## Run Locally

```bash
pnpm install
cp .env.example .env   # optional — sensible defaults are baked in
pnpm dev
```

## Build & Deploy

```bash
# Build production client bundle
pnpm build

# Preview locally with Wrangler
pnpm preview

# Deploy to Cloudflare Workers
pnpm run deploy
```

## Other Integration Methods

- **React Component** — `import QratiConnect from '@qratilabs/qrati-connect'` (see the React, Next.js, and Preact examples).
- **Web Component** — `<qrati-connect>` (see the Svelte, Vue, Solid, Qwik, and Lit examples).
- **Embed (no-code)** — single `<script>` tag with `data-*` attributes (see the Vanilla JS, Marko, and Ember examples).

Docs: <https://www.npmjs.com/package/@qratilabs/qrati-connect>
