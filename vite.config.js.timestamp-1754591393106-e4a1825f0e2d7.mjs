// vite.config.js
import { defineConfig } from "file:///app/code/node_modules/vite/dist/node/index.js";
import react from "file:///app/code/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";

// server/index.js
import "file:///app/code/node_modules/dotenv/config.js";
import express from "file:///app/code/node_modules/express/index.js";
import cors from "file:///app/code/node_modules/cors/lib/index.js";

// server/services/together.js
import Together from "file:///app/code/node_modules/together-ai/index.mjs";
var together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});
async function generateQuestions(testType, subject, topic, numQuestions) {
  const topicText = topic ? ` focusing on ${topic}` : "";
  const prompt = `Generate ${numQuestions} multiple choice questions for ${testType} ${subject}${topicText}.

Requirements:
- Realistic questions for actual ${testType} exams
- 4 answer choices each
- Mix of difficulty levels (Easy, Medium, Hard)
- Detailed explanations that are 3-5 sentences long, explaining the concept, why the correct answer is right, why other options are wrong, and providing helpful tips or context
- Proper academic language
- For mathematical expressions, use LaTeX syntax: $x^2$ for powers, $\frac{a}{b}$ for fractions, $sqrt{x}$ for square roots, etc.
- Wrap inline math in single $ signs: $2x + 3$
- Wrap display math in double $$ signs: $$int_0^1 x^2 dx$$

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
      max_tokens: 3e3
    });
    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from AI");
    }
    let jsonText = response.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/, "").replace(/\n?```$/, "");
    }
    const data = JSON.parse(jsonText);
    const questions = data.questions || [];
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
async function generateChatResponse(message) {
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
function createFallbackQuestions(testType, subject, numQuestions) {
  const mathQuestions = [
    {
      id: 1,
      question: "If 3x + 7 = 22, what is the value of x?",
      choices: ["x = 5", "x = 7", "x = 15", "x = 29"],
      correct_answer: 0,
      explanation: "To solve this linear equation, we need to isolate the variable x. First, subtract 7 from both sides: 3x + 7 - 7 = 22 - 7, which gives us 3x = 15. Next, divide both sides by 3 to get x = 5. We can verify this by substituting back: 3(5) + 7 = 15 + 7 = 22. This type of algebraic manipulation is fundamental for SAT math problems.",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "What is the slope between points (2, 5) and (6, 13)?",
      choices: ["2", "4", "8", "1/2"],
      correct_answer: 0,
      explanation: "The slope between two points is calculated using the formula: slope = (y\u2082 - y\u2081)/(x\u2082 - x\u2081). Substituting our points (2, 5) and (6, 13): slope = (13 - 5)/(6 - 2) = 8/4 = 2. This means for every 1 unit increase in x, y increases by 2 units. Understanding slope is crucial for coordinate geometry questions on standardized tests.",
      difficulty: "Medium"
    }
  ];
  const readingQuestions = [
    {
      id: 1,
      question: "The word 'deliberate' most nearly means:",
      choices: ["intentional", "slow", "careful", "thoughtful"],
      correct_answer: 0,
      explanation: "The word 'deliberate' as an adjective means intentional, carefully planned, or done on purpose. It comes from the Latin 'deliberatus' meaning 'weighed' or 'considered carefully'. In test contexts, 'deliberate' often contrasts with accidental or spontaneous actions. When you see this word on reading comprehension passages, it usually suggests that someone made a conscious, thoughtful decision.",
      difficulty: "Medium"
    }
  ];
  let questions = mathQuestions;
  if (subject.toLowerCase().includes("reading")) {
    questions = readingQuestions;
  }
  const result = [];
  for (let i = 0; i < numQuestions; i++) {
    const q = questions[i % questions.length];
    result.push({ ...q, id: i + 1 });
  }
  return result;
}

// server/routes/questions.js
async function handleGenerateQuestions(req, res) {
  try {
    const { testType, subject, topic, numQuestions } = req.body;
    if (!testType || !subject || !numQuestions) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: testType, subject, and numQuestions"
      });
    }
    const questionCount = parseInt(numQuestions);
    if (questionCount < 1 || questionCount > 25) {
      return res.status(400).json({
        success: false,
        error: "Number of questions must be between 1 and 25"
      });
    }
    console.log(`Generating ${questionCount} questions for ${testType} ${subject}`);
    const questions = await generateQuestions(testType, subject, topic, questionCount);
    res.json({
      success: true,
      questions,
      testType,
      subject,
      topic: topic || "General"
    });
  } catch (error) {
    console.error("Question generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate questions. Please try again."
    });
  }
}

