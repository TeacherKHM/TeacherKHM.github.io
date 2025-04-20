require('dotenv').config();
const { cleanEnv, str } = require('envalid');
const { createClient } = require('@libsql/client');

const env = cleanEnv(process.env, {
  TURSO_DB_URL: str(),
  TURSO_DB_AUTH_TOKEN: str()
});

const db = createClient({
  url: env.TURSO_DB_URL,
  authToken: env.TURSO_DB_AUTH_TOKEN
});

module.exports = db;
