import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
      max_tokens: 3000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(response);
    const questions = parsedResponse.questions;

    // Add IDs to questions
    return questions.map((q: any, index: number) => ({
      ...q,
      id: index + 1
    }));

  } catch (error) {
    console.error('Error generating questions with OpenAI:', error);
    
    // Fallback to better quality mock questions if OpenAI fails
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are PrepMind's AI tutor - an expert in SAT, ACT, and AP test preparation. You provide clear, helpful, and encouraging guidance to students preparing for standardized tests."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I'm having trouble responding right now. Please try asking your question again.";

  } catch (error) {
    console.error('Error generating chat response with OpenAI:', error);
    return "I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to ask a different question about test preparation.";
  }
}

// Improved fallback questions for when OpenAI isn't available
function generateFallbackQuestions(testType: string, subject: string, topic: string | undefined, numQuestions: number): Question[] {
  const questions: Question[] = [];
  
  // Generate subject-appropriate questions
  if (subject.toLowerCase().includes('math')) {
    questions.push({
      id: 1,
      question: "If 3x + 7 = 22, what is the value of x?",
      choices: ["x = 5", "x = 7", "x = 15", "x = 29"],
      correct_answer: 0,
      explanation: "To solve 3x + 7 = 22, subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5.",
      difficulty: "Easy"
    });
    
    questions.push({
      id: 2,
      question: "What is the slope of the line passing through points (2, 5) and (6, 13)?",
      choices: ["2", "4", "8", "1/2"],
      correct_answer: 0,
      explanation: "Using the slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (13 - 5)/(6 - 2) = 8/4 = 2.",
      difficulty: "Medium"
    });
  } else if (subject.toLowerCase().includes('reading')) {
    questions.push({
      id: 1,
      question: "In context, the word 'deliberate' most nearly means:",
      choices: ["intentional", "slow", "careful", "thoughtful"],
      correct_answer: 0,
      explanation: "'Deliberate' in most reading contexts means intentional or purposeful, suggesting something done on purpose rather than by accident.",
      difficulty: "Medium"
    });
  } else if (subject.toLowerCase().includes('science')) {
    questions.push({
      id: 1,
      question: "According to the data in the graph, what happens to enzyme activity as temperature increases from 20°C to 40°C?",
      choices: ["It decreases steadily", "It increases then decreases", "It remains constant", "It increases steadily"],
      correct_answer: 3,
      explanation: "Enzyme activity typically increases with temperature up to an optimal point, so from 20°C to 40°C, activity would generally increase steadily before reaching the optimal temperature.",
      difficulty: "Medium"
    });
  }

  // Return requested number of questions (repeat if necessary)
  const result: Question[] = [];
  for (let i = 0; i < numQuestions; i++) {
    const baseQuestion = questions[i % questions.length];
    result.push({
      ...baseQuestion,
      id: i + 1
    });
  }
  
  return result;
}
