import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { ORGANIZATION_ID, QRATI_SCRIPT_URL, GITHUB_ORG, REPO } from '../config';
import { ThemeService } from '../theme/theme.service';
import { showCookiePreferences } from '../../lib/cookieConsent';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  private readonly theme = inject(ThemeService);

  readonly orgId = ORGANIZATION_ID;
  readonly repoUrl = `https://github.com/${GITHUB_ORG}/${REPO}`;
  readonly vscodeUrl = `https://vscode.dev/github/${GITHUB_ORG}/${REPO}`;
  readonly npmUrl = 'https://www.npmjs.com/package/@qratilabs/qrati-connect';
  readonly currentYear = new Date().getFullYear();

  readonly themeMode = this.theme.theme;

  private scriptEl?: HTMLScriptElement;
  private ownsScript = false;

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  openCookiePreferences(): void {
    showCookiePreferences();
  }

  ngAfterViewInit(): void {
    const styleUrl = QRATI_SCRIPT_URL.replace(/\/web\.es\.js$/, '/styles.css');
    if (!document.querySelector(`link[href="${styleUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleUrl;
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector(`script[src="${QRATI_SCRIPT_URL}"]`);
    if (existingScript instanceof HTMLScriptElement) {
      this.scriptEl = existingScript;
      return;
    }

    const s = document.createElement('script');
    s.type = 'module';
    s.src = QRATI_SCRIPT_URL;
    document.head.appendChild(s);
    this.scriptEl = s;
    this.ownsScript = true;
  }

  ngOnDestroy(): void {
    if (this.ownsScript) {
      this.scriptEl?.remove();
    }
  }
}
