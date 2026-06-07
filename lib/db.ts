import { Pool } from 'pg';

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL || '';
  if (!connectionString) {
    console.warn('[DB] DATABASE_URL not set — Postgres client not initialized.');
    return null;
  }

  // Neon and managed Postgres require SSL. Set DATABASE_SSL=false to disable.
  const useSsl = process.env.DATABASE_SSL !== 'false';
  pool = new Pool({ 
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
  
  // Log pool errors
  pool.on('error', (err) => {
    console.error('[DB] Unexpected pool error:', err.message);
  });
  
  console.info('[DB] Pool created (connections will be lazily established on first query)');

  return pool;
}

// Initialize minimal schema (create if not exists, add missing columns)
async function init() {
  const currentPool = getPool();
  if (!currentPool) {
    console.warn('[DB] Pool not initialized, skipping schema init');
    return;
  }
  try {
    console.info('[DB] Initializing schema...');
    
    // Create users table if it doesn't exist
    await currentPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        name text NOT NULL,
        email text UNIQUE NOT NULL,
        password text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);
    
    // Create drops table if it doesn't exist (without FK constraint for dev simplicity)
    await currentPool.query(`
      CREATE TABLE IF NOT EXISTS drops (
        id uuid PRIMARY KEY,
        code text UNIQUE,
        lat numeric,
        lng numeric,
        radius text,
        message text,
        status text DEFAULT 'active',
        is_public boolean NOT NULL DEFAULT false,
        public_name text,
        public_description text,
        created_by uuid,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);
    
    // Create discoveries table to track when users find drops
    await currentPool.query(`
      CREATE TABLE IF NOT EXISTS discoveries (
        id uuid PRIMARY KEY,
        drop_id uuid,
        found_by uuid,
        distance_at_find numeric,
        found_at timestamptz NOT NULL DEFAULT now()
      );
    `);
    
    // Add missing radius column if it doesn't exist (migration for old schema)
    await currentPool.query(`
      ALTER TABLE drops ADD COLUMN IF NOT EXISTS radius text;
    `);
    
    // Add status column if it doesn't exist (migration for new schema)
    await currentPool.query(`
      ALTER TABLE drops ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
    `);

    // Add public visibility flag for public hunt discovery
    await currentPool.query(`
      ALTER TABLE drops ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;
    `);

    // Add optional public listing metadata
    await currentPool.query(`
      ALTER TABLE drops ADD COLUMN IF NOT EXISTS public_name text;
    `);
    await currentPool.query(`
      ALTER TABLE drops ADD COLUMN IF NOT EXISTS public_description text;
    `);
    
    // Drop foreign key constraint if it exists (for dev, we don't enforce FK)
    await currentPool.query(`
      ALTER TABLE drops DROP CONSTRAINT IF EXISTS drops_created_by_fkey CASCADE;
    `).catch(() => {
      // Ignore if constraint doesn't exist
    });
    
    console.info('[DB] Schema initialized');
  } catch (e: any) {
    console.error('[DB] Schema init error:', e?.message || String(e));
    throw e; // Re-throw to ensure init failure is visible
  }
}

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = init();
  }

  return initPromise;
}

export async function query(text: string, params?: any[]) {
  const currentPool = getPool();
  if (!currentPool) {
    console.error('[DB.query] Pool is null - DATABASE_URL may not be configured');
    throw new Error('DATABASE_URL not configured. Set DATABASE_URL in your environment.');
  }
  
  // Wait for schema initialization to complete before running any query
  await ensureInitialized();
  
  try {
    return await currentPool.query(text, params);
  } catch (e: any) {
    console.error('[DB.query] Query failed:', { err: e?.message, code: e?.code });
    throw e;
  }
}

export default { pool, query };
