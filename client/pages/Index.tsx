import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, BookOpen, MessageSquare, Lightbulb, CheckCircle2, Users, Clock, Award } from "lucide-react";
import Layout from "@/components/Layout";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 dark:from-black dark:to-black">
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-100 dark:bg-emerald-400/10 rounded-full blur-xl opacity-60" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-100 dark:bg-emerald-400/10 rounded-full blur-xl opacity-60" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-100 dark:bg-emerald-400/10 rounded-full blur-xl opacity-60" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Powered by AI badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 mb-8">
              <Lightbulb className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Prep Smarter.</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                Not Harder.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 dark:text-white/70 mb-8 max-w-3xl mx-auto">
              Free AI-powered practice questions and personalized tutoring for SAT, ACT, and AP exams. Just smarter studying.
            </p>

            {/* Mission statement */}
            <p className="text-lg text-gray-700 dark:text-white/80 mb-12 max-w-4xl mx-auto">
              PrepMind provides free, high-quality SAT, ACT, and AP practice to help underprivileged students gain equal access to powerful study tools—so they have the same opportunities to succeed as anyone else.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/practice">
                <Button size="lg" className="bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black px-8 py-3 text-lg">
                  Start Practicing →
                </Button>
              </Link>
              <Link to="/tutor">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-emerald-600 dark:border-white text-emerald-600 dark:text-white hover:bg-emerald-50 dark:hover:bg-white dark:hover:text-black px-8 py-3 text-lg"
                >
                  Meet Your AI Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70">
              Advanced AI technology meets personalized learning to give you the edge you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI-Generated Questions */}
            <Card className="bg-white dark:bg-black border dark:border-white/20 hover:shadow-lg dark:hover:border-emerald-400/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Generated Questions</h3>
                <p className="text-gray-600 dark:text-white/70">
                  Get unlimited practice questions tailored to your test type and difficulty level. Our AI creates fresh content that mirrors real exam patterns.
                </p>
              </CardContent>
            </Card>

            {/* Instant Explanations */}
            <Card className="bg-white dark:bg-black border dark:border-white/20 hover:shadow-lg dark:hover:border-emerald-400/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instant Explanations</h3>
                <p className="text-gray-600 dark:text-white/70">
                  Never wonder why an answer is correct. Get detailed, step-by-step explanations that help you understand concepts, not just memorize patterns.
                </p>
              </CardContent>
            </Card>

            {/* Personal AI Tutor */}
            <Card className="bg-white dark:bg-black border dark:border-white/20 hover:shadow-lg dark:hover:border-emerald-400/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal AI Tutor</h3>
                <p className="text-gray-600 dark:text-white/70">
                  Ask questions anytime, anywhere. Our AI tutor provides personalized help with concepts, strategies, and test-taking techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Students Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">3+</div>
              <div className="text-emerald-100">Exam Types Supported</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">∞</div>
              <div className="text-emerald-100">Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-emerald-100">AI Tutor Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Test Prep?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who are preparing smarter with AI-powered practice questions and tutoring.
          </p>
          <Link to="/practice">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
              Start Practicing Now →
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
