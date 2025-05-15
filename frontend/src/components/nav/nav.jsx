import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Sun,
  Moon,
  Menu,
  User,
  X,
  Home,
  Info,
  Award,
  Smartphone,
  ChevronDown,
  BarChart2,
  LogOut,
  Settings,
  Shield,
  HelpCircle,
  SquarePlus,
  Flag,
} from "lucide-react";
import DeviceUploadStepper from "../dashboard/deviceStepper";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../redux/slices/authSlice";
import { AuthModals } from "./auth";
import { Avatar, Badge, Divider, useMediaQuery, Fab, useTheme } from "@mui/material";

const colors = {
  primary: "bg-emerald-600",
  primaryHover: "hover:bg-emerald-700",
  accent: "bg-amber-500",
  accentHover: "hover:bg-amber-600",
};

// Map of country codes to flag emojis
const countryFlags = {
  Uganda: "🇺🇬",
  Zambia: "🇿🇲",
  Malawi: "🇲🇼",
  Namibia: "🇳🇦",
  Lesotho: "🇱🇸",
  Eswatini: "🇸🇿",
  Angola: "🇦🇴",
  DRC: "🇨🇩",
};

// Map of country names to their brand names
const countryBrands = {
  Uganda: "Ugarec",
  Zambia: "Zamrec",
  Malawi: "Malrec",
  Namibia: "Namrec",
  Lesotho: "Lesrec",
  Eswatini: "Eswarec",
  Angola: "Angrec",
  DRC: "DRCrec",
};

export const Logo = ({ country = null }) => (
  <div className="flex items-center justify-center relative">
    <svg viewBox="0 0 200 200" className="w-12 h-12">
      <ellipse
        cx="100"
        cy="100"
        rx="80"
        ry="30"
        fill="none"
        stroke="#2ECC71"
        strokeWidth="2"
        transform="rotate(0 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="80"
        ry="30"
        fill="none"
        stroke="#2ECC71"
        strokeWidth="2"
        transform="rotate(60 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="80"
        ry="30"
        fill="none"
        stroke="#2ECC71"
        strokeWidth="2"
        transform="rotate(120 100 100)"
      />
      <circle cx="180" cy="100" r="6" fill="#2ECC71" />
      <circle cx="60" cy="126" r="6" fill="#2ECC71" />
      <circle cx="60" cy="74" r="6" fill="#2ECC71" />
      <circle cx="100" cy="100" r="18" fill="#27AE60" />
      <circle cx="100" cy="100" r="14" fill="#2ECC71" />
    </svg>
    {country && (
      <span className="absolute -right-3 -bottom-3 text-lg">
        {countryFlags[country]}
      </span>
    )}
  </div>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
   const theme = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
   const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isAdmin = user?.is_superuser;
  const location = useLocation();
  const navigate = useNavigate();

  // Get user's country if available
  const userCountry = user?.country || null;

  useEffect(() => setIsOpen(false), [location]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate("/");
  };

  // Get brand name based on user's country
  const getBrandName = () => {
    if (!userCountry) return "";
    return countryBrands[userCountry] || "";
  };

  return (
    <>
      <nav
        className={`${colors.primary} text-white shadow-lg sticky top-0 z-50`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
            <img
                src="/logo.png"
                alt="HSP Logo"
                className="w-22 h-15"/>
              <span className="text-xl font-bold">{getBrandName()}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                to="/"
                className="hover:text-amber-200 transition flex items-center"
              >
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-amber-200 transition flex items-center"
              >
                <Info className="mr-1 h-4 w-4" />
                About
              </Link>
              <Link
                to="/news"
                className="hover:text-amber-200 transition flex items-center"
              >
                <BarChart2 className="mr-1 h-4 w-4" />
                News
              </Link>
              {user && (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hover:text-amber-200 transition flex items-center"
                    >
                      <BarChart2 className="mr-1 h-4 w-4" />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/devices"
                    className="hover:text-amber-200 transition flex items-center"
                  >
                    <Smartphone className="mr-1 h-4 w-4" />
                    Devices
                  </Link>
                  <Link
                    to="/issue-requests"
                    className="hover:text-amber-200 transition flex items-center"
                  >
                    <Award className="mr-1 h-4 w-4" />
                    Requests
                  </Link>
                  <button onClick={() => setOpen(true)}>
                                <SquarePlus className="text-white" size={24} />
                                </button>
                </>
              )}

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-emerald-700"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 hover:text-amber-200"
                  >
                    <Avatar className="h-8 w-8 bg-emerald-700">
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <span className="ml-2">{user.email || user.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {userCountry && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="mr-1">
                              {countryFlags[userCountry]}
                            </span>
                            <span>
                              {userCountry} ({countryBrands[userCountry]})
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <Link
                        to="/security"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        Security
                      </Link>
                      <Divider className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-x-4">
                  <button
                    onClick={() => setAuthModalOpen("login")}
                    className="px-4 py-2 rounded bg-white text-emerald-600 font-medium hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthModalOpen("register")}
                    className={`px-4 py-2 rounded ${colors.accent} hover:bg-amber-600 text-white font-medium`}
                  >
                    Select Country & Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col space-y-4 py-4">
                  <Link
                    to="/"
                    className="hover:bg-emerald-700 px-4 py-2 rounded"
                  >
                    <Home className="inline-block mr-2 h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="hover:bg-emerald-700 px-4 py-2 rounded"
                  >
                    <Info className="inline-block mr-2 h-4 w-4" />
                    About
                  </Link>
                  {user && (
                    <>
                                <button onClick={() => setOpen(true)} className="px-4 py-2">
                                <SquarePlus className="text-white" size={24} />
                                </button>
                      <Link
                        to="/dashboard"
                        className="hover:bg-emerald-700 px-4 py-2 rounded"
                      >
                        <BarChart2 className="inline-block mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/devices"
                        className="hover:bg-emerald-700 px-4 py-2 rounded"
                      >
                        <Smartphone className="inline-block mr-2 h-4 w-4" />
                        Devices
                      </Link>
                    </>
                  )}
                  {user ? (
                    <>
                      <button
                        onClick={handleLogout}
                        className="hover:bg-emerald-700 px-4 py-2 rounded text-left w-full flex items-center"
                      >
                        <LogOut className="inline-block mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => setAuthModalOpen("login")}
                        className="block w-full px-4 py-2 rounded bg-white text-emerald-600 font-medium hover:bg-gray-100"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => setAuthModalOpen("register")}
                        className={`block w-full px-4 py-2 rounded ${colors.accent} hover:bg-amber-600 text-white font-medium`}
                      >
                        Select Country & Register
                      </button>
                    </div>
                  )}
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center px-4 py-2 hover:bg-emerald-700 rounded"
                  >
                    {isDarkMode ? (
                      <Sun className="mr-2 h-5 w-5" />
                    ) : (
                      <Moon className="mr-2 h-5 w-5" />
                    )}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

            <DeviceUploadStepper
              open={open}
              onClose={() => setOpen(false)}
              fullScreen={isMobile}
            />

      <AuthModals
        openType={authModalOpen}
        onClose={(type) => setAuthModalOpen(type || null)}
      />
    </>
  );
};

export default Navigation;
