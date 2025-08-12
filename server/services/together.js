import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// ----------------- HELPERS -----------------

function removeDuplicates(questions) {
  const seen = new Set();
  return questions.filter(q => {
    const key = q.question.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function removeNearDuplicates(questions) {
  const seenKeys = new Set();
  return questions.filter(q => {
    const equationMatch = q.question.match(/([A-Z][a-z]?\s*\d*\s*\+\s*[A-Z][a-z]?\s*\d*)/g);
    const eqKey = equationMatch ? equationMatch.sort().join(" + ").toLowerCase() : "";
    const keywords = q.question.toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 4)
      .join(" ");
    const key = eqKey || keywords;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });
}

function sentenceCount(text) {
  return text
    ? text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0).length
    : 0;
}

async function batchFixExplanations(badQuestions) {
  const prompt = `You are fixing explanations for test prep questions.
Each explanation must be factually correct and between 3 and 5 full sentences.

Return ONLY valid JSON in the format:
[
  {"id": 1, "explanation": "Fixed explanation here"},
  ...
]

Questions needing fixes:
${JSON.stringify(badQuestions, null, 2)}`;

  const completion = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 1500
  });

  const raw = completion.choices[0]?.message?.content || "[]";
  return JSON.parse(raw);
}

async function batchGenerateMissing(testType, subject, topic, count) {
  const topicText = topic ? ` focusing on ${topic}` : "";
  const prompt = `Generate ${count} multiple choice questions for ${testType} ${subject}${topicText}.

Follow all rules:
- No duplicates with existing questions.
- Each explanation must be 3–5 sentences.
- Exactly 4 answer choices labeled A, B, C, D.
- One correct answer (index 0-3).
- Use proper academic language.

Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question": "Question text here",
      "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation here",
      "difficulty": "Medium"
    }
  ]
}`;

  const completion = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: Math.min(1500, count * 200)
  });

  let jsonText = completion.choices[0]?.message?.content?.trim() || "{}";
  if (jsonText.includes("```")) {
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  }
  const data = JSON.parse(jsonText);
  return data.questions || [];
}

// ----------------- MAIN FUNCTION -----------------

export async function generateQuestions(testType, subject, topic, numQuestions) {
  const topicText = topic ? ` focusing on ${topic}` : "";
  console.log(`🤖 Generating ${numQuestions} AI questions for: ${testType} ${subject}${topicText}`);

  const prompt = `Create ${numQuestions} multiple choice questions for ${testType} ${subject}${topicText}.

CRITICAL REQUIREMENTS:
- Absolutely NO two questions may be based on the same equation, same variables, or same general formula (e.g., "A + B → C + D").
- No directly opposite or renamed concepts as separate questions.
- Every question must be unique in concept and explanation style.
- Each explanation must be 3–5 sentences, factually correct.
- Exactly 4 answer choices labeled A, B, C, D.
- One correct answer (index 0-3).
- Mix of difficulties: Easy, Medium, Hard.
- Use proper academic language.

Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question": "Question text here",
      "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation here",
      "difficulty": "Medium"
    }
  ]
}`;

  // Main generation
  const completion = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: Math.min(3000, numQuestions * 200)
  });

  let jsonText = completion.choices[0]?.message?.content?.trim() || "{}";
  if (jsonText.includes("```")) {
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  }
  const data = JSON.parse(jsonText);
  let questions = data.questions || [];

  // Remove duplicates
  questions = removeDuplicates(questions);
  questions = removeNearDuplicates(questions);

  // Fill missing
  if (questions.length < numQuestions) {
    console.log(`⚠️ Missing ${numQuestions - questions.length} questions. Generating extra...`);
    const extras = await batchGenerateMissing(testType, subject, topic, numQuestions - questions.length);
    questions = questions.concat(extras);
    questions = removeDuplicates(questions);
    questions = removeNearDuplicates(questions);
  }

  // Batch fix bad explanations
  const badQs = questions
    .map((q, i) => ({ id: i + 1, question: q.question, correct_answer: q.choices?.[q.correct_answer], difficulty: q.difficulty }))
    .filter((q, i) => sentenceCount(questions[i].explanation) < 3 || sentenceCount(questions[i].explanation) > 5);

  if (badQs.length > 0) {
    console.log(`🔄 Fixing ${badQs.length} bad explanations in one batch...`);
    const fixes = await batchFixExplanations(badQs);
    fixes.forEach(fix => {
      const idx = questions.findIndex(q => q.question === badQs.find(b => b.id === fix.id)?.question);
      if (idx !== -1) questions[idx].explanation = fix.explanation;
    });
  }

  console.log(`✅ Final set: ${questions.length} questions`);
  return questions.slice(0, numQuestions).map((q, i) => ({
    id: i + 1,
    question: q.question,
    choices: q.choices.slice(0, 4),
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    difficulty: q.difficulty
  }));
}

// ----------------- CHAT FUNCTION -----------------

export async function generateChatResponse(message) {
  const prompt = `You are an expert tutor for SAT, ACT, and AP test prep.

Student question: "${message}"

Provide a helpful response with:
- **Bold** for final answers
- $inline math$ for math expressions
- $$display math$$ for long equations
- <highlight> tags for important steps/concepts
- Clear 2–3 paragraph explanation`;

  const completion = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000
  });

  return completion.choices[0]?.message?.content?.trim() || "Sorry, I'm having trouble responding.";
}
