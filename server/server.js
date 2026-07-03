import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { dbRun, dbGet, dbAll, getClient, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── JWT secret hardening (no weak public fallback in production) ───
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET must be set in production. Refusing to start.');
    process.exit(1);
  }
  JWT_SECRET = 'dev_only_insecure_secret_change_me';
  console.warn('[WARN] JWT_SECRET not set — using an insecure dev secret. Never use this in production.');
}

// Trust the Render/Vercel reverse proxy so req.ip reflects the real client (rate limiting).
app.set('trust proxy', 1);

// ─── CORS allowlist ───
// Set ALLOWED_ORIGINS (comma-separated) in production to lock the API to your frontends.
// When unset (local dev), all origins are allowed.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);
const mobileOrigins = ['http://localhost', 'capacitor://localhost'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0) return cb(null, true);
    if (mobileOrigins.includes(origin)) return cb(null, true);
    return cb(null, allowedOrigins.includes(origin));
  }
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Lightweight in-memory rate limiter (per IP + route) ───
function rateLimit({ windowMs, max, message }) {
  const hits = new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
  }, windowMs);
  if (timer.unref) timer.unref();

  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || now > entry.reset) entry = { count: 0, reset: now + windowMs };
    entry.count++;
    hits.set(key, entry);
    if (entry.count > max) {
      return res.status(429).json({ error: message || 'Too many requests, please try again later.' });
    }
    next();
  };
}

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: 'Too many auth attempts. Please try again in a few minutes.' });
const aiLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 40, message: 'AI request limit reached. Please wait a moment and retry.' });

// ─── AUTH MIDDLEWARE ───
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ─── AUTH ROUTES ───
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const existing = await dbGet('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const userId = randomUUID();
    const hash = await bcrypt.hash(password, 10);
    await dbRun(
      'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)',
      [userId, name, email.toLowerCase(), hash]
    );

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email: email.toLowerCase() } });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// ─── PROJECT ROUTES ───
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await dbAll('SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const { name, params, startDate, activities, riskAssessment } = req.body;
  if (!name || !startDate || !activities) {
    return res.status(400).json({ error: 'Project name, startDate, and activities are required' });
  }

  const projectId = randomUUID();
  const { buildingType, soilType, season, stories, budget, plotArea, city } = params || {};
  const { overallRisk = 'Low', estimatedDelayDays = 0, summary = '' } = riskAssessment || {};

  const client = await getClient();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO projects (id, user_id, name, building_type, soil_type, season, stories, budget, start_date, plot_area, city, overall_risk, estimated_delay_days, risk_summary)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [projectId, req.userId, name, buildingType, soilType, season, stories, budget, startDate, plotArea || null, city || null, overallRisk, estimatedDelayDays, summary]
    );

    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      await client.query(
        `INSERT INTO activities (id, project_id, name, original_name, stage, duration, start_date, end_date, actual_start_date, actual_end_date, status, notes, is_addon, sequence_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [act.id, projectId, act.name, act.originalName || act.name, act.stage, act.duration, act.startDate, act.endDate, act.actualStartDate || null, act.actualEndDate || null, act.status || 'Pending', act.notes || null, act.isAddon ? 1 : 0, i]
      );

      if (Array.isArray(act.checklist)) {
        for (let j = 0; j < act.checklist.length; j++) {
          const item = act.checklist[j];
          await client.query(
            `INSERT INTO checklist_items (id, activity_id, project_id, text, original_text, rule, original_rule, checked, item_index)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [randomUUID(), act.id, projectId, item.text, item.originalText || item.text, item.rule || null, item.originalRule || item.rule || null, item.checked ? 1 : 0, j]
          );
        }
      }
    }

    await client.query('COMMIT');
    const newProject = await dbGet('SELECT * FROM projects WHERE id = $1', [projectId]);
    res.status(201).json(newProject);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Failed to create project:', err.message);
    res.status(500).json({ error: 'Failed to create project and populate schedule' });
  } finally {
    client.release();
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    // FK ON DELETE CASCADE removes the project's activities, checklists and chats.
    const result = await dbRun('DELETE FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ─── ACTIVITIES & CHECKLISTS ROUTES ───
app.get('/api/projects/:projectId/activities', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, req.userId]);
    if (!project) return res.status(403).json({ error: 'Access denied to project' });

    const acts = await dbAll('SELECT * FROM activities WHERE project_id = $1 ORDER BY sequence_order', [projectId]);
    const items = await dbAll('SELECT * FROM checklist_items WHERE project_id = $1 ORDER BY item_index', [projectId]);

    const activities = acts.map(act => {
      const activityItems = items
        .filter(item => item.activity_id === act.id)
        .map(item => ({
          id: item.id,
          text: item.text,
          originalText: item.original_text,
          rule: item.rule,
          originalRule: item.original_rule,
          checked: !!item.checked
        }));

      return {
        id: act.id,
        name: act.name,
        originalName: act.original_name,
        stage: act.stage,
        duration: act.duration,
        startDate: act.start_date,
        endDate: act.end_date,
        actualStartDate: act.actual_start_date || undefined,
        actualEndDate: act.actual_end_date || undefined,
        status: act.status,
        notes: act.notes || undefined,
        isAddon: !!act.is_addon,
        checklist: activityItems
      };
    });

    res.json(activities);
  } catch (err) {
    console.error('Fetch activities error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve activities' });
  }
});

