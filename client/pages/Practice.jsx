import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import Layout from "@/components/Layout";
import ApiKeyNotice from "@/components/ApiKeyNotice";

const TEST_SUBJECTS = {
  "SAT": ["Math", "Reading", "Writing"],
  "ACT": ["Math", "Reading", "English", "Science"],
  "AP Exams": [
    "Calculus AB", "Calculus BC", "Statistics", "Physics 1", "Physics 2", 
    "Physics C", "Chemistry", "Biology", "English Language", "English Literature",
    "US History", "World History", "Government", "Psychology", "Computer Science A"
  ]
};

const TOPIC_OPTIONS = {
  "Math": ["Algebra", "Geometry", "Trigonometry", "Statistics", "Functions"],
  "Reading": ["Reading Comprehension", "Vocabulary", "Main Ideas", "Inferences"],
  "Writing": ["Grammar", "Sentence Structure", "Essay Writing", "Rhetorical Analysis"],
  "English": ["Grammar", "Punctuation", "Style", "Strategy"],
  "Science": ["Data Analysis", "Scientific Reasoning", "Research Summaries"],
  // AP Exams
  "Calculus AB": ["Limits", "Derivatives", "Integrals", "Applications"],
  "Calculus BC": ["Series", "Parametric Equations", "Polar Coordinates", "Advanced Integration"],
  "Statistics": ["Probability", "Sampling", "Inference", "Regression"],
  "Physics 1": ["Kinematics", "Forces", "Energy", "Waves"],
  "Physics 2": ["Fluid Mechanics", "Thermodynamics", "Electrostatics", "Magnetism"],
  "Physics C": ["Mechanics", "Electricity & Magnetism", "Advanced Calculus"],
  "Chemistry": ["Atomic Structure", "Chemical Bonding", "Reactions", "Thermodynamics"],
  "Biology": ["Cell Biology", "Genetics", "Evolution", "Ecology"],
  "English Language": ["Rhetorical Analysis", "Synthesis", "Argument Writing", "Language Use"],
  "English Literature": ["Poetry Analysis", "Prose Analysis", "Literary Devices", "Thematic Analysis"],
  "US History": ["Colonial Period", "Revolutionary Era", "Civil War", "Modern America"],
  "World History": ["Ancient Civilizations", "Medieval Period", "Renaissance", "Modern World"],
  "Government": ["Constitutional Principles", "Political Institutions", "Civil Rights", "Public Policy"],
  "Psychology": ["Biological Bases", "Sensation & Perception", "Learning", "Cognition"],
  "Computer Science A": ["Object-Oriented Programming", "Data Structures", "Algorithms", "Program Design"]
};

