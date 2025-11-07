import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";
import sendEmail from "../utils/sendEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, Excel, and JSON files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

// Parse JSON file
const parseJSON = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Upload and parse dataset
router.post('/upload-dataset', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let data;

    // Parse file based on extension
    switch (fileExt) {
      case '.csv':
        data = await parseCSV(filePath);
        break;
      case '.xlsx':
      case '.xls':
        data = parseExcel(filePath);
        break;
      case '.json':
        data = parseJSON(filePath);
        break;
      default:
        throw new Error('Unsupported file type');
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Send email notification if user info available
    try {
      const email = req.headers['x-user-email'];
      const name = req.headers['x-user-name'] || 'there';
      if (email) {
        await sendEmail(
          email,
          'Your dataset has been processed ✔',
          `Hi ${name}, your dataset was uploaded and parsed successfully. Rows: ${data.length}.`,
          `<p>Hi ${name},</p><p>Your dataset was uploaded and parsed successfully.</p><p><b>Rows</b>: ${data.length}</p><p>You can now continue preprocessing and analysis in the app.</p>`
        );
      }
    } catch (e) {
      // best-effort
    }

    res.json({
      message: 'Dataset uploaded and parsed successfully',
      data: data,
      rows: data.length,
      columns: data.length > 0 ? Object.keys(data[0]).length : 0
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: error.message || 'Failed to process dataset' 
    });
  }
});

export default router;


