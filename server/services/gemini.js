import { GoogleGenerativeAI } from "@google/generative-ai";

const CHAT_KEY  = process.env.GEMINI_CHAT_API_KEY || process.env.GOOGLE_API_KEY;
const CHAT_MODEL = process.env.GEMINI_MODEL_CHAT || "gemini-2.5-flash";

const QA_KEY    = process.env.GEMINI_QA_API_KEY   || CHAT_KEY;
const QA_MODEL  = process.env.GEMINI_MODEL_QA     || "gemini-2.5-flash";

/* ---------------- helpers ---------------- */

function parseModelJson(text) {
  if (!text) throw new Error("Empty model response.");
  const fence = text.match(/```json([\s\S]*?)```/i);
  const raw = fence ? fence[1] : text;
  try { return JSON.parse(raw); } catch {}
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
  if (s !== -1 && e !== -1 && e > s) {
    const maybe = raw.slice(s, e + 1);
    try { return JSON.parse(maybe); } catch {}
  }
  throw new Error("Invalid JSON from model.");
}

// Lightly wrap common bare LaTeX only when no $ delimiters exist
function autoWrapMath(s) {
  if (!s) return s;
  let out = String(s);
  if (out.includes("$")) return out;

  out = out.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_m, a, b) => `$\\frac{${a}}{${b}}$`);
  out = out.replace(/\\sqrt\{([^{}]+)\}/g, (_m, a) => `$\\sqrt{${a}}$`);
  out = out
    .replace(/\b\\pi\b/g, '$\\pi$')
    .replace(/\b\\theta\b/g, '$\\theta$')
    .replace(/\b\\alpha\b/g, '$\\alpha$')
    .replace(/\b\\beta\b/g, '$\\beta$')
    .replace(/\b\\gamma\b/g, '$\\gamma$')
    .replace(/\b\\delta\b/g, '$\\delta$')
    .replace(/\b\\lambda\b/g, '$\\lambda$')
    .replace(/\b\\mu\b/g, '$\\mu$')
    .replace(/\b\\sigma\b/g, '$\\sigma$')
    .replace(/\b\\leq\b/g, '$\\leq$')
    .replace(/\b\\geq\b/g, '$\\geq$')
    .replace(/\b\\neq\b/g, '$\\neq$')
    .replace(/\b\\ne\b/g, '$\\ne$');
  return out;
}

function normalizeQA(q) {
  const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
  const choices = Array.isArray(q?.choices) ? q.choices.slice(0, 4) : [];
  const ansLetter = String(q?.answer || "").trim().toUpperCase();
  const idx =
    Number.isInteger(q?.answerIndex)
      ? q.answerIndex
      : Number.isInteger(q?.correctIndex)
      ? q.correctIndex
      : (ansLetter in letterToIndex ? letterToIndex[ansLetter] : 0);

  return {
    question: autoWrapMath(q?.question || ""),
    choices: choices.map(autoWrapMath),
    answer: ansLetter || ["A","B","C","D"][idx],
    answerIndex: idx,
    correctIndex: idx,
    explanation: autoWrapMath(q?.explanation || ""),
    difficulty: q?.difficulty || "Medium",
  };
}

/* --------------- exports ----------------- */

// Tutor chat
export async function generateChatResponse({ message, model } = {}) {
  if (!CHAT_KEY) throw new Error("GEMINI_CHAT_API_KEY (or GOOGLE_API_KEY) is missing.");

  const genAI = new GoogleGenerativeAI(CHAT_KEY);
  const gModel = genAI.getGenerativeModel({
    model: model || CHAT_MODEL,
    generationConfig: { temperature: 0.2, topP: 0.9 }
  });

  const prompt = `
You are a friendly SAT/ACT/AP tutor.
- Explain step-by-step but concisely.
- When writing math, ALWAYS wrap LaTeX in $...$ (inline) or $$...$$ (display).
Student: ${message}
Tutor:
  `;

  const result = await gModel.generateContent(prompt);
  const text = result?.response?.text?.() ?? "";
  return autoWrapMath(text);
}

// Practice questions
export async function generateQuestions({ testType, subject, topic, count = 5 }) {
  if (!QA_KEY) throw new Error("GEMINI_QA_API_KEY (or GOOGLE_API_KEY) is missing.");

  const genAI = new GoogleGenerativeAI(QA_KEY);
  const gModel = genAI.getGenerativeModel({
    model: QA_MODEL,
    generationConfig: { temperature: 0.3, topP: 0.9 }
  });

  const prompt = `
You create high-quality multiple-choice practice questions for standardized tests.

Output ONLY valid JSON in this exact shape (no prose before/after):
{
  "questions": [
    {
      "question": "string",
      "choices": ["string","string","string","string"],
      "answer": "A | B | C | D",
      "explanation": "string"
    }
  ]
}

Rules:
- "answer" MUST be one of "A","B","C","D" (uppercase).
- Exactly 4 distinct choices.
- Explanations are 1–3 sentences that reference why the correct choice works.
- When you include math, always wrap LaTeX in $...$ or $$...$$.

Generate ${count} questions for:
Test Type: ${testType}
Subject: ${subject}
Topic: ${topic || "General"}
Difficulty: mix of easy and medium.
`;

  const result = await gModel.generateContent(prompt);
  const text = result?.response?.text?.() ?? "";
  const parsed = parseModelJson(text);

  const raw = Array.isArray(parsed?.questions) ? parsed.questions : [];
  const questions = raw.map(normalizeQA).filter(q => q.question && q.choices.length === 4);
  if (questions.length === 0) throw new Error("No questions produced.");
  return { questions };
}
