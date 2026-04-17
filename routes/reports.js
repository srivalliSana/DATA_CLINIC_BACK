import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all reports for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Mock reports data - in real app, fetch from database
    const reports = [
      {
        _id: '1',
        title: 'Monthly Sales Analysis',
        type: 'Summary Report',
        pages: 5,
        createdAt: new Date().toISOString(),
        sections: [
          {
            title: 'Executive Summary',
            content: 'This report provides a comprehensive analysis of monthly sales data, including trends, patterns, and key insights.'
          },
          {
            title: 'Sales Performance',
            content: 'Total sales increased by 15% compared to the previous month, with the highest growth in the technology sector.'
          }
        ],
        summary: 'The analysis reveals strong growth trends with opportunities for further optimization in customer acquisition channels.'
      },
      {
        _id: '2',
        title: 'Customer Behavior Analysis',
        type: 'Trend Analysis',
        pages: 8,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        sections: [
          {
            title: 'Customer Segmentation',
            content: 'Customers can be segmented into three main groups based on purchasing behavior and demographics.'
          }
        ],
        summary: 'Customer behavior analysis shows distinct patterns that can be leveraged for targeted marketing campaigns.'
      }
    ];

    res.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
});

// Generate new report
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const reportTypes = ['Summary Report', 'Trend Analysis', 'Data Quality'];
    const randomType = reportTypes[Math.floor(Math.random() * reportTypes.length)];
    
    const newReport = {
      _id: Date.now().toString(),
      title: `${randomType} - ${new Date().toLocaleDateString()}`,
      type: randomType,
      pages: Math.floor(Math.random() * 10) + 3,
      createdAt: new Date().toISOString(),
      sections: [
        {
          title: 'Executive Summary',
          content: 'This report provides comprehensive insights into your data analysis results, highlighting key findings and recommendations.'
        },
        {
          title: 'Data Overview',
          content: 'Analysis of your datasets reveals several important patterns and trends that can inform business decisions.'
        },
        {
          title: 'Key Insights',
          content: 'The data shows significant opportunities for optimization and growth in various areas of your business.'
        }
      ],
      summary: 'This report summarizes the key findings from your data analysis, providing actionable insights for decision-making.'
    };

    res.json({ report: newReport });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

// Download report
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, you would generate a PDF here
    // For now, we'll return a simple text response
    const reportContent = `Data Clinic Report - ${id}\n\nThis is a sample report download.\nIn a real application, this would be a PDF file.`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="report-${id}.txt"`);
    res.send(reportContent);
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ message: 'Failed to download report' });
  }
});

// Delete report
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, delete from database
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Failed to delete report' });
  }
});

export default router;


