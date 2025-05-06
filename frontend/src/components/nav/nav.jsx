import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, Menu, X, Home, Info, Award, Database, ChevronDown, User, LogOut, BarChart2, Globe, Wind, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { selectCurrentUser, selectDashboardData } from '../../redux/selectors';
import { logout } from '../../redux/slices/authSlice';

// Brand colors
const colors = {
  primary: 'bg-emerald-600',
  primaryHover: 'hover:bg-emerald-700',
  secondary: 'bg-purple-600',
  secondaryHover: 'hover:bg-purple-700',
  accent: 'bg-amber-500',
  accentHover: 'hover:bg-amber-600',
  dark: 'bg-gray-800',
  darkHover: 'hover:bg-gray-900',
  light: 'bg-gray-50',
  lightHover: 'hover:bg-gray-100',
};


const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        {/* Electron Orbits */}
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#2ECC71" strokeWidth="2" transform="rotate(0 100 100)" />
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#2ECC71" strokeWidth="2" transform="rotate(60 100 100)" />
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#2ECC71" strokeWidth="2" transform="rotate(120 100 100)" />
        
        {/* Electrons */}
        <circle cx="180" cy="100" r="6" fill="#2ECC71" />
        <circle cx="60" cy="126" r="6" fill="#2ECC71" />
        <circle cx="60" cy="74" r="6" fill="#2ECC71" />
        
        {/* Nucleus */}
        <circle cx="100" cy="100" r="18" fill="#27AE60" />
        <circle cx="100" cy="100" r="14" fill="#2ECC71" />
      </svg>
    </div>
  );
};


// Navigation component with dropdown for user
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setUserMenuOpen(false);
  };

  return (
    <nav className={`${colors.primary} text-white shadow-lg sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold">Africa RECs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-amber-200 transition duration-200 flex items-center">
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link to="/about" className="hover:text-amber-200 transition duration-200 flex items-center">
              <Info className="mr-1 h-4 w-4" />
              About
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="hover:text-amber-200 transition duration-200 flex items-center">
                  <BarChart2 className="mr-1 h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/devices" className="hover:text-amber-200 transition duration-200 flex items-center">
                  <Database className="mr-1 h-4 w-4" />
                  Devices
                </Link>
                <Link to="/issue-requests" className="hover:text-amber-200 transition duration-200 flex items-center">
                  <Award className="mr-1 h-4 w-4" />
                  Issue Requests
                </Link>
              </>
            )}
            
            {/* Theme toggle */}
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-emerald-700 transition duration-200">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* User menu or login */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1 hover:text-amber-200 transition duration-200"
                >
                  <User className="h-5 w-5" />
                  <span>{user.email || user.username}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded bg-white text-emerald-600 font-medium hover:bg-gray-100 transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`px-4 py-2 rounded ${colors.accent} ${colors.accentHover} text-white font-medium transition duration-200`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 py-4">
                <Link to="/" className="hover:bg-emerald-700 px-4 py-2 rounded transition duration-200">
                  <Home className="inline-block mr-2 h-4 w-4" />
                  Home
                </Link>
                <Link to="/about" className="hover:bg-emerald-700 px-4 py-2 rounded transition duration-200">
                  <Info className="inline-block mr-2 h-4 w-4" />
                  About
                </Link>
                {user && (
                  <>
                    <Link to="/dashboard" className="hover:bg-emerald-700 px-4 py-2 rounded transition duration-200">
                      <BarChart2 className="inline-block mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link to="/devices" className="hover:bg-emerald-700 px-4 py-2 rounded transition duration-200">
                      <Database className="inline-block mr-2 h-4 w-4" />
                      Devices
                    </Link>
                    <Link to="/issue-requests" className="hover:bg-emerald-700 px-4 py-2 rounded transition duration-200">
                      <Award className="inline-block mr-2 h-4 w-4" />
                      Issue Requests
                    </Link>
                  </>
                )}
                {user ? (
                  <>
                    <Link to="/profile" className="hover:bg-emerald-700 px-4 py-2 rounded transition duration-200">
                      <User className="inline-block mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="hover:bg-emerald-700 px-4 py-2 rounded transition duration-200 text-left w-full"
                    >
                      <LogOut className="inline-block mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link 
                      to="/login" 
                      className="block text-center px-4 py-2 rounded bg-white text-emerald-600 font-medium hover:bg-gray-100 transition duration-200"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className={`block text-center px-4 py-2 rounded ${colors.accent} ${colors.accentHover} text-white font-medium transition duration-200`}
                    >
                      Register
                    </Link>
                  </div>
                )}
                <button 
                  onClick={toggleDarkMode} 
                  className="flex items-center px-4 py-2 hover:bg-emerald-700 rounded transition duration-200"
                >
                  {isDarkMode ? <Sun className="mr-2 h-5 w-5" /> : <Moon className="mr-2 h-5 w-5" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// Export the Navigation component
export default Navigation;