// Shared types between client and server

export interface Question {
  id: number;
  question: string;
  choices: string[];
  correct_answer: number;
  explanation: string;
  difficulty: string;
}

export interface QuestionRequest {
  testType: string;
  subject: string;
  topic?: string;
  numQuestions: number;
}

export interface ChatRequest {
  message: string;
}
