import { Card, CardContent } from "@/components/ui/card";
import { Brain, Code, Shield, Users, Zap, Heart } from "lucide-react";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About PrepMind
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              PrepMind is built to help students prepare for SAT, ACT, and AP
              exams with instant practice, clear explanations, and AI-powered
              tutoring—completely free.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-black dark:to-black border-emerald-200 dark:border-emerald-400/50 mb-12">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 dark:text-white/80 leading-relaxed">
                We believe that quality test preparation should be accessible to every student. 
                PrepMind harnesses the power of AI to provide personalized, effective, and 
                completely free test prep resources to help students achieve their academic goals.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* AI-Powered Learning */}
            <Card className="bg-white dark:bg-black border dark:border-white/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  AI-Powered Learning
                </h3>
                <p className="text-gray-600 dark:text-white/70">
                  Our advanced AI generates unlimited practice questions tailored to your needs, 
                  with instant feedback and detailed explanations to accelerate your learning.
                </p>
              </CardContent>
            </Card>

            {/* Comprehensive Coverage */}
            <Card className="bg-white dark:bg-black border dark:border-white/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Comprehensive Coverage
                </h3>
                <p className="text-gray-600 dark:text-white/70">
                  From SAT and ACT to 15+ AP subjects, PrepMind covers all major standardized tests 
                  with authentic question styles and up-to-date content.
                </p>
              </CardContent>
            </Card>

            {/*Platform &Security*/}
            <Card className="bg-white dark:bg-black border dark:border-white/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Platform &Security
                </h3>
                <p className="text-gray-600 dark:text-white/70">
                  The platform is hosted on sercure cloud infrastucture with proper SSL certificates and is developed to ensure reliability and safety. 
                </p>
              </CardContent>
            </Card>

            {/* Community Driven */}
            <Card className="bg-white dark:bg-black border dark:border-white/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Student-Focused
                </h3>
                <p className="text-gray-600 dark:text-white/70">
                  Built by educators who understand the challenges students face, PrepMind adapts 
                  to individual learning styles and provides personalized guidance.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Section */}
          <Card className="bg-white dark:bg-black border dark:border-white/20 mb-12">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Powered by Advanced AI
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Meta-Llama-3.1
                  </h3>
                  <p className="text-gray-600 dark:text-white/70">
                    Powered by state-of-the-art language models through its API for intelligent question generation and explanations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Adaptive Learning
                  </h3>
                  <p className="text-gray-600 dark:text-white/70">
                    AI continuously learns from your responses to provide increasingly personalized practice sessions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Instant Feedback
                  </h3>
                  <p className="text-gray-600 dark:text-white/70">
                    Get immediate explanations and learn from mistakes with detailed step-by-step solutions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications Section */}
      <Card className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white shadow-md">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Learn about the technology stack powering PrepMind.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Frontend Technology</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>React.js for dynamic interface</li>
                    <li>Tailwind CSS for utility-first design</li>
                    <li>JavaScript (ES6+)</li>
                    <li>Component-based architecture</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Backend & AI</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Node.js backend infrastructure</li>
                    <li>RESTful API design</li>
                    <li>Together AI language model integration</li>
                    <li>Real-time response generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}
