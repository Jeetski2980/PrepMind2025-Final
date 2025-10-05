// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateChatResponse, generateQuestions } from './services/gemini.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:5173'] }));

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Chat (Gemini key #1)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "message required" });
    const content = await generateChatResponse(message);
    res.json({ content });
  } catch (e) {
    console.error("chat error:", e);
    res.status(500).json({ error: String(e.message || e) });
  }
});

// Question generator (Gemini key #2)
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { testType, subject, topic, numQuestions } = req.body || {};
    if (!testType || !subject || !topic) {
      return res.status(400).json({ error: "testType, subject, topic required" });
    }
    const data = await generateQuestions({ testType, subject, topic, numQuestions });
    res.json(data);
  } catch (e) {
    console.error("questions error:", e);
    res.status(500).json({ error: String(e.message || e) });
  }
});

// Serve client (prefer /dist, fallback to /public)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');
const serveDir = fs.existsSync(distDir) ? distDir : publicDir;

app.use(express.static(serveDir));
app.get('*', (_req, res) => res.sendFile(path.join(serveDir, 'index.html')));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log('Has GEMINI_CHAT_API_KEY?', !!process.env.GEMINI_CHAT_API_KEY);
  console.log('Has GEMINI_QA_API_KEY?', !!process.env.GEMINI_QA_API_KEY);
});
