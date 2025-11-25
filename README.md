# DATA_CLINIC

# Data Clinic - AI-Powered Data Analytics Platform

A comprehensive data analytics platform built with React, Node.js, and MongoDB, featuring AI-powered suggestions and automated data processing.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based login with Google OAuth integration
- **Email Notifications**: Automated email sending for Google OAuth users
- **Data Upload**: Support for CSV, Excel, and JSON files
- **AI-Powered Suggestions**: Intelligent recommendations for data cleaning and analysis
- **Data Cleaning**: Automated preprocessing and cleaning workflows
- **Data Analysis**: Multiple analysis types including descriptive statistics and correlation analysis
- **Report Generation**: Comprehensive PDF report generation
- **Real-time Visualizations**: Interactive charts and graphs

### AI Features
- **Smart Data Analysis**: Automatic detection of data types and patterns
- **Cleaning Suggestions**: AI-powered recommendations for data quality improvement
- **Visualization Suggestions**: Intelligent chart and graph recommendations
- **Confidence Scoring**: AI suggestions come with confidence levels
- **One-click Execution**: Apply AI suggestions with a single click

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Passport.js** for Google OAuth
- **Nodemailer** for email functionality
- **Multer** for file uploads
- **PapaParse** for CSV processing

### Database
- **MongoDB Atlas** for cloud database
- **Mongoose** for object modeling

## 📁 Project Structure



```
data-clinic/
backend/
├── models/
│ └── user.js
├── routes/
│ ├── ai.js
│ ├── auth.js
│ ├── reports.js
│ └── upload.js
├── utils/
│ ├── mailer.js
│ └── sendEmail.js
├── db.js
├── server.js
├── .env
├── package.json
├── package-lock.json

frontend/
├── public/
│ ├── ai-assistant.svg
│ └── vite.svg
├── src/
│ ├── assets/
│ │ ├── data-analysisjs.jpg
│ │ ├── IMG_1063.PNG
│ │ └── react.svg
│ ├── components/
│ │ ├── auth/
│ │ │ ├── AccountSettingsOverlay.jsx
│ │ │ ├── ChangePasswordOverlay.jsx
│ │ │ ├── EditProfileOverlay.jsx
│ │ │ ├── ForgotPasswordOverlay.jsx
│ │ │ ├── LoginOverlay.jsx
│ │ │ ├── SignupOverlay.jsx
│ │ ├── common/
│ │ │ ├── Carousel.jsx
│ │ │ ├── Icons.jsx
│ │ │ ├── Navbar.jsx
│ │ │ └── ThemeToggle.jsx
│ ├── hooks/
│ ├── pages/
│ │ ├── About.jsx
│ │ ├── AnalyzeDataPage.jsx
│ │ ├── AuthSuccess.jsx
│ │ ├── CleanDataPage.jsx
│ │ ├── Dashboard.jsx
│ │ ├── ForgotPassword.jsx
│ │ ├── GetStartedPage.jsx
│ │ ├── GoogleCallback.jsx
│ │ ├── HomePage.jsx
│ │ ├── LearnMore.jsx
│ │ ├── Login.jsx
│ │ ├── Onboarding.jsx
│ │ ├── Register.jsx
│ │ ├── ReportPage.jsx
│ │ └── ResetPassword.jsx
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js

.gitignore
README.md
vercel.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-clinic
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   SESSION_SECRET=your_session_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Data Management
- `POST /api/upload-dataset` - Upload dataset
- `GET /api/upload-dataset` - Get user datasets
- `POST /api/clean-dataset/:id` - Clean dataset
- `POST /api/analyze-dataset/:id` - Analyze dataset

### AI Features
- `POST /api/ai/suggestions` - Get AI suggestions
- `POST /api/ai/execute` - Execute AI suggestion

### Reports
- `GET /api/reports` - Get user reports
- `POST /api/generate-report` - Generate new report
- `GET /api/reports/:id/download` - Download report
- `DELETE /api/reports/:id` - Delete report

## 🤖 AI Features

### Smart Suggestions
The AI system analyzes uploaded datasets and provides intelligent suggestions for:
- **Data Cleaning**: Missing value handling, duplicate removal
- **Data Analysis**: Statistical analysis, correlation detection
- **Visualizations**: Chart recommendations based on data types

### Confidence Scoring
Each AI suggestion includes a confidence score (0-100%) to help users make informed decisions.

### One-Click Execution
Users can apply AI suggestions with a single click, making data processing more efficient.

## 📊 Data Processing

### Supported File Types
- CSV files
- Excel files (.xlsx, .xls)
- JSON files

### Cleaning Operations
- Remove duplicate rows
- Handle missing values
- Data type conversion
- Outlier detection
- Data normalization

### Analysis Types
- Descriptive statistics
- Correlation analysis
- Distribution analysis
- Trend analysis
- Predictive modeling

## 🎨 UI/UX Features

### Modern Design
- Clean, modern interface with TailwindCSS
- Responsive design for all screen sizes
- Dark/light theme support
- Smooth animations and transitions

### User Experience
- Intuitive navigation
- Real-time feedback
- Progress indicators
- Error handling
- Success notifications

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Secure file uploads

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Add to environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email dataclinicc@gmail.com or create an issue in the repository.

---

**Data Clinic** - Making data analytics accessible to everyone through AI-powered insights.



