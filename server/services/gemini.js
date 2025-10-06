import { GoogleGenerativeAI } from "@google/generative-ai";

const CHAT_KEY = process.env.GEMINI_CHAT_API_KEY;
const QA_KEY   = process.env.GEMINI_QA_API_KEY;

const CHAT_MODEL = process.env.GEMINI_MODEL_CHAT || "gemini-2.5-flash";
const QA_MODEL   = process.env.GEMINI_MODEL_QA   || "gemini-2.5-flash";

function need(name, val) {
  if (!val) throw new Error(`Missing required env: ${name}`);
  return val;
}

/* ---------------------- Chat (string-safe) ---------------------- */
export async function generateChatResponse(message) {
  const genAI = new GoogleGenerativeAI(need("GEMINI_CHAT_API_KEY", CHAT_KEY));
  const model = genAI.getGenerativeModel({ model: CHAT_MODEL });

  const prompt = `You are a friendly test-prep tutor (SAT/ACT/AP).
Use clear steps and LaTeX ($...$ / $$...$$). Be concise.

Student: ${message}`;

  const result = await model.generateContent(prompt);

  let text = "";
  try {
    text = (result?.response?.text?.() ?? "").trim();
  } catch {
    text = "";
  }
  return text || "I’m here! Try asking a math or test-prep question.";
}

/* ----------------- Questions (JSON mode, robust) ---------------- */
function extractJsonBlock(s) {
  if (!s) return null;
  const cleaned = s.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf("{");
    const last  = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) {
      const slice = cleaned.slice(first, last + 1);
      try { return JSON.parse(slice); } catch {}
    }
  }
  return null;
}

/**
 * Normalize each question and compute BOTH:
 *   - answer (letter: "A"|"B"|"C"|"D")
 *   - answerIndex / correctIndex (0..3)  ← use this for grading!
 */
function normalizeQA(parsed) {
  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new Error("Questions JSON missing 'questions' array.");
  }

  const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
  const stripLetterPrefix = (s) =>
    String(s ?? "").replace(/^\s*[A-D][\)\.\:\-]\s*/i, "").trim();

  parsed.questions = parsed.questions.map((q) => {
    let { question, choices, answer, explanation } = q ?? {};

    // Ensure strings
    question = typeof question === "string" ? question : String(question ?? "");
    explanation = typeof explanation === "string" ? explanation : String(explanation ?? "");

    // Normalize choices → array of 4 plain strings (no "A. ", "B) ", etc.)
    if (!Array.isArray(choices)) {
      if (choices && typeof choices === "object") choices = Object.values(choices);
      else choices = String(choices ?? "").split(/\s*[|;]\s*/);
    }
    choices = choices.map(stripLetterPrefix).slice(0, 4);
    while (choices.length < 4) choices.push("N/A");

    // Determine correct index
    let idx = -1;

    // If model gave a letter like "B"
    if (typeof answer === "string" && /^[ABCD]$/i.test(answer.trim())) {
      idx = letterToIndex[answer.trim().toUpperCase()];
    }

    // If model gave the *text* of the correct choice, try to match by text
    if (idx < 0 && typeof answer === "string") {
      const ai = choices.findIndex(
        (c) => c.toLowerCase() === answer.trim().toLowerCase()
      );
      if (ai >= 0) idx = ai;
    }

    // Fallback
    if (idx < 0) idx = 0;

    // Keep letter too (compatibility)
    const letter = Object.keys(letterToIndex).find((k) => letterToIndex[k] === idx) || "A";

    return {
      question,
      choices,
      answer: letter,        // "A" | "B" | "C" | "D"
      answerIndex: idx,      // 0..3  ← USE THIS FOR GRADING
      correctIndex: idx,     // alias
      explanation
    };
  });

  return parsed;
}

export async function generateQuestions({
  testType,
  subject,
  topic,
  numQuestions = 5,
}) {
  const genAI = new GoogleGenerativeAI(need("GEMINI_QA_API_KEY", QA_KEY));
  const model = genAI.getGenerativeModel({ model: QA_MODEL });

  const n = Math.max(1, Math.min(15, Number(numQuestions) || 5));

  const prompt = `
Create ${n} ${testType} ${subject} multiple-choice practice questions on: "${topic}".

Rules:
- Each item has exactly 4 choices labeled A, B, C, D.
- "answer" MUST be exactly one of: A, B, C, D (or the exact answer text).
- "explanation" is 1–3 concise sentences.
- Return ONLY JSON (no text, no markdown). EXACT shape:

{
  "questions": [
    {
      "question": "string (may include LaTeX like $x^2$)",
      "choices": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "string"
    }
  ]
}
`;

  let raw = "";
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: { responseMimeType: "application/json" }
    });
    raw = result?.response?.text?.() ?? "";
  } catch {
    const result = await model.generateContent(prompt);
    raw = result?.response?.text?.() ?? "";
  }

  const parsed = extractJsonBlock(raw);
  if (!parsed) {
    console.error("Question JSON parse failed. Raw (first 800 chars):", String(raw).slice(0, 800));
    throw new Error("Invalid JSON from model.");
  }
  return normalizeQA(parsed);
}
