import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import heroSnapshot from "@/assets/heroSnapshot.png";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRegLightbulb, FaRegFileAlt, FaRegStar, FaRegClock, FaRegChartBar, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";
import { motion } from "framer-motion";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      setIsLoading(true);
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log(
          "Error fetching user data:",
          error.message
        );
        dispatch(addUserData(""));
      } finally {
        setIsLoading(false);
      }
    };
    fetchResponse();
  }, [dispatch]);

  const handleGetStartedClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/sign-in");
    }
  };

  const features = [
    {
      icon: <FaRegLightbulb className="w-10 h-10 text-amber-500" />,
      title: "AI-Powered Suggestions",
      description: "Get intelligent content recommendations tailored for your industry and role"
    },
    {
      icon: <FaRegFileAlt className="w-10 h-10 text-emerald-500" />,
      title: "Premium Templates",
      description: "Access professionally designed templates that stand out to recruiters"
    },
    {
      icon: <FaRegStar className="w-10 h-10 text-purple-500" />,
      title: "ATS-Friendly Formats",
      description: "Ensure your resume passes through applicant tracking systems easily"
    },
    {
      icon: <FaRegClock className="w-10 h-10 text-blue-500" />,
      title: "Quick Creation",
      description: "Build a professional resume in minutes, not hours"
    },
    {
      icon: <FaRegChartBar className="w-10 h-10 text-rose-500" />,
      title: "Performance Analytics",
      description: "Track how your resume performs with detailed insights"
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          {/* Enhanced animated background elements */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 right-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-40 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left space-y-8"
            >
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm inline-block shadow-sm"
              >
                Future of Resume Building
              </motion.span>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="block"
                >
                  Elevate Your
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                >
                  Career Journey
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="block mt-1"
                >
                  With Smart Resumes
                </motion.span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-xl text-gray-600 max-w-lg leading-relaxed"
              >
                Our AI-powered platform helps you create stunning, professional resumes that get you noticed by employers and boost your job search success.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="pt-4"
              >
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white px-10 py-7 rounded-xl text-xl font-semibold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
                  onClick={handleGetStartedClick}
                >
                  Start Building Now
                  <FaArrowRight className="animate-pulse" />
                </Button>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <FaCheck className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <FaCheck className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">ATS-Friendly</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-indigo-500/30 rounded-2xl blur-3xl"></div>
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/50 bg-white"
              >
                <div className="h-12 bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-white/70"></div>
                    <div className="w-3 h-3 rounded-full bg-white/70"></div>
                    <div className="w-3 h-3 rounded-full bg-white/70"></div>
                  </div>
                </div>
                <img
                  src={heroSnapshot}
                  alt="Resume Builder Dashboard"
                  className="w-full object-cover transition-transform hover:scale-105 duration-700"
                />
              </motion.div>
              
              {/* Enhanced floating badges with animations */}
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -right-6 -top-6 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 border border-gray-100"
              >
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                  <FaRegLightbulb className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800">AI Powered</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -left-6 -bottom-6 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 border border-gray-100"
              >
                <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                  <FaRegStar className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800">ATS Optimized</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute right-20 -bottom-3 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 border border-gray-100"
              >
                <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                  <FaRegClock className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800">Quick Setup</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Enhanced with staggered animations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm inline-block shadow-sm">Powerful Features</span>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">Everything You Need to Succeed</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Our platform provides all the tools you need to create a professional resume that stands out to employers</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 lg:grid-cols-5 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 group hover:-translate-y-2"
              >
                <div className="mb-5 p-3 bg-gray-50 rounded-xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works - Enhanced with better visuals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm inline-block shadow-sm">Simple Process</span>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Create your professional resume in just three simple steps</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              {
                step: "01",
                title: "Sign Up & Create Profile",
                description: "Create an account and fill in your professional details and experience"
              },
              {
                step: "02",
                title: "Choose Template & Customize",
                description: "Select from our professional templates and customize with AI assistance"
              },
              {
                step: "03",
                title: "Download & Apply",
                description: "Export your polished resume and start applying for your dream jobs"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 group hover:border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white mb-6 group-hover:scale-110 transition-transform duration-300">{step.step}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-24 h-2 bg-gradient-to-r from-emerald-500 to-indigo-500 transform -translate-x-12 rounded-full"></div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section - Enhanced with better visuals */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Floating elements for visual interest */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white relative z-10"
          >
            <h2 className="text-4xl font-bold mb-6">Transform Your Career Today</h2>
            <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">Join thousands of professionals who've boosted their career opportunities with our AI-powered resume builder</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                className="bg-white text-indigo-700 hover:bg-gray-100 text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleGetStartedClick}
              >
                Create Your Resume Now
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Footer - Enhanced with better styling */}
      <footer className="mt-auto bg-white border-t border-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent mb-2">
              AI Resume Builder
            </div>
            <p className="text-gray-600 text-sm text-center md:text-left">
              Building futures, one resume at a time.
            </p>
          </div>
          
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          
          <p className="text-gray-500 text-sm mt-6 md:mt-0">
            &copy; 2024 AI-Resume-Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;