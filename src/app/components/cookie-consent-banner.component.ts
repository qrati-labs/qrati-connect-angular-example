import { Component, OnInit } from '@angular/core';
import { checkConsentRequired, ensureCookieConsentInitialized, initGtm } from '../../lib/cookieConsent';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  template: '',
})
export class CookieConsentBannerComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    initGtm((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.['NG_APP_GTM_ID']);
    try {
      const required = await checkConsentRequired();
      if (required) {
        await ensureCookieConsentInitialized(true);
      } else {
        await ensureCookieConsentInitialized(false);
      }
    } catch {
      await ensureCookieConsentInitialized(true);
    }
  }
}
