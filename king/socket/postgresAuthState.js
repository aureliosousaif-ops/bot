'use strict';

const { Pool } = require('pg');
const { initAuthCreds, BufferJSON } = require('mrxd-baileys');

const TABLE = 'whatsapp_auth_state';

function createPool(connectionString) {
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada para autenticação PostgreSQL.');
  }

  return new Pool({
    connectionString,
    max: Number(process.env.WHATSAPP_AUTH_PG_POOL_MAX || 1),
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
    statement_timeout: 15000,
    ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
  });
}

async function usePostgresAuthState(connectionString, sessionId = 'default') {
  const pool = createPool(connectionString);
  const normalizedSessionId = String(sessionId || 'default').replace(/[^a-zA-Z0-9_.:-]/g, '_');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      session_id TEXT NOT NULL,
      auth_key TEXT NOT NULL,
      auth_value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (session_id, auth_key)
    )
  `);

  const read = async (authKey) => {
    const result = await pool.query(
      `SELECT auth_value FROM ${TABLE} WHERE session_id = $1 AND auth_key = $2`,
      [normalizedSessionId, authKey],
    );
    if (!result.rows[0]) return null;
    return JSON.parse(JSON.stringify(result.rows[0].auth_value), BufferJSON.reviver);
  };

  const write = async (authKey, value) => {
    await pool.query(
      `
        INSERT INTO ${TABLE} (session_id, auth_key, auth_value, updated_at)
        VALUES ($1, $2, $3::jsonb, NOW())
        ON CONFLICT (session_id, auth_key)
        DO UPDATE SET auth_value = EXCLUDED.auth_value, updated_at = NOW()
      `,
      [normalizedSessionId, authKey, JSON.stringify(value, BufferJSON.replacer)],
    );
  };

  const remove = async (authKey) => {
    await pool.query(
      `DELETE FROM ${TABLE} WHERE session_id = $1 AND auth_key = $2`,
      [normalizedSessionId, authKey],
    );
  };

  const creds = (await read('creds')) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const result = {};
          for (const id of ids) {
            const value = await read(`${type}-${id}`);
            if (value) result[id] = value;
          }
          return result;
        },
        set: async (data) => {
          for (const [type, entries] of Object.entries(data || {})) {
            for (const [id, value] of Object.entries(entries || {})) {
              const authKey = `${type}-${id}`;
              if (value) await write(authKey, value);
              else await remove(authKey);
            }
          }
        },
      },
    },
    saveCreds: async () => write('creds', creds),
    close: async () => pool.end(),
  };
}

module.exports = { usePostgresAuthState };
