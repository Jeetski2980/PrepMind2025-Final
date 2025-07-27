import { RequestHandler } from "express";
import { generateChatResponse } from "../services/openai";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Check message length
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long. Please keep messages under 1000 characters.'
      });
    }

    console.log(`Processing chat message: "${message.substring(0, 50)}..."`);

    // Generate AI response
    const response = await generateChatResponse(message.trim());

    console.log(`Generated response length: ${response.length} characters`);

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Error in handleChat:', error);
    
    // Provide a helpful fallback response
    const fallbackResponse = `I'm sorry, I'm experiencing some technical difficulties right now. Here are some general test prep tips while I get back online:

• **Practice consistently**: Set aside time daily for focused practice
• **Review mistakes**: Learn from incorrect answers to avoid repeating them
• **Time management**: Practice under timed conditions to build speed
• **Focus on weak areas**: Identify and target your lowest-scoring subjects

Please try asking your question again in a moment!`;

    res.json({
      success: true,
      response: fallbackResponse
    });
  }
};