app.put('/api/projects/:projectId/activities/:activityId', authMiddleware, async (req, res) => {
  const { projectId, activityId } = req.params;
  const { checklist } = req.body;

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, req.userId]);
    if (!project) return res.status(403).json({ error: 'Access denied to project' });

    // Dynamic update — only the fields actually sent are changed, so a partial
    // update (e.g. a checklist toggle sending just {status}) never wipes notes/dates.
    const columnMap = {
      status: 'status',
      actualStartDate: 'actual_start_date',
      actualEndDate: 'actual_end_date',
      notes: 'notes',
      name: 'name',
      startDate: 'start_date',
      endDate: 'end_date',
      duration: 'duration'
    };
    const sets = [];
    const vals = [];
    for (const [field, col] of Object.entries(columnMap)) {
      if (field in req.body) {
        let v = req.body[field];
        if ((field === 'actualStartDate' || field === 'actualEndDate') && !v) v = null;
        vals.push(v);
        sets.push(`${col} = $${vals.length}`);
      }
    }
    if (sets.length > 0) {
      vals.push(projectId);
      vals.push(activityId);
      await dbRun(
        `UPDATE activities SET ${sets.join(', ')} WHERE project_id = $${vals.length - 1} AND id = $${vals.length}`,
        vals
      );
    }

    if (Array.isArray(checklist)) {
      for (let j = 0; j < checklist.length; j++) {
        const item = checklist[j];
        await dbRun(
          `UPDATE checklist_items SET text = $1, rule = $2 WHERE project_id = $3 AND activity_id = $4 AND item_index = $5`,
          [item.text, item.rule, projectId, activityId, j]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Update activity error:', err.message);
    res.status(500).json({ error: 'Failed to update activity details' });
  }
});

app.put('/api/projects/:projectId/activities/:activityId/checklist/:itemIndex', authMiddleware, async (req, res) => {
  const { projectId, activityId, itemIndex } = req.params;
  const { checked } = req.body;

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, req.userId]);
    if (!project) return res.status(403).json({ error: 'Access denied to project' });

    await dbRun(
      `UPDATE checklist_items SET checked = $1 WHERE project_id = $2 AND activity_id = $3 AND item_index = $4`,
      [checked ? 1 : 0, projectId, activityId, parseInt(itemIndex, 10)]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Toggle checklist error:', err.message);
    res.status(500).json({ error: 'Failed to toggle checklist status' });
  }
});

