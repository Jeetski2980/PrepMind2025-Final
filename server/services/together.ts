import Together from 'together-ai';

// Initialize Together AI client
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export interface GenerateQuestionsParams {
  testType: string;
  subject: string;
  topic?: string;
  numQuestions: number;
}

export interface Question {
  id: number;
  question: string;
  choices: string[];
  correct_answer: number;
  explanation: string;
  difficulty: string;
}

export async function generateQuestions({
  testType,
  subject,
  topic,
  numQuestions
}: GenerateQuestionsParams): Promise<Question[]> {
  
  const topicText = topic ? ` focusing specifically on ${topic}` : '';
  
  const prompt = `Generate ${numQuestions} high-quality multiple choice questions for ${testType} ${subject}${topicText}.

Requirements:
- Questions should be authentic and realistic for actual ${testType} ${subject} exams
- Each question should have exactly 4 answer choices (A, B, C, D)
- Include a mix of difficulty levels (Easy, Medium, Hard)
- Provide detailed explanations that teach the concept
- Questions should test understanding, not just memorization
- Use proper academic language and formatting
- Make sure questions are subject-appropriate (no writing questions for math, etc.)

Format your response as valid JSON:
{
  "questions": [
    {
      "question": "Question text here",
      "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation of why this answer is correct and others are wrong",
      "difficulty": "Medium"
    }
  ]
}

Subject-specific guidelines:
- Math: Focus on problem-solving, formulas, and mathematical reasoning
- Reading: Use passage comprehension, inference, and analysis
- Writing/English: Grammar, rhetoric, and language usage
- Science: Data interpretation, scientific reasoning, and analysis
- AP subjects: College-level depth and complexity`;

  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert test prep tutor who creates high-quality practice questions for standardized tests. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 0.9,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Together AI');
    }

    // Clean up response to ensure valid JSON
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(cleanedResponse);
    const questions = parsedResponse.questions;

    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: questions should be an array');
    }

    // Add IDs to questions and validate structure
    return questions.map((q: any, index: number) => ({
      id: index + 1,
      question: q.question || "Question unavailable",
      choices: Array.isArray(q.choices) ? q.choices.slice(0, 4) : ["Option A", "Option B", "Option C", "Option D"],
      correct_answer: typeof q.correct_answer === 'number' ? Math.max(0, Math.min(3, q.correct_answer)) : 0,
      explanation: q.explanation || "Explanation unavailable",
      difficulty: q.difficulty || "Medium"
    }));

  } catch (error) {
    console.error('Error generating questions with Together AI:', error);
    
    // Fallback to improved quality mock questions if Together AI fails
    return generateFallbackQuestions(testType, subject, topic, numQuestions);
  }
}

export async function generateChatResponse(message: string): Promise<string> {
  const prompt = `You are an expert AI tutor specializing in SAT, ACT, and AP test preparation. 

Student message: "${message}"

Provide a helpful, detailed response that:
- Addresses their specific question or concern
- Gives practical test-taking strategies
- Explains concepts clearly with examples
- Offers study tips and resources
- Maintains an encouraging, supportive tone
- Focuses specifically on test preparation content

Keep responses comprehensive but not overwhelming (2-4 paragraphs).`;

  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "You are PrepMind's AI tutor - an expert in SAT, ACT, and AP test preparation. You provide clear, helpful, and encouraging guidance to students preparing for standardized tests. Always keep responses focused on educational content and test preparation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
      top_p: 0.9,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return "I'm sorry, I'm having trouble responding right now. Please try asking your question again.";
    }

    // Clean up the response
    return response.trim();

  } catch (error) {
    console.error('Error generating chat response with Together AI:', error);
    return "I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to ask a different question about test preparation.";
  }
}

// Improved fallback questions for when Together AI isn't available
function generateFallbackQuestions(testType: string, subject: string, topic: string | undefined, numQuestions: number): Question[] {
  const questions: Question[] = [];
  
  // Generate subject-appropriate questions
  if (subject.toLowerCase().includes('math')) {
    questions.push(
      {
        id: 1,
        question: "If 3x + 7 = 22, what is the value of x?",
        choices: ["x = 5", "x = 7", "x = 15", "x = 29"],
        correct_answer: 0,
        explanation: "To solve 3x + 7 = 22, subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5.",
        difficulty: "Easy"
      },
      {
        id: 2,
        question: "What is the slope of the line passing through points (2, 5) and (6, 13)?",
        choices: ["2", "4", "8", "1/2"],
        correct_answer: 0,
        explanation: "Using the slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (13 - 5)/(6 - 2) = 8/4 = 2.",
        difficulty: "Medium"
      },
      {
        id: 3,
        question: "If f(x) = 2x² - 3x + 1, what is f(3)?",
        choices: ["10", "16", "18", "28"],
        correct_answer: 0,
        explanation: "Substitute x = 3: f(3) = 2(3)² - 3(3) + 1 = 2(9) - 9 + 1 = 18 - 9 + 1 = 10.",
        difficulty: "Medium"
      }
    );
  } else if (subject.toLowerCase().includes('reading')) {
    questions.push(
      {
        id: 1,
        question: "In context, the word 'deliberate' most nearly means:",
        choices: ["intentional", "slow", "careful", "thoughtful"],
        correct_answer: 0,
        explanation: "'Deliberate' in most reading contexts means intentional or purposeful, suggesting something done on purpose rather than by accident.",
        difficulty: "Medium"
      },
      {
        id: 2,
        question: "The primary purpose of the passage is to:",
        choices: ["argue for a position", "describe a process", "analyze a problem", "compare two theories"],
        correct_answer: 2,
        explanation: "Reading comprehension questions often test your ability to identify the main purpose. Look for the central argument or theme.",
        difficulty: "Medium"
      }
    );
  } else if (subject.toLowerCase().includes('science')) {
    questions.push(
      {
        id: 1,
        question: "According to the data in the graph, what happens to enzyme activity as temperature increases from 20°C to 40°C?",
        choices: ["It decreases steadily", "It increases then decreases", "It remains constant", "It increases steadily"],
        correct_answer: 3,
        explanation: "Enzyme activity typically increases with temperature up to an optimal point, so from 20°C to 40°C, activity would generally increase steadily before reaching the optimal temperature.",
        difficulty: "Medium"
      }
    );
  } else if (subject.toLowerCase().includes('english') || subject.toLowerCase().includes('writing')) {
    questions.push(
      {
        id: 1,
        question: "Which of the following sentences contains a comma splice?",
        choices: ["I went to the store, I bought milk.", "Although I was tired, I finished my homework.", "The dog barked loudly, and the neighbors complained.", "She studied hard; therefore, she passed the test."],
        correct_answer: 0,
        explanation: "A comma splice occurs when two independent clauses are joined only by a comma. Option A incorrectly uses just a comma to connect two complete thoughts.",
        difficulty: "Medium"
      }
    );
  }

  // Return requested number of questions (repeat if necessary)
  const result: Question[] = [];
  for (let i = 0; i < numQuestions; i++) {
    const baseQuestion = questions[i % questions.length] || questions[0];
    result.push({
      ...baseQuestion,
      id: i + 1
    });
  }
  
  return result;
}
