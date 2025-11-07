import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Filter,
  Search,
  Sparkles
} from "../components/Icons.jsx";

export default function CleanDataPage() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [cleaningSteps, setCleaningSteps] = useState([]);
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

  const handleCleanDataset = async (datasetId) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/clean-dataset/${datasetId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Cleaning failed');
      }

      const result = await response.json();
      setCleaningSteps(result.steps || []);
      
      // Update dataset status
      setDatasets(prev => 
        prev.map(ds => 
          ds._id === datasetId ? { ...ds, cleaned: true } : ds
        )
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cleaningOptions = [
    {
      id: 'remove_duplicates',
      name: 'Remove Duplicates',
      description: 'Remove duplicate rows from the dataset',
      icon: Trash2,
      color: 'text-red-600'
    },
    {
      id: 'handle_missing',
      name: 'Handle Missing Values',
      description: 'Fill or remove missing values',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      id: 'normalize_data',
      name: 'Normalize Data',
      description: 'Standardize data formats and types',
      icon: RefreshCw,
      color: 'text-blue-600'
    },
    {
      id: 'remove_outliers',
      name: 'Remove Outliers',
      description: 'Detect and handle statistical outliers',
      icon: Filter,
      color: 'text-purple-600'
    }
  ];

  return (
    <>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-backgroundTop-light dark:from-backgroundTop-dark to-backgroundBottom-light dark:to-backgroundBottom-dark" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating data cleaning elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-green-200/20 rounded-full animate-pulse floating-element"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-blue-200/20 rounded-full animate-bounce floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-purple-200/20 rounded-full animate-ping floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-1/3 w-12 h-12 bg-cyan-200/20 rounded-full animate-pulse floating-element" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-emerald-200/20 rounded-full animate-bounce floating-element" style={{animationDelay: '3s'}}></div>
        
        {/* Animated "CLEAN DATA" text in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[10rem] md:text-[15rem] font-black text-gray-100/5 dark:text-gray-800/10 select-none animate-pulse data-clinic-bg">
            CLEAN DATA
          </div>
        </div>
        
        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
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
        {[...Array(4)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-data-flow"
            style={{
              top: `${25 + i * 15}%`,
              left: '-100px',
              width: '200px',
              animationDelay: `${i * 2}s`,
              animationDuration: '10s'
            }}
          ></div>
        ))}
        
        {/* Rotating cleaning elements */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`rotate-${i}`}
            className="absolute w-3 h-3 border-2 border-blue-400/30 rounded-full animate-spin"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full text-sm font-medium animate-bounce">
                <Sparkles className="w-4 h-4" />
                AI-Powered Data Cleaning
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Data Cleaning
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Clean and preprocess your datasets for better analysis
              </p>
            </div>

            {/* Dataset Selection */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                Select Dataset to Clean
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
                        <div className="flex items-center gap-2">
                          {dataset.cleaned ? (
                            <div className="flex items-center gap-1 text-blue-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Cleaned</span>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCleanDataset(dataset._id);
                              }}
                              disabled={loading}
                              className="btn btn-primary text-sm"
                            >
                              {loading ? 'Cleaning...' : 'Clean Data'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cleaning Options */}
            {selectedDataset && (
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                  Cleaning Options
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cleaningOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <div
                        key={option.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className={`w-5 h-5 mt-1 ${option.color}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {option.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cleaning Results */}
            {cleaningSteps.length > 0 && (
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                  Cleaning Results
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    <strong>Data cleaning completed successfully!</strong>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Steps performed:</h3>
                    <ul className="space-y-2">
                      {cleaningSteps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button className="btn btn-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Cleaned Data
                    </button>
                    <button className="btn btn-secondary">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clean Again
                    </button>
                  </div>
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
