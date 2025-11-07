import React from "react";
import {
  Target,
  Shield,
  Users,
  Award,
  Lightbulb,
  TrendingUp,
  Brain,
  Database,
  BarChart3,
  Clock
} from "../components/Icons.jsx";

export default function About() {
  const aboutCards = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To democratize data science by providing accessible, powerful, and intelligent tools that enable organizations of all sizes to unlock the full potential of their data."
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description: "To become the world's most trusted data intelligence platform, where AI-powered insights drive innovation and growth across every industry."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Your data's security is paramount. We implement enterprise-grade protection and comply with all major privacy regulations."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every feature is designed with our users in mind, ensuring intuitive experiences that empower data professionals at all levels."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from code quality to customer support and data accuracy."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously push the boundaries of data science to deliver cutting-edge solutions that drive real business value."
    }
  ];

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
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              About Data Clinic
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Empowering organizations worldwide with intelligent data solutions that transform raw information into strategic advantages.
            </p>
          </section>

          {/* About Cards */}
          <section className="py-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
              {aboutCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={index}
                    className="group backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/30 hover:bg-white/15 dark:hover:bg-slate-800/30 hover:transform hover:scale-105 transition-all duration-500 h-full flex flex-col min-h-[320px]"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-shadow duration-300 mx-auto">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">{card.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center flex-grow">{card.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
