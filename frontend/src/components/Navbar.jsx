import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  UserIcon,
  Cog6ToothIcon,
  PencilIcon,
  HomeIcon,
  InformationCircleIcon,
  BookOpenIcon,
  CloudArrowUpIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle.jsx";

const NavItem = ({ to, children, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
        isActive
          ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
          : "text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    {children}
  </NavLink>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Save current page to localStorage for persistence
  useEffect(() => {
    if (user && location.pathname !== '/auth/login' && location.pathname !== '/auth/register') {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location.pathname, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastVisitedPage");
    navigate("/onboarding");
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border border-gray-200 dark:border-neutral-700 rounded-lg p-2 shadow-lg"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-r border-gray-200 dark:border-neutral-700 shadow-xl z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and Theme Toggle */}
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src="src/assets/IMG_1063.PNG"
                alt="Data Clinic Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-lg font-bold text-[#1A1A1A] dark:text-white tracking-tight group-hover:text-[#2563EB] transition-colors">
                Data Clinic
              </span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavItem to="/" icon={HomeIcon} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </NavItem>
            <NavItem to="/about" icon={InformationCircleIcon} onClick={() => setIsMobileMenuOpen(false)}>
              About
            </NavItem>
            <NavItem to="/learn-more" icon={BookOpenIcon} onClick={() => setIsMobileMenuOpen(false)}>
              Learn More
            </NavItem>
            <NavItem to="/upload-dataset" icon={CloudArrowUpIcon} onClick={() => setIsMobileMenuOpen(false)}>
              Upload Dataset
            </NavItem>
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    Profile
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      View Profile
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsMobileMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit Profile
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Settings
                    </button>

                    <hr className="my-1 border-neutral-200 dark:border-neutral-600" />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>

                  {/* Click Outside to Close */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
