// ATSScoreChecker.jsx with enhanced animation
import React, { useState, useEffect } from "react";
import { 
  FileDown, 
  X, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowRight,
  Clipboard,
  PieChart,
  BarChart3,
  LoaderCircle,
  ChevronDown,
  Code,
  Search,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel"; // AI service
import { getResumeData } from "@/Services/resumeAPI"; // Import the API function to get resume data

// ATS evaluation prompt
const ATS_PROMPT = `
You are an expert ATS (Applicant Tracking System) analyzer with deep knowledge of how resume scanning algorithms work. Your task is to precisely evaluate the match between a resume and job description, providing detailed feedback and suggestions for improvement.

**Job Description:**
"{jobDescription}"

**Resume Content:**
"{resumeContent}"

Your evaluation should include the following:

1. **Key Requirements and Skills Identification**:
   - Extract all key requirements, qualifications, and skills listed in the job description, including mandatory, preferred, and any additional criteria (such as certifications, software tools, or technologies).
   - Identify specific terms such as hard skills (e.g., programming languages, technical skills), soft skills (e.g., communication, leadership), experience, and qualifications.
   
2. **Comparison of Resume to Job Description**:
   - **Direct Matches**: Check for exact matches between the job description and the resume. Highlight whether the resume directly mentions required keywords or qualifications, and the context in which they appear.
   - **Semantic Matches**: Evaluate whether the resume contains synonyms or related terms (e.g., if the job description asks for "JavaScript" but the resume mentions "JS").
   - **Experience and Context Matching**: Analyze whether the candidate's work experience matches the role's responsibilities, including the scope of projects, job titles, and technologies used. Identify any experience gaps, and highlight relevant achievements or responsibilities.
   - **Soft Skills**: Identify whether the resume highlights soft skills relevant to the job (e.g., communication, leadership, teamwork). Evaluate if they are mentioned in the context of actual job tasks or experiences.
   - **Formatting and Structure**: Review the overall layout and organization of the resume. Does it follow ATS-friendly practices (e.g., clear headings, concise sections, no excessive use of graphics)? Is the format compatible with ATS parsing?
   - **Missing or Insufficient Keywords**: Identify key skills, qualifications, and experiences that are missing or inadequately represented in the resume but are crucial for the job role. Include suggestions on how to improve this.

3. **Calculation of ATS Score**:
   Calculate a numeric ATS score (0-100) based on the following criteria:
   
   - **60% Weight**: Presence of required hard skills, qualifications, technical terms, and certifications.
     - Does the resume mention the key hard skills and qualifications in direct context?
     - Are the technical skills relevant and sufficiently detailed (e.g., not just "Python," but "Python with Django for web development")?
   
   - **20% Weight**: Experience and job title compatibility.
     - Is the candidate's experience relevant and aligned with the job requirements (e.g., years of experience, industry, job titles)?
     - Does the resume demonstrate relevant responsibilities, leadership, or achievements that align with the role?
   
   - **10% Weight**: Soft skills and culture fit.
     - Are soft skills like communication, teamwork, leadership, and adaptability mentioned and contextualized properly within the resume?
     - Does the resume indicate the candidate's potential cultural fit (e.g., experience in collaborative environments, working with diverse teams)?
   
   - **10% Weight**: Resume formatting and structure.
     - Is the resume properly formatted for ATS? (e.g., no complex tables, proper use of section headings like "Skills", "Experience", "Education").
     - Does the resume avoid unnecessary graphics, images, or special characters that might disrupt ATS parsing?

4. **Recommendations and Actionable Feedback**:
   - Provide specific, actionable recommendations for the candidate to improve their resume and match the job description better.
   - **Strengths**: What are the areas where the resume is already strong and well-aligned with the job requirements?
   - **Improvements**: Identify areas where the resume could be improved, including missing skills or qualifications, or sections that need rewording or clarification.
   - **Missing Keywords**: List important missing keywords that are critical to the job description. Provide suggestions on how to incorporate them into the resume.
   - **Format Improvement**: Provide feedback on whether the resume format is ATS-friendly. If necessary, suggest simple formatting changes (e.g., using standard headings, removing graphics).
   - **Content Suggestions**: If the job description asks for certain experience or qualifications that are not mentioned, suggest how to add them, or recommend rewording certain sections of the resume.

**Output Format:**
Please format your response as a clean JSON object with the following fields:

{
  "score": 85,
  "strengths": [
    "Strong technical skills in Python, React, and SQL with clear experience in web development",
    "Leadership experience in managing a team of 5 developers on a high-profile project",
    "Demonstrates key achievements such as reducing project delivery time by 20%"
  ],
  "improvements": [
    "Missing key experience with cloud technologies such as AWS or Azure",
    "Lack of evidence of Agile experience, which is mentioned in the job description",
    "Could benefit from more specific examples of communication and teamwork skills"
  ],
  "missingKeywords": ["AWS", "Azure", "Agile", "CI/CD", "Cloud computing"],
  "recommendations": [
    "Add specific projects or experience with cloud platforms (e.g., AWS, Azure) in the skills or experience sections",
    "Quantify achievements in the work experience section (e.g., 'Led a team of 5 developers, delivering the project 2 weeks ahead of schedule')",
    "Include examples of Agile methodologies and highlight any Scrum or Kanban experience",
    "Revise 'Soft Skills' section to include measurable examples of communication or teamwork"
  ]
}

**Guidelines:**
- Ensure that the feedback is as specific as possible and actionable.
- If certain skills or experiences are crucial but missing, provide advice on how the candidate can add or reframe their experience.
- Focus on both the content of the resume (skills, experiences, keywords) and the formatting (ATS-friendliness).

`;

function ATSScoreChecker({ isOpen, onClose, resumes, darkMode }) {
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Animation stages
  const analyzeStages = [
    "Extracting keywords...",
    "Matching skills...",
    "Analyzing experience...",
    "Evaluating format...",
    "Calculating score..."
  ];
  
  // Progress animation
  useEffect(() => {
    if (isAnalyzing) {
      const totalTime = 10000; // Total animation time in ms
      const stageTime = totalTime / analyzeStages.length;
      const intervalTime = 50; // Update every 50ms for smooth animation
      const stepsPerStage = stageTime / intervalTime;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const currentStage = Math.floor(currentStep / stepsPerStage);
        
        if (currentStage < analyzeStages.length) {
          setAnalysisStage(currentStage);
          
          // Calculate progress within current stage (0-100)
          const stageProgress = ((currentStep % stepsPerStage) / stepsPerStage) * 100;
          setAnimationProgress(stageProgress);
        } else {
          clearInterval(interval);
        }
      }, intervalTime);
      
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);
  
  // Reset state when modal closes
  const handleClose = () => {
    setSelectedResumeId("");
    setJobDescription("");
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setResumeData(null);
    setAnalysisStage(0);
    setAnimationProgress(0);
    onClose();
  };
  
  // Fetch resume data when a resume is selected
  const handleResumeSelect = async (resumeId) => {
    setSelectedResumeId(resumeId);
    setIsLoadingResume(true);
    try {
      const response = await getResumeData(resumeId);
      setResumeData(response.data);
    } catch (error) {
      toast.error("Failed to load resume data", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsLoadingResume(false);
    }
  };
  
  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      toast.success("Copied to clipboard", {
        description: "Recommendations copied successfully"
      });
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      toast.error("Failed to copy", {
        description: "Please try again manually"
      });
    });
  };
  
  // Generate formatted resume content from resume data
  const generateResumeContent = (resume) => {
    if (!resume) return "";
    
    let content = "";
    
    // Personal info
    if (resume.firstName || resume.lastName) {
      content += `Name: ${resume.firstName || ""} ${resume.lastName || ""}\n`;
    }
    if (resume.jobTitle) content += `Job Title: ${resume.jobTitle}\n`;
    if (resume.email) content += `Email: ${resume.email}\n`;
    if (resume.phone) content += `Phone: ${resume.phone}\n`;
    if (resume.address) content += `Location: ${resume.address}\n\n`;
    
    // Summary
    if (resume.summary) content += `SUMMARY\n${resume.summary}\n\n`;
    
    // Skills
    if (resume.skills && resume.skills.length > 0) {
      content += "SKILLS\n";
      resume.skills.forEach(skill => {
        if (skill.name) content += `${skill.name}\n`;
      });
      content += "\n";
    }
    
    // Experience
    if (resume.experience && resume.experience.length > 0) {
      content += "EXPERIENCE\n";
      resume.experience.forEach(exp => {
        if (exp.title) content += `${exp.title}`;
        if (exp.companyName) content += ` at ${exp.companyName}`;
        if (exp.city || exp.state) {
          content += ` (${exp.city || ""}${exp.city && exp.state ? ", " : ""}${exp.state || ""})`;
        }
        if (exp.startDate || exp.endDate || exp.currentlyWorking) {
          content += ` | ${exp.startDate || ""} - ${exp.currentlyWorking ? "Present" : exp.endDate || ""}`;
        }
        content += "\n";
        if (exp.workSummary) {
          // Strip HTML tags from workSummary
          const plainWorkSummary = exp.workSummary.replace(/<[^>]*>?/gm, '');
          content += `${plainWorkSummary}\n`;
        }
        content += "\n";
      });
    }
    
    // Projects
    if (resume.projects && resume.projects.length > 0) {
      content += "PROJECTS\n";
      resume.projects.forEach(project => {
        if (project.projectName) content += `${project.projectName}\n`;
        if (project.techStack) content += `Technologies: ${project.techStack}\n`;
        if (project.githubLink) content += `GitHub: ${project.githubLink}\n`;
        if (project.deployedLink) content += `Deployed: ${project.deployedLink}\n`;
        if (project.projectSummary) {
          // Strip HTML tags from projectSummary
          const plainProjectSummary = project.projectSummary.replace(/<[^>]*>?/gm, '');
          content += `${plainProjectSummary}\n`;
        }
        content += "\n";
      });
    }
    
    // Education
    if (resume.education && resume.education.length > 0) {
      content += "EDUCATION\n";
      resume.education.forEach(edu => {
        if (edu.degree) content += `${edu.degree}`;
        if (edu.major) content += ` in ${edu.major}`;
        content += "\n";
        if (edu.universityName) content += `${edu.universityName}`;
        if (edu.startDate || edu.endDate) {
          content += ` | ${edu.startDate || ""} - ${edu.endDate || ""}`;
        }
        content += "\n";
        if (edu.grade && edu.gradeType) {
          content += `${edu.gradeType}: ${edu.grade}\n`;
        }
        content += "\n";
      });
    }
    
    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      content += "CERTIFICATIONS\n";
      resume.certifications.forEach(cert => {
        if (cert.name) content += `${cert.name}\n`;
        if (cert.issuer) content += `Issuer: ${cert.issuer}\n`;
        if (cert.date) content += `Date: ${cert.date}\n`;
        if (cert.description) content += `${cert.description}\n`;
        content += "\n";
      });
    }
    
    return content;
  };
  
  const analyzeResume = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume", {
        description: "You need to select a resume to analyze"
      });
      return;
    }
    
    if (jobDescription.trim().length < 50) {
      toast.error("Job description too short", {
        description: "Please provide a comprehensive job description"
      });
      return;
    }
    
    if (!resumeData) {
      toast.error("Resume data not loaded", {
        description: "Please wait for the resume to load or select another resume"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Format the resume content
      const resumeContent = generateResumeContent(resumeData);
      
      if (!resumeContent.trim()) {
        throw new Error("Resume content is empty or not properly formatted");
      }
      
      // Prepare the prompt
      const prompt = ATS_PROMPT
        .replace("{jobDescription}", jobDescription)
        .replace("{resumeContent}", resumeContent);
      
      // Send to AI service
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text();
      
      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(responseText);
        setAnalysisResult(parsedResponse);
        
      } catch (error) {
        console.error("Error parsing AI response:", error);
        toast.error("Error analyzing resume", {
          description: "Could not parse AI response. Try again or use different inputs."
        });
      }
    } catch (error) {
      console.error("Error in ATS analysis:", error);
      toast.error("Analysis failed", {
        description: error.message || "An unknown error occurred"
      });
    } finally {
      setIsAnalyzing(false);
      setAnimationProgress(0);
      setAnalysisStage(0);
    }
  };
  
  // Animated analysis component
  const AnalysisAnimation = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className={`relative h-48 w-48 mb-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
          {/* Outer rotating circle */}
          <div className="absolute inset-0 animate-spin-slow">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
            </svg>
          </div>
          
          {/* Middle pulsing circle */}
          <div className="absolute inset-0 animate-pulse">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle 
                cx="50" 
                cy="50" 
                r="35" 
                stroke="currentColor" 
                strokeWidth="2" 
                opacity="0.6"
              />
            </svg>
          </div>
          
          {/* Inner progress circle */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle 
                cx="50" 
                cy="50" 
                r="25" 
                stroke={darkMode ? "#4F46E5" : "#3B82F6"} 
                strokeWidth="4" 
                strokeDasharray={`${(animationProgress * 1.57)}  157`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          
          {/* Center icon - changes based on stage */}
          <div className="absolute inset-0 flex items-center justify-center">
            {analysisStage === 0 && <Search className="h-12 w-12 animate-pulse" />}
            {analysisStage === 1 && <Cpu className="h-12 w-12 animate-pulse" />}
            {analysisStage === 2 && <FileText className="h-12 w-12 animate-pulse" />}
            {analysisStage === 3 && <Code className="h-12 w-12 animate-pulse" />}
            {analysisStage === 4 && <BarChart3 className="h-12 w-12 animate-pulse" />}
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin-orbit" style={{ animationDirection: 'reverse' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1.5 -translate-y-1.5">
              <div className={`h-3 w-3 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-orbit" style={{ animationDuration: '8s' }}>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1.5 translate-y-1.5">
              <div className={`h-3 w-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-orbit" style={{ animationDuration: '12s' }}>
            <div className="absolute top-1/2 right-0 transform translate-x-1.5 -translate-y-1.5">
              <div className={`h-3 w-3 rounded-full ${darkMode ? 'bg-amber-400' : 'bg-amber-500'}`}></div>
            </div>
          </div>
        </div>
        
        {/* Status text */}
        <div className="text-center space-y-2">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Analyzing your resume...
          </h3>
          <p className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
            {analyzeStages[analysisStage]}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            This may take a moment. We're thoroughly comparing your resume against the job requirements.
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 w-full max-w-md">
          <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(analysisStage / analyzeStages.length) * 100 + (animationProgress / analyzeStages.length)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs font-medium">
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Scanning</span>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Analyzing</span>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Scoring</span>
          </div>
        </div>
      </div>
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 relative z-10`}>
          {/* Radial gradient accent */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-blue-600/30 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-purple-600/30 to-emerald-500/30 rounded-full blur-3xl opacity-20"></div>
          
          {/* Header */}
          <div className={`px-8 py-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center relative z-10`}>
            <div className="flex items-center space-x-4">
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ATS Score Analyzer
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Check how well your resume matches the job description
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              aria-label="Close"
            >
              <X className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
          
          {/* Content */}
          <div className={`px-8 py-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isAnalyzing ? (
              <AnalysisAnimation />
            ) : analysisResult ? (
              <div className="space-y-8">
                {/* Result Header */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center mb-4">
                    {/* Circular score meter */}
                    <div className="relative h-40 w-40">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={darkMode ? "#2D3748" : "#E2E8F0"} 
                          strokeWidth="8"
                        />
                        {/* Score circle - calculate stroke-dasharray based on score */}
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={
                            analysisResult.score >= 80 ? "#10B981" : 
                            analysisResult.score >= 60 ? "#FBBF24" : 
                            "#EF4444"
                          } 
                          strokeWidth="8"
                          strokeDasharray={`${analysisResult.score * 2.83} 283`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Score text */}
                        <text 
                          x="50%" y="50%" 
                          dominantBaseline="middle" 
                          textAnchor="middle" 
                          fontSize="24" 
                          fontWeight="bold" 
                          fill={darkMode ? "#E2E8F0" : "#1F2937"}
                        >
                          {analysisResult.score}
                        </text>
                        <text 
                          x="50%" y="65%" 
                          dominantBaseline="middle" 
                          textAnchor="middle" 
                          fontSize="10" 
                          fill={darkMode ? "#A0AEC0" : "#6B7280"}
                        >
                          out of 100
                        </text>
                      </svg>
                    </div>
                  </div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
                    ATS Score: {analysisResult.score}/100
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {analysisResult.score >= 80 
                      ? "Excellent match! Your resume is well-aligned with this job." 
                      : analysisResult.score >= 60 
                        ? "Good match with room for improvement." 
                        : "Your resume needs significant improvements for this job."}
                  </p>
                </div>
                
                {/* Result Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className={`rounded-xl p-6 ${
                    darkMode ? 'bg-gray-700/50' : 'bg-emerald-50'
                  } border ${
                    darkMode ? 'border-gray-600' : 'border-emerald-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Resume Strengths
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                            darkMode ? 'bg-emerald-900/60' : 'bg-emerald-200'
                          } flex items-center justify-center mt-0.5 mr-3`}>
                            <span className={`text-xs font-bold ${
                              darkMode ? 'text-emerald-400' : 'text-emerald-700'
                            }`}>{index + 1}</span>
                          </div>
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Improvements */}
                  <div className={`rounded-xl p-6 ${
                    darkMode ? 'bg-gray-700/50' : 'bg-amber-50'
                  } border ${
                    darkMode ? 'border-gray-600' : 'border-amber-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                      darkMode ? 'text-amber-400' : 'text-amber-700'
                    }`}>
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                            darkMode ? 'bg-amber-900/60' : 'bg-amber-200'
                          } flex items-center justify-center mt-0.5 mr-3`}>
                            <span className={`text-xs font-bold ${
                              darkMode ? 'text-amber-400' : 'text-amber-700'
                            }`}>{index + 1}</span>
                          </div>
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Missing Keywords */}
                <div className={`rounded-xl p-6 ${
                  darkMode ? 'bg-gray-700/50' : 'bg-red-50'
                } border ${
                  darkMode ? 'border-gray-600' : 'border-red-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-red-400' : 'text-red-700'
                  }`}>
                    <XCircle className="h-5 w-5 mr-2" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords.map((keyword, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                        darkMode 
                          ? 'bg-red-900/30 text-red-300 border border-red-800/50' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className={`rounded-xl p-6 ${
                  darkMode ? 'bg-gray-700/50' : 'bg-blue-50'
                } border ${
                  darkMode ? 'border-gray-600' : 'border-blue-200'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold flex items-center ${
                      darkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Recommendations
                    </h3>
                    <Button
                      onClick={() => copyToClipboard(analysisResult.recommendations.join("\n"))}
                      size="sm"
                      variant="outline"
                      className={`text-xs ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {copySuccess ? (
                        <><CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Copied</>
                      ) : (
                        <><Clipboard className="h-3.5 w-3.5 mr-1.5" /> Copy All</>
                      )}
                    </Button>
                  </div>
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                          darkMode ? 'bg-blue-900/60' : 'bg-blue-200'
                        } flex items-center justify-center mt-0.5 mr-3`}>
                          <span className={`text-xs font-bold ${
                            darkMode ? 'text-blue-400' : 'text-blue-700'
                          }`}>{index + 1}</span>
                        </div>
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Actions Footer */}
                <div className="flex justify-between pt-2">
                  <Button
                    onClick={() => {
                      setAnalysisResult(null);
                    }}
                    variant="outline"
                    className={`rounded-xl ${
                      darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300' 
                        : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Start New Analysis
                  </Button>
                  
                  <Button
                    onClick={handleClose}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Step 1: Select Resume (Dropdown) */}
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Step 1: Select a Resume
                  </h3>
                  <div className="relative">
                    <div className={`relative w-full cursor-pointer ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      
                      {/* Dropdown Select */}
                      <select
                        value={selectedResumeId}
                        onChange={(e) => handleResumeSelect(e.target.value)}
                        className={`w-full pl-12 pr-10 py-4 appearance-none rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-emerald-500' 
                            : 'bg-white border-gray-200 text-gray-800 focus:border-emerald-500'
                        }`}
                        disabled={isLoadingResume}
                      >
                        <option value="" disabled>Select a resume...</option>
                        {resumes.map((resume) => (
                          <option key={resume._id} value={resume._id}>
                            {resume.title || "Untitled Resume"}
                          </option>
                        ))}
                      </select>
                      
                      {/* Icon */}
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <div className={`p-2 rounded-lg ${
                          isLoadingResume 
                            ? darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                            : selectedResumeId
                              ? 'bg-emerald-500 text-white'
                              : darkMode
                                ? 'bg-gray-600 text-gray-400'
                                : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isLoadingResume ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      
                      {/* Dropdown arrow */}
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                    
                    {/* Additional info if a resume is selected */}
                    {selectedResumeId && (
                      <div className={`mt-2 text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last updated: {
                          new Date(resumes.find(r => r._id === selectedResumeId)?.updatedAt || new Date()).toLocaleDateString()
                        }
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Step 2: Enter Job Description */}
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Step 2: Paste Job Description
                  </h3>
                  <div>
                    <textarea
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                      placeholder="Paste the full job description here..."
                      className={`w-full h-48 p-4 rounded-xl resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                      } focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all`}
                    />
                    <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      For best results, include the complete job description with requirements and responsibilities.
                    </p>
                  </div>
                </div>
                
                {/* Step 3: Analyze Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={analyzeResume}
                    disabled={isAnalyzing || isLoadingResume || !selectedResumeId || !resumeData || jobDescription.trim().length < 50}
                    className={`px-8 py-6 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isAnalyzing ? (
                      <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Analyzing Resume...</>
                    ) : (
                      <><BarChart3 className="mr-2 h-5 w-5" /> Analyze Resume</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS keyframes for animations
const spinOrbitKeyframes = `
@keyframes spin-orbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-orbit {
  animation: spin-orbit 10s linear infinite;
}

.animate-spin-slow {
  animation: spin-slow 15s linear infinite;
}
`;

// Add the keyframes to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = spinOrbitKeyframes;
  document.head.appendChild(styleElement);
}

export default ATSScoreChecker;