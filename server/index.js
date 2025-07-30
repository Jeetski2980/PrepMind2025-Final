import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleGenerateQuestions } from "./routes/questions.js";
import { handleChat } from "./routes/chat.js";

export function createServer() {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/ping", (req, res) => {
    res.json({ message: "PrepMind API is running" });
  });

  // Main API routes
  app.post("/api/generate-questions", handleGenerateQuestions);
  app.post("/api/chat", handleChat);

  return app;
}
