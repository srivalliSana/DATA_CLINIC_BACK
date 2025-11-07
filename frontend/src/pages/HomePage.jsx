import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Database,
  Brain,
  Star,
  Play,
  CheckCircle,
  TrendingUp,
  PieChart,
  FileText,
  Shield,
  Clock,
  Users,
  Award,
  ChevronLeft,
  ChevronRight
} from "../components/Icons.jsx";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Database,
      title: "Data Upload",
      description: "Simply upload your Excel or CSV datasets with our intuitive drag-and-drop interface",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Advanced AI algorithms automatically clean, preprocess, and analyze your data",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: BarChart3,
      title: "Smart Visualizations",
      description: "Generate beautiful, interactive charts and graphs that tell your data's story",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: FileText,
      title: "Comprehensive Reports",
      description: "Receive detailed reports with insights, recommendations, and predictive analytics",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "10+", label: "Datasets Processed", icon: Database },
    { number: "95.9%", label: "Accuracy Rate", icon: Award },
    { number: "10+", label: "Analysis Types", icon: BarChart3 },
    { number: "24/7", label: "AI Support", icon: Clock }
  ];

  const testimonials = [
    {
      name: "Srivalli Sana",
      role: "Student",
      company: "Centurion university ",
      content: "Data Clinic transformed how we analyze our datasets. The AI suggestions are incredibly accurate!",
      avatar: "SS"
    },
    {
      name: "Ganesh",
      role: "Analyst",
      company: "DataFlow Inc",
      content: "The visualization features are outstanding. We can now present data insights like never before.",
      avatar: "GN"
    },
    {
      name: "karthik",
      role: "Student",
      company: "Centurion Univeristy",
      content: "The automated data cleaning saved us weeks of manual work. Absolutely game-changing!",
      avatar: "KT"
    }
  ];

  return (
    <>
      {/* Dynamic gradient background - Full screen */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10">
        <main className="w-full">
          {/* Hero Section - True full width */}
          <section className="py-32 w-full">
            <div className="w-full px-6">
              <div className="text-center w-full max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  Unlocking Your Data's <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Potential
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                  Transforming raw data into actionable insights for a smarter tomorrow.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-lg"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  <button
                    onClick={() => navigate('/learn-more')}
                    className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transform hover:scale-105 transition-all duration-300 text-lg"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - True full width */}
          <section className="py-20 w-full bg-white/5 dark:bg-slate-900/20">
            <div className="w-full px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Your End-to-End Data Solution
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  Data Clinic is a modern platform providing comprehensive data solutions for businesses, researchers, and students. We handle every step of your data journey, from initial upload to final visualization, ensuring you gain maximum value from your information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/15 dark:hover:bg-slate-800/30 hover:transform hover:scale-[1.02] transition-all duration-300 min-h-[280px] flex flex-col"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300 mx-auto`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 text-center">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center text-sm flex-grow flex items-center">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Steps - True full width */}
          <section className="py-20 w-full">
            <div className="w-full px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  From Raw Data to Refined Understanding
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/30 min-h-[240px] flex flex-col justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Data Cleaning</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Automated preprocessing and quality assurance</p>
                </div>

                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/30 min-h-[240px] flex flex-col justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Data Preprocessing</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Intelligent transformation and feature engineering</p>
                </div>

                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/30 min-h-[240px] flex flex-col justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Exploratory Data Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Deep insights and pattern discovery</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section - True full width */}
          <section className="py-20 w-full bg-white/5 dark:bg-slate-900/20">
            <div className="w-full px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="group text-center p-6 backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/15 dark:hover:bg-slate-800/30 hover:transform hover:scale-[1.02] transition-all duration-300 min-h-[180px] flex flex-col justify-center"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">{stat.number}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Testimonials - True full width */}
          <section className="py-20 w-full">
            <div className="w-full px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  What Our Users Say
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="group backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/15 dark:hover:bg-slate-800/30 hover:transform hover:scale-[1.02] transition-all duration-300 min-h-[220px] flex flex-col justify-center"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        {testimonial.avatar}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{testimonial.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">{testimonial.role}, {testimonial.company}</p>
                      <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm">"{testimonial.content}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
