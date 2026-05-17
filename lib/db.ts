import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || '';
let pool: Pool | null = null;
if (!connectionString) {
  console.warn('DATABASE_URL not set — Postgres client not initialized.');
} else {
  pool = new Pool({ connectionString });
}

// Initialize minimal schema if not exists (safe for dev)
async function init() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      email text UNIQUE NOT NULL,
      password text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS drops (
      id uuid PRIMARY KEY,
      code text,
      lat numeric,
      lng numeric,
      radius text,
      message text,
      created_by uuid REFERENCES users(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

init().catch((e) => console.error('DB init error', e));

export async function query(text: string, params?: any[]) {
  if (!pool) throw new Error('DATABASE_URL not configured. Set DATABASE_URL in your environment.');
  return pool.query(text, params);
}

export default { pool, query };
