import React, { useState } from "react";
import { Globe, Wind, Zap, Sun, Search, ChevronRight } from "lucide-react";

// Brand colors (kept from your original code)
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

// News data based on actual articles
const newsData = [
  {
    id: 1,
    title: "New Platform to Boost Clean Energy Adoption Launched",
    description: "Zimbabwe launches a new platform to register renewable energy devices and facilitate the issuance of Renewable Energy Certificates (RECs), promoting clean energy adoption across the country.",
    category: "Policy",
    date: "May 15, 2025",
    image: "/rec4.webp",
    icon: <Zap className="h-5 w-5" />,
    url: "https://www.sundaymail.co.zw/new-platform-to-boost-clean-energy-adoption-launched"
  },
  {
    id: 2,
    title: "Zimbabwe Launches Renewable Energy Platform",
    description: "Official launch of the Zimbabwe Renewable Energy Device Registry (ZREDR) to accelerate the adoption of clean energy solutions and create a transparent market for renewable energy certificates.",
    category: "Market Trends",
    date: "May 15, 2025",
    image: "/rec5.jpg",
    icon: <Globe className="h-5 w-5" />,
    url: "https://www.herald.co.zw/zimbabwe-launches-renewable"
  },
  {
    id: 3,
    title: "Ndiripano Entrance Platform Goes Live",
    description: "The Ndiripano Entrance platform has been officially launched, providing a gateway for renewable energy device registration and certificate issuance in Zimbabwe.",
    category: "Technology",
    date: "May 15, 2025",
    image: "/rec3.jpg",
    icon: <Sun className="h-5 w-5" />,
    url: "/https://www.facebook.com/share/p/18X5G5cDeX/?mibextid=wwXIfr"
  },
];

// Categories for filtering
const categories = ["All", "Market Trends", "Solar Energy", "Policy", "Technology", "Investment"];

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Filter news based on search term and category
  const filteredNews = newsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/api/placeholder/1200/600')] bg-cover bg-center mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Renewable Energy News</h1>
            <p className="text-xl mb-6">Stay updated with the latest developments in renewable energy and RECs across Africa</p>
          </div>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? `${colors.primary} text-white`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* News Cards Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((newsItem) => (
                <a 
                  href={newsItem.url} 
                  key={newsItem.id}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute top-4 left-4 ${colors.secondary} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                      {newsItem.icon}
                      {newsItem.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{newsItem.date}</div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{newsItem.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{newsItem.description}</p>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                      Read more
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No news articles found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      
      {/* Featured Resources Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white text-center">Featured Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Zimbabwe REC Market Guide</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Comprehensive guide to understanding and navigating the renewable energy certificate market in Zimbabwe.
              </p>
              <a href="#" className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                Download PDF
                <ChevronRight className="h-4 w-4 ml-1"/>
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Ndiripano Platform Tutorial</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn how to register your renewable energy devices and access certificates through the Ndiripano platform.
              </p>
              <a href="#" className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                Watch Video
                <ChevronRight className="h-4 w-4 ml-1"/>
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Zimbabwe Energy Policy Tracker</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Interactive tool tracking renewable energy policies and incentives in Zimbabwe's energy sector.
              </p>
              <a href="#" className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                Explore Tool
                <ChevronRight className="h-4 w-4 ml-1"/>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;