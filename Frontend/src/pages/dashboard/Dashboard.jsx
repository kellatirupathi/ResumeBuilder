import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import { motion } from "framer-motion";
import { Search, Grid, List, Plus, Loader2, Sparkles, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const fetchAllResumeData = async () => {
    setIsLoading(true);
    try {
      const resumes = await getAllResumeData();
      console.log(`Fetched resumes from backend:`, resumes.data);
      setResumeList(resumes.data);
      setFilteredList(resumes.data);
    } catch (error) {
      console.log("Error fetching resumes:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
    
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [user]);

  // Filter resumes when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredList(resumeList);
    } else {
      const filtered = resumeList.filter(resume => 
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    }
  }, [searchQuery, resumeList]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        delay: 0.1 
      } 
    }
  };

  // Floating elements animation
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-br ${darkMode ? 'from-gray-900 via-indigo-950/30 to-purple-950/30' : 'from-blue-50 via-indigo-50/30 to-purple-50/20'} pb-20 overflow-hidden`}>
      {/* Background decorative elements - more and better positioned */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 left-20 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 right-40 w-64 h-64 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-3xl"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${darkMode ? 'bg-white' : 'bg-indigo-600'} opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 5,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Larger decorative circles */}
      <motion.div 
        className="absolute top-1/4 -right-24 w-64 h-64 border border-indigo-200 dark:border-indigo-700 rounded-full opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-1/4 -left-32 w-96 h-96 border border-emerald-200 dark:border-emerald-700 rounded-full opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />
      
      
      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <motion.div 
            className="mb-12"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            
            <div className="text-center mb-8">

              
              <motion.h1 
                className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-emerald-400 via-blue-400 to-indigo-400' : 'from-emerald-600 via-blue-600 to-indigo-600'}`}>
                  Resume Portfolio
                </span>
              </motion.h1>
              
              <motion.p 
                className={`text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Create professional, AI-powered resumes tailored for your dream job roles
              </motion.p>
            </div>
            
            {/* Action bar with search and view toggle */}
            <motion.div 
              className={`flex flex-col md:flex-row justify-between items-center gap-4 mb-8 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md p-6 rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="relative w-full md:w-auto">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  placeholder="Search resumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 w-full md:w-80 ${darkMode ? 'bg-gray-700/60 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-gray-50 border-gray-200'} focus:border-emerald-500 focus:ring-emerald-500/30 rounded-xl`}
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <Button
                  onClick={() => document.querySelector('.add-resume-trigger')?.click()}
                  className={`rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all px-6 py-2.5`}
                >
                  <Plus className="h-4 w-4 mr-2" /> New Resume
                </Button>
                
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex p-1`}>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? `${darkMode ? 'bg-gray-600' : 'bg-white'} text-emerald-500 shadow-sm`
                        : `${darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`
                    }`}
                    aria-label="Grid View"
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? `${darkMode ? 'bg-gray-600' : 'bg-white'} text-emerald-500 shadow-sm`
                        : `${darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`
                    }`}
                    aria-label="List View"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Dashboard content */}
          <div className="relative">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-6">
                <div className="relative">
                  <div className={`h-24 w-24 rounded-full border-4 ${darkMode ? 'border-gray-700 border-t-emerald-400' : 'border-gray-200 border-t-emerald-500'} animate-spin`}></div>
                  <div className={`absolute top-0 left-0 h-24 w-24 rounded-full border-4 border-transparent ${darkMode ? 'border-r-blue-400' : 'border-r-blue-500'} animate-pulse opacity-60`}></div>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg animate-pulse`}>Loading your resumes...</p>
              </div>
            ) : (
              <>
                {searchQuery && filteredList.length === 0 ? (
                  <motion.div 
                    className={`text-center py-14 ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-md rounded-2xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={`mx-auto h-20 w-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-6`}>
                      <Search className={`h-10 w-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>No matching resumes found</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try a different search term or create a new resume</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8" 
                      : "flex flex-col space-y-6"
                    }
                  >
                    {/* Only show AddResume when not searching */}
                    {!searchQuery && (
                      <motion.div variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                        <AddResume viewMode={viewMode} darkMode={darkMode} />
                      </motion.div>
                    )}
                    
                    {filteredList.map((resume) => (
                      <motion.div key={resume._id} variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                        <ResumeCard
                          resume={resume}
                          refreshData={fetchAllResumeData}
                          viewMode={viewMode}
                          darkMode={darkMode}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
            )}

            {!isLoading && resumeList.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md rounded-2xl shadow-xl p-12 text-center mt-8 max-w-2xl mx-auto border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
              >
                <motion.div 
                  animate={floatingAnimation}
                  className={`w-28 h-28 bg-gradient-to-br ${darkMode ? 'from-emerald-900/60 to-blue-900/60' : 'from-emerald-100 to-blue-100'} rounded-full flex items-center justify-center mx-auto mb-8`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-14 w-14 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                  No resumes yet
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg mb-10 max-w-md mx-auto`}>
                  Create your first AI-powered resume to showcase your skills and experience
                </p>
                <motion.button 
                  onClick={() => document.querySelector('.add-resume-trigger')?.click()}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:from-emerald-600 hover:to-blue-700 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Resume
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;