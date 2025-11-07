import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Database, 
  Play,
  Download,
  Eye,
  Settings,
  Target,
  Activity,
  Zap,
  Sparkles
} from "../components/Icons.jsx";

export default function AnalyzeDataPage() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [analysisType, setAnalysisType] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      navigate("/auth/login");
    } else {
      fetchDatasets();
    }
  }, [navigate]);

  const fetchDatasets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/upload-dataset', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDatasets(data.datasets || []);
      }
    } catch (err) {
      console.error('Failed to fetch datasets:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedDataset || !analysisType) {
      setError('Please select a dataset and analysis type');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/analyze-dataset/${selectedDataset._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ analysisType })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysisResults(result);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analysisTypes = [
    {
      id: 'descriptive',
      name: 'Descriptive Statistics',
      description: 'Generate summary statistics for numeric columns',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'correlation',
      name: 'Correlation Analysis',
      description: 'Analyze relationships between numeric variables',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      id: 'distribution',
      name: 'Distribution Analysis',
      description: 'Visualize data distributions and patterns',
      icon: PieChart,
      color: 'text-purple-600'
    },
    {
      id: 'outliers',
      name: 'Outlier Detection',
      description: 'Identify and analyze statistical outliers',
      icon: Target,
      color: 'text-red-600'
    },
    {
      id: 'trends',
      name: 'Trend Analysis',
      description: 'Analyze temporal trends and patterns',
      icon: Activity,
      color: 'text-orange-600'
    },
    {
      id: 'predictive',
      name: 'Predictive Analysis',
      description: 'Build simple predictive models',
      icon: Zap,
      color: 'text-indigo-600'
    }
  ];

  return (
    <>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-backgroundTop-light dark:from-backgroundTop-dark to-backgroundBottom-light dark:to-backgroundBottom-dark" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating analysis elements */}
        <div className="absolute top-20 left-10 w-28 h-28 bg-purple-200/20 rounded-full animate-pulse floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200/20 rounded-full animate-bounce floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-200/20 rounded-full animate-ping floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-1/3 w-16 h-16 bg-cyan-200/20 rounded-full animate-pulse floating-element" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-violet-200/20 rounded-full animate-bounce floating-element" style={{animationDelay: '3s'}}></div>
        
        {/* Animated "ANALYZE DATA" text in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[10rem] md:text-[15rem] font-black text-gray-100/5 dark:text-gray-800/10 select-none animate-pulse data-clinic-bg">
            ANALYZE DATA
          </div>
        </div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Animated data flow lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-data-flow"
            style={{
              top: `${20 + i * 15}%`,
              left: '-100px',
              width: '200px',
              animationDelay: `${i * 2}s`,
              animationDuration: '12s'
            }}
          ></div>
        ))}
        
        {/* Rotating analysis elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`rotate-${i}`}
            className="absolute w-4 h-4 border-2 border-purple-400/30 rounded-full animate-spin"
            style={{
              left: `${10 + i * 12}%`,
              top: `${25 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-5 pt-20 pb-16">
          <div className="space-y-12">
            {/* Header with Animations */}
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-sm font-medium animate-bounce">
                <Sparkles className="w-4 h-4" />
                AI-Powered Data Analysis
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                Data Analysis
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Analyze your datasets and discover insights
              </p>
            </div>

            {/* Dataset Selection */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                Select Dataset to Analyze
              </h2>
              
              {datasets.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No datasets found</p>
                  <button
                    onClick={() => navigate('/upload')}
                    className="btn btn-primary"
                  >
                    Upload Dataset
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset._id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedDataset?._id === dataset._id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                      onClick={() => setSelectedDataset(dataset)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-primary-600" />
                          <div>
                            <h3 className="font-semibold">{dataset.fileName}</h3>
                            <p className="text-sm text-gray-600">
                              {dataset.rowCount} rows • {dataset.columns?.length || 0} columns
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {dataset.cleaned ? 'Cleaned' : 'Raw'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analysis Type Selection */}
            {selectedDataset && (
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                  Choose Analysis Type
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          analysisType === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 bg-white hover:border-primary-300'
                        }`}
                        onClick={() => setAnalysisType(type.id)}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className={`w-5 h-5 mt-1 ${type.color}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {type.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={!analysisType || loading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Settings className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Analysis
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResults && (
              <div className="glass p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{color:'var(--title)'}}>
                    Analysis Results
                  </h2>
                  <button className="btn btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Results
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Analysis Summary</h3>
                    <p className="text-blue-800">
                      {analysisResults.summary || 'Analysis completed successfully'}
                    </p>
                  </div>

                  {/* Statistics */}
                  {analysisResults.statistics && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Statistical Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(analysisResults.statistics).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded">
                            <div className="text-sm text-gray-600">{key}</div>
                            <div className="font-semibold">{typeof value === 'number' ? value.toFixed(2) : value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Charts */}
                  {analysisResults.charts && analysisResults.charts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Visualizations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysisResults.charts.map((chart, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">{chart.title}</h4>
                            <div className="h-64 bg-white rounded border flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                                <p>Chart visualization would appear here</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {analysisResults.insights && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                      <ul className="space-y-2">
                        {analysisResults.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Eye className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* rounded container border */}
      <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-black/10 dark:border-white/10" />
    </>
  );
}
