// server/services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const CHAT_KEY = process.env.GEMINI_CHAT_API_KEY;
const QA_KEY   = process.env.GEMINI_QA_API_KEY;

const CHAT_MODEL = process.env.GEMINI_MODEL_CHAT || "gemini-2.5-flash";
const QA_MODEL   = process.env.GEMINI_MODEL_QA   || "gemini-2.5-flash";

function need(name, val) {
  if (!val) throw new Error(`Missing required env: ${name}`);
  return val;
}

export async function generateChatResponse(message) {
  const genAI = new GoogleGenerativeAI(need("GEMINI_CHAT_API_KEY", CHAT_KEY));
  const model = genAI.getGenerativeModel({ model: CHAT_MODEL });

  const prompt = `You are a friendly test-prep tutor (SAT/ACT/AP).
Use clear steps and LaTeX ($...$ / $$...$$). Be concise.

Student: ${message}`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateQuestions({ testType, subject, topic, numQuestions = 5 }) {
  const genAI = new GoogleGenerativeAI(need("GEMINI_QA_API_KEY", QA_KEY));
  const model = genAI.getGenerativeModel({ model: QA_MODEL });

  const prompt = `
Create ${numQuestions} ${testType} ${subject} practice questions on: "${topic}".
Return STRICT JSON only:
{
  "questions": [
    {"question":"...", "choices":["A","B","C","D"], "answer":"A|B|C|D", "explanation":"..."}
  ]
}`;

  const result = await model.generateContent(prompt);
  const txt = result.response.text().trim();
  const json = txt.replace(/```json|```/g, "").trim();

  let parsed;
  try { parsed = JSON.parse(json); } catch { throw new Error("Invalid JSON from model."); }
  if (!parsed || !Array.isArray(parsed.questions)) throw new Error("Missing 'questions' array.");
  return parsed;
}
