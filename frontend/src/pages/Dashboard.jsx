import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { 
  Upload, 
  Database, 
  BarChart3, 
  FileText, 
  TrendingUp,
  Activity,
  Users,
  Clock,
  ArrowRight,
  Plus,
  Sparkles
} from "../components/Icons.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDatasets: 0,
    cleanedDatasets: 0,
    totalReports: 0,
    recentActivity: []
  });
  const [recentDatasets, setRecentDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      navigate("/auth/login");
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch datasets
      const datasetsResponse = await fetch('http://localhost:5000/api/upload-dataset', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Fetch reports
      const reportsResponse = await fetch('http://localhost:5000/api/reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (datasetsResponse.ok) {
        const datasetsData = await datasetsResponse.json();
        const datasets = datasetsData.datasets || [];
        
        setStats(prev => ({
          ...prev,
          totalDatasets: datasets.length,
          cleanedDatasets: datasets.filter(ds => ds.cleaned).length
        }));
        
        setRecentDatasets(datasets.slice(0, 5));
      }

      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        const reports = reportsData.reports || [];
        
        setStats(prev => ({
          ...prev,
          totalReports: reports.length
        }));
      }

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Dataset',
      description: 'Upload and preprocess your data',
      icon: Upload,
      color: 'bg-blue-500',
      href: '/upload'
    },
    {
      title: 'Clean Data',
      description: 'Clean and prepare your datasets',
      icon: Database,
      color: 'bg-green-500',
      href: '/clean'
    },
    {
      title: 'Analyze Data',
      description: 'Perform advanced data analysis',
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '/analyze'
    },
    {
      title: 'Generate Report',
      description: 'Create comprehensive reports',
      icon: FileText,
      color: 'bg-orange-500',
      href: '/reports'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-top)] to-[var(--bg-bottom)]" />
        <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-backgroundTop-light dark:from-backgroundTop-dark to-backgroundBottom-light dark:to-backgroundBottom-dark" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating data elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/20 rounded-full animate-pulse floating-element"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-300/20 rounded-full animate-bounce floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-ping floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-1/3 w-8 h-8 bg-green-500/20 rounded-full animate-pulse floating-element" style={{animationDelay: '0.5s'}}></div>
        
        {/* Animated "Data Clinic" text in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[10rem] md:text-[15rem] font-black text-gray-100/5 dark:text-gray-800/10 select-none animate-pulse data-clinic-bg">
            DASHBOARD
          </div>
        </div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Animated data flow lines */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-data-flow"
            style={{
              top: `${30 + i * 20}%`,
              left: '-100px',
              width: '200px',
              animationDelay: `${i * 3}s`,
              animationDuration: '12s'
            }}
          ></div>
        ))}
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-5 pt-20 pb-16">
          <div className="space-y-12">
            {/* Welcome Section with Animations */}
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-sm font-medium animate-bounce">
                <Sparkles className="w-4 h-4" />
                AI-Powered Dashboard
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight dc-heading-blue">
                Welcome to Data Clinic
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Your AI-powered data analytics platform
              </p>
            </div>

            {/* Stats Overview with Amazing Animations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Database, color: 'blue', value: stats.totalDatasets, label: 'Total Datasets', bgColor: 'from-blue-500 to-cyan-500' },
                { icon: Activity, color: 'blue', value: stats.cleanedDatasets, label: 'Cleaned Datasets', bgColor: 'from-blue-500 to-blue-600' },
                { icon: FileText, color: 'purple', value: stats.totalReports, label: 'Reports Generated', bgColor: 'from-purple-500 to-pink-500' },
                { icon: TrendingUp, color: 'orange', value: '100%', label: 'AI Powered', bgColor: 'from-orange-500 to-red-500' }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="dc-card dc-card--outline-blue dc-card--hover animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
                    
                    {/* Floating particles */}
                    
                    
                    <div className="relative flex items-center gap-4">
                      <div className={`p-3 bg-greenButtons-light rounded-xl shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white group-hover:animate-pulse" />
                      </div>
                      <div>
                        <div className={`text-2xl font-bold dc-heading-blue`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated progress bar */}
                    
                  </div>
                );
              })}
            </div>

            {/* Quick Actions with Amazing Animations */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative glass p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg animate-pulse">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quick Actions
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <div
                        key={index}
                        className="group/action relative p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 transition-all duration-500 cursor-pointer transform hover:scale-110 hover:-translate-y-2 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.15}s` }}
                        onClick={() => navigate(action.href)}
                      >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Floating particles */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400/50 rounded-full animate-ping" style={{animationDelay: `${index * 0.2}s`}}></div>
                        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse" style={{animationDelay: `${index * 0.4}s`}}></div>
                        
                        <div className="relative">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${action.color} shadow-lg group-hover/action:scale-125 group-hover/action:rotate-12 transition-all duration-500`}>
                              <IconComponent className="w-6 h-6 text-white group-hover/action:animate-bounce" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover/action:text-blue-600 group-hover/action:translate-x-1 transition-all duration-300" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover/action:text-blue-600 dark:group-hover/action:text-blue-400 transition-colors duration-300">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover/action:text-gray-800 dark:group-hover/action:text-gray-200 transition-colors duration-300">
                            {action.description}
                          </p>
                          
                          {/* Animated progress bar */}
                          <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-1000 w-0 group-hover/action:w-full"></div>
                          </div>
                        </div>
                        
                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover/action:border-blue-300 transition-all duration-500"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Datasets with Amazing Animations */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative glass p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg animate-pulse">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Recent Datasets
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/upload')}
                    className="group/btn relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                    Upload New
                  </button>
                </div>
                
                {recentDatasets.length === 0 ? (
                  <div className="text-center py-16 animate-fade-in-up">
                    <div className="relative inline-block">
                      <Database className="w-20 h-20 text-gray-400 mx-auto mb-6 animate-pulse" />
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
                      No datasets yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
                      Upload your first dataset to get started with data analysis
                    </p>
                    <button
                      onClick={() => navigate('/upload')}
                      className="group/upload relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Upload className="w-5 h-5 group-hover/upload:animate-bounce" />
                        Upload Dataset
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentDatasets.map((dataset, index) => (
                      <div
                        key={dataset._id}
                        className="group/dataset relative p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => navigate('/upload')}
                      >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-500/5 rounded-2xl opacity-0 group-hover/dataset:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Floating particles */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400/50 rounded-full animate-ping" style={{animationDelay: `${index * 0.2}s`}}></div>
                        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse" style={{animationDelay: `${index * 0.4}s`}}></div>
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="p-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-lg group-hover/dataset:scale-125 group-hover/dataset:rotate-12 transition-all duration-500">
                              <Database className="w-6 h-6 text-white group-hover/dataset:animate-bounce" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover/dataset:text-blue-600 dark:group-hover/dataset:text-blue-400 transition-colors duration-300">
                                {dataset.fileName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover/dataset:text-gray-800 dark:group-hover/dataset:text-gray-200 transition-colors duration-300">
                                {dataset.rowCount} rows • {dataset.columns?.length || 0} columns
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500 group-hover/dataset:text-gray-700 transition-colors duration-300">
                              {formatDate(dataset.uploadedAt)}
                            </div>
                            <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                              dataset.cleaned 
                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200' 
                                : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200'
                            } group-hover/dataset:scale-110 transition-transform duration-300`}>
                              {dataset.cleaned ? 'Cleaned' : 'Raw'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Animated progress bar */}
                        <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 w-0 group-hover/dataset:w-full"></div>
                        </div>
                        
                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover/dataset:border-blue-300 transition-all duration-500"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Getting Started */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                Getting Started
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Upload Your Data</h3>
                  <p className="text-sm text-gray-600">
                    Upload CSV, Excel, or JSON files to get started
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Clean & Analyze</h3>
                  <p className="text-sm text-gray-600">
                    Use AI suggestions to clean and analyze your data
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Generate Reports</h3>
                  <p className="text-sm text-gray-600">
                    Create comprehensive reports and visualizations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* rounded container border */}
      <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-black/10 dark:border-white/10" />
    </>
  );
}
