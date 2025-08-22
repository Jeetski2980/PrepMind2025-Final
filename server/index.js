// server/index.js
import "dotenv/config"; // for local dev (.env). Not used in production unless mounted.
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { generateQuestions, generateChatResponse } from "./services/together.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// API: generate questions
app.post("/api/generate-questions", async (req, res) => {
  try {
    const { testType, subject, topic, numQuestions = 5 } = req.body || {};
    const data = await generateQuestions(testType, subject, topic, Number(numQuestions));
    res.json({ questions: data });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// API: chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body || {};
    const text = await generateChatResponse(message || "");
    res.json({ content: text });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// --- Serve built client (optional: if same service serves frontend) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "..", "dist");

app.use(express.static(clientDist));
app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
