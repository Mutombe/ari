// About Page
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, Menu, X, Home, Info, Award, Database, ChevronDown, User, LogOut, BarChart2, Globe, Wind, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

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

const About = () => {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <div className={`${colors.primary} text-white py-16`}>
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">About Africa RECs International</h1>
            <p className="text-xl max-w-3xl">We're pioneering Renewable Energy Certificates across Africa, creating sustainable value for renewable energy producers.</p>
          </div>
        </div>
  
        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Understanding RECs</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              Renewable Energy Certificates (RECs) are market-based instruments that certify renewable energy generation. 
              Each REC represents proof that one megawatt-hour (MWh) of electricity has been generated from a renewable 
              energy source and injected into the grid.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              The REC system facilitates the tracking, trading, and retirement of renewable energy claims, ensuring 
              transparency and credibility in sustainability commitments. RECs provide businesses and governments with a 
              verifiable way to meet renewable energy goals, enhance sustainability reporting, and demonstrate their 
              commitment to reducing carbon emissions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To create a thriving renewable energy ecosystem across Africa, where clean energy producers 
                  are properly rewarded for their contributions to sustainability and climate change mitigation.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To develop and manage the most accessible, transparent, and valuable Renewable Energy Certificate 
                  program in Africa, connecting local producers with global sustainability markets.
                </p>
              </div>
            </div>
          </div>
  
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">The Registration Process</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-emerald-200 dark:bg-emerald-800"></div>
              
              {/* Timeline items */}
              <div className="space-y-12 relative">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Step 1</h3>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Project Eligibility Assessment</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Projects must generate electricity from renewable sources such as solar, wind, hydro, or biomass.
                      The facility must comply with registry requirements.
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-10 md:pl-12 relative">
                    <div className="absolute left-0 md:left-0 top-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold z-10">
                      1
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/2 md:text-right order-1 md:order-2 md:pl-12 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Step 2</h3>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Application Submission</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      We gather all necessary documentation, including proof of renewable energy generation, 
                      metering data, and technical specifications, and submit it to the International regulatory board.
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-10 order-2 md:order-1 md:pr-12 relative">
                    <div className="absolute left-0 md:right-0 top-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold z-10">
                      2
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Step 3</h3>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Verification and Certification</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      A third-party auditor verifies the project's compliance and renewable energy production.
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-10 md:pl-12 relative">
                    <div className="absolute left-0 md:left-0 top-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold z-10">
                      3
                    </div>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/2 md:text-right order-1 md:order-2 md:pl-12">
                    <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Step 4</h3>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">RECs Issuance and Trading</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Once verified, RECs are issued and can be traded, sold, or retired to claim renewable energy usage.
                      We facilitate this process, ensuring project owners receive their funds.
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-10 order-2 md:order-1 md:pr-12 relative">
                    <div className="absolute left-0 md:right-0 top-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold z-10">
                      4
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">FAQs</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">How much does it cost to register a project for RECs?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Africa RECs International will absorb all application and registration costs, meaning project owners 
                  do not need to pay upfront. The costs will be recovered once the RECs are sold.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Can small-scale renewable energy initiatives participate?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Both large and small renewable energy projects can qualify, provided they meet the minimum 
                  generation capacity and reporting standards.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">What is the revenue potential of REC-certified projects?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The revenue depends on domestic and international demand and supply of certificates. We act as a broker 
                  in the trading of certificates through price discovery strategies that seek to maximize returns for project owners.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">What are the benefits of businesses purchasing RECs?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Buying RECs allows businesses to claim renewable energy use, meet sustainability targets, and enhance 
                  their corporate reputation in the global market.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Contact Section */}
        <section className={`${colors.primary} text-white py-16`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Have Questions About Africa RECs?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Our team of renewable energy experts is ready to assist you with any questions about the registration process or benefits of RECs.</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-emerald-700 p-6 rounded-lg">
                <div className="mb-4">
                  <svg className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p>info@africarecsintl.org</p>
              </div>
              
              <div className="bg-emerald-700 p-6 rounded-lg">
                <div className="mb-4">
                  <svg className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p>+254 712 345 678</p>
              </div>
              
              <div className="bg-emerald-700 p-6 rounded-lg">
                <div className="mb-4">
                  <svg className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p>Kilimani Business Centre, Nairobi, Kenya</p>
              </div>
            </div>
            
            <div className="mt-12">
              <a href="#contact-form" className={`px-8 py-4 rounded-lg ${colors.accent} ${colors.accentHover} text-white font-bold text-lg transition duration-300`}>
                Contact Us Today
              </a>
            </div>
          </div>
        </section>
  
        {/* Partner Organizations */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800 dark:text-white">Our Partners</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg flex items-center justify-center h-32">
                <img src="/api/placeholder/150/60" alt="Partner Logo" className="max-h-16" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg flex items-center justify-center h-32">
                <img src="/api/placeholder/150/60" alt="Partner Logo" className="max-h-16" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg flex items-center justify-center h-32">
                <img src="/api/placeholder/150/60" alt="Partner Logo" className="max-h-16" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg flex items-center justify-center h-32">
                <img src="/api/placeholder/150/60" alt="Partner Logo" className="max-h-16" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form */}
        <section id="contact-form" className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Get In Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                Fill out the form below and one of our REC specialists will get back to you within 24 hours.
              </p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="first-name">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="last-name">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="organization">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="inquiry-type">
                    Type of Inquiry
                  </label>
                  <select
                    id="inquiry-type"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="project-registration">Project Registration</option>
                    <option value="rec-purchasing">REC Purchasing</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="general">General Information</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 mr-2"
                    required
                  />
                  <label className="text-gray-600 dark:text-gray-300 text-sm" htmlFor="consent">
                    I consent to Africa RECs International collecting and storing the information I have provided. 
                    I understand this information will be used for the purpose of responding to my inquiry.
                  </label>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className={`px-8 py-3 rounded-lg ${colors.primary} ${colors.primaryHover} text-white font-bold transition duration-300`}
                  >
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  };

export default About;