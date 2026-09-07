const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

export const ORGANIZATION_ID = env['NG_APP_ORGANIZATION_ID'] || '69ad9c7876d8bf6f864b3a65';
export const QRATI_SCRIPT_URL =
  env['NG_APP_CDN_URL'] ||
  'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect@latest/element/web.es.js';

export const GITHUB_ORG = 'qrati-labs';
export const REPO = 'qrati-connect-angular-example';

export const EXAMPLE_ORG_ID = ORGANIZATION_ID;
