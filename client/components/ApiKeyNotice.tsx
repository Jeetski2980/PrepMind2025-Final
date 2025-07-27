import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Key } from "lucide-react";

export default function ApiKeyNotice() {
  return (
    <Alert className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-300">OpenAI API Key Required</AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-400">
        <div className="space-y-2">
          <p>To use AI-powered features, you need to add your OpenAI API key:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
            <li>Set the environment variable: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">OPENAI_API_KEY=your-key-here</code></li>
            <li>Restart the server</li>
          </ol>
          <p className="text-xs">Currently using fallback responses until a valid API key is configured.</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