app.put('/api/projects/:projectId/activities_bulk', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { activities } = req.body;

  if (!Array.isArray(activities)) {
    return res.status(400).json({ error: 'activities array is required' });
  }

  const project = await dbGet('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, req.userId]);
  if (!project) return res.status(403).json({ error: 'Access denied to project' });

  const client = await getClient();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM checklist_items WHERE project_id = $1', [projectId]);
    await client.query('DELETE FROM activities WHERE project_id = $1', [projectId]);

    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      await client.query(
        `INSERT INTO activities (id, project_id, name, original_name, stage, duration, start_date, end_date, actual_start_date, actual_end_date, status, notes, is_addon, sequence_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [act.id, projectId, act.name, act.originalName || act.name, act.stage, act.duration, act.startDate, act.endDate, act.actualStartDate || null, act.actualEndDate || null, act.status || 'Pending', act.notes || null, act.isAddon ? 1 : 0, i]
      );

      if (Array.isArray(act.checklist)) {
        for (let j = 0; j < act.checklist.length; j++) {
          const item = act.checklist[j];
          await client.query(
            `INSERT INTO checklist_items (id, activity_id, project_id, text, original_text, rule, original_rule, checked, item_index)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [randomUUID(), act.id, projectId, item.text, item.originalText || item.text, item.rule || null, item.originalRule || item.rule || null, item.checked ? 1 : 0, j]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Bulk update error:', err.message);
    res.status(500).json({ error: 'Failed to bulk update activities' });
  } finally {
    client.release();
  }
});

// ─── CHAT LOGS ROUTES ───
app.get('/api/projects/:projectId/chat', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, req.userId]);
    if (!project) return res.status(403).json({ error: 'Access denied to project' });

    const chats = await dbAll(
      'SELECT sender, text, created_at AS timestamp FROM chat_logs WHERE project_id = $1 ORDER BY created_at ASC',
      [projectId]
    );
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

