import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function generateQuestions(testType, subject, topic, numQuestions) {
  const topicText = topic ? ` focusing on ${topic}` : "";
  console.log(`🤖 Generating ${numQuestions} AI questions for: ${testType} ${subject}${topicText}`);

  // Verify API key exists
  if (!process.env.TOGETHER_API_KEY) {
    throw new Error("TOGETHER_API_KEY environment variable is not set");
  }

  // Optimized prompt for high-quality question generation
  const prompt = `Create ${numQuestions} multiple choice questions for ${testType} ${subject}${topicText}.

CRITICAL REQUIREMENTS:
- Questions must be appropriate for ${testType} ${subject} level
- Exactly 4 answer choices labeled A, B, C, D
- One correct answer (index 0-3)
- Detailed explanations (3-4 sentences)
- Mix of difficulties: Easy, Medium, Hard
- Use proper academic language
- For math: use simple notation like x^2, (a/b), sqrt(x)
${testType === "AP Exams" ? `- Generate college-level ${subject} questions with advanced concepts` : ""}
${topic ? `- Focus specifically on ${topic} concepts and problems` : ""}

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

  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: `You are a ${testType} test prep expert. Generate ${subject} questions. Return valid JSON only.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from AI - API call failed");
    }

    // Clean and parse JSON response
    let jsonText = response.trim();

    // Remove any markdown formatting
    if (jsonText.includes("```")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").replace(/\n?```$/g, "");
    }

    // Find JSON object if response has extra text
    if (!jsonText.startsWith("{")) {
      const startIndex = jsonText.indexOf("{");
      const endIndex = jsonText.lastIndexOf("}");
      if (startIndex !== -1 && endIndex !== -1) {
        jsonText = jsonText.substring(startIndex, endIndex + 1);
      }
    }

    const data = JSON.parse(jsonText);
    const questions = data.questions || [];

    if (questions.length === 0) {
      throw new Error("AI returned empty questions array");
    }

    console.log(`✅ Successfully generated ${questions.length} AI questions for ${testType} ${subject}${topicText}`);

    // Return formatted questions
    return questions.map((q, index) => ({
      id: index + 1,
      question: q.question || `Question ${index + 1}`,
      choices: Array.isArray(q.choices) ? q.choices.slice(0, 4) : ["A", "B", "C", "D"],
      correct_answer: typeof q.correct_answer === "number" ? Math.min(3, Math.max(0, q.correct_answer)) : 0,
      explanation: q.explanation || "Explanation not available",
      difficulty: q.difficulty || "Medium"
    })).slice(0, numQuestions);

  } catch (error) {
    console.error(`❌ AI generation failed for ${testType} ${subject}${topicText}:`, error);

    // NO FALLBACK - Force AI generation only
    throw new Error(`AI question generation failed: ${error.message}. Please try again.`);
  }
}


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
