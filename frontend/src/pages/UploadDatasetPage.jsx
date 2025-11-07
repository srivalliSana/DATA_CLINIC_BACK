import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  Lightbulb, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Database, 
  CheckCircle, 
  Play,
  Download,
  Eye,
  Settings,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  Upload as UploadIcon,
  FileText
} from "../components/Icons.jsx";

export default function UploadDatasetPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preprocessedData, setPreprocessedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preprocessingSteps, setPreprocessingSteps] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [suggestionMode, setSuggestionMode] = useState(false);
  const [dataInsights, setDataInsights] = useState(null);
  const [autoStats, setAutoStats] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [visualizations, setVisualizations] = useState([]);
  const [plotlyChart, setPlotlyChart] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [showAllData, setShowAllData] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setPreprocessedData(null);
      setPreprocessingSteps([]);
    }
  };

  // Generate AI suggestions based on data analysis
  const generateAISuggestions = (data) => {
    if (!data || data.length === 0) return [];

    const suggestions = [];
    const columns = Object.keys(data[0] || {});
    
    // Classify columns using detectColumnType
    const columnTypes = {};
    columns.forEach(col => {
      columnTypes[col] = detectColumnType(data, col);
    });
    const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
    const categoricalColumns = columns.filter(col => columnTypes[col] === 'categorical');
    const datetimeColumns = columns.filter(col => columnTypes[col] === 'datetime');

    // Data Quality Suggestions - Column-based missing values
    const nullCounts = {};
    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (row[key] === null || row[key] === undefined || row[key] === "") {
          nullCounts[key] = (nullCounts[key] || 0) + 1;
        }
      });
    });

    Object.keys(nullCounts).forEach(key => {
      if (nullCounts[key] > 0) {
        const colType = columnTypes[key];
        let title, description, action, confidence;
        
        if (colType === 'numeric') {
          title = `Missing Values in ${key} (Numeric)`;
          description = `Found ${nullCounts[key]} missing values in numeric column '${key}'. Suggest filling with median.`;
          action = `fill_median_${key}`;
          confidence = 0.95;
        } else if (colType === 'categorical') {
          title = `Missing Values in ${key} (Categorical)`;
          description = `Found ${nullCounts[key]} missing values in categorical column '${key}'. Suggest filling with mode.`;
          action = `fill_mode_${key}`;
          confidence = 0.9;
        } else if (colType === 'datetime') {
          title = `Missing Values in ${key} (Datetime)`;
          description = `Found ${nullCounts[key]} missing values in datetime column '${key}'. Suggest forward fill.`;
          action = `forward_fill_datetime_${key}`;
          confidence = 0.92;
        } else {
          title = `Missing Values in ${key}`;
          description = `Found ${nullCounts[key]} missing values in '${key}'. Suggest filling with appropriate method.`;
          action = `fill_missing_${key}`;
          confidence = 0.85;
        }
        
        suggestions.push({
          id: `missing-${key}`,
          type: 'cleaning',
          title,
          description,
          action,
          confidence,
          applied: false,
          icon: Database
        });
      }
    });

    // Duplicate Detection
    const duplicates = data.length - [...new Set(data.map(row => JSON.stringify(row)))].length;
    if (duplicates > 0) {
      suggestions.push({
        id: 'duplicates',
        type: 'cleaning',
        title: 'Duplicate Rows Detected',
        description: `Found ${duplicates} duplicate rows. Consider removing duplicates to improve data quality.`,
        action: 'remove_duplicates',
        confidence: 0.95,
        applied: false,
        icon: Database
      });
    }

    // Analysis Suggestions - Tailored to column types
    if (numericColumns.length >= 2) {
      suggestions.push({
        id: 'correlation',
        type: 'analysis',
        title: 'Correlation Analysis',
        description: `Analyze correlations between ${numericColumns.length} numeric columns to find relationships.`,
        action: 'correlation_analysis',
        confidence: 0.8,
        applied: false,
        icon: TrendingUp
      });
    }

    if (numericColumns.length > 0) {
      suggestions.push({
        id: 'descriptive_stats',
        type: 'analysis',
        title: 'Descriptive Statistics',
        description: `Generate summary statistics for ${numericColumns.length} numeric columns.`,
        action: 'descriptive_stats',
        confidence: 0.9,
        applied: false,
        icon: BarChart3
      });
    }

    if (datetimeColumns.length > 0) {
      suggestions.push({
        id: 'trend_analysis',
        type: 'analysis',
        title: 'Trend Analysis over Time',
        description: `Analyze trends in ${datetimeColumns.length} datetime columns to identify temporal patterns.`,
        action: 'trend_analysis_datetime',
        confidence: 0.85,
        applied: false,
        icon: TrendingUp
      });
    }

    // Visualization Suggestions - Tailored to column types
    if (numericColumns.length >= 1) {
      suggestions.push({
        id: 'histogram',
        type: 'visualization',
        title: 'Distribution Analysis',
        description: `Create histograms to visualize the distribution of numeric data.`,
        action: 'create_histograms',
        confidence: 0.85,
        applied: false,
        icon: BarChart3
      });
    }

    if (numericColumns.length >= 2) {
      suggestions.push({
        id: 'scatter_plot',
        type: 'visualization',
        title: 'Scatter Plot Matrix',
        description: `Create scatter plots to explore relationships between numeric variables.`,
        action: 'create_scatter_plots',
        confidence: 0.8,
        applied: false,
        icon: TrendingUp
      });
    }

    if (categoricalColumns.length > 0) {
      suggestions.push({
        id: 'pie_chart',
        type: 'visualization',
        title: 'Categorical Distribution',
        description: `Create pie charts to visualize the distribution of categorical data.`,
        action: 'create_pie_charts',
        confidence: 0.75,
        applied: false,
        icon: PieChart
      });
    }

    if (datetimeColumns.length > 0 && numericColumns.length > 0) {
      suggestions.push({
        id: 'line_chart_time',
        type: 'visualization',
        title: 'Time Series Line Chart',
        description: `Create line charts to visualize numeric trends over datetime columns.`,
        action: 'create_line_charts_datetime',
        confidence: 0.8,
        applied: false,
        icon: TrendingUp
      });
    }

    return suggestions;
  };

  // Generate data insights
  const generateDataInsights = (data) => {
    if (!data || data.length === 0) return;

    const columns = Object.keys(data[0] || {});
    const columnTypes = {};
    columns.forEach(col => {
      columnTypes[col] = detectColumnType(data, col);
    });
    const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
    const datetimeColumns = columns.filter(col => columnTypes[col] === 'datetime');
    const categoricalColumns = columns.filter(col => columnTypes[col] === 'categorical');

    const insights = {
      totalRows: data.length,
      totalColumns: columns.length,
      numericColumns: numericColumns.length,
      categoricalColumns: categoricalColumns.length,
      datetimeColumns: datetimeColumns.length,
      missingValues: 0,
      duplicateRows: 0,
      basicStats: {} // Placeholder for auto-generated stats summary
    };

    // Calculate missing values
    data.forEach(row => {
      Object.values(row).forEach(value => {
        if (value === null || value === undefined || value === "") {
          insights.missingValues++;
        }
      });
    });

    // Calculate duplicates
    insights.duplicateRows = data.length - [...new Set(data.map(row => JSON.stringify(row)))].length;

    // Add basic stats summary if available
    if (autoStats && autoStats.stats) {
      insights.basicStats = {
        avgNumericColumns: Object.keys(autoStats.stats).length > 0 ? 
          Object.values(autoStats.stats).reduce((sum, s) => sum + s.mean, 0) / Object.keys(autoStats.stats).length : 0,
        totalNumericValues: Object.values(autoStats.stats).reduce((sum, s) => sum + s.count, 0)
      };
    }

    setDataInsights(insights);
  };

  // Handle AI suggestion execution
  const handleSuggestionExecute = async (suggestion) => {
    setSelectedSuggestion(suggestion);
    setLoading(true);

    try {
      let result;
      
      switch (suggestion.action) {
        case 'descriptive_stats':
          result = await generateDescriptiveStats(preprocessedData);
          break;
        case 'correlation_analysis':
          result = await generateCorrelationAnalysis(preprocessedData);
          break;
        case 'create_histograms':
          result = await createHistograms(preprocessedData);
          break;
        case 'create_scatter_plots':
          result = await createScatterPlots(preprocessedData);
          break;
        case 'create_pie_charts':
          result = await createPieCharts(preprocessedData);
          break;
        default:
          result = { message: 'Suggestion executed successfully' };
      }

      // Mark suggestion as applied
      setAiSuggestions(prev => 
        prev.map(s => 
          s.id === suggestion.id ? { ...s, applied: true } : s
        )
      );

      // Add to visualizations if it's a visualization suggestion (keep only one chart)
      if (suggestion.type === 'visualization' && result.charts && result.charts.length > 0) {
        setVisualizations([result.charts[0]]);
      }

    } catch (err) {
      setError(`Failed to execute suggestion: ${err.message}`);
    } finally {
      setLoading(false);
      setSelectedSuggestion(null);
    }
  };

  // Generate descriptive statistics
  const generateDescriptiveStats = async (data) => {
    const numericColumns = Object.keys(data[0] || {}).filter(col => {
      const sampleValues = data.slice(0, 10).map(row => row[col]);
      return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length > sampleValues.length * 0.8;
    });

    const stats = {};
    numericColumns.forEach(col => {
      const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
      if (values.length > 0) {
        const sorted = values.sort((a, b) => a - b);
        stats[col] = {
          count: values.length,
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          median: sorted[Math.floor(sorted.length / 2)],
          min: Math.min(...values),
          max: Math.max(...values),
          std: Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length)
        };
      }
    });

    return { stats, type: 'descriptive_stats' };
  };

  // Generate correlation analysis
  const generateCorrelationAnalysis = async (data) => {
    const numericColumns = Object.keys(data[0] || {}).filter(col => {
      const sampleValues = data.slice(0, 10).map(row => row[col]);
      return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length > sampleValues.length * 0.8;
    });

    const correlations = {};
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        const values1 = data.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
        const values2 = data.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
        
        if (values1.length > 0 && values2.length > 0) {
          const correlation = calculateCorrelation(values1, values2);
          correlations[`${col1}_${col2}`] = correlation;
        }
      }
    }

    return { correlations, type: 'correlation_analysis' };
  };

  // Calculate correlation coefficient
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
    
    return (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  };

  // Create histograms
  const createHistograms = async (data) => {
    const numericColumns = Object.keys(data[0] || {}).filter(col => {
      const sampleValues = data.slice(0, 10).map(row => row[col]);
      return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length > sampleValues.length * 0.8;
    });

    // Rank by variance (higher variance -> more interesting distribution)
    const ranked = numericColumns
      .map(col => {
        const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
        if (values.length === 0) return { col, variance: -Infinity, values };
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
        return { col, variance, values };
      })
      .sort((a, b) => b.variance - a.variance)
      .slice(0, 3);

    const charts = ranked.map(({ col, values }) => ({
      type: 'histogram',
      column: col,
      data: values
    }));

    return { charts, type: 'histograms' };
  };

  // Create scatter plots
  const createScatterPlots = async (data) => {
    const numericColumns = Object.keys(data[0] || {}).filter(col => {
      const sampleValues = data.slice(0, 10).map(row => row[col]);
      return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length > sampleValues.length * 0.8;
    });

    // Compute correlations and pick top 3 strongest absolute correlations
    const pairs = [];
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        const values1 = data.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
        const values2 = data.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
        if (values1.length > 1 && values2.length > 1 && values1.length === values2.length) {
          const corr = calculateCorrelation(values1, values2);
          pairs.push({ col1, col2, corr });
        }
      }
    }
    const topPairs = pairs.sort((a, b) => Math.abs(b.corr) - Math.abs(a.corr)).slice(0, 3);
    const charts = topPairs.map(({ col1, col2 }) => ({
      type: 'scatter',
      x: col1,
      y: col2,
      data: data.map(row => ({ x: parseFloat(row[col1]), y: parseFloat(row[col2]) }))
        .filter(point => !isNaN(point.x) && !isNaN(point.y))
    }));

    return { charts, type: 'scatter_plots' };
  };

  // Create pie charts
  const createPieCharts = async (data) => {
    const categoricalColumns = Object.keys(data[0] || {}).filter(col => {
      const sampleValues = data.slice(0, 10).map(row => row[col]);
      return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length <= sampleValues.length * 0.8;
    });

    // Prefer columns with a manageable number of categories (2-12), pick top 3 by unique count
    const ranked = categoricalColumns
      .map(col => {
        const valueCounts = {};
        data.forEach(row => {
          const value = row[col] ?? 'Unknown';
          valueCounts[String(value)] = (valueCounts[String(value)] || 0) + 1;
        });
        const uniqueCount = Object.keys(valueCounts).length;
        return { col, valueCounts, uniqueCount };
      })
      .filter(item => item.uniqueCount >= 2 && item.uniqueCount <= 12)
      .sort((a, b) => b.uniqueCount - a.uniqueCount)
      .slice(0, 3);

    const charts = ranked.map(({ col, valueCounts }) => ({
      type: 'pie',
      column: col,
      data: Object.entries(valueCounts).map(([label, value]) => ({ label, value }))
    }));

    return { charts, type: 'pie_charts' };
  };

