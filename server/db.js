import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'nirmaan.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) console.error('Failed to enable foreign keys:', err);
    });
  }
});

// Promisified DB helpers
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Automatic database schema creation
export async function initDatabase() {
  console.log('Initializing database tables...');
  
  // 1. Users Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Projects Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      building_type TEXT,
      soil_type TEXT,
      season TEXT,
      stories TEXT,
      budget TEXT,
      start_date TEXT,
      overall_risk TEXT DEFAULT 'Low',
      estimated_delay_days INTEGER DEFAULT 0,
      risk_summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 3. Activities Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT,
      project_id TEXT,
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
      PRIMARY KEY (id, project_id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  // 4. Checklist Items Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS checklist_items (
      id TEXT PRIMARY KEY,
      activity_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      text TEXT NOT NULL,
      original_text TEXT NOT NULL,
      rule TEXT,
      original_rule TEXT,
      checked INTEGER DEFAULT 0,
      item_index INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  // 5. Chat Logs Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS chat_logs (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables initialized successfully!');
}

export default db;
