import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieConsentBannerComponent } from './components/cookie-consent-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CookieConsentBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
