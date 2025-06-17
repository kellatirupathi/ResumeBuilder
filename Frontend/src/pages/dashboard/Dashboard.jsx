import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import ATSScoreChecker from "./components/ATSScoreChecker";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  Sparkles, 
  Moon, 
  Sun, 
  Loader2, 
  FileText,
  LayoutDashboard,
  AlertCircle,
  ChevronDown,
  PieChart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [showATSModal, setShowATSModal] = useState(false);

  const fetchAllResumeData = async () => {
    setIsLoading(true);
    try {
      const resumes = await getAllResumeData();
      console.log(`Fetched resumes from backend:`, resumes.data);
      setResumeList(resumes.data);
      setFilteredList(resumes.data);
    } catch (error) {
      console.log("Error fetching resumes:", error.message);
      toast.error("Failed to load resumes", {
        description: "Please try refreshing the page",
        action: {
          label: "Retry",
          onClick: () => fetchAllResumeData(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenATSChecker = () => {
    if (resumeList.length === 0) {
      toast.error("No resumes available", {
        description: "Please create a resume first to use the ATS checker"
      });
      return;
    }
    
    setShowATSModal(true);
  };

  useEffect(() => {
    fetchAllResumeData();
    
    // Check for dark mode preference
    const storedDarkMode = localStorage.getItem("prefersDarkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
    } else if (storedDarkMode === null) {
      // Check for system preference if no stored preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, [user]);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("prefersDarkMode", newDarkMode.toString());
  };

  // Filter and sort resumes
  useEffect(() => {
    let filtered = [...resumeList];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(resume => 
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (sortOption === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredList(filtered);
  }, [searchQuery, resumeList, sortOption]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 }
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.2 }
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

  // Animation variants
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  // Shimmer effect for loading state
  const shimmerAnimation = {
    x: [-200, 200],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden ${darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-indigo-950/30 to-purple-950/30 text-gray-200' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 text-gray-800'}`}
    >
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-40 w-64 h-64 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-3xl"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${darkMode ? 'bg-white' : 'bg-indigo-600'} opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, Math.random() * 0.5 + 1, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 5,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Decorative circles */}
        <motion.div 
          className={`absolute top-1/4 -right-24 w-96 h-96 border ${darkMode ? 'border-indigo-600/20' : 'border-indigo-300/30'} rounded-full opacity-20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className={`absolute bottom-1/4 -left-32 w-96 h-96 border ${darkMode ? 'border-emerald-600/20' : 'border-emerald-300/30'} rounded-full opacity-20`}
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className={`absolute left-1/3 -top-40 w-[40rem] h-[40rem] border ${darkMode ? 'border-purple-600/20' : 'border-purple-300/30'} rounded-full opacity-10`}
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 pt-16 pb-16 relative z-10 max-w-7xl">
        {/* Header with site name and dark mode toggle */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 flex justify-between items-center"
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-3 rounded-xl shadow-lg mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Resume Dashboard</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage your professional profile documents
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-full ${darkMode 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-white hover:bg-gray-100'} shadow-md transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-indigo-600" />}
          </button>
        </motion.div>
            
        {/* Action bar with search, view toggle, and sorting */}
        <motion.div 
          className={`mb-8 rounded-2xl shadow-xl border ${darkMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-gray-100'} backdrop-blur-md overflow-hidden`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Left side - Search */}
            <div className="relative w-full md:w-auto">
              <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <Input
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 w-full md:w-80 ${darkMode 
                  ? 'bg-gray-700/60 border-gray-600 text-gray-200' 
                  : 'bg-gray-50 border-gray-200'} rounded-xl`}
              />
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              {/* Sort dropdown (custom implementation instead of shadcn dropdown) */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className={`h-10 rounded-xl ${darkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                  } whitespace-nowrap flex items-center`}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  {sortOption === "newest" && "Newest first"}
                  {sortOption === "oldest" && "Oldest first"}
                  {sortOption === "alphabetical" && "A to Z"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                
                {/* Custom dropdown menu */}
                {showSortOptions && (
                  <div 
                    className={`absolute z-10 mt-1 w-48 rounded-md shadow-lg ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                    }`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSortOption("newest");
                          setShowSortOptions(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortOption === "newest" 
                            ? darkMode 
                              ? "bg-emerald-900/30 text-emerald-400" 
                              : "bg-emerald-100 text-emerald-600" 
                            : darkMode 
                              ? "text-gray-200 hover:bg-gray-700" 
                              : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {sortOption === "newest" && (
                            <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className={sortOption === "newest" ? "" : "ml-6"}>Newest first</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSortOption("oldest");
                          setShowSortOptions(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortOption === "oldest" 
                            ? darkMode 
                              ? "bg-emerald-900/30 text-emerald-400" 
                              : "bg-emerald-100 text-emerald-600" 
                            : darkMode 
                              ? "text-gray-200 hover:bg-gray-700" 
                              : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {sortOption === "oldest" && (
                            <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className={sortOption === "oldest" ? "" : "ml-6"}>Oldest first</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSortOption("alphabetical");
                          setShowSortOptions(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortOption === "alphabetical" 
                            ? darkMode 
                              ? "bg-emerald-900/30 text-emerald-400" 
                              : "bg-emerald-100 text-emerald-600" 
                            : darkMode 
                              ? "text-gray-200 hover:bg-gray-700" 
                              : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {sortOption === "alphabetical" && (
                            <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className={sortOption === "alphabetical" ? "" : "ml-6"}>A to Z</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* ATS Score Checker Button */}
              <Button
                onClick={handleOpenATSChecker}
                disabled={isLoading || resumeList.length === 0}
                className={`rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all`}
              >
                <PieChart className="h-4 w-4 mr-2" /> ATS Score Checker
              </Button>
              
              {/* New Resume button */}
              <Button
                onClick={() => document.querySelector('.add-resume-trigger')?.click()}
                className={`rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all`}
              >
                <Plus className="h-4 w-4 mr-2" /> New Resume
              </Button>
              
              {/* View mode toggle */}
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
          </div>
          
          {/* Analytics bar - only show when there are resumes */}
          {resumeList.length > 0 && !isLoading && !searchQuery && (
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-lg ${darkMode ? 'bg-indigo-900/60' : 'bg-indigo-100'} flex items-center justify-center mr-3`}>
                    <FileText className={`h-4 w-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{resumeList.length}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Resumes</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-lg ${darkMode ? 'bg-emerald-900/60' : 'bg-emerald-100'} flex items-center justify-center mr-3`}>
                    <svg className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold">
                      {/* Calculate the most recent update date */}
                      {resumeList.length > 0 
                        ? (() => {
                            const mostRecent = new Date(Math.max(...resumeList.map(r => new Date(r.updatedAt))));
                            return mostRecent.toLocaleDateString();
                          })() 
                        : "-"}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Updated</div>
                  </div>
                </div>
                
                {/* New ATS Score Analytics Widget */}
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-lg ${darkMode ? 'bg-purple-900/60' : 'bg-purple-100'} flex items-center justify-center mr-3`}>
                    <PieChart className={`h-4 w-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <button 
                      onClick={handleOpenATSChecker}
                      className={`text-xl font-bold flex items-center ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                    >
                      Check Score
                      <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATS Compatibility</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Dashboard content */}
        <div className="relative">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-8">
              {/* Advanced loader with shimmer effect */}
              <div className="relative">
                <div className={`h-28 w-28 rounded-full border-4 ${darkMode 
                  ? 'border-gray-700 border-t-emerald-400 border-r-blue-500/70' 
                  : 'border-gray-200 border-t-emerald-500 border-r-blue-600/70'} animate-spin`}>
                </div>
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={shimmerAnimation}
                  />
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg animate-pulse`}>
                Loading your resumes...
              </p>
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
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Try a different search term or create a new resume</p>
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
                  >
                    Clear search
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
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
                </AnimatePresence>
              )}
            </>
          )}

          {/* Empty state with enhanced animation */}
          {!isLoading && resumeList.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md rounded-2xl shadow-xl p-12 text-center mt-4 max-w-2xl mx-auto border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <motion.div 
                animate={floatingAnimation}
                className={`w-32 h-32 ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-blue-900/60' : 'bg-gradient-to-br from-emerald-100 to-blue-100'} rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.div>
              <h3 className={`text-3xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Create Your First Resume
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg mb-10 max-w-md mx-auto`}>
                Build professional resumes with AI assistance to showcase your skills and experience
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
        
        {/* Footer with support info */}
        {!isLoading && resumeList.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className={`mt-16 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
              <span>Need help with your resume? Contact support</span>
              <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="flex justify-center gap-4">
              <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}>
                Help Center
              </a>
              <span>•</span>
              <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}>
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}>
                Terms of Service
              </a>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Animated corner decoration */}
      <div className="fixed bottom-0 right-0 w-40 h-40 pointer-events-none opacity-30 dark:opacity-20">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0 100C0 44.7715 44.7715 0 100 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="150"
            initial={{ strokeDashoffset: 150 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.path
            d="M0 80C0 35.8172 35.8172 0 80 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="130"
            initial={{ strokeDashoffset: 130 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
          <motion.path
            d="M0 60C0 26.8629 26.8629 0 60 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, delay: 1.4 }}
          />
        </svg>
      </div>
      
      {/* ATS Score Checker Modal */}
      <ATSScoreChecker
        isOpen={showATSModal}
        onClose={() => setShowATSModal(false)}
        resumes={resumeList}
        darkMode={darkMode}
      />
    </div>
  );
}

export default Dashboard;