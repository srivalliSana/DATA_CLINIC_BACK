import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// -----------------
// AI Suggestions
// -----------------
router.post('/suggestions', authenticateToken, async (req, res) => {
  try {
    const { data, columns } = req.body;
    if (!data || !Array.isArray(data))
      return res.status(400).json({ message: 'Valid data array is required' });

    const suggestions = [];
    const numericColumns = columns.filter(col => {
      const sampleValues = data.slice(0, 10).map(row => row[col]);
      return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length > sampleValues.length * 0.8;
    });
    const categoricalColumns = columns.filter(col => !numericColumns.includes(col));

    // Missing values
    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (row[key] === null || row[key] === undefined || row[key] === '') {
          suggestions.push({
            id: `missing-${key}`,
            type: 'cleaning',
            title: `Missing Values in ${key}`,
            description: `Found missing values in the '${key}' column.`,
            action: `fill_missing_${key}`,
            confidence: 0.9,
            applied: false
          });
        }
      });
    });

    // Duplicates
    const duplicates = data.length - [...new Set(data.map(row => JSON.stringify(row)))].length;
    if (duplicates > 0) {
      suggestions.push({
        id: 'duplicates',
        type: 'cleaning',
        title: 'Duplicate Rows Detected',
        description: `Found ${duplicates} duplicate rows.`,
        action: 'remove_duplicates',
        confidence: 0.95,
        applied: false
      });
    }

    // Analysis suggestions
    if (numericColumns.length >= 2) suggestions.push({ id: 'correlation', type: 'analysis', title: 'Correlation Analysis', action: 'correlation_analysis', confidence: 0.8, applied: false });
    if (numericColumns.length > 0) suggestions.push({ id: 'descriptive_stats', type: 'analysis', title: 'Descriptive Statistics', action: 'descriptive_stats', confidence: 0.9, applied: false });

    // Visualization suggestions
    if (numericColumns.length >= 1) suggestions.push({ id: 'histogram', type: 'visualization', title: 'Distribution Analysis', action: 'create_histograms', confidence: 0.85, applied: false });
    if (numericColumns.length >= 2) suggestions.push({ id: 'scatter_plot', type: 'visualization', title: 'Scatter Plot Matrix', action: 'create_scatter_plots', confidence: 0.8, applied: false });
    if (categoricalColumns.length > 0) suggestions.push({ id: 'pie_chart', type: 'visualization', title: 'Categorical Distribution', action: 'create_pie_charts', confidence: 0.75, applied: false });

    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ message: 'Failed to generate AI suggestions' });
  }
});

// -----------------
// Execute AI Action
// -----------------
router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { action, data } = req.body;
    if (!action || !data) return res.status(400).json({ message: 'Action and data are required' });

    let result = {};

    switch (action) {
      case 'descriptive_stats': result = await generateDescriptiveStats(data); break;
      case 'correlation_analysis': result = await generateCorrelationAnalysis(data); break;
      case 'create_histograms': result = await createHistograms(data); break;
      case 'create_scatter_plots': result = await createScatterPlots(data); break;
      case 'create_pie_charts': result = await createPieCharts(data); break;
      default: return res.status(400).json({ message: 'Unknown action' });
    }

    res.json({ result, action });
  } catch (error) {
    console.error('AI execution error:', error);
    res.status(500).json({ message: 'Failed to execute AI suggestion' });
  }
});

// -----------------
// Helper Functions
// -----------------
const generateDescriptiveStats = async (data) => {
  const columns = Object.keys(data[0] || {});
  const numericColumns = columns.filter(col => {
    const sampleValues = data.slice(0, 10).map(row => row[col]);
    return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length > sampleValues.length * 0.8;
  });

  const stats = {};
  numericColumns.forEach(col => {
    const values = data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
    if (values.length > 0) {
      const sorted = values.sort((a, b) => a - b);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      stats[col] = {
        count: values.length,
        mean,
        median: sorted[Math.floor(sorted.length / 2)],
        min: Math.min(...values),
        max: Math.max(...values),
        std: Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length)
      };
    }
  });
  return { stats, type: 'descriptive_stats' };
};

const generateCorrelationAnalysis = async (data) => {
  const columns = Object.keys(data[0] || {});
  const numericColumns = columns.filter(col => {
    const sampleValues = data.slice(0, 10).map(row => row[col]);
    return sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length > sampleValues.length * 0.8;
  });

  const correlations = {};
  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i], col2 = numericColumns[j];
      const vals1 = data.map(r => parseFloat(r[col1])).filter(v => !isNaN(v));
      const vals2 = data.map(r => parseFloat(r[col2])).filter(v => !isNaN(v));
      if (vals1.length && vals2.length) correlations[`${col1}_${col2}`] = calculateCorrelation(vals1, vals2);
    }
  }
  return { correlations, type: 'correlation_analysis' };
};

const calculateCorrelation = (x, y) => {
  const n = x.length;
  const sumX = x.reduce((a,b)=>a+b,0);
  const sumY = y.reduce((a,b)=>a+b,0);
  const sumXY = x.reduce((acc,xi,i)=>acc+xi*y[i],0);
  const sumX2 = x.reduce((acc,xi)=>acc+xi*xi,0);
  const sumY2 = y.reduce((acc,yi)=>acc+yi*yi,0);
  return (n*sumXY - sumX*sumY)/Math.sqrt((n*sumX2 - sumX*sumX)*(n*sumY2 - sumY*sumY));
};

