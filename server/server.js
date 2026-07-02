import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { dbRun, dbGet, dbAll, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'nirmaan_secret_key_123';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Helper to generate secure UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const existing = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const userId = generateUUID();
    const hash = await bcrypt.hash(password, 10);
    await dbRun(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      [userId, name, email.toLowerCase(), hash]
    );

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email: email.toLowerCase() } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
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
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// ─── PROJECT ROUTES ───
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await dbAll('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
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

  const projectId = generateUUID();
  const { buildingType, soilType, season, stories, budget } = params || {};
  const { overallRisk, estimatedDelayDays, summary } = riskAssessment || { overallRisk: 'Low', estimatedDelayDays: 0, summary: '' };

  try {
    // 1. Insert Project Row
    await dbRun(
      `INSERT INTO projects (id, user_id, name, building_type, soil_type, season, stories, budget, start_date, overall_risk, estimated_delay_days, risk_summary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [projectId, req.userId, name, buildingType, soilType, season, stories, budget, startDate, overallRisk, estimatedDelayDays, summary]
    );

    // 2. Insert Activities and Checklists
    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      await dbRun(
        `INSERT INTO activities (id, project_id, name, original_name, stage, duration, start_date, end_date, actual_start_date, actual_end_date, status, notes, is_addon, sequence_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [act.id, projectId, act.name, act.originalName || act.name, act.stage, act.duration, act.startDate, act.endDate, act.actualStartDate || null, act.actualEndDate || null, act.status || 'Pending', act.notes || null, act.isAddon ? 1 : 0, i]
      );

      if (act.checklist && Array.isArray(act.checklist)) {
        for (let j = 0; j < act.checklist.length; j++) {
          const item = act.checklist[j];
          const checkId = generateUUID();
          await dbRun(
            `INSERT INTO checklist_items (id, activity_id, project_id, text, original_text, rule, original_rule, checked, item_index)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [checkId, act.id, projectId, item.text, item.originalText || item.text, item.rule || null, item.originalRule || item.rule || null, item.checked ? 1 : 0, j]
          );
        }
      }
    }

    const newProject = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Failed to create project:', err);
    res.status(500).json({ error: 'Failed to create project and populate schedule' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
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
    // Authenticate project ownership first
    const project = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, req.userId]);
    if (!project) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    const acts = await dbAll('SELECT * FROM activities WHERE project_id = ? ORDER BY sequence_order', [projectId]);
    const items = await dbAll('SELECT * FROM checklist_items WHERE project_id = ? ORDER BY item_index', [projectId]);

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
    console.error('Fetch activities error:', err);
    res.status(500).json({ error: 'Failed to retrieve activities' });
  }
});

app.put('/api/projects/:projectId/activities/:activityId', authMiddleware, async (req, res) => {
  const { projectId, activityId } = req.params;
  const { status, actualStartDate, actualEndDate, notes, name, checklist } = req.body;

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, req.userId]);
    if (!project) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    // Update main fields
    await dbRun(
      `UPDATE activities 
       SET status = COALESCE(?, status), 
           actual_start_date = ?, 
           actual_end_date = ?, 
           notes = ?, 
           name = COALESCE(?, name)
       WHERE project_id = ? AND id = ?`,
      [status, actualStartDate || null, actualEndDate || null, notes || null, name || null, projectId, activityId]
    );

    // If checklist was sent, update checklist item text/rules (like when translated or AI customized)
    if (checklist && Array.isArray(checklist)) {
      for (let j = 0; j < checklist.length; j++) {
        const item = checklist[j];
        await dbRun(
          `UPDATE checklist_items 
           SET text = ?, rule = ? 
           WHERE project_id = ? AND activity_id = ? AND item_index = ?`,
          [item.text, item.rule, projectId, activityId, j]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Update activity error:', err);
    res.status(500).json({ error: 'Failed to update activity details' });
  }
});

app.put('/api/projects/:projectId/activities/:activityId/checklist/:itemIndex', authMiddleware, async (req, res) => {
  const { projectId, activityId, itemIndex } = req.params;
  const { checked } = req.body;

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, req.userId]);
    if (!project) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    await dbRun(
      `UPDATE checklist_items 
       SET checked = ? 
       WHERE project_id = ? AND activity_id = ? AND item_index = ?`,
      [checked ? 1 : 0, projectId, activityId, parseInt(itemIndex, 10)]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Toggle checklist error:', err);
    res.status(500).json({ error: 'Failed to toggle checklist status' });
  }
});

app.put('/api/projects/:projectId/activities_bulk', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { activities } = req.body;

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, req.userId]);
    if (!project) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    // Delete existing activities and checklist items
    await dbRun('DELETE FROM activities WHERE project_id = ?', [projectId]);
    await dbRun('DELETE FROM checklist_items WHERE project_id = ?', [projectId]);

    // Insert new activities and checklists
    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      await dbRun(
        `INSERT INTO activities (id, project_id, name, original_name, stage, duration, start_date, end_date, actual_start_date, actual_end_date, status, notes, is_addon, sequence_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [act.id, projectId, act.name, act.originalName || act.name, act.stage, act.duration, act.startDate, act.endDate, act.actualStartDate || null, act.actualEndDate || null, act.status || 'Pending', act.notes || null, act.isAddon ? 1 : 0, i]
      );

      if (act.checklist && Array.isArray(act.checklist)) {
        for (let j = 0; j < act.checklist.length; j++) {
          const item = act.checklist[j];
          const checkId = generateUUID();
          await dbRun(
            `INSERT INTO checklist_items (id, activity_id, project_id, text, original_text, rule, original_rule, checked, item_index)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [checkId, act.id, projectId, item.text, item.originalText || item.text, item.rule || null, item.originalRule || item.rule || null, item.checked ? 1 : 0, j]
          );
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Bulk update error:', err);
    res.status(500).json({ error: 'Failed to bulk update activities' });
  }
});

// ─── CHAT LOGS ROUTES ───
app.get('/api/projects/:projectId/chat', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, req.userId]);
    if (!project) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    const chats = await dbAll(
      'SELECT sender, text, created_at as timestamp FROM chat_logs WHERE project_id = ? ORDER BY created_at ASC',
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
    const project = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, req.userId]);
    if (!project) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    const chatId = generateUUID();
    await dbRun(
      'INSERT INTO chat_logs (id, project_id, sender, text) VALUES (?, ?, ?, ?)',
      [chatId, projectId, sender, text]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

// ─── UPDATE RISK REPORT ROUTES ───
app.put('/api/projects/:projectId/risk', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { overallRisk, estimatedDelayDays, summary } = req.body;

  try {
    const project = await dbGet('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, req.userId]);
    if (!project) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    await dbRun(
      `UPDATE projects 
       SET overall_risk = ?, estimated_delay_days = ?, risk_summary = ? 
       WHERE id = ?`,
      [overallRisk, estimatedDelayDays, summary, projectId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update risk report' });
  }
});

// Start Server and migrate DB
app.listen(PORT, async () => {
  try {
    await initDatabase();
    console.log(`Nirmaan Sahayak Backend running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('Failed to initialize database on startup:', err);
  }
});
