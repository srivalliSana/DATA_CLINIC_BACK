import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Plus,
  Calendar,
  BarChart3,
  TrendingUp,
  Database,
  Sparkles
} from "../components/Icons.jsx";

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      navigate("/auth/login");
    } else {
      fetchReports();
    }
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/generate-report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Report generation failed');
      }

      const result = await response.json();
      setReports(prev => [result.report, ...prev]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError('Failed to download report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setReports(prev => prev.filter(report => report._id !== reportId));
        if (selectedReport?._id === reportId) {
          setSelectedReport(null);
        }
      }
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-backgroundTop-light dark:from-backgroundTop-dark to-backgroundBottom-light dark:to-backgroundBottom-dark" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating report elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/20 rounded-full animate-pulse floating-element"></div>
        <div className="absolute top-40 right-20 w-28 h-28 bg-red-200/20 rounded-full animate-bounce floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-pink-200/20 rounded-full animate-ping floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-1/3 w-20 h-20 bg-rose-200/20 rounded-full animate-pulse floating-element" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-amber-200/20 rounded-full animate-bounce floating-element" style={{animationDelay: '3s'}}></div>
        
        {/* Animated "REPORTS" text in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[10rem] md:text-[15rem] font-black text-gray-100/5 dark:text-gray-800/10 select-none animate-pulse data-clinic-bg">
            REPORTS
          </div>
        </div>
        
        {/* Floating particles */}
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-float particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Animated data flow lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent animate-data-flow"
            style={{
              top: `${15 + i * 12}%`,
              left: '-100px',
              width: '200px',
              animationDelay: `${i * 1.5}s`,
              animationDuration: '8s'
            }}
          ></div>
        ))}
        
        {/* Rotating report elements */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`rotate-${i}`}
            className="absolute w-3 h-3 border-2 border-orange-400/30 rounded-full animate-spin"
            style={{
              left: `${8 + i * 10}%`,
              top: `${20 + (i % 4) * 18}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + i * 0.2}s`
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-sm font-medium animate-bounce">
                <Sparkles className="w-4 h-4" />
                AI-Powered Report Generation
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Reports
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Generate and manage your data analysis reports
              </p>
            </div>

            {/* Generate Report Section */}
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{color:'var(--title)'}}>
                  Generate New Report
                </h2>
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Database className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold mb-1">Summary Report</h3>
                  <p className="text-sm text-gray-600">Overview of all your datasets and analyses</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Trend Analysis</h3>
                  <p className="text-sm text-gray-600">Detailed trend analysis and insights</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <Database className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold mb-1">Data Quality</h3>
                  <p className="text-sm text-gray-600">Data quality assessment and recommendations</p>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                Your Reports
              </h2>
              
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No reports generated yet</p>
                  <button
                    onClick={handleGenerateReport}
                    className="btn btn-primary"
                  >
                    Generate Your First Report
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedReport?._id === report._id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary-600" />
                          <div>
                            <h3 className="font-semibold">{report.title}</h3>
                            <p className="text-sm text-gray-600">
                              Generated on {formatDate(report.createdAt)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {report.type} • {report.pages || 1} pages
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="btn btn-secondary text-sm flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report._id)}
                            className="btn btn-primary text-sm flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            className="btn btn-secondary text-sm text-red-600 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Report Preview */}
            {selectedReport && (
              <div className="glass p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{color:'var(--title)'}}>
                    Report Preview
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReport(selectedReport._id)}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold">{selectedReport.title}</h3>
                    <p className="text-gray-600">
                      Generated on {formatDate(selectedReport.createdAt)}
                    </p>
                  </div>

                  {/* Report Content */}
                  <div className="space-y-4">
                    {selectedReport.sections?.map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{section.title}</h4>
                        <p className="text-gray-700 text-sm">{section.content}</p>
                        {section.charts && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.charts.map((chart, chartIndex) => (
                              <div key={chartIndex} className="bg-gray-50 p-3 rounded">
                                <div className="h-32 bg-white rounded border flex items-center justify-center">
                                  <div className="text-center text-gray-500">
                                    <BarChart3 className="w-8 h-8 mx-auto mb-1" />
                                    <p className="text-xs">{chart.title}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Report Summary */}
                  {selectedReport.summary && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                      <p className="text-blue-800">{selectedReport.summary}</p>
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
    </div>
  );
}
