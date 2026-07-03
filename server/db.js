// PostgreSQL data layer for Nirmaan Sahayak with SQLite fallback.
import pg from 'pg';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';

const connectionString = process.env.DATABASE_URL;
let pool = null;
let sqliteDb = null;
let useSqlite = false;

if (!connectionString) {
  console.warn('[WARN] DATABASE_URL is not set. Falling back to local SQLite database (nirmaan.db).');
  useSqlite = true;
  sqliteDb = new sqlite3.Database('nirmaan.db');
} else {
  const { Pool } = pg;
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
  });
}

// Convert Postgres $1, $2, etc. to SQLite ? placeholders
function convertPgToSqlite(sql) {
  let cleaned = sql.replace(/\$\d+/g, '?');
  cleaned = cleaned.replace(/TIMESTAMPTZ\s+DEFAULT\s+NOW\(\)/gi, 'TEXT DEFAULT CURRENT_TIMESTAMP');
  cleaned = cleaned.replace(/TIMESTAMPTZ/gi, 'TEXT');
  return cleaned;
}

export const dbRun = async (sql, params = []) => {
  if (useSqlite) {
    return new Promise((resolve, reject) => {
      sqliteDb.run(convertPgToSqlite(sql), params, function(err) {
        if (err) return reject(err);
        resolve({ changes: this.changes, rows: [] });
      });
    });
  } else {
    const res = await pool.query(sql, params);
    return { changes: res.rowCount, rows: res.rows };
  }
};

export const dbGet = async (sql, params = []) => {
  if (useSqlite) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(convertPgToSqlite(sql), params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  } else {
    const res = await pool.query(sql, params);
    return res.rows[0];
  }
};

export const dbAll = async (sql, params = []) => {
  if (useSqlite) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(convertPgToSqlite(sql), params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  } else {
    const res = await pool.query(sql, params);
    return res.rows;
  }
};

export const getClient = async () => {
  if (useSqlite) {
    return {
      query: async (sql, params = []) => {
        return new Promise((resolve, reject) => {
          sqliteDb.all(convertPgToSqlite(sql), params, (err, rows) => {
            if (err) return reject(err);
            resolve({ rows });
          });
        });
      },
      release: () => {}
    };
  } else {
    return pool.connect();
  }
};

// ─── Schema creation & lightweight migrations ───
export async function initDatabase() {
  console.log('Initializing PostgreSQL tables...');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      building_type TEXT,
      soil_type TEXT,
      season TEXT,
      stories TEXT,
      budget TEXT,
      start_date TEXT,
      plot_area TEXT,
      city TEXT,
      overall_risk TEXT DEFAULT 'Low',
      estimated_delay_days INTEGER DEFAULT 0,
      risk_summary TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      stage TEXT NOT NULL,
      duration INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      actual_start_date TEXT,
      actual_end_date TEXT,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      is_addon INTEGER DEFAULT 0,
      sequence_order INTEGER NOT NULL,
      PRIMARY KEY (id, project_id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS checklist_items (
      id TEXT PRIMARY KEY,
      activity_id TEXT NOT NULL,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      original_text TEXT NOT NULL,
      rule TEXT,
      original_rule TEXT,
      checked INTEGER DEFAULT 0,
      item_index INTEGER NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS chat_logs (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Migrations for databases created before plot_area/city existed
  try {
    await dbRun(`ALTER TABLE projects ADD COLUMN plot_area TEXT`);
  } catch (err) {
    // Ignore error if column already exists or syntax not supported on SQLite
  }
  try {
    await dbRun(`ALTER TABLE projects ADD COLUMN city TEXT`);
  } catch (err) {
    // Ignore error
  }

  // Helpful indexes for the common lookups
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_activities_project ON activities(project_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_checklist_project ON checklist_items(project_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_chat_project ON chat_logs(project_id)`);

  console.log('PostgreSQL tables initialized successfully.');

  // Optional demo user — ONLY when explicitly enabled (never a production backdoor).
  if (process.env.SEED_DEMO_USER === 'true') {
    try {
      const demoEmail = 'buyer@trading.com';
      const existing = await dbGet('SELECT id FROM users WHERE email = $1', [demoEmail]);
      if (!existing) {
        const hash = await bcrypt.hash('buyer123', 10);
        await dbRun(
          'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)',
          ['demo-user-id', 'Demo User', demoEmail, hash]
        );
        console.log('Seeded demo user (SEED_DEMO_USER=true).');
      }
    } catch (err) {
      console.error('Error seeding demo user:', err.message);
    }
  }
}

export default pool;
