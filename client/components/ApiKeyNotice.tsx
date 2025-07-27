import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Key } from "lucide-react";

export default function ApiKeyNotice() {
  return (
    <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertTitle className="text-green-800 dark:text-green-300">AI Powered by Together AI</AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-400">
        <div className="space-y-2">
          <p>✅ PrepMind is now powered by Together AI's advanced language models for high-quality test prep content.</p>
          <div className="text-sm bg-green-100 dark:bg-green-800/30 p-3 rounded-md">
            <p className="font-medium mb-1">Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>AI-generated practice questions for SAT, ACT, and AP exams</li>
              <li>Intelligent tutoring with detailed explanations</li>
              <li>Subject-specific content and strategies</li>
              <li>Safe, educational-focused responses</li>
            </ul>
          </div>
          <p className="text-xs">Together AI provides fast, reliable, and cost-effective AI capabilities.</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
