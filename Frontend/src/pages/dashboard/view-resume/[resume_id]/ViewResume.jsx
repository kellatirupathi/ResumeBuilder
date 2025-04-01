import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Download, 
  Share, 
  ArrowLeft, 
  CheckCircle, 
  Printer, 
  Copy, 
  FileText, 
  Settings, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  Maximize,
  Clipboard,
  Star,
  Trophy,
  Send,
  Globe,
  ArrowUpRight,
  Heart,
  Calendar,
  Clock,
  ThumbsUp,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [downloadType, setDownloadType] = useState("pdf");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState("download");
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingState, setDownloadingState] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const resumeRef = useRef(null);
  const { resume_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchResumeInfo();
  }, []);

  const fetchResumeInfo = async () => {
    setIsLoading(true);
    try {
      const response = await getResumeData(resume_id);
      
      // Ensure template info is included
      const resumeData = {
        ...response.data,
        template: response.data.template || "modern" // Default to modern if no template specified
      };
      
      console.log("Resume loaded with template:", resumeData.template);
      dispatch(addResumeData(resumeData));
      setResumeInfo(resumeData);
    } catch (error) {
      toast("Error loading resume", {
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For the standard print functionality with improved styles
  const handlePrint = () => {
    // Set up a print-specific stylesheet if not already present
    const printStyleId = 'resume-print-style';
    if (!document.getElementById(printStyleId)) {
      const style = document.createElement('style');
      style.id = printStyleId;
      style.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
            margin: 0;
            padding: 0;
          }
          #resume-container, #resume-container * {
            visibility: visible;
          }
          #resume-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    toast("Preparing to print...", {
      description: "Your resume is being prepared for printing",
      icon: <Printer className="h-5 w-5 text-indigo-500" />
    });
    
    setTimeout(() => window.print(), 500);
  };

  // For PDF download with improved quality and styling
  const handleDownloadPDF = async () => {
    try {
      setDownloadingState(true);
      setDownloadProgress(10);
      
      // Ensure the resume element is ready
      if (!resumeRef.current) {
        toast("Unable to generate PDF", { description: "Resume element not found" });
        return;
      }
      
      // Get the template width and height
      const resumeElement = resumeRef.current;
      
      setDownloadProgress(20);
      
      // Clone the element to manipulate it without affecting the displayed element
      const elementToRender = resumeElement.cloneNode(true);
      elementToRender.style.width = '210mm';
      elementToRender.style.margin = '0';
      elementToRender.style.padding = '0';
      elementToRender.style.boxShadow = 'none';
      elementToRender.style.position = 'absolute';
      elementToRender.style.left = '-9999px';
      document.body.appendChild(elementToRender);
      
      setDownloadProgress(30);
      
      // Use html2canvas to capture the resume with enhanced settings
      const canvas = await html2canvas(elementToRender, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        windowWidth: 1000, // Standardize rendering width
        windowHeight: 1414 // A4 ratio height
      });
      
      // Remove the cloned element
      document.body.removeChild(elementToRender);
      
      setDownloadProgress(70);
      
      // Create PDF with correct dimensions for A4
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Calculate dimensions based on A4 paper
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      
      // Add the image to the PDF with correct proportions
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 
        0, 
        pdfWidth, 
        pdfWidth / ratio <= pdfHeight ? pdfWidth / ratio : pdfHeight
      );
      
      setDownloadProgress(90);
      
      // Generate a filename with resume title
      const fileName = `${resumeInfo.firstName || 'Resume'}_${resumeInfo.lastName || ''}_Resume.pdf`;
      pdf.save(fileName);
      
      setDownloadProgress(100);
      
      toast("Resume Downloaded", { 
        description: "Your resume has been saved as a PDF file",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast("Download failed", { 
        description: "Please try again or use the print option",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setDownloadingState(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  // For PNG download (higher quality image)
  const handleDownloadPNG = async () => {
    try {
      setDownloadingState(true);
      setDownloadProgress(10);
      
      if (!resumeRef.current) {
        toast("Unable to generate image", { description: "Resume element not found" });
        return;
      }
      
      setDownloadProgress(30);
      
      // Clone the element for manipulation
      const elementToRender = resumeRef.current.cloneNode(true);
      elementToRender.style.width = '210mm';
      elementToRender.style.margin = '0';
      elementToRender.style.padding = '0';
      elementToRender.style.boxShadow = 'none';
      elementToRender.style.position = 'absolute';
      elementToRender.style.left = '-9999px';
      document.body.appendChild(elementToRender);
      
      const canvas = await html2canvas(elementToRender, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        backgroundColor: "#ffffff",
        allowTaint: true,
        windowWidth: 1000 // Standardize rendering width
      });
      
      // Remove the cloned element
      document.body.removeChild(elementToRender);
      
      setDownloadProgress(70);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${resumeInfo.firstName || 'Resume'}_${resumeInfo.lastName || ''}_Resume.png`;
      link.href = canvas.toDataURL('image/png');
      
      setDownloadProgress(90);
      
      // Trigger download
      link.click();
      
      setDownloadProgress(100);
      
      toast("Resume Downloaded", { 
        description: "Your resume has been saved as a PNG image",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error("PNG generation error:", error);
      toast("Download failed", { 
        description: "Please try again with a different format",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setDownloadingState(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  // Handle download based on the selected type
  const handleDownload = () => {
    if (downloadType === "pdf") {
      handleDownloadPDF();
    } else if (downloadType === "png") {
      handleDownloadPNG();
    } else {
      handlePrint();
    }
  };

  // Copy resume link to clipboard
  const copyResumeLink = () => {
    const resumeUrl = `${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`;
    navigator.clipboard.writeText(resumeUrl)
      .then(() => {
        setCopied(true);
        toast("Link Copied", { 
          description: "Resume link copied to clipboard",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast("Copy failed", { 
          description: "Please try again or use the share button",
          variant: "destructive"
        });
      });
  };

  return (
    <>
      {/* Normal view mode */}
      <AnimatePresence>
        {!fullscreenPreview && (
          <motion.div 
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 pb-10 pt-20"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Title area */}

              
              {/* Main content with split layout */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Resume preview - left side */}
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                  className="lg:w-2/3 relative"
                >
                  {isLoading ? (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 flex justify-center items-center min-h-[600px]">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-6 text-indigo-200 text-lg">Preparing your professional resume...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      {/* Floating elements for visual flair */}
                      <div className="absolute -left-12 top-20 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl"></div>
                      <div className="absolute right-10 top-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 left-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>
                      
                      {/* Glow effect for the resume */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-blue-500/30 to-indigo-500/30 rounded-2xl blur-xl transform -translate-y-4 scale-105 opacity-80"></div>
                      
                      {/* Resume container with frame effect */}
                      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative">
                        {/* Frame effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 rounded-xl opacity-30"></div>
                        
                        {/* Resume viewer */}
                        <div className="relative">
                          {/* Status badge */}
                          <div className="absolute -right-2 -top-2 z-10">
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1, duration: 0.5 }}
                              className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Ready to Apply
                            </motion.div>
                          </div>
                          
                          {/* The actual resume preview */}
                          <div 
                            ref={resumeRef} 
                            id="resume-container"
                            className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl"
                            style={{ 
                              width: "290mm", 
                              maxWidth: "100%", 
                              height: "auto", 
                              minHeight: "500px",
                              padding: "0",
                              boxSizing: "border-box"
                            }}
                          >
                            <ResumePreview />
                          </div>
                          
                          {/* Fullscreen button overlay */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              size="sm" 
                              className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
                              onClick={() => setFullscreenPreview(true)}
                            >
                              <Maximize className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Control panel - right side */}
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="lg:w-1/3"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-1 rounded-t-xl">
                      <button 
                        className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${activeSidebarTab === 'download' ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
                        onClick={() => setActiveSidebarTab('download')}
                      >
                        <span className="flex items-center justify-center">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </span>
                      </button>
                      <button 
                        className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${activeSidebarTab === 'share' ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
                        onClick={() => setActiveSidebarTab('share')}
                      >
                        <span className="flex items-center justify-center">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </span>
                      </button>
                      <button 
                        className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${activeSidebarTab === 'settings' ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
                        onClick={() => setActiveSidebarTab('settings')}
                      >
                        <span className="flex items-center justify-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Options
                        </span>
                      </button>
                    </div>
                    
                    {/* Tab content with glass morphism */}
                    <div className="p-6 space-y-6">
                      {/* Download tab */}
                      {activeSidebarTab === 'download' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
                              <Download className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Download Your Resume</h3>
                            <p className="text-indigo-200 text-sm mb-6">Get your professional resume in your preferred format</p>
                          </div>
                          
                          {/* Download options */}
                          <div className="space-y-4">
                            {/* Format selector with glass effect */}
                            <div className="relative">
                              <button
                                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                                className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-left text-sm text-white hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center">
                                  {downloadType === 'pdf' && <FileText className="mr-2 h-5 w-5 text-red-400" />}
                                  {downloadType === 'png' && <FileText className="mr-2 h-5 w-5 text-blue-400" />}
                                  {downloadType === 'print' && <Printer className="mr-2 h-5 w-5 text-indigo-300" />}
                                  <span>
                                    {downloadType === 'pdf' && 'PDF Document (.pdf)'}
                                    {downloadType === 'png' && 'Image File (.png)'}
                                    {downloadType === 'print' && 'Print Document'}
                                  </span>
                                </div>
                                <ChevronDown className="h-5 w-5 text-indigo-300" />
                              </button>
                              
                              {/* Dropdown menu with glass effect */}
                              {showDownloadOptions && (
                                <div className="absolute z-10 mt-2 w-full rounded-xl bg-indigo-900/80 backdrop-blur-xl shadow-xl border border-white/10">
                                  <div className="py-1">
                                    <button
                                      className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                                      onClick={() => {
                                        setDownloadType('pdf');
                                        setShowDownloadOptions(false);
                                      }}
                                    >
                                      <FileText className="mr-2 h-5 w-5 text-red-400" />
                                      PDF Document (.pdf)
                                    </button>
                                    <button
                                      className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                                      onClick={() => {
                                        setDownloadType('png');
                                        setShowDownloadOptions(false);
                                      }}
                                    >
                                      <FileText className="mr-2 h-5 w-5 text-blue-400" />
                                      Image File (.png)
                                    </button>
                                    <button
                                      className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                                      onClick={() => {
                                        setDownloadType('print');
                                        setShowDownloadOptions(false);
                                      }}
                                    >
                                      <Printer className="mr-2 h-5 w-5 text-indigo-300" />
                                      Print Document
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Download button or progress */}
                            {downloadingState ? (
                              <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${downloadProgress}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full"
                                  ></motion.div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-center text-sm text-indigo-200">Processing your resume...</p>
                                  <span className="text-sm text-white font-medium">{downloadProgress}%</span>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                className="w-full py-6 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base rounded-xl relative overflow-hidden group"
                                onClick={handleDownload}
                              >
                                {/* Animated background */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                
                                {downloadType === 'pdf' && (
                                  <span className="flex items-center relative z-10">
                                    <Download className="mr-2 h-5 w-5" />
                                    Download as PDF
                                  </span>
                                )}
                                {downloadType === 'png' && (
                                  <span className="flex items-center relative z-10">
                                    <Download className="mr-2 h-5 w-5" />
                                    Download as Image
                                  </span>
                                )}
                                {downloadType === 'print' && (
                                  <span className="flex items-center relative z-10">
                                    <Printer className="mr-2 h-5 w-5" />
                                    Print Resume
                                  </span>
                                )}
                              </Button>
                            )}
                          </div>
                          
                          {/* Pro Tips with glass effect */}
                          <div className="mt-6 bg-emerald-900/20 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/30">
                            <h4 className="text-sm font-medium text-emerald-300 mb-3 flex items-center">
                              <Trophy className="h-4 w-4 mr-2" />
                              Career Expert Tips
                            </h4>
                            <ul className="text-xs text-emerald-200 space-y-3">
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                PDF format is best for ATS systems and online job applications
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                PNG format is perfect for attaching to emails or sharing on LinkedIn
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                Print on premium 24lb paper for in-person interviews
                              </li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Share tab */}
                      {activeSidebarTab === 'share' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-600/20">
                              <Share className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Share Your Resume</h3>
                            <p className="text-indigo-200 text-sm mb-6">Share your professional resume with recruiters and your network</p>
                          </div>
                          
                          {/* Copy link with glassmorphism */}
                          <div className="space-y-4">
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                              <input 
                                type="text" 
                                value={`${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`}
                                className="w-full bg-transparent py-4 pl-4 pr-12 text-sm text-indigo-100 focus:outline-none"
                                readOnly
                              />
                              <button 
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                onClick={copyResumeLink}
                              >
                                {
                                  copied ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-5 w-5 text-indigo-300" />
                                  )}
                                </button>
                              </div>
                              
                              {/* Share buttons with animated gradients */}
                              <div className="grid grid-cols-2 gap-3">
                                <Button 
                                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-300 relative overflow-hidden group"
                                  onClick={copyResumeLink}
                                >
                                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                  <Clipboard className="h-5 w-5" />
                                  <span className="font-medium">Copy Link</span>
                                </Button>
                                
                                <RWebShare
                                  data={{
                                    text: `Check out my professional resume for ${resumeInfo?.jobTitle || 'my next role'}`,
                                    url: `${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`,
                                    title: `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''} Resume`,
                                  }}
                                  onClick={() => toast("Opening share options")}
                                >
                                  <Button 
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-300 relative overflow-hidden group"
                                  >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                    <Send className="h-5 w-5" />
                                    <span className="font-medium">Share Now</span>
                                  </Button>
                                </RWebShare>
                              </div>
                            </div>
                            
                            {/* Social proof section */}
                            <div className="mt-6 bg-purple-900/20 backdrop-blur-sm p-4 rounded-xl border border-purple-500/30">
                              <h4 className="text-sm font-medium text-purple-300 mb-3 flex items-center">
                                <Globe className="h-4 w-4 mr-2" />
                                Recruiter Insights
                              </h4>
                              <ul className="text-xs text-purple-200 space-y-3">
                                <li className="flex items-start">
                                  <ArrowUpRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-purple-400" />
                                  <span>Resumes shared directly get <span className="text-white font-medium">3x more responses</span> from hiring managers</span>
                                </li>
                                <li className="flex items-start">
                                  <Heart className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-pink-400" />
                                  <span>Include your resume link in all your job applications</span>
                                </li>
                                <li className="flex items-start">
                                  <ThumbsUp className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-purple-400" />
                                  <span>Add to your LinkedIn profile to increase visibility</span>
                                </li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Settings tab */}
                        {activeSidebarTab === 'settings' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <div className="text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-600/20">
                                <Settings className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">Resume Options</h3>
                              <p className="text-indigo-200 text-sm mb-6">Manage and edit your professional resume</p>
                            </div>
                            
                            <div className="space-y-4">
                              <Button 
                                className="w-full py-6 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                                onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                              >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="font-medium">Return to Editor</span>
                              </Button>
                              
                              <Button 
                                className="w-full py-6 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                                onClick={() => navigate('/dashboard')}
                              >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="font-medium">Back to Dashboard</span>
                              </Button>
                            </div>
                            
                            {/* Activity tracker */}
                            <div className="mt-6 bg-slate-900/40 backdrop-blur-sm p-4 rounded-xl border border-slate-500/30">
                              <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Resume Activity
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" /> Created
                                  </span>
                                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300 flex items-center">
                                    <Download className="h-3 w-3 mr-1" /> Downloads
                                  </span>
                                  <span className="text-white">0 times</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300 flex items-center">
                                    <Share className="h-3 w-3 mr-1" /> Shares
                                  </span>
                                  <span className="text-white">0 times</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Full-screen preview mode with enhanced design */}
        <AnimatePresence>
          {fullscreenPreview && (
            <motion.div 
              id="noPrint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 sm:p-10"
            >
              {/* Floating elements for visual interest */}
              <div className="absolute left-10 top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute right-10 top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              {/* Top bar with controls */}
              <div className="w-full max-w-5xl flex justify-between items-center py-4 px-6 bg-white/5 backdrop-blur-xl rounded-t-xl border border-white/10 relative z-10">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-white font-bold flex items-center"
                >
                  <Star className="h-4 w-4 mr-2 text-yellow-400" /> Full Resume Preview
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex gap-3"
                >
                  <Button
                    className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white border-none shadow-lg"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadType === 'pdf' ? 'Download PDF' : downloadType === 'png' ? 'Download PNG' : 'Print'}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-white border-white/30 bg-white/5 hover:bg-white/10"
                    onClick={() => setFullscreenPreview(false)}
                  >
                    Close
                  </Button>
                </motion.div>
              </div>
              
              {/* Resume preview with subtle glow */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="relative w-full max-w-5xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-indigo-500/20 rounded-b-xl blur-xl transform scale-105 opacity-50"></div>
                <div className="bg-white overflow-auto max-h-[80vh] w-full rounded-b-xl shadow-2xl relative z-10">
                  <div 
                    id="fullscreen-resume" 
                    className="print-area mx-auto"
                    style={{
                      width: "250mm",
                      padding: "0",
                      margin: "0 auto",
                      boxSizing: "border-box"
                    }}
                  >
                    <ResumePreview />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Add style for shimmer animation */}
        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </>
    );
  }
  
  export default ViewResume;