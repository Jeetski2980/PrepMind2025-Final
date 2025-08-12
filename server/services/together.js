import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// ----------------- HELPERS -----------------

// Remove exact duplicate questions
function removeDuplicates(questions) {
  const seen = new Set();
  return questions.filter(q => {
    const key = q.question.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Remove near-duplicate questions (same equation or concept pattern)
function removeNearDuplicates(questions) {
  const seenKeys = new Set();
  return questions.filter(q => {
    // Detect equation patterns
    const equationMatch = q.question.match(/([A-Z][a-z]?\s*\d*\s*\+\s*[A-Z][a-z]?\s*\d*)/g);
    const eqKey = equationMatch ? equationMatch.sort().join(" + ").toLowerCase() : "";

    // Detect concept keywords
    const keywords = q.question.toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 4) // first few keywords
      .join(" ");

    const key = eqKey || keywords;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });
}

// Count number of sentences in an explanation
function sentenceCount(text) {
  return text
    ? text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0).length
    : 0;
}

// Ask AI to rewrite/fix an explanation
async function fixExplanation(question, correctAnswer, difficulty) {
  const fixPrompt = `The following question needs a correct explanation in exactly 3–5 sentences:

Question: ${question}
Correct Answer: ${correctAnswer}
Difficulty: ${difficulty}

Provide a correct, factual, detailed explanation between 3 and 5 complete sentences. Do not use bullet points.`;

  const completion = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [{ role: "user", content: fixPrompt }],
    temperature: 0.3,
    max_tokens: 300
  });

  return completion.choices[0]?.message?.content?.trim() || "Explanation not available";
}

// ----------------- MAIN FUNCTION -----------------

export async function generateQuestions(testType, subject, topic, numQuestions) {
  const topicText = topic ? ` focusing on ${topic}` : "";
  console.log(`🤖 Generating ${numQuestions} AI questions for: ${testType} ${subject}${topicText}`);

  if (!process.env.TOGETHER_API_KEY) {
    throw new Error("TOGETHER_API_KEY environment variable is not set");
  }

  const prompt = `Create ${numQuestions} multiple choice questions for ${testType} ${subject}${topicText}.

CRITICAL REQUIREMENTS:
- Absolutely NO two questions in this set may be based on the same reaction equation, same variable names, or same general formula (e.g., "A + B → C + D" or "2A + B → 2C + D").
- No two questions may have explanations that follow the same sentence template structure.
- Do not include pairs of directly opposite questions (e.g., exothermic vs. endothermic ΔH) in the same set.
- Do not reword or rename the same concept (e.g., "oxidation-reduction" and "redox") as separate questions — these count as duplicates.
- Every question must be about a unique reaction, concept, or calculation.
- Each explanation MUST be exactly between 3 and 5 full sentences.
  If shorter or longer, rewrite until it fits this length and is factually correct.
- Do not paraphrase or reword a question to make it appear different.
- Questions must be appropriate for ${testType} ${subject} level.
- Exactly 4 answer choices labeled A, B, C, D.
- One correct answer (index 0-3).
- Mix of difficulties: Easy, Medium, Hard.
- Use proper academic language.
- For math: use simple notation like x^2, (a/b), sqrt(x).
${testType === "AP Exams" ? `- Generate college-level ${subject} questions with advanced concepts.` : ""}
${topic ? `- Focus specifically on ${topic} concepts and problems.` : ""}

After generating all questions:
- Scan the set to ensure there are NO duplicates or near-duplicates.
- Confirm every explanation is 3–5 sentences.
- Fix any issues before returning.

Return ONLY valid JSON in this exact format:
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

  // Retry logic
  let attempt = 0;
  let questions = [];

  while (attempt < 3 && questions.length === 0) {
    attempt++;
    console.log(`🔄 Attempt ${attempt} to generate questions...`);

    try {
      const completion = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: `You are a ${testType} test prep expert. Generate ${subject} questions. Return valid JSON only. Be concise but accurate.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: Math.min(3000, numQuestions * 200),
        stream: false
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No response from AI - API call failed");

      let jsonText = response.trim();
      if (jsonText.includes("```")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").replace(/\n?```$/g, "");
      }
      if (!jsonText.startsWith("{")) {
        const startIndex = jsonText.indexOf("{");
        const endIndex = jsonText.lastIndexOf("}");
        if (startIndex !== -1 && endIndex !== -1) {
          jsonText = jsonText.substring(startIndex, endIndex + 1);
        }
      }

      const data = JSON.parse(jsonText);
      questions = data.questions || [];

      if (questions.length === 0) throw new Error("Empty questions array");

      // Remove exact & near duplicates
      questions = removeDuplicates(questions);
      questions = removeNearDuplicates(questions);

      // Fix explanations if needed
      for (let i = 0; i < questions.length; i++) {
        if (sentenceCount(questions[i].explanation) < 3 || sentenceCount(questions[i].explanation) > 5) {
          console.log(`🔄 Fixing explanation for Question ${i + 1}...`);
          questions[i].explanation = await fixExplanation(
            questions[i].question,
            Array.isArray(questions[i].choices) ? questions[i].choices[questions[i].correct_answer] : "",
            questions[i].difficulty || "Medium"
          );
        }
      }

    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
      if (attempt >= 3) {
        throw new Error(`AI question generation failed after ${attempt} attempts: ${err.message}`);
      }
    }
  }

  console.log(`✅ Successfully generated ${questions.length} AI questions after ${attempt} attempt(s)`);

  return questions.map((q, index) => ({
    id: index + 1,
    question: q.question || `Question ${index + 1}`,
    choices: Array.isArray(q.choices) ? q.choices.slice(0, 4) : ["A", "B", "C", "D"],
    correct_answer: typeof q.correct_answer === "number" ? Math.min(3, Math.max(0, q.correct_answer)) : 0,
    explanation: q.explanation || "Explanation not available",
    difficulty: q.difficulty || "Medium"
  })).slice(0, numQuestions);
}

// ----------------- CHAT FUNCTION -----------------

export async function generateChatResponse(message) {
  const prompt = `You are an expert tutor for SAT, ACT, and AP test prep.

Student question: "${message}"

Provide a helpful response following these formatting rules:
- Use **bold text** for final answers and important formulas
- Use $inline math$ for mathematical expressions (e.g., $x = 5$, $\\frac{a}{b}$)
- Use $$display math$$ for longer equations (e.g., $$\\int_0^1 x^2 dx$$)
- For multi-step problems, wrap EACH individual step with <highlight>step explanation here</highlight>
- For concept explanations, highlight key insights with <highlight>important concept</highlight>
- Use multiple highlight tags to emphasize different steps and concepts throughout your response
- Clear explanations with practical study tips
- Encouraging tone focused on test preparation

Keep responses 2-3 paragraphs with proper math formatting.`;

  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "You are PrepMind's AI tutor. Help students with test preparation using proper formatting for math and step-by-step solutions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;
    return response?.trim() || "Sorry, I'm having trouble responding. Please try again.";

  } catch (error) {
    console.error("Chat response failed:", error);
    return "I'm experiencing technical difficulties. Please try again in a moment.";
  }
}
