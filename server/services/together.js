import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function generateQuestions(testType, subject, topic, numQuestions) {
  const topicText = topic ? ` focusing on ${topic}` : "";
  console.log(`🤖 Generating ${numQuestions} AI questions for: ${testType} ${subject}${topicText}`);

  // Check API key
  const apiKey = process.env.TOGETHER_API_KEY;
  console.log(`API Key present: ${apiKey ? 'YES' : 'NO'}, Length: ${apiKey ? apiKey.length : 0}`);

  if (!apiKey) {
    console.warn("⚠️ No API key found, using local question generation");
    return generateLocalQuestions(testType, subject, topic, numQuestions);
  }

  // Streamlined prompt for faster generation
  const prompt = `Generate ${numQuestions} ${testType} ${subject}${topicText} multiple choice questions.

Requirements:
- ${testType} level appropriate questions
- 4 choices each (A, B, C, D)
- Include detailed explanations
- Use simple math notation (avoid complex LaTeX)
${testType === "AP Exams" ? `- College-level ${subject} content` : ""}

JSON format only:
{"questions": [{"question": "text", "choices": ["A", "B", "C", "D"], "correct_answer": 0, "explanation": "text", "difficulty": "Medium"}]}`;

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

    // Use local generation as fallback to ensure it always works
    console.log("🔄 Falling back to local question generation");
    return generateLocalQuestions(testType, subject, topic, numQuestions);
  }
}

// Local question generation for reliable fallback
function generateLocalQuestions(testType, subject, topic, numQuestions) {
  console.log(`📝 Generating ${numQuestions} local questions for ${testType} ${subject}${topic ? ` - ${topic}` : ""}`);

  const questionTemplates = {
    "SAT": {
      "Math": [
        {
          question: "If f(x) = 2x^2 + 3x - 5, what is f(-2)?",
          choices: ["3", "-7", "1", "-3"],
          correct_answer: 2,
          explanation: "To find f(-2), substitute x = -2 into the function: f(-2) = 2(-2)^2 + 3(-2) - 5 = 2(4) - 6 - 5 = 8 - 6 - 5 = -3. Always follow the order of operations: first square the term, then multiply, then add/subtract from left to right.",
          difficulty: "Medium"
        },
        {
          question: "In a right triangle, if one leg is 3 units and the hypotenuse is 5 units, what is the length of the other leg?",
          choices: ["4", "8", "√34", "2√7"],
          correct_answer: 0,
          explanation: "Use the Pythagorean theorem: a^2 + b^2 = c^2. With a = 3 and c = 5: 3^2 + b^2 = 5^2, so 9 + b^2 = 25, which gives b^2 = 16, therefore b = 4. This is actually a 3-4-5 Pythagorean triple, a common pattern on the SAT.",
          difficulty: "Easy"
        }
      ],
      "Reading": [
        {
          question: "The word 'meticulous' most nearly means:",
          choices: ["careless", "extremely careful", "quick", "generous"],
          correct_answer: 1,
          explanation: "Meticulous means showing great attention to detail; being very careful and precise. The prefix 'met-' relates to measure, and the suffix '-ous' means 'full of,' so meticulous literally means 'full of careful measurement.' This is a high-frequency SAT vocabulary word.",
          difficulty: "Medium"
        }
      ]
    },
    "ACT": {
      "Math": [
        {
          question: "What is the slope of the line passing through points (2, 7) and (6, 15)?",
          choices: ["2", "4", "1/2", "8"],
          correct_answer: 0,
          explanation: "Use the slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (15 - 7)/(6 - 2) = 8/4 = 2. The slope represents the rate of change - for every 1 unit increase in x, y increases by 2 units.",
          difficulty: "Medium"
        }
      ],
      "Science": [
        {
          question: "Which of the following best describes the relationship between temperature and kinetic energy in gas molecules?",
          choices: ["Inversely proportional", "Directly proportional", "No relationship", "Exponentially related"],
          correct_answer: 1,
          explanation: "Temperature and average kinetic energy of gas molecules are directly proportional. As temperature increases, molecules move faster (higher kinetic energy). This relationship is described by the kinetic molecular theory and is fundamental to understanding gas behavior.",
          difficulty: "Medium"
        }
      ]
    },
    "AP Exams": {
      "Calculus AB": [
        {
          question: "Find the derivative of f(x) = 3x^4 - 2x^3 + 5x - 7",
          choices: ["12x^3 - 6x^2 + 5", "12x^3 - 6x^2 + 5x", "3x^3 - 2x^2 + 5", "12x^4 - 6x^3 + 5x"],
          correct_answer: 0,
          explanation: "Using the power rule d/dx[x^n] = nx^(n-1): f'(x) = 3(4)x^3 - 2(3)x^2 + 5(1) - 0 = 12x^3 - 6x^2 + 5. Remember that the derivative of a constant is zero, and the derivative of x is 1.",
          difficulty: "Medium"
        }
      ],
      "Calculus BC": [
        {
          question: "What technique would you use to integrate ∫ x e^(x^2) dx?",
          choices: ["Integration by parts", "U-substitution with u = x^2", "Direct integration", "Partial fractions"],
          correct_answer: 1,
          explanation: "Use u-substitution with u = x^2, then du = 2x dx, so x dx = (1/2) du. The integral becomes (1/2) ∫ e^u du = (1/2)e^u + C = (1/2)e^(x^2) + C. This is a classic u-substitution where the derivative of the inner function appears as a factor.",
          difficulty: "Hard"
        }
      ],
      "Chemistry": [
        {
          question: "Calculate the pH of a 0.01 M HCl solution",
          choices: ["1", "2", "12", "13"],
          correct_answer: 1,
          explanation: "HCl is a strong acid that completely dissociates: [H+] = 0.01 M = 1 × 10^(-2) M. Using pH = -log[H+] = -log(1 × 10^(-2)) = -(-2) = 2. Strong acids and bases completely ionize in solution, making pH calculations straightforward.",
          difficulty: "Medium"
        }
      ],
      "US History": [
        {
          question: "The Missouri Compromise of 1820 was significant because it:",
          choices: ["Ended slavery in Missouri", "Established the 36°30' parallel as the boundary between slave and free territory", "Created the Kansas-Nebraska Act", "Led to the Civil War"],
          correct_answer: 1,
          explanation: "The Missouri Compromise admitted Missouri as a slave state and Maine as a free state, maintaining the balance in the Senate. Most importantly, it established the 36°30' parallel as the dividing line: territories north would be free, south would allow slavery. This compromise temporarily eased tensions but was later repealed by the Kansas-Nebraska Act.",
          difficulty: "Medium"
        }
      ]
    }
  };

  // Get appropriate questions for the test type and subject
  const availableQuestions = questionTemplates[testType]?.[subject] || questionTemplates["SAT"]["Math"];

  // Generate the requested number of questions
  const questions = [];
  for (let i = 0; i < numQuestions; i++) {
    const templateQuestion = availableQuestions[i % availableQuestions.length];
    questions.push({
      id: i + 1,
      question: templateQuestion.question,
      choices: [...templateQuestion.choices],
      correct_answer: templateQuestion.correct_answer,
      explanation: templateQuestion.explanation,
      difficulty: templateQuestion.difficulty
    });
  }

  console.log(`✅ Generated ${questions.length} local questions successfully`);
  return questions;
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
