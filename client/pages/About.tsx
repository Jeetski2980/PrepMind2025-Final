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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About PrepMind</h1>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              PrepMind is built to help students prepare for SAT, ACT, and AP exams with instant practice, clear explanations, and AI-powered tutoring—completely free.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-black dark:to-black border-emerald-200 dark:border-emerald-400/50 mb-12">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-700 dark:text-white/80 text-lg">
                We use GPT-4 to generate questions and answers in a clean, distraction-free web app built with standard development technologies like React and Node.js.
              </p>
            </CardContent>
          </Card>

          {/* Technical Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* The AI Engine */}
            <Card className="bg-white dark:bg-black border dark:border-white/20 hover:shadow-lg dark:hover:border-emerald-400/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">The AI Engine: Together AI</h3>
                <p className="text-gray-600 dark:text-white/70">
                  Our platform leverages Together AI's advanced language models to generate unlimited, unique practice questions across different subjects. This ensures highly relevant, cost-effective content for your prep.
                </p>
              </CardContent>
            </Card>

            {/* The Technology Stack */}
            <Card className="bg-white dark:bg-black border dark:border-white/20 hover:shadow-lg dark:hover:border-emerald-400/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-orange-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">The Technology Stack</h3>
                <p className="text-gray-600 dark:text-white/70">
                  PrepMind is a modern web application built with professional-grade tools including a React frontend and Node.js backend. It's crafted to be a stable, fast, and user-friendly experience.
                </p>
              </CardContent>
            </Card>

            {/* Platform & Security */}
            <Card className="bg-white dark:bg-black border dark:border-white/20 hover:shadow-lg dark:hover:border-emerald-400/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Platform & Security</h3>
                <p className="text-gray-600 dark:text-white/70">
                  The platform is hosted on secure cloud infrastructure with proper SSL certificates and is developed and maintained by experienced developers to ensure reliability and safety.
                </p>
              </CardContent>
            </Card>

            {/* Accessibility & Equity */}
            <Card className="bg-white dark:bg-black border dark:border-white/20 hover:shadow-lg dark:hover:border-emerald-400/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accessibility & Equity</h3>
                <p className="text-gray-600 dark:text-white/70">
                  Our goal is to deliver a secure, responsive, and accessible platform for students of all backgrounds. We believe powerful study tools should be the same opportunities to succeed as anyone else.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technical Specifications */}
          <Card className="bg-white dark:bg-black border dark:border-white/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Technical Specifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Frontend Technology */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-emerald-400 mb-4">Frontend Technology</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-white/70">
                    <li>• React.js for interactive user interface</li>
                    <li>• Tailwind CSS for responsive design</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Modern JavaScript (ES6+)</li>
                    <li>• Component-based architecture</li>
                  </ul>
                </div>

                {/* Backend & AI */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-emerald-400 mb-4">Backend & AI</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-white/70">
                    <li>• Node.js server infrastructure</li>
                    <li>• Together AI API integration</li>
                    <li>• RESTful API endpoints</li>
                    <li>• Secure API management with content filtering</li>
                    <li>• Real-time content generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-600 dark:to-green-600 text-white p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-emerald-100 mb-6">
                Join thousands of students using PrepMind to achieve their test prep goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/practice"
                  className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Practicing
                </a>
                <a 
                  href="/tutor"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
                >
                  Meet Your AI Tutor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