const preprocessData = (data) => {
  const steps = [];
  let processedData = data ? data.filter(row => row != null && typeof row === 'object' && Object.keys(row).length > 0) : [];
  if (processedData.length === 0) {
    return { processedData: [], steps: ['No valid data rows available for processing'] };
  }

  // Step 1: Remove completely empty rows
  const initialRows = processedData.length;
  processedData = processedData.filter(row => 
    Object.values(row).some(value => value !== null && value !== undefined && value !== "")
  );
  if (processedData.length < initialRows) {
    steps.push(`Removed ${initialRows - processedData.length} empty rows`);
  }

    // Step 2: Handle null values intelligently
    const nullCounts = {};
    processedData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (row[key] === null || row[key] === undefined || row[key] === "") {
          nullCounts[key] = (nullCounts[key] || 0) + 1;
        }
      });
    });

    Object.keys(nullCounts).forEach(key => {
      if (nullCounts[key] > 0) {
        const colType = detectColumnType(processedData, key);
        let fillMethod = '';
        let fillValue = null;

        if (colType === 'numeric') {
          const numericValues = processedData
            .map(row => parseFloat(row[key]))
            .filter(val => !isNaN(val));
          if (numericValues.length > 0) {
            fillValue = computeMedian(numericValues);
            processedData = processedData.map(row => {
              if (row[key] === null || row[key] === undefined || row[key] === "") {
                return { ...row, [key]: parseFloat(fillValue.toFixed(2)) };
              }
              return row;
            });
            fillMethod = `median (${fillValue.toFixed(2)})`;
          } else {
            fillValue = 0;
            processedData = processedData.map(row => {
              if (row[key] === null || row[key] === undefined || row[key] === "") {
                return { ...row, [key]: 0 };
              }
              return row;
            });
            fillMethod = 'default 0';
          }
          steps.push(`Replaced ${nullCounts[key]} null values in '${key}' (numeric) with ${fillMethod}`);
        } else if (colType === 'categorical') {
          const catValues = processedData
            .map(row => row[key])
            .filter(val => val !== null && val !== undefined && val !== "");
          fillValue = computeMode(catValues);
          processedData = processedData.map(row => {
            if (row[key] === null || row[key] === undefined || row[key] === "") {
              return { ...row, [key]: fillValue };
            }
            return row;
          });
          fillMethod = `mode (${fillValue})`;
          steps.push(`Replaced ${nullCounts[key]} null values in '${key}' (categorical) with ${fillMethod}`);
        } else if (colType === 'datetime') {
          // Forward fill first
          processedData = forwardFill(processedData, key);
          // Count remaining nulls after forward fill
          let remainingNulls = processedData.filter(row => row[key] === null || row[key] === undefined || row[key] === "").length;
          if (remainingNulls > 0) {
            processedData = backwardFill(processedData, key);
          }
          steps.push(`Applied forward/backward fill to ${nullCounts[key]} null values in '${key}' (datetime)`);
        } else {
          // Fallback for unknown types
          fillValue = "Unknown";
          processedData = processedData.map(row => {
            if (row[key] === null || row[key] === undefined || row[key] === "") {
              return { ...row, [key]: "Unknown" };
            }
            return row;
          });
          steps.push(`Replaced ${nullCounts[key]} null values in '${key}' (unknown type) with 'Unknown'`);
        }
      }
    });

    // Step 3: Remove duplicates
    const initialLength = processedData.length;
    const uniqueData = processedData.filter((row, index, self) => 
      index === self.findIndex(r => JSON.stringify(r) === JSON.stringify(row))
    );
    if (uniqueData.length < initialLength) {
      steps.push(`Removed ${initialLength - uniqueData.length} duplicate rows`);
    }
    processedData = uniqueData;

    // Step 4: Data type conversion
    const columns = Object.keys(processedData[0] || {});
    columns.forEach(col => {
      const sampleValues = processedData.slice(0, 10).map(row => row[col]);
      const numericCount = sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length;
      
      if (numericCount > sampleValues.length * 0.8) {
        // Convert to numeric
        processedData.forEach(row => {
          const num = parseFloat(row[col]);
          row[col] = isNaN(num) ? row[col] : num;
        });
        steps.push(`Converted '${col}' to numeric type`);
      }
    });

    return { processedData, steps };
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/upload-dataset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-user-email': JSON.parse(localStorage.getItem('user') || '{}')?.email || '',
          'x-user-name': JSON.parse(localStorage.getItem('user') || '{}')?.name || ''
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
        setError("Invalid or empty data received from server");
        return;
      }

      // Filter out null or invalid rows
      const cleanData = result.data.filter(row => row && typeof row === 'object');
      if (cleanData.length === 0) {
        setError("No valid data rows received from server");
        return;
      }

      // Preprocess the data
      const { processedData, steps } = preprocessData(cleanData);
      
      setPreprocessedData(processedData);
      setPreprocessingSteps(steps);
      
      // Generate AI suggestions
      const suggestions = generateAISuggestions(processedData);
      setAiSuggestions(suggestions);
      
      // Generate data insights
      generateDataInsights(processedData);

      // Automatic analysis: Generate descriptive stats
      const stats = await generateDescriptiveStats(processedData);
      setAutoStats(stats);

      // Automatic visualizations: Create basic histograms for top numeric columns
      const histResult = await createHistograms(preprocessedData);
      if (histResult.charts && histResult.charts.length > 0) {
        setVisualizations(histResult.charts.slice(0, 3)); // Top 3 histograms
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadProcessedData = () => {
    if (!preprocessedData) return;

    const csvContent = [
      Object.keys(preprocessedData[0]).join(','),
      ...preprocessedData.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_dataset.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // UI helpers for details modal
  const openChartDetails = (chart) => {
    setSelectedChart(chart);
    setIsDetailsOpen(true);
  };

  const closeChartDetails = () => {
    setIsDetailsOpen(false);
    setSelectedChart(null);
  };

  const buildHistogramBins = (values, numBins = 10) => {
    if (!Array.isArray(values) || values.length === 0) return [];
    const numeric = values.filter(v => typeof v === 'number' && !isNaN(v));
    if (numeric.length === 0) return [];
    const min = Math.min(...numeric);
    const max = Math.max(...numeric);
    const binCount = Math.max(1, Math.min(numBins, numeric.length));
    const binSize = (max - min) / binCount || 1;
    const bins = new Array(binCount).fill(0).map((_, i) => ({
      name: `${(min + i * binSize).toFixed(2)}-${(min + (i + 1) * binSize).toFixed(2)}`,
      count: 0
    }));
    numeric.forEach(v => {
      let idx = Math.floor((v - min) / binSize);
      if (idx >= binCount) idx = binCount - 1;
      if (idx < 0) idx = 0;
      bins[idx].count += 1;
    });
    return bins;
  };

  const getScatterScale = (points) => {
    const xs = points.map(p => p.x).filter(v => typeof v === 'number' && !isNaN(v));
    const ys = points.map(p => p.y).filter(v => typeof v === 'number' && !isNaN(v));
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const sx = (x) => maxX === minX ? 50 : ((x - minX) / (maxX - minX)) * 100;
    const sy = (y) => maxY === minY ? 50 : (100 - ((y - minY) / (maxY - minY)) * 100);
    return { sx, sy };
  };

  const buildConicGradient = (segments) => {
    const total = segments.reduce((a, b) => a + (b.value || 0), 0);
    if (!total) return 'conic-gradient(#ccc 0deg, #ccc 360deg)';
    const colors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#06B6D4", "#F97316"];
    let current = 0;
    const parts = segments.map((s, i) => {
      const angle = (s.value / total) * 360;
      const start = current;
      const end = current + angle;
      current = end;
      return `${colors[i % colors.length]} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${parts.join(', ')})`;
  };

  // Plotly rendering when opening details
  useEffect(() => {
    if (!isDetailsOpen || !selectedChart) return;
    const containerId = 'plotly-container';

    const renderPlotly = () => {
      if (!(window && window.Plotly)) return;
      let data = [];
      let layout = { title: '', xaxis: { title: '' }, yaxis: { title: '' }, margin: { t: 40, r: 20, b: 50, l: 60 } };

      if (selectedChart.type === 'histogram') {
        data = [{
          x: selectedChart.data,
          type: 'histogram',
          marker: { color: '#6366F1' },
          name: `Histogram - ${selectedChart.column}`
        }];
        layout.title = `Histogram - ${selectedChart.column}`;
        layout.xaxis.title = selectedChart.column;
        layout.yaxis.title = 'Count';
      } else if (selectedChart.type === 'scatter') {
        data = [{
          x: selectedChart.data.map(p => p.x),
          y: selectedChart.data.map(p => p.y),
          mode: 'markers',
          type: 'scatter',
          marker: { color: '#10B981' },
          name: `Scatter - ${selectedChart.x} vs ${selectedChart.y}`
        }];
        layout.title = `Scatter Plot - ${selectedChart.x} vs ${selectedChart.y}`;
        layout.xaxis.title = selectedChart.x;
        layout.yaxis.title = selectedChart.y;
      } else if (selectedChart.type === 'pie') {
        data = [{
          labels: selectedChart.data.map(d => d.label),
          values: selectedChart.data.map(d => d.value),
          type: 'pie',
          textinfo: 'label+percent',
          hoverinfo: 'label+value+percent'
        }];
        layout.title = `Pie Chart - ${selectedChart.column}`;
      } else if (selectedChart.type === 'line') {
        data = [{
          x: selectedChart.data.map(d => d.x),
          y: selectedChart.data.map(d => d.y),
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#3B82F6' },
          marker: { color: '#3B82F6' },
          name: `Line - ${selectedChart.y} over ${selectedChart.x}`
        }];
        layout.title = `Line Chart - ${selectedChart.y} over ${selectedChart.x}`;
        layout.xaxis.title = selectedChart.x;
        layout.yaxis.title = selectedChart.y;
      } else if (selectedChart.type === 'bar_count') {
        data = [{
          x: selectedChart.labels,
          y: selectedChart.values,
          type: 'bar',
          marker: { color: '#8B5CF6' },
          name: `Count by ${selectedChart.x}`
        }];
        layout.title = `Bar Chart - Count by ${selectedChart.x}`;
        layout.xaxis.title = selectedChart.x;
        layout.yaxis.title = 'Count';
      } else if (selectedChart.type === 'bar_agg') {
        data = [{
          x: selectedChart.labels,
          y: selectedChart.values,
          type: 'bar',
          marker: { color: '#F59E0B' },
          name: `${selectedChart.agg} ${selectedChart.y} by ${selectedChart.x}`
        }];
        layout.title = `Bar Chart - ${selectedChart.agg} ${selectedChart.y} by ${selectedChart.x}`;
        layout.xaxis.title = selectedChart.x;
        layout.yaxis.title = `${selectedChart.agg} ${selectedChart.y}`;
      } else if (selectedChart.type === 'box') {
        data = Object.entries(selectedChart.groups).map(([label, arr]) => ({
          y: arr,
          type: 'box',
          name: label,
          marker: { color: '#10B981' }
        }));
        layout.title = `Box Plot - ${selectedChart.y} by ${selectedChart.x}`;
        layout.xaxis.title = selectedChart.x;
        layout.yaxis.title = selectedChart.y;
      } else if (selectedChart.type === 'heatmap') {
        const xs = selectedChart.data.map(d => d.x);
        const ys = selectedChart.data.map(d => d.y);
        data = [{
          x: xs,
          y: ys,
          type: 'histogram2d',
          colorscale: 'Viridis'
        }];
        layout.title = `Heatmap - ${selectedChart.x} vs ${selectedChart.y}`;
        layout.xaxis.title = selectedChart.x;
        layout.yaxis.title = selectedChart.y;
      }

      window.Plotly.newPlot(containerId, data, layout, { displayModeBar: true, responsive: true });
    };

    renderPlotly();
  }, [isDetailsOpen, selectedChart]);

  const pushAssistantMessage = (role, text) => {
    setAssistantMessages(prev => [...prev, { role, text, time: new Date().toISOString() }]);
  };

  const normalizeName = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  const levenshtein = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  };

  const findClosestColumn = (name, cols) => {
    if (!name) return null;
    const target = normalizeName(name);
    // Exact case-insensitive first
    const exact = cols.find(c => normalizeName(c) === target);
    if (exact) return { name: exact, note: '' };
    // Includes/startsWith
    const incl = cols.find(c => normalizeName(c).includes(target) || target.includes(normalizeName(c)));
    if (incl) return { name: incl, note: `(interpreted '${name}' as '${incl}')` };
    // Levenshtein best
    let best = null, bestDist = Infinity;
    cols.forEach(c => {
      const d = levenshtein(normalizeName(c), target);
      if (d < bestDist) { bestDist = d; best = c; }
    });
    if (best && bestDist <= 3) return { name: best, note: `(interpreted '${name}' as '${best}')` };
    return null;
  };

  const handleAssistantCommand = async () => {
    const text = assistantInput.trim();
    if (!text) return;
    pushAssistantMessage('user', text);
    setAssistantInput("");

    if (!preprocessedData || preprocessedData.length === 0) {
      pushAssistantMessage('ai', 'Please upload and preprocess a dataset first.');
      return;
    }

    const columns = Object.keys(preprocessedData[0] || {});

    const lower = text.toLowerCase();

    // Always ask backend LLM first for agentic interpretation and guidance
    try {
      const token = localStorage.getItem('token');
      const context = {
        columns: Object.keys(preprocessedData[0] || {}),
        sample: preprocessedData.slice(0, 1),
        insights: dataInsights
      };
      const resp = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ prompt: text, context })
      });
      const out = await resp.json();
      if (resp.ok && out?.content) {
        pushAssistantMessage('ai', out.content);
        // Do not return; still try local parsing below to auto-create charts if the user asked for one
      }
    } catch (e) {
      // proceed to local parsing
    }
    try {
      // Histogram command: "histogram of Year"
      const histMatch = lower.match(/histogram[^a-z0-9]+(?:of|for)?\s*([a-z0-9_\-]+)/i);
      if (histMatch && histMatch[1]) {
        const resolved = findClosestColumn(histMatch[1], columns);
        if (!resolved) {
          pushAssistantMessage('ai', `Column '${histMatch[1]}' not found.`);
          return;
        }
        const col = resolved.name;
        const data = preprocessedData.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
        setVisualizations([{ type: 'histogram', column: col, data }]);
        pushAssistantMessage('ai', `Added Histogram - ${col}. ${resolved.note || ''}`.trim());
        return;
      }

      // Scatter command: "scatter of X vs Y" or "scatter X vs Y"
      const scatMatch = lower.match(/scatter.*?(?:of\s+)?([a-z0-9_\-]+)\s*(?:vs|and)\s*([a-z0-9_\-]+)/i);
      if (scatMatch && scatMatch[1] && scatMatch[2]) {
        const rx = findClosestColumn(scatMatch[1], columns);
        const ry = findClosestColumn(scatMatch[2], columns);
        if (!rx || !ry) {
          pushAssistantMessage('ai', `Columns '${scatMatch[1]}' and/or '${scatMatch[2]}' not found.`);
          return;
        }
        const xCol = rx.name, yCol = ry.name;
        const data = preprocessedData.map(row => ({ x: parseFloat(row[xCol]), y: parseFloat(row[yCol]) }))
          .filter(p => !isNaN(p.x) && !isNaN(p.y));
        setVisualizations([{ type: 'scatter', x: xCol, y: yCol, data }]);
        pushAssistantMessage('ai', `Added Scatter Plot - ${xCol} vs ${yCol}. ${[rx.note, ry.note].filter(Boolean).join(' ')}`.trim());
        return;
      }

      // Pie command: "pie of Category"
      const pieMatch = lower.match(/pie[^a-z0-9]+(?:of|for)?\s*([a-z0-9_\-]+)/i);
      if (pieMatch && pieMatch[1]) {
        const resolved = findClosestColumn(pieMatch[1], columns);
        if (!resolved) {
          pushAssistantMessage('ai', `Column '${pieMatch[1]}' not found.`);
          return;
        }
        const col = resolved.name;
        const valueCounts = {};
        preprocessedData.forEach(row => {
          const val = row[col] ?? 'Unknown';
          valueCounts[String(val)] = (valueCounts[String(val)] || 0) + 1;
        });
        const data = Object.entries(valueCounts).map(([label, value]) => ({ label, value }));
        setVisualizations([{ type: 'pie', column: col, data }]);
        pushAssistantMessage('ai', `Added Pie Chart - ${col}. ${resolved.note || ''}`.trim());
        return;
      }

      // Cleaning: fill nulls in a column with mean/median/mode or value
      // Examples: "fill nulls in Age with mean", "fill nulls in City with Unknown"
      const fillMatch = lower.match(/fill\s+(?:missing|nulls?)\s+(?:in\s+)?([a-z0-9_\-]+)\s+(?:with\s+)(mean|median|mode|[a-z0-9_\-\.]+)/i);
      if (fillMatch && fillMatch[1] && fillMatch[2]) {
        const col = columns.find(c => c.toLowerCase() === fillMatch[1].toLowerCase());
        if (!col) {
          pushAssistantMessage('ai', `Column '${fillMatch[1]}' not found.`);
          return;
        }
        const strategy = fillMatch[2].toLowerCase();
        let fillValue = strategy;
        if (['mean','median','mode'].includes(strategy)) {
          const numericVals = preprocessedData.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
          if (strategy === 'mean') {
            fillValue = numericVals.length ? (numericVals.reduce((a,b)=>a+b,0) / numericVals.length) : 0;
          } else if (strategy === 'median') {
            const sorted = numericVals.slice().sort((a,b)=>a-b);
            fillValue = sorted.length ? sorted[Math.floor(sorted.length/2)] : 0;
          } else if (strategy === 'mode') {
            const freq = {};
            numericVals.forEach(v => { freq[v] = (freq[v]||0)+1; });
            fillValue = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? 0;
          }
        }
        const updated = preprocessedData.map(r => {
          const v = r[col];
          if (v === null || v === undefined || v === "") {
            return { ...r, [col]: fillValue };
          }
          return r;
        });
        setPreprocessedData(updated);
        setPreprocessingSteps(prev => [...prev, `Filled nulls in '${col}' with ${fillValue}`]);
        setAiSuggestions(generateAISuggestions(updated));
        generateDataInsights(updated);
        pushAssistantMessage('ai', `Filled nulls in ${col}.`);
        return;
      }

      // Cleaning: remove rows with nulls in a column
      // Example: "remove rows where Salary is null"
      const removeNullMatch = lower.match(/remove\s+rows\s+where\s+([a-z0-9_\-]+)\s+(?:is\s+)?null/i);
      if (removeNullMatch && removeNullMatch[1]) {
        const col = columns.find(c => c.toLowerCase() === removeNullMatch[1].toLowerCase());
        if (!col) {
          pushAssistantMessage('ai', `Column '${removeNullMatch[1]}' not found.`);
          return;
        }
        const before = preprocessedData.length;
        const updated = preprocessedData.filter(r => r[col] !== null && r[col] !== undefined && r[col] !== "");
        const removed = before - updated.length;
        setPreprocessedData(updated);
        setPreprocessingSteps(prev => [...prev, `Removed ${removed} rows where '${col}' was null`]);
        setAiSuggestions(generateAISuggestions(updated));
        generateDataInsights(updated);
        pushAssistantMessage('ai', `Removed ${removed} rows with null ${col}.`);
        return;
      }

      // Cleaning: drop a column
      // Example: "drop column Address"
      const dropColMatch = lower.match(/drop\s+column\s+([a-z0-9_\-]+)/i);
      if (dropColMatch && dropColMatch[1]) {
        const col = columns.find(c => c.toLowerCase() === dropColMatch[1].toLowerCase());
        if (!col) {
          pushAssistantMessage('ai', `Column '${dropColMatch[1]}' not found.`);
          return;
        }
        const updated = preprocessedData.map(r => {
          const { [col]: _omit, ...rest } = r;
          return rest;
        });
        setPreprocessedData(updated);
        setPreprocessingSteps(prev => [...prev, `Dropped column '${col}'`]);
        setAiSuggestions(generateAISuggestions(updated));
        generateDataInsights(updated);
        pushAssistantMessage('ai', `Dropped column ${col}.`);
        return;
      }

      // Cleaning: rename a column
      // Example: "rename column oldName to newName"
      const renameMatch = lower.match(/rename\s+column\s+([a-z0-9_\-]+)\s+to\s+([a-z0-9_\-]+)/i);
      if (renameMatch && renameMatch[1] && renameMatch[2]) {
        const from = columns.find(c => c.toLowerCase() === renameMatch[1].toLowerCase());
        if (!from) {
          pushAssistantMessage('ai', `Column '${renameMatch[1]}' not found.`);
          return;
        }
        const to = renameMatch[2];
        const updated = preprocessedData.map(r => {
          const { [from]: value, ...rest } = r;
          return { ...rest, [to]: value };
        });
        setPreprocessedData(updated);
        setPreprocessingSteps(prev => [...prev, `Renamed column '${from}' to '${to}'`]);
        setAiSuggestions(generateAISuggestions(updated));
        generateDataInsights(updated);
        pushAssistantMessage('ai', `Renamed column ${from} to ${to}.`);
        return;
      }

      // Line chart: "line of Sales vs Date" or "line Sales over Date"
      const lineMatch = lower.match(/line(?:\s+chart)?[^a-z0-9]+(?:of\s+)?([a-z0-9_\-]+)\s*(?:vs|over|by)\s*([a-z0-9_\-]+)/i);
      if (lineMatch && lineMatch[1] && lineMatch[2]) {
        const ry = findClosestColumn(lineMatch[1], columns);
        const rx = findClosestColumn(lineMatch[2], columns);
        if (!rx || !ry) {
          pushAssistantMessage('ai', `Columns '${lineMatch[1]}' and/or '${lineMatch[2]}' not found.`);
          return;
        }
        const xCol = rx.name, yCol = ry.name;
        const data = preprocessedData.map(row => ({ x: row[xCol], y: parseFloat(row[yCol]) }))
          .filter(p => p.x !== undefined && !isNaN(p.y));
        setVisualizations([{ type: 'line', x: xCol, y: yCol, data }]);
        pushAssistantMessage('ai', `Added Line Chart - ${yCol} over ${xCol}. ${[rx.note, ry.note].filter(Boolean).join(' ')}`.trim());
        return;
      }

      // Bar chart (count by category): "bar of count by Department"
      const barCountMatch = lower.match(/bar(?:\s+chart)?[^a-z0-9]+(?:of\s+)?count\s+(?:by|for)\s*([a-z0-9_\-]+)/i);
      if (barCountMatch && barCountMatch[1]) {
        const rcat = findClosestColumn(barCountMatch[1], columns);
        if (!rcat) {
          pushAssistantMessage('ai', `Column '${barCountMatch[1]}' not found.`);
          return;
        }
        const catCol = rcat.name;
        const counts = {};
        preprocessedData.forEach(r => { const v = r[catCol] ?? 'Unknown'; counts[String(v)] = (counts[String(v)]||0)+1; });
        const labels = Object.keys(counts);
        const values = labels.map(l => counts[l]);
        setVisualizations([{ type: 'bar_count', x: catCol, labels, values }]);
        pushAssistantMessage('ai', `Added Bar Chart - count by ${catCol}. ${rcat.note || ''}`.trim());
        return;
      }

      // Bar chart (aggregate y by category): "bar of Salary by Department"
      const barAggMatch = lower.match(/bar(?:\s+chart)?[^a-z0-9]+(?:of\s+)?([a-z0-9_\-]+)\s+(?:by|per|vs)\s*([a-z0-9_\-]+)/i);
      if (barAggMatch && barAggMatch[1] && barAggMatch[2]) {
        const ry = findClosestColumn(barAggMatch[1], columns);
        const rcat = findClosestColumn(barAggMatch[2], columns);
        if (!ry || !rcat) {
          pushAssistantMessage('ai', `Columns '${barAggMatch[1]}' and/or '${barAggMatch[2]}' not found.`);
          return;
        }
        const yCol = ry.name, catCol = rcat.name;
        const groups = {};
        preprocessedData.forEach(r => {
          const key = String(r[catCol] ?? 'Unknown');
          const v = parseFloat(r[yCol]);
          if (!isNaN(v)) {
            (groups[key] ||= []).push(v);
          }
        });
        const labels = Object.keys(groups);
        const values = labels.map(k => {
          const arr = groups[k];
          return arr.reduce((a,b)=>a+b,0) / (arr.length || 1);
        });
        setVisualizations([{ type: 'bar_agg', x: catCol, y: yCol, labels, values, agg: 'mean' }]);
        pushAssistantMessage('ai', `Added Bar Chart - mean ${yCol} by ${catCol}. ${[ry.note, rcat.note].filter(Boolean).join(' ')}`.trim());
        return;
      }

      // Box plot: "box of Salary by Department"
      const boxMatch = lower.match(/box(?:\s+plot)?[^a-z0-9]+(?:of\s+)?([a-z0-9_\-]+)\s+(?:by|per|vs)\s*([a-z0-9_\-]+)/i);
      if (boxMatch && boxMatch[1] && boxMatch[2]) {
        const ry = findClosestColumn(boxMatch[1], columns);
        const rcat = findClosestColumn(boxMatch[2], columns);
        if (!ry || !rcat) {
          pushAssistantMessage('ai', `Columns '${boxMatch[1]}' and/or '${boxMatch[2]}' not found.`);
          return;
        }
        const yCol = ry.name, catCol = rcat.name;
        const groups = {};
        preprocessedData.forEach(r => {
          const key = String(r[catCol] ?? 'Unknown');
          const v = parseFloat(r[yCol]);
          if (!isNaN(v)) (groups[key] ||= []).push(v);
        });
        setVisualizations([{ type: 'box', x: catCol, y: yCol, groups }]);
        pushAssistantMessage('ai', `Added Box Plot - ${yCol} by ${catCol}. ${[ry.note, rcat.note].filter(Boolean).join(' ')}`.trim());
        return;
      }

      // Heatmap: "heatmap of X vs Y"
      const heatMatch = lower.match(/heatmap[^a-z0-9]+(?:of\s+)?([a-z0-9_\-]+)\s*(?:vs|by)\s*([a-z0-9_\-]+)/i);
      if (heatMatch && heatMatch[1] && heatMatch[2]) {
        const rx = findClosestColumn(heatMatch[1], columns);
        const ry = findClosestColumn(heatMatch[2], columns);
        if (!rx || !ry) {
          pushAssistantMessage('ai', `Columns '${heatMatch[1]}' and/or '${heatMatch[2]}' not found.`);
          return;
        }
        const xCol = rx.name, yCol = ry.name;
        const data = preprocessedData.map(r => ({ x: parseFloat(r[xCol]), y: parseFloat(r[yCol]) }))
          .filter(p => !isNaN(p.x) && !isNaN(p.y));
        setVisualizations([{ type: 'heatmap', x: xCol, y: yCol, data }]);
        pushAssistantMessage('ai', `Added Heatmap - ${xCol} vs ${yCol}. ${[rx.note, ry.note].filter(Boolean).join(' ')}`.trim());
        return;
      }

      // Generic: "bar product vs quantity ordered" -> treat as bar_agg with mean when y numeric and x categorical; if y not numeric, count by y
      const genericBar = lower.match(/bar[^a-z0-9]+([a-z0-9_\-]+)\s*(?:vs|by|per)\s*([a-z0-9_\-]+)/i);
      if (genericBar && genericBar[1] && genericBar[2]) {
        const r1 = findClosestColumn(genericBar[1], columns);
        const r2 = findClosestColumn(genericBar[2], columns);
        if (!r1 || !r2) {
          pushAssistantMessage('ai', `Columns '${genericBar[1]}' and/or '${genericBar[2]}' not found.`);
          return;
        }
        const col1 = r1.name, col2 = r2.name;
        const num1 = preprocessedData.filter(r => !isNaN(parseFloat(r[col1]))).length;
        const num2 = preprocessedData.filter(r => !isNaN(parseFloat(r[col2]))).length;
        // Prefer categorical on x, numeric on y
        let xCol = col1, yCol = col2, notes = [r1.note, r2.note].filter(Boolean).join(' ');
        if (num1 > num2) { // col1 more numeric than col2 -> swap so numeric becomes y
          xCol = col2; yCol = col1;
        }
        if (preprocessedData.filter(r => !isNaN(parseFloat(r[yCol]))).length > 0) {
          const groups = {};
          preprocessedData.forEach(r => {
            const key = String(r[xCol] ?? 'Unknown');
            const v = parseFloat(r[yCol]);
            if (!isNaN(v)) (groups[key] ||= []).push(v);
          });
          const labels = Object.keys(groups);
          const values = labels.map(k => {
            const arr = groups[k];
            return arr.reduce((a,b)=>a+b,0) / (arr.length || 1);
          });
          setVisualizations([{ type: 'bar_agg', x: xCol, y: yCol, labels, values, agg: 'mean' }]);
          pushAssistantMessage('ai', `Added Bar Chart - mean ${yCol} by ${xCol}. ${notes}`.trim());
        } else {
          // fallback to count by x
          const counts = {};
          preprocessedData.forEach(r => { const v = r[xCol] ?? 'Unknown'; counts[String(v)] = (counts[String(v)]||0)+1; });
          const labels = Object.keys(counts);
          const values = labels.map(l => counts[l]);
          setVisualizations([{ type: 'bar_count', x: xCol, labels, values }]);
          pushAssistantMessage('ai', `Added Bar Chart - count by ${xCol}. ${notes}`.trim());
        }
        return;
      }

      // Describe or stats command
      if (/(describe|insights|summary|stats|statistics)/i.test(lower)) {
        const cols = Object.keys(preprocessedData[0] || {});
        const numericCols = cols.filter(col => preprocessedData
          .slice(0, 10)
          .map(r => r[col])
          .filter(v => !isNaN(parseFloat(v)) && isFinite(v)).length > 5);
        const rowCount = preprocessedData.length;
        const message = `Rows: ${rowCount}. Columns: ${cols.length}. Numeric: ${numericCols.length}. Suggestions available: ${aiSuggestions.length}.`;
        pushAssistantMessage('ai', message);
        return;
      }

      // Fallback
      pushAssistantMessage('ai', "I can clean data (fill/remove nulls, drop/rename columns) and create charts. Examples: 'fill nulls in Age with mean', 'remove rows where Salary is null', 'drop column Address', 'rename column old to new', 'histogram of Year', 'scatter Age vs Salary', 'pie of Category', or ask for 'insights'.");
    } catch (err) {
      pushAssistantMessage('ai', `Error: ${err.message}`);
    }
  };

  // Helper functions for data preprocessing
  const detectColumnType = (data, col) => {
    const sampleSize = Math.min(50, Math.floor(data.length * 0.2));
    const sample = data.slice(0, sampleSize).map(row => row[col]).filter(val => val !== null && val !== undefined && val !== "");
    if (sample.length === 0) return 'categorical';
    const numericCount = sample.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length;
    if (numericCount / sample.length >= 0.8) return 'numeric';
    const dateCount = sample.filter(val => !isNaN(Date.parse(val))).length;
    if (dateCount / sample.length >= 0.7) return 'datetime';
    return 'categorical';
  };

  const computeMedian = (values) => {
    if (values.length === 0) return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };

  const computeMode = (values) => {
    if (values.length === 0) return "Unknown";
    const freq = {};
    values.forEach(val => {
      const key = String(val);
      freq[key] = (freq[key] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(key => freq[key] === maxFreq);
    return modes[0] || "Unknown";
  };

  const forwardFill = (data, col) => {
    const result = [...data];
    let lastValid = null;
    for (let i = 0; i < result.length; i++) {
      if (result[i][col] !== null && result[i][col] !== undefined && result[i][col] !== "") {
        lastValid = result[i][col];
      } else if (lastValid !== null) {
        result[i] = { ...result[i], [col]: lastValid };
      }
    }
    return result;
  };

  const backwardFill = (data, col) => {
    const result = [...data];
    let nextValid = null;
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i][col] !== null && result[i][col] !== undefined && result[i][col] !== "") {
        nextValid = result[i][col];
      } else if (nextValid !== null) {
        result[i] = { ...result[i], [col]: nextValid };
      }
    }
    return result;
  };

  return (
    <>
      {/* Animated gradient background */}
<div className="absolute inset-0 bg-white dark:bg-black" />      

        {/* Data table grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
          {[...Array(5)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-gray-200/20 dark:bg-gray-700/20" style={{ left: `${(i + 1) * 16.66}%` }}></div>
          ))}
          {[...Array(5)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-gray-200/20 dark:bg-gray-700/20" style={{ top: `${(i + 1) * 16.66}%` }}></div>
          ))}
        </div>
        
        {/* Data processing elements */}
        <div className="absolute top-1/4 left-1/5 w-64 h-8 bg-blue-500/10 dark:bg-blue-400/10 rounded-md transform -rotate-12"></div>
        <div className="absolute top-2/3 right-1/4 w-48 h-8 bg-blue-500/10 dark:bg-blue-400/10 rounded-md transform rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/3 w-72 h-8 bg-blue-500/10 dark:bg-blue-400/10 rounded-md transform -rotate-6"></div>
        
        {/* Static data flow lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0,100 Q400,180 800,100 T1600,180" 
            fill="none" 
            stroke="rgba(99, 102, 241, 0.1)" 
            strokeWidth="4"
            strokeDasharray="8 12"
          />
          <path 
            d="M0,300 Q400,220 800,300 T1600,220" 
            fill="none" 
            stroke="rgba(139, 92, 246, 0.1)" 
            strokeWidth="4"
            strokeDasharray="8 12"
          />
          <path 
            d="M0,500 Q400,580 800,500 T1600,580" 
            fill="none" 
            stroke="rgba(79, 70, 229, 0.1)" 
            strokeWidth="4"
            strokeDasharray="8 12"
          />
        </svg>
        
        {/* Static "Data Clinic" text in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[15rem] md:text-[20rem] font-black text-gray-100/5 dark:text-gray-800/10 select-none">
            DATA CLINIC
          </div>
        </div>
        
        {/* Data processing icons */}
        {[...Array(8)].map((_, i) => {
          const icons = [
            <Database key="db" className="w-full h-full opacity-10" />,
            <BarChart3 key="bar" className="w-full h-full opacity-10" />,
            <PieChart key="pie" className="w-full h-full opacity-10" />,
            <TrendingUp key="trend" className="w-full h-full opacity-10" />,
            <FileText key="file" className="w-full h-full opacity-10" />,
            <Brain key="brain" className="w-full h-full opacity-10" />,
            <Lightbulb key="light" className="w-full h-full opacity-10" />,
            <Settings key="settings" className="w-full h-full opacity-10" />
          ];
          return (
            <div
              key={i}
              className="absolute w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-float-slow"
              style={{
                left: `${10 + (Math.random() * 80)}%`,
                top: `${10 + (Math.random() * 80)}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            >
              {icons[i % icons.length]}
            </div>
          );
        })}

      
      <div className="relative z-10">
        <main className="mx-auto max-w-7xl px-5 pt-10 pb-16">
          <div className="space-y-12">
            {/* Hero Section with An animate-bounceimations */}
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium animate-bounce">
                <Sparkles className="w-4 h-4" />
                AI-Powered Data Analytics
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="relative">
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent animate-gradient-x">
                  Upload & Preprocess
                  <br />
                  <span className="text-4xl md:text-5xl">Dataset</span>
                </h1>
              </div>
              
              <p className="text-xl text-black-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Upload your dataset and let our AI automatically clean, preprocess, and suggest the best analysis approaches for your data
              </p>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium shadow-lg">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  AI Suggestions
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium shadow-lg">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  Auto Analysis
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium shadow-lg">
                  <Star className="w-4 h-4 text-purple-500" />
                  Smart Cleaning
                </div>
              </div>
            </div>

            {/* Upload Section with Amazing Animations */}
            <div className="relative group">
              <div className="relative glass p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black-800/80 border border-[var(--color-secondary)] shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-xl shadow-lg">
                      <UploadIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Upload Dataset
              </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSuggestionMode(!suggestionMode)}
                      className={`group relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        suggestionMode 
                          ? 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-secondary)]/25' 
                          : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[var(--color-secondary)] hover:to-[var(--color-primary)] hover:text-white'
                      }`}
                    >
                      <div className="relative overflow-hidden rounded-full p-1 transition-all duration-300 hover:bg-[var(--color-secondary)]/20 active:bg-[var(--color-primary)]/30">
                        <Brain 
                          className={`w-5 h-5 transition-all duration-300 ${suggestionMode ? 'text-white scale-110' : 'group-hover:scale-110'}`} 
                        />
                        {/* Neural network highlight effect */}
                        <div   className={`absolute inset-0 rounded-full bg-[var(--color-primary)]/20 opacity-0 group-hover:opacity-70 transition-opacity duration-300 ${suggestionMode ? 'opacity-70' : ''}`}></div>
                      </div>
                      <span>AI Mode</span>
                      {suggestionMode && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Animated Upload Area */}
                  <div className="relative group/upload">
<div className="absolute -inset-0.5 rounded-2xl bg-[var(--color-primary)]/20 opacity-0 transition duration-500 group-hover/upload:opacity-75 group-hover/upload:blur"></div>
                    <div className="relative border-2 border-dashed border-[var(--color-secondary)] dark:border-[var(--color-secondary)]/60 rounded-2xl p-12 text-center transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-secondary)]/10 dark:hover:bg-[var(--color-secondary)]/20 group-hover/upload:scale-[1.02]">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <div className="relative mb-6">
                          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                            <UploadIcon className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-secondary)] rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <p className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          {file ? (
                            <span className="flex items-center justify-center gap-2">
                              <FileText className="w-5 h-5 text-green-500" />
                              {file.name}
                            </span>
                          ) : (
                            "Click to select a file"
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Supports CSV, Excel (.xlsx, .xls)s
                    </p>
                        <div className="flex justify-center gap-2 text-xs text-gray-400">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-black-700 rounded">CSV</span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-black-700 rounded">Excel</span>
                        </div>
                  </label>
                    </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                    className="group relative w-full py-4 px-8 bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-primary)] to-[var(--color-accent)] rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing with AI...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Upload & Preprocess</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                </button>
                </div>
              </div>
            </div>

            {/* Preprocessing Results */}
            {preprocessingSteps.length > 0 && (
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                  Preprocessing Results
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-green-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    <strong>Preprocessing completed successfully!</strong>
<p className="text-sm mt-1 text-blue-700 !text-blue-700">
  Processed {preprocessedData?.length || 0} rows
</p>

                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Steps performed:</h3>
                    <ul className="space-y-2">
                      {preprocessingSteps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={downloadProcessedData}
                    className="btn btn-secondary"
                  >
                    Download Processed Dataset
                  </button>
                </div>
              </div>
            )}

            {/* Data Insights */}
            {dataInsights && (
              <div className="p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6" style={{color:'var(--title)'}}>
                  Data Insights
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dataInsights.totalRows}</div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dataInsights.totalColumns}</div>
                    <div className="text-sm text-gray-600">Total Columns</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dataInsights.numericColumns}</div>
                    <div className="text-sm text-gray-600">Numeric Columns</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dataInsights.missingValues}</div>
                    <div className="text-sm text-gray-600">Missing Values</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{dataInsights.basicStats?.totalNumericValues || 0}</div>
                    <div className="text-sm text-gray-600">Numeric Values Analyzed</div>
                  </div>
                </div>

{autoStats && autoStats.stats && (
  <section className="mt-10">
    <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white tracking-wide">
      📊 Automatic Descriptive Statistics
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Object.entries(autoStats.stats).map(([col, stats]) => (
        <div
          key={col}
          className="relative group bg-gradient-to-br from-white via-gray-50 to-gray-100
                     dark:from-gray-800 dark:via-gray-900 dark:to-gray-950
                     border border-gray-200 dark:border-gray-700
                     rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300
                     p-6 overflow-hidden"
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10
                          opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></div>

          {/* Header */}
          <h4 className="relative font-bold text-2xl mb-5 text-center text-gray-900 dark:text-gray-50">
            {col}
          </h4>

          {/* Divider */}
          <div className="relative w-16 mx-auto mb-6 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>

          {/* Stats Grid */}
          <div className="relative grid grid-cols-2 gap-y-4 gap-x-6 text-gray-800 dark:text-gray-200">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mean</span>
              <span className="text-lg font-semibold">{stats.mean?.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Median</span>
              <span className="text-lg font-semibold">{stats.median?.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Min</span>
              <span className="text-lg font-semibold">{stats.min?.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Max</span>
              <span className="text-lg font-semibold">{stats.max?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
                )}
              </div>
            )}

            {/* AI Suggestions */}
            {suggestionMode && aiSuggestions.length > 0 && (
              <div>
                <div className="relative p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                        AI Suggestions
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Powered by advanced machine learning algorithms
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white rounded-full text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      {aiSuggestions.length} Suggestions
                    </div>
                  </div>
                  
                  <div className="grid gap-6">
                    {aiSuggestions.map((suggestion, index) => {
                      const IconComponent = suggestion.icon;
                      return (
                        <div
                          key={suggestion.id}
                          className={`group relative p-6 transition-all duration-500 transform hover:scale-[1.02] ${
                            suggestion.applied
                              ? 'bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 dark:from-[var(--color-secondary)]/20 dark:to-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-secondary)]/10'
                              : 'bg-white/80 dark:bg-gray-700/80 hover:shadow-lg hover:shadow-[var(--color-secondary)]/10'
                          }`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="relative flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 shadow-lg transition-all duration-300 ${
                                suggestion.applied 
                                  ? 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]' 
                                  : 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] group-hover/suggestion:scale-110'
                              }`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {suggestion.title}
                                  </h3>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    suggestion.type === 'cleaning' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                    suggestion.type === 'analysis' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  }`}>
                                    {suggestion.type}
                                  </span>
                                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-xs">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span className="font-medium">
                                      {Math.round(suggestion.confidence * 100)}% confidence
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                  {suggestion.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {suggestion.applied ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white rounded-xl font-medium animate-pulse">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Applied</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleSuggestionExecute(suggestion)}
                                  disabled={loading && selectedSuggestion?.id === suggestion.id}
                                  className="group/btn relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-xl blur opacity-0 group-hover/btn:opacity-75 transition duration-500"></div>
                                  <div className="relative flex items-center gap-2">
                                    {loading && selectedSuggestion?.id === suggestion.id ? (
                                      <>
                                        <Settings className="w-4 h-4 animate-spin" />
                                        <span>Processing...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        <span>Execute</span>
                                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                      </>
                                    )}
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Visualizations with Amazing Animations */}
            {visualizations.length > 0 && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-primary)] to-[var(--color-accent)] rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <div className="relative glass p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-xl shadow-lg animate-pulse">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Generated Visualizations
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        AI-powered charts and graphs for your data
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-sm font-medium animate-bounce">
                      <Sparkles className="w-4 h-4" />
                      {visualizations.length} Charts
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {visualizations.map((chart, index) => (
                      <div 
                        key={index} 
                        className="group/chart relative p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600">
                              {chart.type === 'histogram' ? <BarChart3 className="w-5 h-5 text-white" /> :
                               chart.type === 'scatter' ? <TrendingUp className="w-5 h-5 text-white" /> :
                               chart.type === 'pie' ? <PieChart className="w-5 h-5 text-white" /> :
                               <BarChart3 className="w-5 h-5 text-white" />}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {chart.type === 'histogram' ? `Histogram - ${chart.column || 'Column'}` :
                               chart.type === 'scatter' ? `Scatter Plot - ${chart.x} vs ${chart.y}` :
                               chart.type === 'pie' ? `Pie Chart - ${chart.column || 'Category'}` : 'Chart'}
                            </h3>
                            <div className="ml-auto px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs font-medium">
                              {chart.column || `${chart.x} vs ${chart.y}`}
                            </div>
                          </div>
                          
                          <div className="h-64 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300 relative overflow-hidden group-hover/chart:shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover/chart:opacity-100 transition-all duration-500"></div>
                            <div className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full shadow-md opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-center z-10 transform transition-transform duration-300 group-hover/chart:scale-105">
                              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                                Interactive {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Visualization
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                                {chart.type === 'histogram' ? `X: ${chart.column} | Y: Count` :
                                 chart.type === 'scatter' ? `X: ${chart.x} | Y: ${chart.y}` :
                                 chart.type === 'pie' ? `Labels: ${chart.column}` : ''}
                              </p>
                              <div className="w-16 h-16 mx-auto mb-2 opacity-75">
                                {chart.type === 'histogram' ? <BarChart3 className="w-full h-full text-blue-500" /> :
                                 chart.type === 'scatter' ? <TrendingUp className="w-full h-full text-purple-500" /> :
                                 chart.type === 'pie' ? <PieChart className="w-full h-full text-green-500" /> :
                                 <BarChart3 className="w-full h-full text-blue-500" />}
                              </div>
                              <p className="text-xs text-blue-500 dark:text-blue-400 animate-pulse">
                                Click View Details for interactive exploration
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>AI Generated</span>
                            </div>
                            <button 
                              onClick={() => openChartDetails(chart)} 
                              className="px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Data Preview */}
            {preprocessedData && (
              <div>
                <div className="relative p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                        Data Preview
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your processed dataset is ready for analysis
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      {preprocessedData.length} Rows
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden">
                <div className="overflow-x-auto">
                      <table className="w-full">
                    <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                        {Object.keys(preprocessedData[0] || {}).map((key, index) => (
                              <th 
                                key={index} 
                                className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-full animate-pulse"></div>
                            {key}
                                </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preprocessedData.slice(0, showAllData ? preprocessedData.length : 10).filter(row => row != null).map((row, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                      {Object.values(row).map((value, colIndex) => (
                            <td 
                              key={colIndex} 
                              className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span className="truncate max-w-[200px]">{value}</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    </div>
                    
                  {preprocessedData.length > 10 && (
                      <div className="bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 dark:from-[var(--color-secondary)]/20 dark:to-[var(--color-primary)]/20 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {showAllData ? 'all' : 'first 10'} rows of <span className="font-bold text-blue-600 dark:text-blue-400">{preprocessedData.length}</span> total rows
                          </p>
                          <button 
                            onClick={() => setShowAllData(!showAllData)}
                            className="px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            {showAllData ? 'Show Less' : 'View All Data'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Removed animated background particles */}
      
      {/* Removed animated data flow elements */}
      
      {/* Simple border without animation */}
      <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-gradient-to-r from-[var(--color-secondary)]/20 to-[var(--color-primary)]/20 dark:from-[var(--color-secondary)]/20 dark:to-[var(--color-primary)]/20" />

      {/* Floating AI Assistant Button with Neural Network Highlight Effect */}
  
    
      <button
        onClick={() => setIsAssistantOpen(prev => !prev)}
        className=" fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white flex items-center justify-center hover:scale-105 transition-all duration-300 overflow-hidden"
        aria-label="AI Assistant"
        title="Ask AI about your dataset"
      >
        {/* Neural network highlight effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 group-active:scale-90 transition-transform duration-300 origin-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/60 to-[var(--color-primary)]/60 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-80 transition-opacity duration-300"></div>
        
        <Sparkles className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </button>
    
    

      {/* Assistant Panel */}
      {isAssistantOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[92vw] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <div className="relative group cursor-pointer overflow-hidden rounded-full p-1">
              <Sparkles className="w-5 h-5 text-greenButtons-light relative z-10 group-hover:scale-110 transition-transform duration-300" />
              {/* Neural network highlight effect */}
              <div className="absolute inset-0 bg-[var(--color-secondary)]/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">AI Assistant</div>
          </div>
          <div className="max-h-72 overflow-auto p-3 space-y-2">
            {assistantMessages.length === 0 && (
              <div className="text-sm text-gray-500">Ask me to create charts or summarize your dataset. Examples: "histogram of Year", "scatter Age vs Salary", "pie of Category", "insights".</div>
            )}
            {assistantMessages.map((m, i) => (
              <div key={i} className={`${m.role === 'user' ? 'justify-end' : 'justify-start'} flex`}>
                <div className={`${m.role === 'user' ? 'bg-greenButtons-light text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'} px-3 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <input
              value={assistantInput}
              onChange={e => setAssistantInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAssistantCommand(); }}
              placeholder="Ask about your dataset..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 outline-none"
            />
            <button 
              onClick={handleAssistantCommand} 
              className="group relative px-3 py-2 rounded-lg bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white font-medium overflow-hidden"
            >
              {/* Neural network highlight effect */}
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 group-active:scale-90 transition-transform duration-300 origin-center"></div>
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">Send</span>
            </button>
          </div>
        </div>
      )}
      

      {isDetailsOpen && selectedChart && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[92vw] max-w-5xl p-6 relative">
          <button
            onClick={closeChartDetails}
            className="absolute top-3 right-3 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm"
          >
            Close
          </button>

          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {selectedChart.type === 'histogram' ? 'Histogram' : selectedChart.type === 'scatter' ? 'Scatter Plot' : selectedChart.type === 'pie' ? 'Pie Chart' : 'Chart'}
            {selectedChart.column ? ` - ${selectedChart.column}` : (selectedChart.x && selectedChart.y ? ` - ${selectedChart.x} vs ${selectedChart.y}` : '')}
          </h3>

          <div id="plotly-container" className="w-full h-[420px]"></div>
        </div>
      </div>
      )}
    </>
  );
}

