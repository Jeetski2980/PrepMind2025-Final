import { Card, CardContent } from "@/components/ui/card";
import { Brain, Code, Shield, Users, Zap, Heart } from "lucide-react";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground dark:bg-background dark:text-foreground py-12 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-primary dark:text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{/* Using theme colors */}
              <span className="text-foreground dark:text-foreground">About PrepMind</span>
            </h1>
            <p className="text-xl text-muted-foreground dark:text-muted-foreground max-w-3xl mx-auto">
              PrepMind is built to help students prepare for SAT, ACT, and AP
              exams with instant practice, clear explanations, and AI-powered
              tutoring—completely free.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="bg-card dark:bg-card shadow-card dark:shadow-md border border-border dark:border-border rounded-lg mb-12 transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary dark:text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground">
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground dark:text-muted-foreground">
                We believe that quality test preparation should be accessible to every student. 
                PrepMind harnesses the power of AI to provide personalized, effective, and 
                completely free test prep resources to help students achieve their academic goals.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* AI-Powered Learning */}
            <Card className="bg-card dark:bg-card shadow-card dark:shadow-md border border-border dark:border-border rounded-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary dark:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-foreground">
                  AI-Powered Learning
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  Our advanced AI generates unlimited practice questions tailored to your needs, 
                  with instant feedback and detailed explanations to accelerate your learning.
                </p>
              </CardContent>
            </Card>

            {/* Comprehensive Coverage */}
            <Card className="bg-card dark:bg-card shadow-card dark:shadow-md border border-border dark:border-border rounded-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-primary dark:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-foreground">
                  Comprehensive Coverage
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  From SAT and ACT to 15+ AP subjects, PrepMind covers all major standardized tests 
                  with authentic question styles and up-to-date content.
                </p>
              </CardContent>
            </Card>

            {/* Platform & Security */}
            <Card className="bg-card dark:bg-card shadow-card dark:shadow-md border border-border dark:border-border rounded-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary dark:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-foreground">
                  Platform & Security
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  The platform is hosted on secure cloud infrastructure with proper SSL certificates and is developed to ensure reliability and safety. 
                </p>
              </CardContent>
            </Card>

            {/* Community Driven */}
            <Card className="bg-card dark:bg-card shadow-card dark:shadow-md border border-border dark:border-border rounded-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary dark:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-foreground">
                  Student-Focused
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  Built by educators who understand the challenges students face, PrepMind adapts 
                  to individual learning styles and provides personalized guidance.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Section */}
          <Card className="bg-card dark:bg-card shadow-card dark:shadow-md border border-border dark:border-border rounded-lg mb-12 transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary dark:text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground">
                  Powered by Advanced AI
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">
                    Meta-Llama-3.1
                  </h3>
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    Powered by state-of-the-art language models through its API for intelligent question generation and explanations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">
                    Adaptive Learning
                  </h3>
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    AI continuously learns from your responses to provide increasingly personalized practice sessions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">
                    Instant Feedback
                  </h3>
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    Get immediate explanations and learn from mistakes with detailed step-by-step solutions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications Section */}
          <Card className="bg-card text-foreground dark:bg-card dark:text-foreground shadow-card dark:shadow-md border border-border dark:border-border rounded-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  Learn about the technology stack powering PrepMind.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground dark:text-foreground">
                    Frontend Technology
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground dark:text-muted-foreground">
                    <li>React.js for dynamic interface</li>
                    <li>Tailwind CSS for utility-first design</li>
                    <li>JavaScript (ES6+)</li>
                    <li>Component-based architecture</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground dark:text-foreground">
                    Backend & AI
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground dark:text-muted-foreground">
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
