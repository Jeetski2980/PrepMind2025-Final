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
              study tools—so they have the same opportunities to succeed as anyone else.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/practice">
                <Button className="text-lg px-8 py-4 bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black">
                  Start Practicing →
                </Button>
              </Link>
              <Link to="/tutor">
                <Button
                  variant="outline"
                  className="text-lg px-8 py-4 border-2 dark:border-white/30 dark:text-white dark:hover:bg-white dark:hover:text-black"
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
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI with proven test prep strategies to maximize your potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-black dark:border dark:border-white/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Questions</h3>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                  Get unlimited practice questions tailored to your skill level and learning gaps, with instant feedback and explanations.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-black dark:border dark:border-white/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">24/7 AI Tutor</h3>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                  Chat with our AI tutor anytime for explanations, study tips, and personalized guidance on any topic.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-black dark:border dark:border-white/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Proven Results</h3>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                  Join thousands of students who've improved their scores using our adaptive learning technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How PrepMind Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Simple, effective, and designed for your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Choose Your Test</h3>
              <p className="text-gray-600 dark:text-white/70">
                Select from SAT, ACT, or AP exams and pick your subject areas to focus on.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Practice & Learn</h3>
              <p className="text-gray-600 dark:text-white/70">
                Work through AI-generated questions and get instant explanations for every answer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Improve Your Score</h3>
              <p className="text-gray-600 dark:text-white/70">
                Track your progress and watch your confidence grow as you master each topic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Why Students Choose PrepMind
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personalized Learning</h3>
                    <p className="text-gray-600 dark:text-white/70">AI adapts to your learning style and identifies areas for improvement.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Comprehensive Coverage</h3>
                    <p className="text-gray-600 dark:text-white/70">All major standardized tests with detailed explanations for every topic.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Always Available</h3>
                    <p className="text-gray-600 dark:text-white/70">Study anytime, anywhere with our 24/7 AI tutor and practice platform.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Completely Free</h3>
                    <p className="text-gray-600 dark:text-white/70">Access all features at no cost - no hidden fees or premium tiers.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-6 border-0 shadow-lg dark:bg-black dark:border dark:border-white/20">
                  <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-white/70">Active Students</div>
                </Card>

                <Card className="text-center p-6 border-0 shadow-lg dark:bg-black dark:border dark:border-white/20">
                  <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1M+</div>
                  <div className="text-sm text-gray-600 dark:text-white/70">Questions Solved</div>
                </Card>

                <Card className="text-center p-6 border-0 shadow-lg dark:bg-black dark:border dark:border-white/20">
                  <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">200+</div>
                  <div className="text-sm text-gray-600 dark:text-white/70">Point Improvement</div>
                </Card>

                <Card className="text-center p-6 border-0 shadow-lg dark:bg-black dark:border dark:border-white/20">
                  <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI</div>
                  <div className="text-sm text-gray-600 dark:text-white/70">Powered</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white dark:text-black mb-4">
            Ready to Boost Your Test Scores?
          </h2>
          <p className="text-xl text-emerald-100 dark:text-black/80 mb-8">
            Join thousands of students who are achieving their target scores with PrepMind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/practice">
              <Button className="text-lg px-8 py-4 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 text-emerald-600 dark:text-emerald-400">
                Start Practicing Now
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                className="text-lg px-8 py-4 border-2 border-white dark:border-black text-white dark:text-black hover:bg-white hover:text-emerald-600 dark:hover:bg-black dark:hover:text-emerald-400"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
