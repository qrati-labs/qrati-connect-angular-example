// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

const cookieConsent = vi.hoisted(() => ({
  run: vi.fn(),
  acceptedCategory: vi.fn(),
  validCookie: vi.fn(),
  showPreferences: vi.fn(),
}));

vi.mock('vanilla-cookieconsent', () => cookieConsent);

afterEach(() => {
  vi.clearAllMocks();
  document.head.innerHTML = '';
  window.dataLayer = [];
  window.gtag = undefined;
});

async function initializeWithStoredChoice(accepted: boolean, hasStoredCookie = true) {
  vi.resetModules();
  cookieConsent.acceptedCategory.mockReturnValue(accepted);
  cookieConsent.validCookie.mockReturnValue(hasStoredCookie);
  cookieConsent.run.mockResolvedValue(undefined);

  const { initGtm, ensureCookieConsentInitialized } = await import('./cookieConsent');
  initGtm('GTM-TEST');
  const defaults = window.dataLayer?.find(
    (entry) => Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'default',
  ) as unknown[] | undefined;

  await ensureCookieConsentInitialized(false);
  const config = cookieConsent.run.mock.calls[0]?.[0] as { onConsent: () => void };
  return { defaults, config, layer: window.dataLayer ?? [] };
}

describe('cookie consent startup', () => {
  it('keeps a saved analytics rejection denied before and after consent initialization', async () => {
    const { defaults, config, layer } = await initializeWithStoredChoice(false);

    expect(defaults?.[2]).toMatchObject({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    expect(layer.some((entry) => Array.isArray(entry) && entry[1] === 'update')).toBe(false);
    expect(document.getElementById('gtm-script')).not.toBeNull();

    config.onConsent();
    const update = layer.find(
      (entry) => Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'update',
    ) as unknown[] | undefined;
    expect(update?.[2]).toMatchObject({
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  });

  it('restores a saved analytics acceptance through the consent callback', async () => {
    const { config, layer } = await initializeWithStoredChoice(true);

    config.onConsent();
    const update = layer.find(
      (entry) => Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'update',
    ) as unknown[] | undefined;
    expect(update?.[2]).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'granted',
    });
  });

  it('grants enabled analytics for a first-time visitor in an opt-out region', async () => {
    const { layer } = await initializeWithStoredChoice(true, false);

    const update = layer.find(
      (entry) => Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'update',
    ) as unknown[] | undefined;
    expect(update?.[2]).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'granted',
    });
  });
});
