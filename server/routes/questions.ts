import { RequestHandler } from "express";

export const handleGenerateQuestions: RequestHandler = async (req, res) => {
  try {
    const { testType, subject, topic, numQuestions } = req.body;

    // Simulate AI-generated questions for now (in production, this would call OpenAI API)
    const sampleQuestions = [
      {
        id: 1,
        question: `What is the primary purpose of argumentative writing in ${subject}?`,
        choices: [
          "To persuade readers of a scientific problem",
          "To provide a summary of diverse theories",
          "To list facts and data without interpretation",
          "To create fictional scenarios"
        ],
        correct_answer: 0,
        explanation: `Argumentative writing aims to persuade readers by presenting logical arguments supported by evidence. In ${subject}, this involves taking a clear stance and supporting it with relevant examples and reasoning.`,
        difficulty: "Medium"
      },
      {
        id: 2,
        question: `In ${testType} ${subject}, which approach is most effective for analyzing complex passages?`,
        choices: [
          "Reading quickly without taking notes",
          "Focusing only on vocabulary words",
          "Identifying main ideas and supporting details",
          "Memorizing specific facts"
        ],
        correct_answer: 2,
        explanation: "Effective passage analysis requires identifying the main ideas first, then understanding how supporting details reinforce those central concepts. This systematic approach helps with comprehension and retention.",
        difficulty: "Medium"
      },
      {
        id: 3,
        question: `What mathematical concept is fundamental to understanding ${topic || 'algebra'} problems?`,
        choices: [
          "Variable relationships and equations",
          "Only memorizing formulas",
          "Avoiding word problems",
          "Using calculators for everything"
        ],
        correct_answer: 0,
        explanation: "Understanding how variables relate to each other through equations is the foundation of algebraic thinking. This allows you to solve complex problems by setting up and manipulating mathematical relationships.",
        difficulty: "Hard"
      },
      {
        id: 4,
        question: `Which strategy is most helpful for ${testType} test-taking?`,
        choices: [
          "Rushing through questions quickly",
          "Reading all answer choices before selecting",
          "Guessing without reading the question",
          "Spending equal time on every question"
        ],
        correct_answer: 1,
        explanation: "Reading all answer choices helps you understand the full scope of the question and eliminates obviously incorrect options, leading to more accurate answers.",
        difficulty: "Easy"
      },
      {
        id: 5,
        question: `In ${subject}, what is the best way to approach unfamiliar vocabulary?`,
        choices: [
          "Skip words you don't know",
          "Use context clues and word roots",
          "Memorize dictionary definitions only",
          "Avoid reading challenging texts"
        ],
        correct_answer: 1,
        explanation: "Using context clues and understanding word roots helps you determine meaning even when encountering new vocabulary, making you a more effective reader overall.",
        difficulty: "Medium"
      }
    ];

    // Return the requested number of questions
    const questions = sampleQuestions.slice(0, parseInt(numQuestions));

    res.json({
      success: true,
      questions,
      testType,
      subject,
      topic: topic || "General"
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions'
    });
  }
};