export default function Practice() {
  const [testType, setTestType] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const availableSubjects = testType ? TEST_SUBJECTS[testType] || [] : [];
  const availableTopics = subject ? TOPIC_OPTIONS[subject] || [] : [];

  const generateQuestions = async () => {
    if (!testType || !subject) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType,
          subject,
          topic: topic || "General",
          numQuestions: parseInt(numQuestions)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    }
    setIsGenerating(false);
  };

  const selectAnswer = (questionIndex, answerIndex) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const suggestTopics = () => {
    if (subject && availableTopics.length > 0) {
      const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
      setTopic(randomTopic);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Practice Questions</h1>
            <p className="text-gray-600 dark:text-white/70">
              Get personalized practice questions generated by AI for your specific test and subject
            </p>
          </div>

          {questions.length === 0 ? (
            <div>
              <ApiKeyNotice />
              
              <Card className="bg-white dark:bg-black border dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Choose Your Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Test Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                        Test Type
                      </label>
                      <Select value={testType} onValueChange={setTestType}>
                        <SelectTrigger className="dark:bg-black dark:border-white/50 dark:text-white">
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black dark:border-white/50">
                          <SelectItem value="SAT">SAT</SelectItem>
                          <SelectItem value="ACT">ACT</SelectItem>
                          <SelectItem value="AP Exams">AP Exams</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                        Subject
                      </label>
                      <Select value={subject} onValueChange={setSubject} disabled={!testType}>
                        <SelectTrigger className="dark:bg-black dark:border-white/50 dark:text-white">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black dark:border-white/50">
                          {availableSubjects.map((subj) => (
                            <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Number of Questions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                        Number of Questions
                      </label>
                      <Select value={numQuestions} onValueChange={setNumQuestions}>
                        <SelectTrigger className="dark:bg-black dark:border-white/50 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black dark:border-white/50">
                          <SelectItem value="5">5 Questions</SelectItem>
                          <SelectItem value="10">10 Questions</SelectItem>
                          <SelectItem value="15">15 Questions</SelectItem>
                          <SelectItem value="20">20 Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Topic Selection */}
                  {availableTopics.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                          Specific Topic (Optional)
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={suggestTopics}
                          className="dark:bg-black dark:text-white dark:hover:text-emerald-400 dark:border-white/50 dark:hover:border-emerald-400"
                        >
                          <Lightbulb className="w-4 h-4 mr-1" />
                          Suggest Topics
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableTopics.map((topicOption) => (
                          <Badge
                            key={topicOption}
                            variant={topic === topicOption ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              topic === topicOption
                                ? 'bg-emerald-600 dark:bg-emerald-400 text-white dark:text-black'
                                : 'hover:bg-emerald-50 dark:hover:bg-emerald-400/10 dark:text-white dark:border-white/50'
                            }`}
                            onClick={() => setTopic(topic === topicOption ? "" : topicOption)}
                          >
                            {topicOption}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={generateQuestions}
                    disabled={!testType || !subject || isGenerating}
                    className="w-full bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black"
                  >
                    {isGenerating ? "Generating Questions..." : "Generate Practice Questions"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Quiz Interface */
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-white/70">
                  {testType} - {subject} {topic && `- ${topic}`}
                </div>
                <div className="text-sm text-gray-600 dark:text-white/70">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              </div>

              {!showResults ? (
                /* Current Question */
                <Card className="bg-white dark:bg-black border dark:border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      Question {currentQuestion + 1}
                      <Badge variant="outline" className="ml-2 dark:border-white/50 dark:text-white">
                        {questions[currentQuestion]?.difficulty || "Medium"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 dark:text-white mb-6 text-lg">
                      {questions[currentQuestion]?.question}
                    </p>

                    <div className="space-y-3">
                      {questions[currentQuestion]?.choices.map((choice, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswer(currentQuestion, index)}
                          className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-400/10 dark:border-emerald-400'
                              : 'border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/70'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-semibold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-gray-900 dark:text-white">{choice}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="dark:bg-black dark:border-white/50 dark:text-white"
                      >
                        Previous
                      </Button>

                      {currentQuestion === questions.length - 1 ? (
                        <Button
                          onClick={submitAnswers}
                          disabled={Object.keys(selectedAnswers).length !== questions.length}
                          className="bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black"
                        >
                          Submit Answers
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                          className="bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black"
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Results */
                <div className="space-y-6">
                  <Card className="bg-white dark:bg-black border dark:border-white/20">
                    <CardHeader>
                      <CardTitle className="text-center text-gray-900 dark:text-white">
                        Quiz Complete! Your Score: {calculateScore()}%
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  {questions.map((question, qIndex) => (
                    <Card key={qIndex} className="bg-white dark:bg-black border dark:border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Question {qIndex + 1}</h3>
                          {selectedAnswers[qIndex] === question.correct_answer ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>

                        <p className="text-gray-900 dark:text-white mb-4">{question.question}</p>

                        <div className="space-y-2 mb-4">
                          {question.choices.map((choice, cIndex) => (
                            <div
                              key={cIndex}
                              className={`p-3 rounded-lg border ${
                                cIndex === question.correct_answer
                                  ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                                  : selectedAnswers[qIndex] === cIndex
                                  ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                                  : 'border-gray-200 dark:border-white/20'
                              }`}
                            >
                              <span className="font-medium">
                                {String.fromCharCode(65 + cIndex)}.
                              </span>
                              <span className="ml-2 text-gray-900 dark:text-white">{choice}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-blue-50 dark:bg-white/10 p-4 rounded-lg border dark:border-white/30">
                          <h4 className="font-semibold text-blue-900 dark:text-white mb-2">Explanation:</h4>
                          <p className="text-blue-800 dark:text-white/80">{question.explanation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-center">
                    <Button
                      onClick={resetQuiz}
                      className="bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Take Another Practice Set
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
