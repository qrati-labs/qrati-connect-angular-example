const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

const DEFAULT_EXAMPLE_ORG_ID = '69ad9c7876d8bf6f864b3a65';
const DEFAULT_QRATI_SCRIPT_URL =
  'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect@latest/element/web.es.js';

export const EXAMPLE_ORG_ID = env['NG_APP_ORGANIZATION_ID'] || DEFAULT_EXAMPLE_ORG_ID;
export const QRATI_SCRIPT_URL = env['NG_APP_CDN_URL'] || DEFAULT_QRATI_SCRIPT_URL;
export const USER_LOGIN_API = env['NG_APP_API_ENDPOINT'] || 'https://qrati.com/api/qrati/demo-login';
