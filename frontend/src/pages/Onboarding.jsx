import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiSparkles,
  HiChartBar,
  HiShieldCheck,
  HiArrowRight,
  HiCheckCircle,
} from 'react-icons/hi';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Onboarding() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      navigate('/upload-dataset');
    } else {
      navigate('/auth/login');
    }
  };

  const features = [
    {
      icon: HiChartBar,
      title: 'Smart Analytics',
      description: 'AI-powered insights from your data'
    },
    {
      icon: HiShieldCheck,
      title: 'Secure & Private',
      description: 'Enterprise-grade data protection'
    },
    {
      icon: HiSparkles,
      title: 'Easy to Use',
      description: 'No coding required, just upload and analyze'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Hero Section - Full Width */}
      <section className="w-full py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-12">
              <HiSparkles className="w-4 h-4" />
              Welcome to Data Clinic
            </div>

            <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Data
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-4xl mx-auto mb-16">
              Unlock powerful insights from your datasets with AI-driven analytics.
              Clean, visualize, and analyze your data in minutes, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <button
                onClick={handleGetStarted}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-lg"
              >
                <span className="relative z- flex items-center gap-3">
                  Get Started Free
                  <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => navigate('/auth/login')}
                className="px-10 py-5 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transform hover:scale-105 transition-all duration-300 text-lg"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features Section - Full Width */}
          <section className="w-full mb-20">
            <div className="grid md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-3xl p-10 shadow-xl border border-white/20 dark:border-slate-700/30 hover:bg-white/15 dark:hover:bg-slate-800/30 hover:transform hover:scale-105 transition-all duration-500"
                >
                  <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section - Full Width */}
          <section className="w-full mb-20">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-3xl p-12 shadow-xl border border-white/20 dark:border-slate-700/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { number: '10+', label: 'Datasets Analyzed' },
                  { number: '95.9%', label: 'Accuracy Rate' },
                  { number: '10+', label: 'Analysis Types' },
                  { number: '24/7', label: 'AI Support' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3">
                      {stat.number}
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom CTA Section - Full Width */}
          <section className="w-full text-center">
            <div className="backdrop-blur-xl bg-white/5 dark:bg-slate-800/10 rounded-3xl p-12 border border-white/10 dark:border-slate-700/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Ready to Transform Your Data?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                Join thousands of data professionals who trust Data Clinic for their analytics needs
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-slate-900 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <HiCheckCircle className="w-6 h-6" />
                Start Your Free Analysis
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
