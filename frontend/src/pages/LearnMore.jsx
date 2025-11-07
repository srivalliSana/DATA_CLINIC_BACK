import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  HelpCircle,
  Shield,
  FileText,
  Zap,
  Users,
  Database,
  TrendingUp
} from '../components/Icons.jsx';

const faqs = [
  {
    question: "What is Data Clinic?",
    answer: "Data Clinic is an AI-powered data analysis platform that transforms raw data into actionable insights. We handle everything from data cleaning to advanced analytics, making data science accessible to everyone."
  },
  {
    question: "How secure is my data?",
    answer: "We implement enterprise-grade security with end-to-end encryption, SOC 2 compliance, and GDPR adherence. Your data is processed in secure, isolated environments and never stored permanently."
  },
  {
    question: "What file formats do you support?",
    answer: "We support Excel (.xlsx, .xls), CSV, JSON, and SQL databases. Our AI automatically detects and handles various data formats and encodings."
  },
  {
    question: "Can I integrate Data Clinic with my existing tools?",
    answer: "Yes! We offer REST APIs, Python SDK, and integrations with popular tools like Tableau, Power BI, and major cloud platforms (AWS, GCP, Azure)."
  },
  {
    question: "What's included in the free trial?",
    answer: "Free trial includes full access to all features, processing up to 100MB of data, unlimited reports, and 24/7 support for 14 days."
  },
  {
    question: "How does the AI analysis work?",
    answer: "Our AI automatically cleans your data, detects patterns, generates insights, creates visualizations, and produces comprehensive reports - all in minutes instead of days."
  },
  {
    question: "Do you offer team collaboration features?",
    answer: "Yes! Share insights, collaborate on projects, maintain version control, and work together seamlessly across your organization."
  },
  {
    question: "What makes Data Clinic different from other tools?",
    answer: "Unlike traditional tools, Data Clinic handles the entire data workflow automatically - from upload to insights - with 99.9% accuracy and enterprise-grade security."
  }
];

export default function LearnMore() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <>
      {/* Dynamic gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10">
        <main className="py-16">
          {/* Hero Section */}
          <section className="text-center py-20">
            <div className="flex flex-col items-center mb-16">
              <div className="relative mb-8">
                <div className="w-32 h-32 md:w-35 md:h-35 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <HelpCircle className="w-20 h-20 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-2 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Why Data Clinic?
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Everything you need to know about transforming your data workflow with AI-powered insights.
              </p>
            </div>
         

          {/* Key Benefits */}
          
            <div className="text-center mb-16">

              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Join thousands of organizations already transforming their data workflows
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
              {[
                {
                  icon: Database,
                  title: "Save 80% Time",
                  description: "Reduce data preparation time from days to hours with automated workflows."
                },
                {
                  icon: TrendingUp,
                  title: "99.9% Accuracy",
                  description: "AI-powered algorithms deliver unparalleled accuracy in data processing and analysis."
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-level encryption and compliance with GDPR, HIPAA, and SOC 2 standards."
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Share insights, collaborate on projects, and maintain version control across teams."
                }
              ].map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={index}
                    className="group backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/30 hover:bg-white/15 dark:hover:bg-slate-800/30 hover:transform hover:scale-105 transition-all duration-500 h-full flex flex-col min-h-[280px]"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-shadow duration-300 mx-auto">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">{benefit.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center flex-grow">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about getting started with Data Clinic
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 dark:hover:bg-slate-800/10 transition-colors duration-300"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
                    <ChevronRight className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${activeFaq === index ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20">
            <div className="text-center">
              <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-slate-700/30 max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Start your free trial today and experience the power of AI-driven data analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={() => navigate('/about')}
                    className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transform hover:scale-105 transition-all duration-300"
                  >
                    Learn About Us
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