const createHistograms = async (data) => {
  const columns = Object.keys(data[0] || {});
  const numericColumns = columns.filter(col => {
    const sampleValues = data.slice(0, 10).map(row => row[col]);
    return sampleValues.filter(v=>!isNaN(parseFloat(v)) && isFinite(v)).length > sampleValues.length*0.8;
  });
  const charts = numericColumns.map(col => ({
    type: 'histogram',
    column: col,
    data: data.map(row => parseFloat(row[col])).filter(v=>!isNaN(v))
  }));
  return { charts, type: 'histograms' };
};

const createScatterPlots = async (data) => {
  const columns = Object.keys(data[0] || {});
  const numericColumns = columns.filter(col => {
    const sampleValues = data.slice(0,10).map(row => row[col]);
    return sampleValues.filter(v=>!isNaN(parseFloat(v)) && isFinite(v)).length > sampleValues.length*0.8;
  });
  const charts = [];
  for(let i=0;i<numericColumns.length;i++){
    for(let j=i+1;j<numericColumns.length;j++){
      const col1 = numericColumns[i], col2 = numericColumns[j];
      charts.push({ type:'scatter', x:col1, y:col2, data: data.map(row=>({x:parseFloat(row[col1]), y:parseFloat(row[col2])})).filter(p=>!isNaN(p.x)&&!isNaN(p.y))});
    }
  }
  return { charts, type:'scatter_plots' };
};

const createPieCharts = async (data) => {
  const columns = Object.keys(data[0]||{});
  const categoricalColumns = columns.filter(col => {
    const sampleValues = data.slice(0,10).map(r=>r[col]);
    return sampleValues.filter(v=>!isNaN(parseFloat(v)) && isFinite(v)).length <= sampleValues.length*0.8;
  });
  const charts = categoricalColumns.map(col=>{
    const counts = {};
    data.forEach(r=>{const v=r[col]||'Unknown'; counts[v]=(counts[v]||0)+1;});
    return { type:'pie', column:col, data: Object.entries(counts).map(([label,value])=>({label,value})) };
  });
  return { charts, type:'pie_charts' };
};

// -----------------
// LLM Chat Endpoint
// -----------------
router.post('/chat', authenticateToken, async (req,res)=>{
  try{
    const { prompt, context } = req.body || {};
    if(!prompt || typeof prompt!=='string') return res.status(400).json({message:'Prompt is required'});

    const provider = (process.env.LLM_PROVIDER||'openai').toLowerCase();

    // OpenAI
    if(provider==='openai'){
      const apiKey = process.env.OPENAI_API_KEY;
      if(!apiKey) return res.status(500).json({message:'OPENAI_API_KEY missing on server'});

      const response = await fetch('https://api.openai.com/v1/chat/completions',{
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${apiKey}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL||'gpt-4o-mini',
          messages:[
            { role:'system', content: buildSystemContent(context) },
            { role:'user', content: buildUserContent(prompt, context) }
          ],
          temperature:0.2
        })
      });
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content||'No response';
      return res.json({ provider:'openai', content });
    }

    // Gemini
    if(provider==='gemini'){
      const apiKey = process.env.GEMINI_API_KEY;
      if(!apiKey) return res.status(500).json({message:'GEMINI_API_KEY missing on server'});

      const model = process.env.GEMINI_MODEL;
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

      const systemContent = buildSystemContent(context);

      const response = await fetch(url,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          contents:[{ role:"user", parts:[{text:`${systemContent}\n\nUser Query: ${prompt}`}] }]
        })
      });
      const data = await response.json();
      if(data.error) return res.status(500).json({message:data.error.message||"Gemini API error", error:data.error});
      const content = data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join("\n") || "⚠️ Gemini returned no candidates";
      return res.json({ provider:"gemini", content });
    }

    return res.status(400).json({ message:`Unknown LLM provider '${provider}'` });
  }catch(err){
    console.error('AI chat error:',err);
    return res.status(500).json({ message:'Failed to get AI response' });
  }
});

// -----------------
// Helper for LLM
// -----------------
function buildSystemContent(context){
  let systemContent = `You are a specialized data analysis assistant. Always respond directly with insights. Do NOT suggest commands. Be conversational.`;

  if(context){
    const { columns, sample, insights } = context;
    if(Array.isArray(columns) && columns.length) systemContent+=`\nAvailable Columns: ${columns.join(', ')}`;
    if(Array.isArray(sample) && sample.length) systemContent+=`\nSample Data: ${JSON.stringify(sample.slice(0,2)).slice(0,300)}`;
    if(insights) systemContent+=`\nExisting Insights: ${JSON.stringify(insights).slice(0,300)}`;
  }
  return systemContent;
}

function buildUserContent(prompt, context){
  try{
    const pieces=[prompt];
    if(context){
      const { columns, sample, insights } = context;
      if(Array.isArray(columns) && columns.length) pieces.push(`Columns: ${columns.join(', ')}`);
      if(Array.isArray(sample) && sample.length) pieces.push(`Sample Row: ${JSON.stringify(sample[0]).slice(0,1000)}`);
      if(insights) pieces.push(`Insights: ${JSON.stringify(insights).slice(0,1000)}`);
    }
    return pieces.join('\n');
  }catch{return String(prompt);}
}

export default router;
