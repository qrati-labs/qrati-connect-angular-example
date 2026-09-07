import { Component, OnInit } from '@angular/core';
import { checkConsentRequired, ensureCookieConsentInitialized } from '../../lib/cookieConsent';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  template: '',
})
export class CookieConsentBannerComponent implements OnInit {
  async ngOnInit(): Promise<void> {
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
