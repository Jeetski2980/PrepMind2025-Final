import { RequestHandler } from "express";
import { generateChatResponse } from "../services/together";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string",
      });
    }

    // Security: Check message length and sanitize
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error:
          "Message is too long. Please keep messages under 1000 characters.",
      });
    }

    // Security: Basic content filtering to prevent abuse
    const lowercaseMessage = message.toLowerCase();
    const inappropriateContent = [
      "hack",
      "exploit",
      "malware",
      "virus",
      "ddos",
      "attack",
      "illegal",
      "drugs",
      "violence",
      "harm",
      "suicide",
    ];

    if (inappropriateContent.some((word) => lowercaseMessage.includes(word))) {
      return res.json({
        success: true,
        response:
          "I'm designed to help with test preparation and academic subjects. Please ask questions related to SAT, ACT, or AP exam preparation, and I'll be happy to help!",
      });
    }

    // Sanitize message to prevent injection
    const sanitizedMessage = message.replace(/[<>\"'&]/g, "").trim();

    console.log(
      `Processing chat message: "${sanitizedMessage.substring(0, 50)}..."`,
    );

    // Generate AI response using Together AI
    const response = await generateChatResponse(sanitizedMessage);

    console.log(`Generated response length: ${response.length} characters`);

    res.json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error("Error in handleChat:", error);

    // Provide a helpful fallback response
    const fallbackResponse = `I'm sorry, I'm experiencing some technical difficulties right now. Here are some general test prep tips while I get back online:

• **Practice consistently**: Set aside time daily for focused practice
• **Review mistakes**: Learn from incorrect answers to avoid repeating them
• **Time management**: Practice under timed conditions to build speed
• **Focus on weak areas**: Identify and target your lowest-scoring subjects

Please try asking your question again in a moment!`;

    res.json({
      success: true,
      response: fallbackResponse,
    });
  }
};
