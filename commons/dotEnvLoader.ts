const DOT_ENV_KEYS = [
  'DATABASE_PROTOCOL',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',

  'TOKEN_SECRET_KEY',
  'APP_PORT',
  'APP_LOCAL_HOST',
  'APP_PRODUCTION_HOST',

  'PAYU_CLIENT_ID',
  'PAYU_CLIENT_SECRET',
  'PAYU_AUTH_URL',
  'PAYU_ORDERS_URL',
  'PAYU_PAYMENT_METHODS_URL',

  'EMAIL_HOST',
  'EMAIL_SMTP_PORT',
  'EMAIL_HTTP_PORT',
  'EMAIL_FROM',
] as const;
type TDotEnv = {
  [key in typeof DOT_ENV_KEYS[number]]: key;
};

import { config as dotenvConfig } from 'dotenv';

const _env = dotenvConfig().parsed;
if (!_env) {
  throw Error('_env is undefined!');
}

const emptyEnvVars = Object.entries(_env).filter(([key, value]) => !value);
if (emptyEnvVars.length) {
  throw Error(`Some env variables are empty! [ ${emptyEnvVars.map(([key]) => key).join(', ')} ]`);
}

const envKeys = Object.keys(_env);
const requiredKeys: string[] = [...DOT_ENV_KEYS];
const divergedKeys = [
  ...envKeys.filter((key) => !requiredKeys.includes(key)),
  ...requiredKeys.filter((key) => !envKeys.includes(key)),
];
if (divergedKeys.length) {
  throw Error(`Some env variables diverged! [ ${divergedKeys.join(', ')} ]`);
}

export const dotEnv = _env as TDotEnv;
