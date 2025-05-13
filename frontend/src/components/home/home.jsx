import React from "react";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Sun,
  Moon,
  Menu,
  X,
  Home,
  Info,
  Award,
  Database,
  ChevronDown,
  User,
  LogOut,
  BarChart2,
  Globe,
  Wind,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { AuthModals } from "./../nav/auth";

// Brand colors
const colors = {
  primary: "bg-emerald-600",
  primaryHover: "hover:bg-emerald-700",
  secondary: "bg-purple-600",
  secondaryHover: "hover:bg-purple-700",
  accent: "bg-amber-500",
  accentHover: "hover:bg-amber-600",
  dark: "bg-gray-800",
  darkHover: "hover:bg-gray-900",
  light: "bg-gray-50",
  lightHover: "hover:bg-gray-100",
};

// Home page
const Homepage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(null);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/api/placeholder/1200/600')] bg-cover bg-center mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powering Africa's Renewable Energy Future
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Register your renewable energy devices and unlock new value
              through Renewable Energy Certificates.
            </p>
            <div className="flex flex-wrap gap-4">
                <button className={`px-6 py-3 rounded-lg ${colors.accent} ${colors.accentHover} text-white font-bold text-lg transition duration-300 transform hover:scale-105`} onClick={() => setAuthModalOpen("register")} >
                Get Started
                </button>
              <Link
                to="/about"
                className="px-6 py-3 rounded-lg bg-white text-emerald-600 font-bold text-lg transition duration-300 transform hover:scale-105 hover:bg-gray-100"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md"
            >
              <div
                className={`${colors.primary} text-white p-3 rounded-full inline-block mb-4`}
              >
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Register Your Devices
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Submit information about your renewable energy plants and
                production capacity.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md"
            >
              <div
                className={`${colors.secondary} text-white p-3 rounded-full inline-block mb-4`}
              >
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Get Approved
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our team reviews and approves eligible renewable energy devices.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md"
            >
              <div
                className={`${colors.accent} text-white p-3 rounded-full inline-block mb-4`}
              >
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Submit Issue Requests
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Request benefits based on your renewable energy production and
                receive value.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.img
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                src="/rec.jpeg"
                alt="Renewable Energy Certificates"
                className="rounded-lg shadow-xl"
              />
            </div>

            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Benefits of Renewable Energy Certificates
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className={`${colors.primary} text-white p-2 rounded-full mr-4 mt-1`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
                      Revenue Generation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Earn additional revenue by selling RECs, making clean
                      energy investments more financially viable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`${colors.primary} text-white p-2 rounded-full mr-4 mt-1`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
                      Sustainability Credentials
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Enhance sustainability reports and demonstrate commitment
                      to reducing carbon footprint.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`${colors.primary} text-white p-2 rounded-full mr-4 mt-1`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
                      Global Market Access
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Improve competitiveness by demonstrating use of renewable
                      energy through IRECs.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className={`mt-8 inline-block px-6 py-3 rounded-lg ${colors.secondary} ${colors.secondaryHover} text-white font-bold transition duration-300`}
              >
                Learn More About RECs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`${colors.primary} py-16 text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join Africa's Renewable Energy Movement?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Register your renewable energy devices today and start capitalizing
            on your contribution to a sustainable future.
          </p>
          <Link
            onClick={() => setAuthModalOpen("register")} 
            className={`px-8 py-4 rounded-lg ${colors.accent} ${colors.accentHover} text-white font-bold text-lg transition duration-300 transform hover:scale-105`}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      <AuthModals
        openType={authModalOpen}
        onClose={(type) => setAuthModalOpen(type || null)}
      />
    </div>
  );
};

export default Homepage;
