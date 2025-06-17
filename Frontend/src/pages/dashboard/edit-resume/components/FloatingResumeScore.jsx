import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Info, 
  FileCheck,
  Briefcase,
  GraduationCap,
  FolderGit,
  X,
  MessageSquare,
  Sparkles,
  ChevronUp,
  ThumbsUp,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIChatSession } from "@/Services/AiModel";
import { toast } from "sonner";

// Add custom CSS for fade-in-out animation and rainbow gradient for the bot icon
const animationStyles = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-5px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-5px); }
  }
  .animate-fade-in-out {
    animation: fadeInOut 1s ease-in-out;
  }
  
  /* Rainbow gradient animation for the bot icon */
  /* Enhanced 3D animation effects */
  @keyframes floatingRobot {
    0% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-3px) rotate(1deg); }
    50% { transform: translateY(0px) rotate(0deg); }
    75% { transform: translateY(3px) rotate(-1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  @keyframes glowPulse {
    0% { opacity: 0.4; }
    50% { opacity: 0.7; }
    100% { opacity: 0.4; }
  }
  
  @keyframes eyeScan {
    0% { transform: translateX(-1px); }
    50% { transform: translateX(1px); }
    100% { transform: translateX(-1px); }
  }
  
  @keyframes blinkEffect {
    0% { transform: scaleY(1); }
    49% { transform: scaleY(1); }
    50% { transform: scaleY(0.1); }
    51% { transform: scaleY(1); }
    100% { transform: scaleY(1); }
  }
  
  @keyframes antennaGlow {
    0% { opacity: 0.6; filter: blur(1px); }
    50% { opacity: 1; filter: blur(2px); }
    100% { opacity: 0.6; filter: blur(1px); }
  }
  
  @keyframes rainbowAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .rainbow-gradient {
    background: linear-gradient(124deg, #fd7e97, #f9a470, #fad874, #a5e8b1, #80d0e6, #a6a1e6, #caa5e6);
    background-size: 1800% 1800%;
    animation: rainbowAnimation 15s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .rainbow-fill {
    background: linear-gradient(124deg, #fd7e97, #f9a470, #fad874, #a5e8b1, #80d0e6, #a6a1e6, #caa5e6);
    background-size: 1800% 1800%;
    animation: rainbowAnimation 15s ease infinite;
  }
  
  .robot-float {
    animation: floatingRobot 4s ease-in-out infinite;
  }
  
  .eye-scan {
    animation: eyeScan 3s ease-in-out infinite, blinkEffect 5s ease-in-out infinite;
  }
  
  .glow-effect {
    animation: glowPulse 2s ease-in-out infinite;
  }
  
  .antenna-glow {
    animation: antennaGlow 1.5s ease-in-out infinite;
  }
`;

const FloatingResumeScore = ({ resumeInfo }) => {
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Periodically animate the button and show hint
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimateButton(true);
      setShowHint(true);
      
      // Hide hint after 1 second
      setTimeout(() => {
        setShowHint(false);
      }, 2000);
      
      // Reset button animation after 1 second
      setTimeout(() => {
        setAnimateButton(false);
      }, 1000);
    }, 10000); // Show every 10 seconds
    
    return () => clearInterval(animationTimer);
  }, []);

  // Show hint initially for a second
  useEffect(() => {
    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate initial score
  const calculateInitialScore = () => {
    // Initial score structure
    const scores = {
      personal: 0,
      summary: 0,
      experience: 0,
      education: 0,
      skills: 0,
      projects: 0,
      certifications: 0, // Added certifications score
      totalScore: 0,
      feedback: []
    };
    
    // Check if resumeInfo exists and has data
    if (!resumeInfo) return scores;
    
    // Personal details - score based on completed fields
    const personalFields = [
      resumeInfo.firstName, 
      resumeInfo.lastName,
      resumeInfo.jobTitle,
      resumeInfo.email,
      resumeInfo.phone,
      resumeInfo.address
    ];
    const filledPersonalFields = personalFields.filter(field => field && field.trim().length > 0).length;
    // Only calculate percentage if there are filled fields
    scores.personal = personalFields.length > 0 ? Math.round((filledPersonalFields / personalFields.length) * 100) : 0;
    
    // Summary - check if exists and has reasonable length
    if (resumeInfo.summary && resumeInfo.summary.trim()) {
      const summaryLength = resumeInfo.summary.trim().length;
      if (summaryLength > 300) scores.summary = 95;
      else if (summaryLength > 200) scores.summary = 85;
      else if (summaryLength > 100) scores.summary = 75;
      else scores.summary = 60;
    } else {
      scores.summary = 0; // Set to 0 if no summary exists
    }
    
    // Experience - check number and quality of entries
    if (resumeInfo.experience && resumeInfo.experience.length > 0) {
      const expCount = resumeInfo.experience.length;
      let expQuality = 0;
      
      resumeInfo.experience.forEach(exp => {
        let entryScore = 0;
        if (exp.title && exp.title.trim()) entryScore += 20;
        if (exp.companyName && exp.companyName.trim()) entryScore += 20;
        if (exp.startDate && exp.startDate.trim()) entryScore += 10;
        if (exp.endDate && exp.endDate.trim()) entryScore += 10;
        if (exp.workSummary && exp.workSummary.trim()) {
          // Score based on workSummary quality
          const summaryLength = exp.workSummary.trim().length;
          entryScore += summaryLength > 200 ? 40 : (summaryLength > 100 ? 30 : 20);
        }
        expQuality += entryScore / 100;
      });
      
      // Average quality score across all experiences
      const avgQuality = expQuality / expCount;
      scores.experience = Math.min(Math.round(avgQuality * 100), 100);
    } else {
      scores.experience = 0; // Set to 0 if no experience entries exist
    }
    
    // Education - check entries
    if (resumeInfo.education && resumeInfo.education.length > 0) {
      const eduCount = resumeInfo.education.length;
      let eduQuality = 0;
      
      resumeInfo.education.forEach(edu => {
        let entryScore = 0;
        if (edu.universityName && edu.universityName.trim()) entryScore += 30;
        if (edu.degree && edu.degree.trim()) entryScore += 25;
        if (edu.major && edu.major.trim()) entryScore += 15;
        if (edu.startDate && edu.startDate.trim()) entryScore += 10;
        if (edu.endDate && edu.endDate.trim()) entryScore += 10;
        if (edu.description && edu.description.trim()) entryScore += 10;
        eduQuality += entryScore / 100;
      });
      
      const avgQuality = eduQuality / eduCount;
      scores.education = Math.min(Math.round(avgQuality * 100), 100);
    } else {
      scores.education = 0; // Set to 0 if no education entries exist
    }
    
    // Skills - check number and ratings
    if (resumeInfo.skills && resumeInfo.skills.length > 0) {
      const skillsCount = resumeInfo.skills.length;
      const hasRatings = resumeInfo.skills.some(skill => skill.rating > 0);
      
      if (skillsCount >= 10) scores.skills = 90;
      else if (skillsCount >= 7) scores.skills = 80;
      else if (skillsCount >= 5) scores.skills = 70;
      else if (skillsCount >= 3) scores.skills = 60;
      else scores.skills = 50;
      
      // Bonus for having ratings
      if (hasRatings) scores.skills = Math.min(scores.skills + 10, 100);
    } else {
      scores.skills = 0; // Set to 0 if no skills entries exist
    }
    
    // Projects - check entries and details
    if (resumeInfo.projects && resumeInfo.projects.length > 0) {
      const projCount = resumeInfo.projects.length;
      let projQuality = 0;
      
      resumeInfo.projects.forEach(proj => {
        let entryScore = 0;
        if (proj.projectName && proj.projectName.trim()) entryScore += 30;
        if (proj.techStack && proj.techStack.trim()) entryScore += 30;
        if (proj.projectSummary && proj.projectSummary.trim()) {
          const summaryLength = proj.projectSummary.trim().length;
          entryScore += summaryLength > 200 ? 40 : (summaryLength > 100 ? 30 : 20);
        }
        projQuality += entryScore / 100;
      });
      
      const avgQuality = projQuality / projCount;
      scores.projects = Math.min(Math.round(avgQuality * 100), 100);
    } else {
      scores.projects = 0; // Set to 0 if no projects entries exist
    }
    
    // Certifications - check entries and details
    if (resumeInfo.certifications && resumeInfo.certifications.length > 0) {
      const certCount = resumeInfo.certifications.length;
      let certQuality = 0;
      
      resumeInfo.certifications.forEach(cert => {
        let entryScore = 0;
        if (cert.name && cert.name.trim()) entryScore += 35;
        if (cert.issuer && cert.issuer.trim()) entryScore += 25;
        if (cert.issueDate && cert.issueDate.trim()) entryScore += 15;
        if (cert.expiryDate && cert.expiryDate.trim()) entryScore += 10;
        if (cert.credentialId && cert.credentialId.trim()) entryScore += 15;
        certQuality += entryScore / 100;
      });
      
      const avgQuality = certQuality / certCount;
      scores.certifications = Math.min(Math.round(avgQuality * 100), 100);
    } else {
      scores.certifications = 0; // Set to 0 if no certifications entries exist
    }
    
    // Calculate total score - weighted average of all sections
    const weights = {
      personal: 0.15,
      summary: 0.15,
      experience: 0.20,
      education: 0.15,
      skills: 0.15,
      projects: 0.10,
      certifications: 0.10 // Added certifications with weight
    };
    
    let totalWeightedScore = 0;
    let appliedWeights = 0;
    
    Object.keys(weights).forEach(key => {
      if (scores[key] > 0) {
        totalWeightedScore += scores[key] * weights[key];
        appliedWeights += weights[key];
      }
    });
    
    scores.totalScore = appliedWeights > 0 
      ? Math.round(totalWeightedScore / appliedWeights) 
      : 0;
    
    // Generate appropriate feedback
    if (scores.personal < 70) {
      scores.feedback.push("Complete your personal details section to improve your resume");
    }
    
    if (scores.summary === 0) {
      scores.feedback.push("Add a professional summary to highlight your career goals and strengths");
    } else if (scores.summary < 70) {
      scores.feedback.push("Enhance your professional summary with more specific details about your career goals and strengths");
    }
    
    if (!resumeInfo.experience || resumeInfo.experience.length === 0) {
      scores.feedback.push("Add your work experience to showcase your professional background");
    } else if (scores.experience < 70) {
      scores.feedback.push("Provide more detailed descriptions of your work responsibilities and achievements");
    }
    
    if (!resumeInfo.education || resumeInfo.education.length === 0) {
      scores.feedback.push("Add your educational background to strengthen your resume");
    }
    
    if (!resumeInfo.skills || resumeInfo.skills.length === 0) {
      scores.feedback.push("Add skills relevant to your target job to highlight your expertise");
    } else if (resumeInfo.skills.length < 5) {
      scores.feedback.push("Add more skills relevant to your target job to highlight your expertise");
    }
    
    if (!resumeInfo.projects || resumeInfo.projects.length === 0) {
      scores.feedback.push("Include projects to demonstrate your practical experience");
    } else if (scores.projects < 70) {
      scores.feedback.push("Add more details to your projects, including technologies used and your role");
    }
    
    // Added feedback for certifications
    if (!resumeInfo.certifications || resumeInfo.certifications.length === 0) {
      scores.feedback.push("Include relevant certifications to validate your technical skills and knowledge");
    } else if (scores.certifications < 70) {
      scores.feedback.push("Provide more details for your certifications, including issuer and credential IDs");
    }
    
    return scores;
  };

  const getAIAnalysis = async () => {
    setLoading(true);
    try {
      // Calculate initial scores for reference
      const initialScores = calculateInitialScore();
      setScoreData(initialScores);
      
      // Create prompt for AI analysis
      const prompt = `
      I need you to analyze this resume data and provide a detailed evaluation with specific, accurate percentage scores.
      
      The resume belongs to a job seeker and contains the following data:
      ${JSON.stringify(resumeInfo, null, 2)}
      
      Please analyze each section carefully and provide scores based on completeness, quality, and impact:
      
      IMPORTANT: For any section that is completely empty (not filled in at all), assign a score of exactly 0%. Do not give any default minimum score.
      
      For Personal Details:
      - Score 0% if completely empty
      - Score 40-60% if only basic fields are filled 
      - Score 70-80% if most fields are complete
      - Score 90-100% if all fields are complete with professional contact information
      
      For Professional Summary:
      - Score 0% if completely empty
      - Otherwise, score based on length, specificity, relevance, and impact
      - Evaluate whether it effectively communicates career goals and value proposition
      
      For Work Experience:
      - Score 0% if completely empty
      - Otherwise evaluate based on number of entries, detail level, use of action verbs, and quantifiable achievements
      - Higher scores for comprehensive descriptions with metrics and results
      
      For Education:
      - Score 0% if completely empty
      - Otherwise score based on completeness of degree information, dates, and relevant details
      
      For Skills:
      - Score 0% if completely empty
      - Otherwise evaluate based on number of skills, relevance, organization, and rating consistency
      
      For Projects:
      - Score 0% if completely empty
      - Otherwise score based on detail level, technology descriptions, and connection to skills
      
      For Certifications:
      - Score 0% if completely empty
      - Otherwise score based on completeness of certification information, including name, issuer, dates, and credential ID
      - Higher scores for recent, relevant certifications with complete details
      
      Format your response exactly as a valid JSON object with the following structure:
      {
        "scores": {
          "personal": [0-100 number],
          "summary": [0-100 number],
          "experience": [0-100 number], 
          "education": [0-100 number],
          "skills": [0-100 number],
          "projects": [0-100 number],
          "certifications": [0-100 number],
          "totalScore": [0-100 number]
        },
        "analysis": {
          "strengths": [array of specific strengths found in this resume],
          "weaknesses": [array of specific areas for improvement]
        },
        "suggestions": [array of specific, actionable improvement suggestions]
      }
      
      Ensure your scores are fair but realistic reflections of the resume quality. Remember to give a score of 0% to any completely empty sections. The overall totalScore should be a weighted average (personal 15%, summary 15%, experience 20%, education 15%, skills 15%, projects 10%, certifications 10%).
      `;
      
      // Call AI API
      const result = await AIChatSession.sendMessage(prompt);
      const aiAnalysis = JSON.parse(result.response.text());
      
      // Update with AI analysis results
      setScoreData({
        ...aiAnalysis.scores,
        analysis: aiAnalysis.analysis,
        suggestions: aiAnalysis.suggestions
      });
      
      setAnalyzed(true);
      
      toast("Resume analysis completed", {
        description: "AI has analyzed your resume and provided improvement suggestions"
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast("Could not complete AI analysis", {
        description: "Using basic score calculation instead",
        variant: "destructive"
      });
      
      // Fallback to initial scores if AI fails
      const initialScores = calculateInitialScore();
      setScoreData(initialScores);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Calculate initial score on component mount
    const initialScores = calculateInitialScore();
    setScoreData(initialScores);
  }, [resumeInfo]);

  const getScoreColor = (score) => {
    if (score === 0) return "bg-gray-300"; // Gray color for 0% score
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreDescription = (score) => {
    if (score === 0) return "Not Started";
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
  };

  if (!resumeInfo) return null;
  
  const scoreTextColor = getScoreColor(scoreData?.totalScore || 0).replace('bg-', 'text-');

  // Custom SVG for ultra-advanced 3D robot icon with animations
  const RainbowBotIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      style={{ 
        filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))",
      }}
      className="robot-float"
    >
      {/* Enhanced gradients and filters for 3D effect */}
      <defs>
        <linearGradient id="robotHead" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        
        <linearGradient id="robotHeadHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
        
        <radialGradient id="robotEye" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="40%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </radialGradient>
        
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
        
        <linearGradient id="robotGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
        </linearGradient>
        
        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feOffset dx="0.5" dy="0.5" in="blur" result="offsetBlur" />
          <feComposite in="SourceAlpha" in2="offsetBlur" operator="out" result="innerShadow" />
          <feFlood floodColor="#000" floodOpacity="0.3" result="color" />
          <feComposite in="color" in2="innerShadow" operator="in" result="shadow" />
          <feComposite in="SourceGraphic" in2="shadow" operator="over" />
        </filter>
        
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feFlood floodColor="#A5B4FC" floodOpacity="0.8" result="glow" />
          <feComposite in="glow" in2="SourceGraphic" operator="in" result="coloredGlow" />
          <feGaussianBlur in="coloredGlow" stdDeviation="1" result="blurredGlow" />
          <feComposite in="blurredGlow" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
      
      {/* Glow effect behind robot */}
      <ellipse className="glow-effect" cx="12" cy="12" rx="11" ry="10" fill="url(#robotGlow)" />
      
      {/* Robot head - 3D metallic effect with highlights */}
      <g filter="url(#innerShadow)">
        <rect x="4" y="4" width="16" height="11" rx="3" ry="3" fill="url(#robotHead)" stroke="#4338CA" strokeWidth="0.3" />
        {/* Highlight for 3D effect */}
        <path d="M4 7 L20 7" stroke="url(#robotHeadHighlight)" strokeWidth="0.7" opacity="0.8" />
      </g>
      
      {/* Head details - advanced circuit-like patterns */}
      <g opacity="0.9">
        <path d="M5 6.5h2M5 9h1M18 6.5h2M18 9h1" stroke="#A5B4FC" strokeWidth="0.4" />
        <path d="M7.5 5h2M14.5 5h2" stroke="#A5B4FC" strokeWidth="0.4" />
        <path d="M6 11h3M15 11h3" stroke="#A5B4FC" strokeWidth="0.4" />
        <circle cx="6.5" cy="6.5" r="0.3" fill="#C7D2FE" />
        <circle cx="18.5" cy="6.5" r="0.3" fill="#C7D2FE" />
        <circle cx="6" cy="11" r="0.2" fill="#818CF8" />
        <circle cx="18" cy="11" r="0.2" fill="#818CF8" />
      </g>
      
      {/* Robot eyes - glowing with animation */}
      <g className="eye-scan">
        <circle cx="9" cy="8.5" r="2" fill="url(#robotEye)" stroke="#3B82F6" strokeWidth="0.2" />
        <circle cx="15" cy="8.5" r="2" fill="url(#robotEye)" stroke="#3B82F6" strokeWidth="0.2" />
        
        {/* Eye glow effect */}
        <circle className="glow-effect" cx="9" cy="8.5" r="2.5" fill="url(#eyeGlow)" />
        <circle className="glow-effect" cx="15" cy="8.5" r="2.5" fill="url(#eyeGlow)" />
        
        {/* Eye details with reflection */}
        <circle cx="9" cy="8.5" r="1" fill="#DBEAFE" opacity="0.9" />
        <circle cx="15" cy="8.5" r="1" fill="#DBEAFE" opacity="0.9" />
        <circle cx="9.5" cy="8" r="0.4" fill="#FFFFFF" />
        <circle cx="15.5" cy="8" r="0.4" fill="#FFFFFF" />
        
        {/* Scanning effect details */}
        <line x1="7.5" y1="8.5" x2="10.5" y2="8.5" stroke="#93C5FD" strokeWidth="0.2" opacity="0.7" />
        <line x1="13.5" y1="8.5" x2="16.5" y2="8.5" stroke="#93C5FD" strokeWidth="0.2" opacity="0.7" />
      </g>
      
      {/* Robot mouth - advanced with LED indicators */}
      <g>
        <path d="M7.5 12.5a4.5 3 0 0 0 9 0" stroke="#818CF8" strokeWidth="0.5" fill="none" />
        <path d="M8 12h8" stroke="#A5B4FC" strokeWidth="0.3" />
        
        {/* Animated mouth lights */}
        <g className="glow-effect">
          <circle cx="9" cy="12.5" r="0.3" fill="#93C5FD" />
          <circle cx="10.5" cy="13" r="0.3" fill="#93C5FD" />
          <circle cx="12" cy="13.2" r="0.3" fill="#93C5FD" />
          <circle cx="13.5" cy="13" r="0.3" fill="#93C5FD" />
          <circle cx="15" cy="12.5" r="0.3" fill="#93C5FD" />
        </g>
      </g>
      
      {/* Robot antenna with glowing effect */}
      <g>
        <path d="M12 4V2" stroke="#4F46E5" strokeWidth="0.8" />
        <circle cx="12" cy="1.5" r="1" fill="#4F46E5" stroke="#4338CA" strokeWidth="0.2" />
        <circle className="antenna-glow" cx="12" cy="1.5" r="1.3" fill="#818CF8" opacity="0.6" filter="url(#neonGlow)" />
        <circle cx="12" cy="1.5" r="0.4" fill="#FFFFFF" opacity="0.9" />
      </g>
      
      {/* Robot neck with mechanical details */}
      <g>
        <path d="M9 15v2M15 15v2" stroke="#4F46E5" strokeWidth="1" />
        <rect x="8.5" y="15" width="1" height="2" rx="0.2" fill="#818CF8" />
        <rect x="14.5" y="15" width="1" height="2" rx="0.2" fill="#818CF8" />
      </g>
      
      {/* Robot body with 3D effect */}
      <g filter="url(#innerShadow)">
        <rect x="6.5" y="17" width="11" height="5" rx="1.5" ry="1.5" fill="url(#robotHead)" stroke="#4338CA" strokeWidth="0.3" />
        <path d="M6.5 19L17.5 19" stroke="url(#robotHeadHighlight)" strokeWidth="0.5" opacity="0.7" />
      </g>
      
      {/* Body details - control panel */}
      <g>
        <circle cx="9" cy="18.5" r="0.6" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="0.2" />
        <circle cx="12" cy="18.5" r="0.6" fill="#93C5FD" stroke="#3B82F6" strokeWidth="0.2" />
        <circle cx="15" cy="18.5" r="0.6" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="0.2" />
        
        <rect x="8.5" y="20" width="1" height="1" rx="0.2" fill="#A5B4FC" />
        <rect x="11.5" y="20" width="1" height="1" rx="0.2" fill="#93C5FD" />
        <rect x="14.5" y="20" width="1" height="1" rx="0.2" fill="#A5B4FC" />
        
        {/* Animated indicator lights */}
        <g className="glow-effect">
          <circle cx="9" cy="18.5" r="0.3" fill="#FFFFFF" opacity="0.7" />
          <circle cx="12" cy="18.5" r="0.3" fill="#FFFFFF" opacity="0.7" />
          <circle cx="15" cy="18.5" r="0.3" fill="#FFFFFF" opacity="0.7" />
        </g>
      </g>
      
      {/* Robot arms with mechanical joints */}
      <g>
        <path d="M6.5 18L4.5 20" stroke="#4F46E5" strokeWidth="0.8" />
        <path d="M17.5 18L19.5 20" stroke="#4F46E5" strokeWidth="0.8" />
        
        {/* Mechanical arm joints */}
        <circle cx="4.5" cy="20" r="1" fill="#6366F1" stroke="#4338CA" strokeWidth="0.2" />
        <circle cx="19.5" cy="20" r="1" fill="#6366F1" stroke="#4338CA" strokeWidth="0.2" />
        
        {/* Joint details */}
        <circle cx="4.5" cy="20" r="0.5" fill="#A5B4FC" />
        <circle cx="19.5" cy="20" r="0.5" fill="#A5B4FC" />
        <circle cx="4.5" cy="20" r="0.2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="19.5" cy="20" r="0.2" fill="#FFFFFF" opacity="0.8" />
      </g>
      
      {/* 3D effect highlights */}
      <g opacity="0.5">
        <path d="M6.5 5 Q12 3.5 17.5 5" stroke="#FFFFFF" strokeWidth="0.2" fill="none" />
        <path d="M8 17.5 Q12 16.5 16 17.5" stroke="#FFFFFF" strokeWidth="0.2" fill="none" />
      </g>
    </svg>
  );

  return (
    <>
      {/* Add animation styles to head */}
      <style>{animationStyles}</style>
      
      {/* Floating button with enhanced chatbot-like design */}
      <div 
        className={`fixed left-4 bottom-16 md:bottom-6 z-50 flex items-center justify-center ${expanded ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}
      >
        <button 
          onClick={() => setExpanded(true)}
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 ${animateButton ? 'scale-110' : 'scale-100'} border-2 border-indigo-100`}
          aria-label="Open Resume Assistant"
        >
          <RainbowBotIcon />
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center">
            <span className={`text-xs font-bold ${scoreTextColor}`}>{scoreData?.totalScore || 0}</span>
          </div>
          
          {/* Floating hint message */}
          {showHint && (
            <div className="absolute -top-12 left-0 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-medium text-gray-700 whitespace-nowrap border border-gray-100 animate-fade-in-out">
              Check your resume score! <ChevronUp className="h-3 w-3 inline ml-1" />
            </div>
          )}
        </button>
      </div>

      {/* Enhanced chat-like panel with increased width */}
      <div 
        className={`fixed left-0 bottom-0 md:left-4 md:bottom-4 z-50 transition-all duration-300 transform ${
          expanded 
            ? 'translate-y-0 md:translate-y-0 opacity-100' 
            : 'translate-y-full md:translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ maxWidth: "calc(100vw - 32px)" }} // Ensures it doesn't overflow on smaller screens
      >
        <div className="bg-white rounded-t-xl md:rounded-xl shadow-xl border border-gray-200 w-full md:w-[450px] lg:w-[550px] xl:w-[650px] max-h-[75vh] flex flex-col overflow-hidden">
          {/* Enhanced header with rainbow gradient background */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-violet-50 flex items-center justify-between border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full flex-shrink-0" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #f5f3ff, #ede9fe)" }}>
                <RainbowBotIcon />
              </div>
              <div>
                <h3 className="font-semibold">Resume Assistant</h3>
                <p className="text-xs opacity-90">
                  {analyzed ? "AI-powered analysis" : "Initial evaluation"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold">{scoreData?.totalScore || 0}</span>
                  <span className="text-xs">/100</span>
                </div>
                <div className="text-xs -mt-0.5">
                  {getScoreDescription(scoreData?.totalScore || 0)}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setExpanded(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Intro message in chat-like style */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full rainbow-fill bg-opacity-10 flex-shrink-0">
                <RainbowBotIcon />
              </div>
              <div className="text-sm">
                <p className="text-gray-700">
                  Hi there! I've analyzed your resume and can provide personalized feedback to help you improve it.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Your current resume score is <span className="font-semibold">{scoreData?.totalScore || 0}/100</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Body with scrollable content */}
          <div className="overflow-y-auto p-4 space-y-5 flex-grow">
            {/* AI Analysis Button - Enhanced style */}
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-sm flex items-center justify-center gap-2 py-5 rounded-lg border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              onClick={getAIAnalysis}
              disabled={loading}
            >
              {loading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Analyzing your resume...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> {analyzed ? "Get Fresh AI Analysis" : "Analyze with AI"}</>
              )}
            </Button>

            {/* Section Scores - Enhanced with cards */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 text-sm flex items-center gap-2 px-1">
                <BarChart className="h-4 w-4 rainbow-gradient" />
                Section Scores
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "Personal", key: "personal", icon: <Info className="h-4 w-4" /> },
                  { name: "Summary", key: "summary", icon: <FileCheck className="h-4 w-4" /> },
                  { name: "Experience", key: "experience", icon: <Briefcase className="h-4 w-4" /> },
                  { name: "Education", key: "education", icon: <GraduationCap className="h-4 w-4" /> },
                  { name: "Skills", key: "skills", icon: <CheckCircle className="h-4 w-4" /> },
                  { name: "Projects", key: "projects", icon: <FolderGit className="h-4 w-4" /> },
                  { name: "Certifications", key: "certifications", icon: <Award className="h-4 w-4" /> }
                ].map((section) => (
                  <div key={section.key} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-full ${getScoreColor(scoreData?.[section.key] || 0)} bg-opacity-10`}>
                        {section.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{section.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreColor(scoreData?.[section.key] || 0)} transition-all duration-500 ease-out`}
                            style={{ width: `${scoreData?.[section.key] || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-700">
                        {scoreData?.[section.key] || 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resume Strengths - Enhanced card style */}
            {analyzed && scoreData?.analysis?.strengths && scoreData.analysis.strengths.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-gray-700 text-sm mb-3 flex items-center gap-2">
                  <div className="p-1 rounded-full bg-green-500 text-white">
                    <ThumbsUp className="h-3 w-3" />
                  </div>
                  <span>Resume Strengths</span>
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  {scoreData.analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 bg-white bg-opacity-60 p-2 rounded-md">
                      <div className="min-w-4 pt-0.5 text-green-500">•</div>
                      <div>{strength}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Suggestions and Feedback - Enhanced card style */}
            {(scoreData?.suggestions || scoreData?.analysis?.weaknesses || scoreData?.feedback) && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-medium text-gray-700 text-sm mb-3 flex items-center gap-2">
                  <div className="p-1 rounded-full bg-amber-500 text-white">
                    <AlertCircle className="h-3 w-3" />
                  </div>
                  <span>How to Improve Your Resume</span>
                </h4>
                
                <ul className="text-sm text-gray-700 space-y-2">
                  {analyzed && scoreData?.suggestions ? (
                    // AI-generated suggestions
                    scoreData.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 bg-white bg-opacity-60 p-2 rounded-md">
                        <div className="min-w-4 pt-0.5 text-amber-500">•</div>
                        <div>{suggestion}</div>
                      </li>
                    ))
                  ) : analyzed && scoreData?.analysis?.weaknesses ? (
                    // AI-generated weaknesses
                    scoreData.analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 bg-white bg-opacity-60 p-2 rounded-md">
                        <div className="min-w-4 pt-0.5 text-amber-500">•</div>
                        <div>{weakness}</div>
                      </li>
                    ))
                  ) : (
                    // Basic feedback
                    scoreData?.feedback?.map((feedback, index) => (
                      <li key={index} className="flex items-start gap-2 bg-white bg-opacity-60 p-2 rounded-md">
                        <div className="min-w-4 pt-0.5 text-amber-500">•</div>
                        <div>{feedback}</div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {/* Chat-like prompt at the bottom */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="text-center text-sm text-gray-500">
                <p>Want more detailed feedback? Try the AI Analysis!</p>
                <p className="text-xs mt-1">Our AI can provide personalized suggestions to help improve your resume</p>
              </div>
            </div>
          </div>
          
          {/* Footer with branding */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-500">Resume Assistant</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Powered by</span>
              <Sparkles className="h-3 w-3 rainbow-gradient" />
              <span className="text-xs font-medium rainbow-gradient">AI</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingResumeScore;