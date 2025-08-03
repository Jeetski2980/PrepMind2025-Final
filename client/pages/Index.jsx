import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  Users,
  Clock,
  Award,
} from "lucide-react";
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
            {/* Powered by Advanced AI badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 mb-8">
              <Lightbulb className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gray-900 dark:text-white">Prep </span>
              <span className="text-emerald-600 dark:text-emerald-400">Smarter.</span>
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">Not Harder.</span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-10">
              Free AI-powered practice questions and personalized tutoring for SAT, ACT, and AP
              exams. Just smarter studying.
            </p>

            <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-10">
              PrepMind provides free, high-quality SAT, ACT, and AP practice to help students gain equal access to powerful
              study tools��so they have the same opportunities to succeed as anyone else.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/practice">
                <Button className="text-lg px-8 py-4 bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black">
                  Start Practicing →
                </Button>
              </Link>
              <Link to="/tutor">
                <button className="cssbuttons-io">
                  <span>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Meet Your AI Tutor
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Advanced AI technology meets personalized learning to give you the edge you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-black dark:border dark:border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">AI-Generated Questions</h3>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                  Get unlimited practice questions tailored to your skill level and difficulty level. Our AI creates fresh content that mirrors real exam patterns.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-black dark:border dark:border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Instant Explanations</h3>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                  Never wonder why an answer is correct. Get detailed, step-by-step explanations that help you understand the concepts.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-black dark:border dark:border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Personal AI Tutor</h3>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                  Ask questions anytime, anywhere. Our AI tutor provides personalized help with concepts, strategies, and test-taking techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trusted by Students Everywhere Section */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Students Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">3+</div>
              <div className="text-white/90">Exam Types Supported</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">∞</div>
              <div className="text-white/90">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/90">AI Tutor Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Transform Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Test Prep?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who are preparing smarter with AI-powered practice questions and tutoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/practice">
              <Button className="text-lg px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                Start Practicing Now →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
