import { RequestHandler } from "express";
import { generateQuestions } from "../services/together";

export const handleGenerateQuestions: RequestHandler = async (req, res) => {
  try {
    const { testType, subject, topic, numQuestions } = req.body;

    // Validate required fields
    if (!testType || !subject || !numQuestions) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: testType, subject, and numQuestions are required'
      });
    }

    // Validate numQuestions is reasonable
    const questionCount = parseInt(numQuestions);
    if (isNaN(questionCount) || questionCount < 1 || questionCount > 25) {
      return res.status(400).json({
        success: false,
        error: 'numQuestions must be a number between 1 and 25'
      });
    }

    // Security: Sanitize inputs to prevent injection
    const sanitizedTestType = testType.replace(/[<>\"'&]/g, '');
    const sanitizedSubject = subject.replace(/[<>\"'&]/g, '');
    const sanitizedTopic = topic ? topic.replace(/[<>\"'&]/g, '') : undefined;

    console.log(`Generating ${questionCount} questions for ${sanitizedTestType} ${sanitizedSubject}${sanitizedTopic ? ` - ${sanitizedTopic}` : ''}`);

    // Generate questions using Together AI
    const questions = await generateQuestions({
      testType: sanitizedTestType,
      subject: sanitizedSubject,
      topic: sanitizedTopic,
      numQuestions: questionCount
    });

    console.log(`Successfully generated ${questions.length} questions`);

    res.json({
      success: true,
      questions,
      testType: sanitizedTestType,
      subject: sanitizedSubject,
      topic: sanitizedTopic || "General"
    });

  } catch (error) {
    console.error('Error in handleGenerateQuestions:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions. Please try again.'
    });
  }
};
