import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  Brain,
  BarChart3,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Sparkles
} from "../components/Icons.jsx";

const quotes = [
  {
    text: "Data is the new oil, but only when properly refined and analyzed.",
    author: "Data Clinic",
    icon: Database,
    color: "from-blue-500 to-indigo-600"
  },
  {
    text: "Transforming raw data into actionable insights, one algorithm at a time.",
    author: "Data Clinic",
    icon: Brain,
    color: "from-purple-500 to-pink-600"
  },
  {
    text: "Your data's potential is limitless when you have the right tools.",
    author: "Data Clinic",
    icon: BarChart3,
    color: "from-green-500 to-emerald-600"
  },
  {
    text: "From messy spreadsheets to meaningful reports in minutes.",
    author: "Data Clinic",
    icon: FileText,
    color: "from-orange-500 to-red-600"
  },
  {
    text: "Security first, insights second - your data is always protected.",
    author: "Data Clinic",
    icon: Shield,
    color: "from-cyan-500 to-blue-600"
  },
  {
    text: "AI-powered preprocessing that learns from your data patterns.",
    author: "Data Clinic",
    icon: TrendingUp,
    color: "from-indigo-500 to-purple-600"
  },
  {
    text: "Collaborate smarter, analyze faster, achieve more together.",
    author: "Data Clinic",
    icon: Users,
    color: "from-teal-500 to-green-600"
  },
  {
    text: "Lightning-fast analysis without compromising on accuracy.",
    author: "Data Clinic",
    icon: Zap,
    color: "from-yellow-500 to-orange-600"
  }
];

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const name = params.get("name");

    if (token && email) {
      // ✅ Save token + full user
      const user = { email, name };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Cycle through quotes every 3 seconds
      const quoteInterval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
      }, 3000);

      // Redirect after 8 seconds
      const redirectTimer = setTimeout(() => {
        navigate("/upload-dataset");
      }, 8000);

      return () => {
        clearInterval(quoteInterval);
        clearTimeout(redirectTimer);
      };
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const quote = quotes[currentQuote];
  const IconComponent = quote.icon;

  return (
    <>
      {/* Dynamic gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Success Header */}
          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Welcome to Data Clinic!
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Authentication successful. Preparing your workspace...
            </p>
          </div>

          {/* Quote Display */}
          <div className="group backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-3xl p-10 shadow-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/15 dark:hover:bg-slate-800/30 hover:transform hover:scale-105 transition-all duration-500 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 mx-auto mb-8 bg-gradient-to-br ${quote.color} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white text-center">{quote.text}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-center">"{quote.author}"</p>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="mt-12">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Redirecting to dashboard in a few seconds...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