// server/routes/chat.js
async function handleChat(req, res) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }
    if (message.length > 1e3) {
      return res.status(400).json({
        success: false,
        error: "Message too long. Please keep under 1000 characters."
      });
    }
    console.log(`Chat message: "${message.substring(0, 50)}..."`);
    const response = await generateChatResponse(message.trim());
    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.json({
      success: true,
      response: "I'm having technical difficulties. Please try again in a moment, or ask a different test prep question."
    });
  }
}

// server/index.js
function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/api/ping", (req, res) => {
    res.json({ message: "PrepMind API is running" });
  });
  app.post("/api/generate-questions", handleGenerateQuestions);
  app.post("/api/chat", handleChat);
  return app;
}

// vite.config.js
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///app/code/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "./node_modules"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"]
    }
  },
  build: {
    outDir: "dist/spa"
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared")
    }
  }
}));
function expressPlugin() {
  return {
    name: "express-plugin",
    apply: "serve",
    // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAic2VydmVyL2luZGV4LmpzIiwgInNlcnZlci9zZXJ2aWNlcy90b2dldGhlci5qcyIsICJzZXJ2ZXIvcm91dGVzL3F1ZXN0aW9ucy5qcyIsICJzZXJ2ZXIvcm91dGVzL2NoYXQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgfSBmcm9tIFwiLi9zZXJ2ZXIvaW5kZXguanNcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgZnM6IHtcbiAgICAgIGFsbG93OiBbXCIuL2NsaWVudFwiLCBcIi4vc2hhcmVkXCIsIFwiLi9ub2RlX21vZHVsZXNcIl0sXG4gICAgICBkZW55OiBbXCIuZW52XCIsIFwiLmVudi4qXCIsIFwiKi57Y3J0LHBlbX1cIiwgXCIqKi8uZ2l0LyoqXCIsIFwic2VydmVyLyoqXCJdLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImRpc3Qvc3BhXCIsXG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBleHByZXNzUGx1Z2luKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vY2xpZW50XCIpLFxuICAgICAgXCJAc2hhcmVkXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zaGFyZWRcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcblxuZnVuY3Rpb24gZXhwcmVzc1BsdWdpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcImV4cHJlc3MtcGx1Z2luXCIsXG4gICAgYXBwbHk6IFwic2VydmVcIiwgLy8gT25seSBhcHBseSBkdXJpbmcgZGV2ZWxvcG1lbnQgKHNlcnZlIG1vZGUpXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgY29uc3QgYXBwID0gY3JlYXRlU2VydmVyKCk7XG5cbiAgICAgIC8vIEFkZCBFeHByZXNzIGFwcCBhcyBtaWRkbGV3YXJlIHRvIFZpdGUgZGV2IHNlcnZlclxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhcHApO1xuICAgIH0sXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvaW5kZXguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9pbmRleC5qc1wiO2ltcG9ydCBcImRvdGVudi9jb25maWdcIjtcbmltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuaW1wb3J0IHsgaGFuZGxlR2VuZXJhdGVRdWVzdGlvbnMgfSBmcm9tIFwiLi9yb3V0ZXMvcXVlc3Rpb25zLmpzXCI7XG5pbXBvcnQgeyBoYW5kbGVDaGF0IH0gZnJvbSBcIi4vcm91dGVzL2NoYXQuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNlcnZlcigpIHtcbiAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xuXG4gIC8vIEJhc2ljIG1pZGRsZXdhcmVcbiAgYXBwLnVzZShjb3JzKCkpO1xuICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcblxuICAvLyBIZWFsdGggY2hlY2tcbiAgYXBwLmdldChcIi9hcGkvcGluZ1wiLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiUHJlcE1pbmQgQVBJIGlzIHJ1bm5pbmdcIiB9KTtcbiAgfSk7XG5cbiAgLy8gTWFpbiBBUEkgcm91dGVzXG4gIGFwcC5wb3N0KFwiL2FwaS9nZW5lcmF0ZS1xdWVzdGlvbnNcIiwgaGFuZGxlR2VuZXJhdGVRdWVzdGlvbnMpO1xuICBhcHAucG9zdChcIi9hcGkvY2hhdFwiLCBoYW5kbGVDaGF0KTtcblxuICByZXR1cm4gYXBwO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3NlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3NlcnZpY2VzL3RvZ2V0aGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9zZXJ2ZXIvc2VydmljZXMvdG9nZXRoZXIuanNcIjtpbXBvcnQgVG9nZXRoZXIgZnJvbSBcInRvZ2V0aGVyLWFpXCI7XG5cbmNvbnN0IHRvZ2V0aGVyID0gbmV3IFRvZ2V0aGVyKHtcbiAgYXBpS2V5OiBwcm9jZXNzLmVudi5UT0dFVEhFUl9BUElfS0VZLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVF1ZXN0aW9ucyh0ZXN0VHlwZSwgc3ViamVjdCwgdG9waWMsIG51bVF1ZXN0aW9ucykge1xuICBjb25zdCB0b3BpY1RleHQgPSB0b3BpYyA/IGAgZm9jdXNpbmcgb24gJHt0b3BpY31gIDogXCJcIjtcbiAgXG4gIGNvbnN0IHByb21wdCA9IGBHZW5lcmF0ZSAke251bVF1ZXN0aW9uc30gbXVsdGlwbGUgY2hvaWNlIHF1ZXN0aW9ucyBmb3IgJHt0ZXN0VHlwZX0gJHtzdWJqZWN0fSR7dG9waWNUZXh0fS5cblxuUmVxdWlyZW1lbnRzOlxuLSBSZWFsaXN0aWMgcXVlc3Rpb25zIGZvciBhY3R1YWwgJHt0ZXN0VHlwZX0gZXhhbXNcbi0gNCBhbnN3ZXIgY2hvaWNlcyBlYWNoXG4tIE1peCBvZiBkaWZmaWN1bHR5IGxldmVscyAoRWFzeSwgTWVkaXVtLCBIYXJkKVxuLSBEZXRhaWxlZCBleHBsYW5hdGlvbnMgdGhhdCBhcmUgMy01IHNlbnRlbmNlcyBsb25nLCBleHBsYWluaW5nIHRoZSBjb25jZXB0LCB3aHkgdGhlIGNvcnJlY3QgYW5zd2VyIGlzIHJpZ2h0LCB3aHkgb3RoZXIgb3B0aW9ucyBhcmUgd3JvbmcsIGFuZCBwcm92aWRpbmcgaGVscGZ1bCB0aXBzIG9yIGNvbnRleHRcbi0gUHJvcGVyIGFjYWRlbWljIGxhbmd1YWdlXG4tIEZvciBtYXRoZW1hdGljYWwgZXhwcmVzc2lvbnMsIHVzZSBMYVRlWCBzeW50YXg6ICR4XjIkIGZvciBwb3dlcnMsICRcXGZyYWN7YX17Yn0kIGZvciBmcmFjdGlvbnMsICRcXHNxcnR7eH0kIGZvciBzcXVhcmUgcm9vdHMsIGV0Yy5cbi0gV3JhcCBpbmxpbmUgbWF0aCBpbiBzaW5nbGUgJCBzaWduczogJDJ4ICsgMyRcbi0gV3JhcCBkaXNwbGF5IG1hdGggaW4gZG91YmxlICQkIHNpZ25zOiAkJFxcaW50XzBeMSB4XjIgZHgkJFxuXG5Gb3JtYXQgYXMgSlNPTjpcbntcbiAgXCJxdWVzdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwicXVlc3Rpb25cIjogXCJRdWVzdGlvbiB0ZXh0XCIsXG4gICAgICBcImNob2ljZXNcIjogW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiXSxcbiAgICAgIFwiY29ycmVjdF9hbnN3ZXJcIjogMCxcbiAgICAgIFwiZXhwbGFuYXRpb25cIjogXCJXaHkgdGhpcyBhbnN3ZXIgaXMgY29ycmVjdFwiLFxuICAgICAgXCJkaWZmaWN1bHR5XCI6IFwiTWVkaXVtXCJcbiAgICB9XG4gIF1cbn1gO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgY29tcGxldGlvbiA9IGF3YWl0IHRvZ2V0aGVyLmNoYXQuY29tcGxldGlvbnMuY3JlYXRlKHtcbiAgICAgIG1vZGVsOiBcIm1ldGEtbGxhbWEvTWV0YS1MbGFtYS0zLjEtOEItSW5zdHJ1Y3QtVHVyYm9cIixcbiAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByb2xlOiBcInN5c3RlbVwiLFxuICAgICAgICAgIGNvbnRlbnQ6IFwiWW91IGFyZSBhIHRlc3QgcHJlcCB0dXRvci4gQ3JlYXRlIHJlYWxpc3RpYyBwcmFjdGljZSBxdWVzdGlvbnMgYW5kIHJlc3BvbmQgd2l0aCB2YWxpZCBKU09OIG9ubHkuXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgIGNvbnRlbnQ6IHByb21wdFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgdGVtcGVyYXR1cmU6IDAuNyxcbiAgICAgIG1heF90b2tlbnM6IDMwMDBcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gY29tcGxldGlvbi5jaG9pY2VzWzBdPy5tZXNzYWdlPy5jb250ZW50O1xuICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHJlc3BvbnNlIGZyb20gQUlcIik7XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gSlNPTiByZXNwb25zZVxuICAgIGxldCBqc29uVGV4dCA9IHJlc3BvbnNlLnRyaW0oKTtcbiAgICBpZiAoanNvblRleHQuc3RhcnRzV2l0aChcImBgYGpzb25cIikpIHtcbiAgICAgIGpzb25UZXh0ID0ganNvblRleHQucmVwbGFjZSgvYGBganNvblxcbj8vLCBcIlwiKS5yZXBsYWNlKC9cXG4/YGBgJC8sIFwiXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGpzb25UZXh0KTtcbiAgICBjb25zdCBxdWVzdGlvbnMgPSBkYXRhLnF1ZXN0aW9ucyB8fCBbXTtcblxuICAgIC8vIEZvcm1hdCBxdWVzdGlvbnMgd2l0aCBJRHNcbiAgICByZXR1cm4gcXVlc3Rpb25zLm1hcCgocSwgaW5kZXgpID0+ICh7XG4gICAgICBpZDogaW5kZXggKyAxLFxuICAgICAgcXVlc3Rpb246IHEucXVlc3Rpb24gfHwgXCJRdWVzdGlvbiB1bmF2YWlsYWJsZVwiLFxuICAgICAgY2hvaWNlczogQXJyYXkuaXNBcnJheShxLmNob2ljZXMpID8gcS5jaG9pY2VzLnNsaWNlKDAsIDQpIDogW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiXSxcbiAgICAgIGNvcnJlY3RfYW5zd2VyOiB0eXBlb2YgcS5jb3JyZWN0X2Fuc3dlciA9PT0gXCJudW1iZXJcIiA/IE1hdGgubWluKDMsIE1hdGgubWF4KDAsIHEuY29ycmVjdF9hbnN3ZXIpKSA6IDAsXG4gICAgICBleHBsYW5hdGlvbjogcS5leHBsYW5hdGlvbiB8fCBcIkV4cGxhbmF0aW9uIHVuYXZhaWxhYmxlXCIsXG4gICAgICBkaWZmaWN1bHR5OiBxLmRpZmZpY3VsdHkgfHwgXCJNZWRpdW1cIlxuICAgIH0pKTtcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJBSSBnZW5lcmF0aW9uIGZhaWxlZDpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBjcmVhdGVGYWxsYmFja1F1ZXN0aW9ucyh0ZXN0VHlwZSwgc3ViamVjdCwgbnVtUXVlc3Rpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVDaGF0UmVzcG9uc2UobWVzc2FnZSkge1xuICBjb25zdCBwcm9tcHQgPSBgWW91IGFyZSBhbiBleHBlcnQgdHV0b3IgZm9yIFNBVCwgQUNULCBhbmQgQVAgdGVzdCBwcmVwLlxuXG5TdHVkZW50IHF1ZXN0aW9uOiBcIiR7bWVzc2FnZX1cIlxuXG5Qcm92aWRlIGEgaGVscGZ1bCByZXNwb25zZSBmb2xsb3dpbmcgdGhlc2UgZm9ybWF0dGluZyBydWxlczpcbi0gVXNlICoqYm9sZCB0ZXh0KiogZm9yIGZpbmFsIGFuc3dlcnMgYW5kIGltcG9ydGFudCBmb3JtdWxhc1xuLSBVc2UgJGlubGluZSBtYXRoJCBmb3IgbWF0aGVtYXRpY2FsIGV4cHJlc3Npb25zIChlLmcuLCAkeCA9IDUkLCAkXFxcXGZyYWN7YX17Yn0kKVxuLSBVc2UgJCRkaXNwbGF5IG1hdGgkJCBmb3IgbG9uZ2VyIGVxdWF0aW9ucyAoZS5nLiwgJCRcXFxcaW50XzBeMSB4XjIgZHgkJClcbi0gRm9yIG11bHRpLXN0ZXAgcHJvYmxlbXMsIHdyYXAgRUFDSCBpbmRpdmlkdWFsIHN0ZXAgd2l0aCA8aGlnaGxpZ2h0PnN0ZXAgZXhwbGFuYXRpb24gaGVyZTwvaGlnaGxpZ2h0PlxuLSBGb3IgY29uY2VwdCBleHBsYW5hdGlvbnMsIGhpZ2hsaWdodCBrZXkgaW5zaWdodHMgd2l0aCA8aGlnaGxpZ2h0PmltcG9ydGFudCBjb25jZXB0PC9oaWdobGlnaHQ+XG4tIFVzZSBtdWx0aXBsZSBoaWdobGlnaHQgdGFncyB0byBlbXBoYXNpemUgZGlmZmVyZW50IHN0ZXBzIGFuZCBjb25jZXB0cyB0aHJvdWdob3V0IHlvdXIgcmVzcG9uc2Vcbi0gQ2xlYXIgZXhwbGFuYXRpb25zIHdpdGggcHJhY3RpY2FsIHN0dWR5IHRpcHNcbi0gRW5jb3VyYWdpbmcgdG9uZSBmb2N1c2VkIG9uIHRlc3QgcHJlcGFyYXRpb25cblxuS2VlcCByZXNwb25zZXMgMi0zIHBhcmFncmFwaHMgd2l0aCBwcm9wZXIgbWF0aCBmb3JtYXR0aW5nLmA7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBjb21wbGV0aW9uID0gYXdhaXQgdG9nZXRoZXIuY2hhdC5jb21wbGV0aW9ucy5jcmVhdGUoe1xuICAgICAgbW9kZWw6IFwibWV0YS1sbGFtYS9NZXRhLUxsYW1hLTMuMS04Qi1JbnN0cnVjdC1UdXJib1wiLFxuICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJvbGU6IFwic3lzdGVtXCIsXG4gICAgICAgICAgY29udGVudDogXCJZb3UgYXJlIFByZXBNaW5kJ3MgQUkgdHV0b3IuIEhlbHAgc3R1ZGVudHMgd2l0aCB0ZXN0IHByZXBhcmF0aW9uIGluIGEgY2xlYXIsIGVuY291cmFnaW5nIHdheS5cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXG4gICAgICAgICAgY29udGVudDogcHJvbXB0XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICB0ZW1wZXJhdHVyZTogMC44LFxuICAgICAgbWF4X3Rva2VuczogODAwXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGNvbXBsZXRpb24uY2hvaWNlc1swXT8ubWVzc2FnZT8uY29udGVudDtcbiAgICByZXR1cm4gcmVzcG9uc2U/LnRyaW0oKSB8fCBcIlNvcnJ5LCBJJ20gaGF2aW5nIHRyb3VibGUgcmVzcG9uZGluZy4gUGxlYXNlIHRyeSBhZ2Fpbi5cIjtcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJDaGF0IHJlc3BvbnNlIGZhaWxlZDpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBcIkknbSBleHBlcmllbmNpbmcgdGVjaG5pY2FsIGRpZmZpY3VsdGllcy4gUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIG1vbWVudC5cIjtcbiAgfVxufVxuXG4vLyBTaW1wbGUgZmFsbGJhY2sgcXVlc3Rpb25zIHdoZW4gQUkgZmFpbHNcbmZ1bmN0aW9uIGNyZWF0ZUZhbGxiYWNrUXVlc3Rpb25zKHRlc3RUeXBlLCBzdWJqZWN0LCBudW1RdWVzdGlvbnMpIHtcbiAgY29uc3QgbWF0aFF1ZXN0aW9ucyA9IFtcbiAgICB7XG4gICAgICBpZDogMSxcbiAgICAgIHF1ZXN0aW9uOiBcIklmIDN4ICsgNyA9IDIyLCB3aGF0IGlzIHRoZSB2YWx1ZSBvZiB4P1wiLFxuICAgICAgY2hvaWNlczogW1wieCA9IDVcIiwgXCJ4ID0gN1wiLCBcInggPSAxNVwiLCBcInggPSAyOVwiXSxcbiAgICAgIGNvcnJlY3RfYW5zd2VyOiAwLFxuICAgICAgZXhwbGFuYXRpb246IFwiVG8gc29sdmUgdGhpcyBsaW5lYXIgZXF1YXRpb24sIHdlIG5lZWQgdG8gaXNvbGF0ZSB0aGUgdmFyaWFibGUgeC4gRmlyc3QsIHN1YnRyYWN0IDcgZnJvbSBib3RoIHNpZGVzOiAzeCArIDcgLSA3ID0gMjIgLSA3LCB3aGljaCBnaXZlcyB1cyAzeCA9IDE1LiBOZXh0LCBkaXZpZGUgYm90aCBzaWRlcyBieSAzIHRvIGdldCB4ID0gNS4gV2UgY2FuIHZlcmlmeSB0aGlzIGJ5IHN1YnN0aXR1dGluZyBiYWNrOiAzKDUpICsgNyA9IDE1ICsgNyA9IDIyLiBUaGlzIHR5cGUgb2YgYWxnZWJyYWljIG1hbmlwdWxhdGlvbiBpcyBmdW5kYW1lbnRhbCBmb3IgU0FUIG1hdGggcHJvYmxlbXMuXCIsXG4gICAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIlxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDIsXG4gICAgICBxdWVzdGlvbjogXCJXaGF0IGlzIHRoZSBzbG9wZSBiZXR3ZWVuIHBvaW50cyAoMiwgNSkgYW5kICg2LCAxMyk/XCIsXG4gICAgICBjaG9pY2VzOiBbXCIyXCIsIFwiNFwiLCBcIjhcIiwgXCIxLzJcIl0sXG4gICAgICBjb3JyZWN0X2Fuc3dlcjogMCxcbiAgICAgIGV4cGxhbmF0aW9uOiBcIlRoZSBzbG9wZSBiZXR3ZWVuIHR3byBwb2ludHMgaXMgY2FsY3VsYXRlZCB1c2luZyB0aGUgZm9ybXVsYTogc2xvcGUgPSAoeVx1MjA4MiAtIHlcdTIwODEpLyh4XHUyMDgyIC0geFx1MjA4MSkuIFN1YnN0aXR1dGluZyBvdXIgcG9pbnRzICgyLCA1KSBhbmQgKDYsIDEzKTogc2xvcGUgPSAoMTMgLSA1KS8oNiAtIDIpID0gOC80ID0gMi4gVGhpcyBtZWFucyBmb3IgZXZlcnkgMSB1bml0IGluY3JlYXNlIGluIHgsIHkgaW5jcmVhc2VzIGJ5IDIgdW5pdHMuIFVuZGVyc3RhbmRpbmcgc2xvcGUgaXMgY3J1Y2lhbCBmb3IgY29vcmRpbmF0ZSBnZW9tZXRyeSBxdWVzdGlvbnMgb24gc3RhbmRhcmRpemVkIHRlc3RzLlwiLFxuICAgICAgZGlmZmljdWx0eTogXCJNZWRpdW1cIlxuICAgIH1cbiAgXTtcblxuICBjb25zdCByZWFkaW5nUXVlc3Rpb25zID0gW1xuICAgIHtcbiAgICAgIGlkOiAxLFxuICAgICAgcXVlc3Rpb246IFwiVGhlIHdvcmQgJ2RlbGliZXJhdGUnIG1vc3QgbmVhcmx5IG1lYW5zOlwiLFxuICAgICAgY2hvaWNlczogW1wiaW50ZW50aW9uYWxcIiwgXCJzbG93XCIsIFwiY2FyZWZ1bFwiLCBcInRob3VnaHRmdWxcIl0sXG4gICAgICBjb3JyZWN0X2Fuc3dlcjogMCxcbiAgICAgIGV4cGxhbmF0aW9uOiBcIlRoZSB3b3JkICdkZWxpYmVyYXRlJyBhcyBhbiBhZGplY3RpdmUgbWVhbnMgaW50ZW50aW9uYWwsIGNhcmVmdWxseSBwbGFubmVkLCBvciBkb25lIG9uIHB1cnBvc2UuIEl0IGNvbWVzIGZyb20gdGhlIExhdGluICdkZWxpYmVyYXR1cycgbWVhbmluZyAnd2VpZ2hlZCcgb3IgJ2NvbnNpZGVyZWQgY2FyZWZ1bGx5Jy4gSW4gdGVzdCBjb250ZXh0cywgJ2RlbGliZXJhdGUnIG9mdGVuIGNvbnRyYXN0cyB3aXRoIGFjY2lkZW50YWwgb3Igc3BvbnRhbmVvdXMgYWN0aW9ucy4gV2hlbiB5b3Ugc2VlIHRoaXMgd29yZCBvbiByZWFkaW5nIGNvbXByZWhlbnNpb24gcGFzc2FnZXMsIGl0IHVzdWFsbHkgc3VnZ2VzdHMgdGhhdCBzb21lb25lIG1hZGUgYSBjb25zY2lvdXMsIHRob3VnaHRmdWwgZGVjaXNpb24uXCIsXG4gICAgICBkaWZmaWN1bHR5OiBcIk1lZGl1bVwiXG4gICAgfVxuICBdO1xuXG4gIGxldCBxdWVzdGlvbnMgPSBtYXRoUXVlc3Rpb25zO1xuICBpZiAoc3ViamVjdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwicmVhZGluZ1wiKSkge1xuICAgIHF1ZXN0aW9ucyA9IHJlYWRpbmdRdWVzdGlvbnM7XG4gIH1cblxuICAvLyBSZXBlYXQgcXVlc3Rpb25zIHRvIG1hdGNoIHJlcXVlc3RlZCBudW1iZXJcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUXVlc3Rpb25zOyBpKyspIHtcbiAgICBjb25zdCBxID0gcXVlc3Rpb25zW2kgJSBxdWVzdGlvbnMubGVuZ3RoXTtcbiAgICByZXN1bHQucHVzaCh7IC4uLnEsIGlkOiBpICsgMSB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3JvdXRlcy9xdWVzdGlvbnMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXMvcXVlc3Rpb25zLmpzXCI7aW1wb3J0IHsgZ2VuZXJhdGVRdWVzdGlvbnMgfSBmcm9tIFwiLi4vc2VydmljZXMvdG9nZXRoZXIuanNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdlbmVyYXRlUXVlc3Rpb25zKHJlcSwgcmVzKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyB0ZXN0VHlwZSwgc3ViamVjdCwgdG9waWMsIG51bVF1ZXN0aW9ucyB9ID0gcmVxLmJvZHk7XG5cbiAgICAvLyBCYXNpYyB2YWxpZGF0aW9uXG4gICAgaWYgKCF0ZXN0VHlwZSB8fCAhc3ViamVjdCB8fCAhbnVtUXVlc3Rpb25zKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IFwiTWlzc2luZyByZXF1aXJlZCBmaWVsZHM6IHRlc3RUeXBlLCBzdWJqZWN0LCBhbmQgbnVtUXVlc3Rpb25zXCJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHF1ZXN0aW9uQ291bnQgPSBwYXJzZUludChudW1RdWVzdGlvbnMpO1xuICAgIGlmIChxdWVzdGlvbkNvdW50IDwgMSB8fCBxdWVzdGlvbkNvdW50ID4gMjUpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogXCJOdW1iZXIgb2YgcXVlc3Rpb25zIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAyNVwiXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgR2VuZXJhdGluZyAke3F1ZXN0aW9uQ291bnR9IHF1ZXN0aW9ucyBmb3IgJHt0ZXN0VHlwZX0gJHtzdWJqZWN0fWApO1xuXG4gICAgY29uc3QgcXVlc3Rpb25zID0gYXdhaXQgZ2VuZXJhdGVRdWVzdGlvbnModGVzdFR5cGUsIHN1YmplY3QsIHRvcGljLCBxdWVzdGlvbkNvdW50KTtcblxuICAgIHJlcy5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBxdWVzdGlvbnMsXG4gICAgICB0ZXN0VHlwZSxcbiAgICAgIHN1YmplY3QsXG4gICAgICB0b3BpYzogdG9waWMgfHwgXCJHZW5lcmFsXCJcbiAgICB9KTtcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJRdWVzdGlvbiBnZW5lcmF0aW9uIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgcXVlc3Rpb25zLiBQbGVhc2UgdHJ5IGFnYWluLlwiXG4gICAgfSk7XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzL2NoYXQuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXMvY2hhdC5qc1wiO2ltcG9ydCB7IGdlbmVyYXRlQ2hhdFJlc3BvbnNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL3RvZ2V0aGVyLmpzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVDaGF0KHJlcSwgcmVzKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBtZXNzYWdlIH0gPSByZXEuYm9keTtcblxuICAgIC8vIEJhc2ljIHZhbGlkYXRpb25cbiAgICBpZiAoIW1lc3NhZ2UgfHwgdHlwZW9mIG1lc3NhZ2UgIT09IFwic3RyaW5nXCIgfHwgbWVzc2FnZS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IFwiTWVzc2FnZSBpcyByZXF1aXJlZFwiXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5sZW5ndGggPiAxMDAwKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IFwiTWVzc2FnZSB0b28gbG9uZy4gUGxlYXNlIGtlZXAgdW5kZXIgMTAwMCBjaGFyYWN0ZXJzLlwiXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgQ2hhdCBtZXNzYWdlOiBcIiR7bWVzc2FnZS5zdWJzdHJpbmcoMCwgNTApfS4uLlwiYCk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGdlbmVyYXRlQ2hhdFJlc3BvbnNlKG1lc3NhZ2UudHJpbSgpKTtcblxuICAgIHJlcy5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICByZXNwb25zZVxuICAgIH0pO1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkNoYXQgZXJyb3I6XCIsIGVycm9yKTtcbiAgICBcbiAgICByZXMuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgcmVzcG9uc2U6IFwiSSdtIGhhdmluZyB0ZWNobmljYWwgZGlmZmljdWx0aWVzLiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgbW9tZW50LCBvciBhc2sgYSBkaWZmZXJlbnQgdGVzdCBwcmVwIHF1ZXN0aW9uLlwiXG4gICAgfSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNk0sU0FBUyxvQkFBb0I7QUFDMU8sT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTs7O0FDRnFNLE9BQU87QUFDN04sT0FBTyxhQUFhO0FBQ3BCLE9BQU8sVUFBVTs7O0FDRnNPLE9BQU8sY0FBYztBQUU1USxJQUFNLFdBQVcsSUFBSSxTQUFTO0FBQUEsRUFDNUIsUUFBUSxRQUFRLElBQUk7QUFDdEIsQ0FBQztBQUVELGVBQXNCLGtCQUFrQixVQUFVLFNBQVMsT0FBTyxjQUFjO0FBQzlFLFFBQU0sWUFBWSxRQUFRLGdCQUFnQixLQUFLLEtBQUs7QUFFcEQsUUFBTSxTQUFTLFlBQVksWUFBWSxrQ0FBa0MsUUFBUSxJQUFJLE9BQU8sR0FBRyxTQUFTO0FBQUE7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
