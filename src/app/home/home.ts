import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { EXAMPLE_ORG_ID, QRATI_SCRIPT_URL } from '../config';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../theme/theme.service';



const GITHUB_ORG = 'qrati-labs';
const REPO = 'qrati-connect-angular-example';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly theme = inject(ThemeService);

  readonly orgId = EXAMPLE_ORG_ID;
  readonly repoUrl = `https://github.com/${GITHUB_ORG}/${REPO}`;
  readonly vscodeUrl = `https://vscode.dev/github/${GITHUB_ORG}/${REPO}`;
  readonly currentYear = new Date().getFullYear();

  readonly userId = computed(() => this.auth.user()?.userId ?? null);
  readonly fname = computed(() => {
    const name = this.auth.user()?.fullName?.trim();
    if (!name) return null;
    return name.split(/\s+/)[0];
  });
  readonly lname = computed(() => {
    const parts = this.auth.user()?.fullName?.trim().split(/\s+/) ?? [];
    return parts.length > 1 ? parts.slice(1).join(' ') : null;
  });

  private scriptEl?: HTMLScriptElement;
  private ownsScript = false;

  readonly themeMode = this.theme.theme;



  ngAfterViewInit(): void {
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
