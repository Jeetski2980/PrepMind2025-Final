import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function generateQuestions(testType, subject, topic, numQuestions) {
  const topicText = topic ? ` focusing on ${topic}` : "";
  
  const prompt = `Generate ${numQuestions} multiple choice questions for ${testType} ${subject}${topicText}.

Requirements:
- Realistic questions for actual ${testType} exams
- 4 answer choices each
- Mix of difficulty levels (Easy, Medium, Hard)
- Detailed explanations that are 3-5 sentences long, explaining the concept, why the correct answer is right, why other options are wrong, and providing helpful tips or context
- Proper academic language

Format as JSON:
{
  "questions": [
    {
      "question": "Question text",
      "choices": ["A", "B", "C", "D"],
      "correct_answer": 0,
      "explanation": "Why this answer is correct",
      "difficulty": "Medium"
    }
  ]
}`;

  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "You are a test prep tutor. Create realistic practice questions and respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from AI");
    }

    // Clean JSON response
    let jsonText = response.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/, "").replace(/\n?```$/, "");
    }

    const data = JSON.parse(jsonText);
    const questions = data.questions || [];

    // Format questions with IDs
    return questions.map((q, index) => ({
      id: index + 1,
      question: q.question || "Question unavailable",
      choices: Array.isArray(q.choices) ? q.choices.slice(0, 4) : ["A", "B", "C", "D"],
      correct_answer: typeof q.correct_answer === "number" ? Math.min(3, Math.max(0, q.correct_answer)) : 0,
      explanation: q.explanation || "Explanation unavailable",
      difficulty: q.difficulty || "Medium"
    }));

  } catch (error) {
    console.error("AI generation failed:", error);
    return createFallbackQuestions(testType, subject, numQuestions);
  }
}

export async function generateChatResponse(message) {
  const prompt = `You are an expert tutor for SAT, ACT, and AP test prep.

Student question: "${message}"

Provide a helpful response following these formatting rules:
- Use **bold text** for final answers and important formulas
- Use $inline math$ for mathematical expressions (e.g., $x = 5$, $\\frac{a}{b}$)
- Use $$display math$$ for longer equations (e.g., $$\\int_0^1 x^2 dx$$)
- Wrap 1-2 sentence explanations/summaries with <highlight>explanation here</highlight>
- Clear explanations with practical study tips
- Encouraging tone focused on test preparation

Keep responses 2-3 paragraphs with proper math formatting.`;

  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "You are PrepMind's AI tutor. Help students with test preparation in a clear, encouraging way."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    const response = completion.choices[0]?.message?.content;
    return response?.trim() || "Sorry, I'm having trouble responding. Please try again.";

  } catch (error) {
    console.error("Chat response failed:", error);
    return "I'm experiencing technical difficulties. Please try again in a moment.";
  }
}

// Simple fallback questions when AI fails
function createFallbackQuestions(testType, subject, numQuestions) {
  const mathQuestions = [
    {
      id: 1,
      question: "If 3x + 7 = 22, what is the value of x?",
      choices: ["x = 5", "x = 7", "x = 15", "x = 29"],
      correct_answer: 0,
      explanation: "Subtract 7 from both sides: 3x = 15. Then divide by 3: x = 5.",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "What is the slope between points (2, 5) and (6, 13)?",
      choices: ["2", "4", "8", "1/2"],
      correct_answer: 0,
      explanation: "Use slope formula: (13-5)/(6-2) = 8/4 = 2.",
      difficulty: "Medium"
    }
  ];

  const readingQuestions = [
    {
      id: 1,
      question: "The word 'deliberate' most nearly means:",
      choices: ["intentional", "slow", "careful", "thoughtful"],
      correct_answer: 0,
      explanation: "'Deliberate' means intentional or done on purpose.",
      difficulty: "Medium"
    }
  ];

  let questions = mathQuestions;
  if (subject.toLowerCase().includes("reading")) {
    questions = readingQuestions;
  }

  // Repeat questions to match requested number
  const result = [];
  for (let i = 0; i < numQuestions; i++) {
    const q = questions[i % questions.length];
    result.push({ ...q, id: i + 1 });
  }

  return result;
}