app.post('/api/projects/:projectId/chat', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { text, sender } = req.body;
  if (!text || !sender) {
    return res.status(400).json({ error: 'Message text and sender are required' });
  }

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, req.userId]);
    if (!project) return res.status(403).json({ error: 'Access denied to project' });

    await dbRun(
      'INSERT INTO chat_logs (id, project_id, sender, text) VALUES ($1, $2, $3, $4)',
      [randomUUID(), projectId, sender, text]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

// ─── UPDATE RISK REPORT ───
app.put('/api/projects/:projectId/risk', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { overallRisk, estimatedDelayDays, summary } = req.body;

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [projectId, req.userId]);
    if (!project) return res.status(403).json({ error: 'Access denied to project' });

    await dbRun(
      `UPDATE projects SET overall_risk = $1, estimated_delay_days = $2, risk_summary = $3 WHERE id = $4`,
      [overallRisk, estimatedDelayDays, summary, projectId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update risk report' });
  }
});

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── API LANDING PAGE ───
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nirmaan Sahayak API Gateway</title>
      <style>
        body { background:#0a0c12; color:#f0f0f5; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center; }
        .container { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:40px 30px; max-width:500px; box-shadow:0 8px 32px rgba(0,0,0,0.4); }
        h1 { color:#f97316; margin-top:0; font-size:28px; }
        p { color:#9ca3af; font-size:15px; line-height:1.6; }
        .footer { margin-top:30px; font-size:11px; color:#4b5563; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏗️ Nirmaan Sahayak API</h1>
        <p>The backend services and PostgreSQL database are active and running securely.</p>
        <div class="footer">Nirmaan Sahayak v1.0.0 • Secure API Gateway</div>
      </div>
    </body>
    </html>
  `);
});

// ─── AI PROXY ENDPOINTS ───
app.get('/api/ai/config', (req, res) => {
  res.json({ hasApiKey: !!process.env.GEMINI_API_KEY || !!process.env.GROQ_API_KEY || !!process.env.CLOD_API_KEY });
});

// Per-provider generators — each returns text or throws (fast-fail enables failover).
async function generateClod(prompt, isJson) {
  const apiKey = process.env.CLOD_API_KEY;
  if (!apiKey) throw new Error('CLoD key not configured');
  const model = process.env.CLOD_MODEL || 'GPT OSS 120B';
  const messages = [];
  // Omit response_format:{type:'json_object'} — the free GPT OSS 120B breaks with it;
  // a system nudge + prompt-driven JSON is reliable.
  if (isJson) {
    messages.push({ role: 'system', content: 'You are a strict JSON API. Respond with ONLY one valid raw JSON value. No markdown, no code fences, no commentary.' });
  }
  messages.push({ role: 'user', content: prompt });
  const response = await fetch('https://api.clod.io/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, max_tokens: 4000 })
  });
  if (!response.ok) {
    const e = await response.json().catch(() => ({}));
    throw new Error(`CLoD HTTP ${response.status}: ${e.error?.message || ''}`);
  }
  const data = await response.json();
  let text = data.choices?.[0]?.message?.content || '';
  if (isJson && text) text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  if (!text.trim()) throw new Error('CLoD returned empty text');
  return text;
}

async function generateGroq(prompt, isJson) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Groq key not configured');
  let model = 'llama-3.3-70b-versatile';
  for (let attempt = 0; attempt < 2; attempt++) {
    const body = { model, messages: [{ role: 'user', content: prompt }], max_tokens: 3000 };
    if (isJson) body.response_format = { type: 'json_object' };
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const e = await response.json().catch(() => ({}));
      const msg = e.error?.message || `HTTP ${response.status}`;
      if ((msg.toLowerCase().includes('tpm') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('limit')) && model === 'llama-3.3-70b-versatile') {
        model = 'llama-3.1-8b-instant';
        continue;
      }
      throw new Error(`Groq: ${msg}`);
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Groq returned empty text');
    return text;
  }
  throw new Error('Groq failed after model fallback');
}

async function generateGemini(prompt, isJson) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini key not configured');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  if (isJson) body.generationConfig = { responseMimeType: 'application/json' };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const e = await response.json().catch(() => ({}));
    throw new Error(`Gemini: ${e.error?.message || ('HTTP ' + response.status)}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty text');
  return text;
}

const AI_PROVIDERS = {
  clod: { fn: generateClod, key: 'CLOD_API_KEY' },
  gemini: { fn: generateGemini, key: 'GEMINI_API_KEY' },
  groq: { fn: generateGroq, key: 'GROQ_API_KEY' }
};

app.post('/api/ai/generate', aiLimiter, authMiddleware, async (req, res) => {
  const { prompt, isJson, provider } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  // Try the preferred provider first, then fail over to the others that have keys.
  // (clod is often IP-blocked from datacenters, so Gemini/Groq are live fallbacks.)
  const preferred = provider && AI_PROVIDERS[provider] ? provider : 'clod';
  const order = [...new Set([preferred, 'gemini', 'groq', 'clod'])]
    .filter(p => AI_PROVIDERS[p] && process.env[AI_PROVIDERS[p].key]);

  if (order.length === 0) {
    return res.status(500).json({ error: 'No AI provider is configured by the administrator.' });
  }

  const errors = [];
  for (const p of order) {
    try {
      const text = await AI_PROVIDERS[p].fn(prompt, isJson);
      return res.json({ text, provider: p });
    } catch (err) {
      console.log(`[AI:${p}] failed: ${err.message}`);
      errors.push(`${p}: ${err.message}`);
    }
  }
  return res.status(502).json({ error: `All AI providers failed. ${errors.join(' | ')}` });
});

// Start server after DB is ready.
app.listen(PORT, async () => {
  try {
    await initDatabase();
    console.log(`Nirmaan Sahayak Backend running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('Failed to initialize database on startup:', err.message);
  }
});
