import { Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import Onboarding from './pages/Onboarding.jsx';
import LearnMore from './pages/LearnMore.jsx';
import About from './pages/About.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import AuthSuccess from './pages/AuthSuccess.jsx';
import GoogleCallback from './pages/GoogleCallback.jsx';
import UploadDatasetPage from './pages/UploadDatasetPage.jsx';
import Profile from './pages/Profile.jsx';
import Navbar from './components/Navbar.jsx';

function AppLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] dark:from-[#121212] dark:to-[#1E1E1E]">
      <Navbar />
      <main className="flex-1 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

function OnboardingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<OnboardingLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload-dataset" element={<UploadDatasetPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
