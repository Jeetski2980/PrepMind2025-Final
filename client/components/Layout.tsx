import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-emerald-400/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gray-900 dark:text-white">PrepMind</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  .org
                </span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400"
                    : "text-gray-600 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10"
                }`}
              >
                Home
              </Link>
              <Link
                to="/practice"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/practice")
                    ? "bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400"
                    : "text-gray-600 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10"
                }`}
              >
                AI Practice
              </Link>
              <Link
                to="/tutor"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/tutor")
                    ? "bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400"
                    : "text-gray-600 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10"
                }`}
              >
                AI Tutor
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/about")
                    ? "bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400"
                    : "text-gray-600 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10"
                }`}
              >
                About
              </Link>
            </nav>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-gray-900 dark:text-white">
                    PrepMind
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    .org
                  </span>
                </span>
              </div>
              <p className="text-gray-600 dark:text-white/70 mb-4">
                Free AI-powered practice for SAT, ACT, and AP exams. Prep
                smarter, not harder.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-emerald-400 mb-4">
                Features
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-white/70">
                <li>AI-Generated Questions</li>
                <li>Instant Explanations</li>
                <li>Personal AI Tutor</li>
              </ul>
            </div>

            {/* Supported Tests */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-emerald-400 mb-4">
                Supported Tests
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-white/70">
                <li>SAT (Math, Reading, Writing)</li>
                <li>ACT (All Subjects)</li>
                <li>AP Exams</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/20 text-center">
            <p className="text-gray-500 dark:text-white/50">
              PrepMind.org | Free test prep for everyone. Powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
