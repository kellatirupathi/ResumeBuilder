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
  FolderGit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIChatSession } from "@/Services/AiModel";
import { toast } from "sonner";

const ResumeScore = ({ resumeInfo }) => {
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // More accurate calculation of initial score
  const calculateInitialScore = () => {
    // Initial score structure
    const scores = {
      personal: 0,
      summary: 0,
      experience: 0,
      education: 0,
      skills: 0,
      projects: 0,
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
    scores.personal = Math.round((filledPersonalFields / personalFields.length) * 100);
    
    // Summary - check if exists and has reasonable length
    if (resumeInfo.summary && resumeInfo.summary.trim()) {
      const summaryLength = resumeInfo.summary.trim().length;
      if (summaryLength > 300) scores.summary = 95;
      else if (summaryLength > 200) scores.summary = 85;
      else if (summaryLength > 100) scores.summary = 75;
      else scores.summary = 60;
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
    }
    
    // Calculate total score - weighted average of all sections
    const weights = {
      personal: 0.15,
      summary: 0.15,
      experience: 0.25,
      education: 0.15,
      skills: 0.15,
      projects: 0.15
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
    
    if (scores.summary < 70) {
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
    
    if (!resumeInfo.skills || resumeInfo.skills.length < 5) {
      scores.feedback.push("Add more skills relevant to your target job to highlight your expertise");
    }
    
    if (!resumeInfo.projects || resumeInfo.projects.length === 0) {
      scores.feedback.push("Include projects to demonstrate your practical experience");
    } else if (scores.projects < 70) {
      scores.feedback.push("Add more details to your projects, including technologies used and your role");
    }
    
    return scores;
  };

  const getAIAnalysis = async () => {
    setLoading(true);
    try {
      // Calculate initial scores for reference
      const initialScores = calculateInitialScore();
      setScoreData(initialScores);
      
      // Create improved prompt for Gemini with more accurate analysis
      const prompt = `
      I need you to analyze this resume data and provide a detailed evaluation with specific, accurate percentage scores.
      
      The resume belongs to a job seeker and contains the following data:
      ${JSON.stringify(resumeInfo, null, 2)}
      
      Please analyze each section carefully and provide scores based on completeness, quality, and impact:
      
      For Personal Details:
      - Score 40-60% if only basic fields are filled 
      - Score 70-80% if most fields are complete
      - Score 90-100% if all fields are complete with professional contact information
      
      For Professional Summary:
      - Score based on length, specificity, relevance, and impact
      - Evaluate whether it effectively communicates career goals and value proposition
      
      For Work Experience:
      - Evaluate based on number of entries, detail level, use of action verbs, and quantifiable achievements
      - Higher scores for comprehensive descriptions with metrics and results
      
      For Education:
      - Score based on completeness of degree information, dates, and relevant details
      
      For Skills:
      - Evaluate based on number of skills, relevance, organization, and rating consistency
      
      For Projects:
      - Score based on detail level, technology descriptions, and connection to skills
      
      Format your response exactly as a valid JSON object with the following structure:
      {
        "scores": {
          "personal": [0-100 number],
          "summary": [0-100 number],
          "experience": [0-100 number],
          "education": [0-100 number],
          "skills": [0-100 number],
          "projects": [0-100 number],
          "totalScore": [0-100 number]
        },
        "analysis": {
          "strengths": [array of specific strengths found in this resume],
          "weaknesses": [array of specific areas for improvement]
        },
        "suggestions": [array of specific, actionable improvement suggestions]
      }
      
      Ensure your scores are fair but realistic reflections of the resume quality. The overall totalScore should be a weighted average (personal 15%, summary 15%, experience 25%, education 15%, skills 15%, projects 15%).
      `;
      
      // Call Gemini API
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
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!resumeInfo) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${getScoreColor(scoreData?.totalScore || 0)} bg-opacity-10`}>
            <FileCheck className={`h-5 w-5 ${getScoreColor(scoreData?.totalScore || 0).replace('bg-', 'text-')}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Resume Score</h3>
            <p className="text-sm text-gray-500">
              {analyzed ? "AI-powered resume analysis" : "Initial resume evaluation"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">{scoreData?.totalScore || 0}</span>
              <span className="text-sm text-gray-500">/100</span>
            </div>
            <div className="text-xs text-gray-500">
              {scoreData?.totalScore >= 90 ? "Excellent" : 
               scoreData?.totalScore >= 80 ? "Very Good" : 
               scoreData?.totalScore >= 70 ? "Good" : 
               scoreData?.totalScore >= 60 ? "Fair" : "Needs Work"}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            className="text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="flex justify-between mb-3">
              <h4 className="font-medium text-gray-700 flex items-center gap-1">
                <BarChart className="h-4 w-4 text-gray-500" />
                Section Scores
              </h4>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs flex items-center gap-1"
                onClick={getAIAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <><RefreshCw className="h-3 w-3 animate-spin" /> Analyzing...</>
                ) : (
                  <><TrendingUp className="h-3 w-3" /> {analyzed ? "Refresh Analysis" : "Analyze with AI"}</>
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Personal Details", key: "personal", icon: <Award className="h-4 w-4" /> },
                { name: "Professional Summary", key: "summary", icon: <Info className="h-4 w-4" /> },
                { name: "Work Experience", key: "experience", icon: <Briefcase className="h-4 w-4" /> },
                { name: "Education", key: "education", icon: <GraduationCap className="h-4 w-4" /> },
                { name: "Skills", key: "skills", icon: <CheckCircle className="h-4 w-4" /> },
                { name: "Projects", key: "projects", icon: <FolderGit className="h-4 w-4" /> }
              ].map((section) => (
                <div key={section.key} className="flex items-center gap-2">
                  <div className="w-36 flex items-center gap-1 text-sm text-gray-600">
                    {section.icon}
                    <span>{section.name}</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreColor(scoreData?.[section.key] || 0)} transition-all duration-500 ease-out`}
                        style={{ width: `${scoreData?.[section.key] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm font-medium">
                    {scoreData?.[section.key] || 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Resume Strengths */}
          {analyzed && scoreData?.analysis?.strengths && scoreData.analysis.strengths.length > 0 && (
            <div className="mt-4 bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Resume Strengths
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {scoreData.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="min-w-4 pt-0.5">•</div>
                    <div>{strength}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Suggestions and Feedback */}
          {(scoreData?.suggestions || scoreData?.analysis?.weaknesses || scoreData?.feedback) && (
            <div className="mt-4 bg-amber-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                How to Improve
              </h4>
              
              <ul className="text-sm text-gray-600 space-y-1">
                {analyzed && scoreData?.suggestions ? (
                  // AI-generated suggestions
                  scoreData.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="min-w-4 pt-0.5">•</div>
                      <div>{suggestion}</div>
                    </li>
                  ))
                ) : analyzed && scoreData?.analysis?.weaknesses ? (
                  // AI-generated weaknesses
                  scoreData.analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="min-w-4 pt-0.5">•</div>
                      <div>{weakness}</div>
                    </li>
                  ))
                ) : (
                  // Basic feedback
                  scoreData?.feedback?.map((feedback, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="min-w-4 pt-0.5">•</div>
                      <div>{feedback}</div>
                    </li>
                  ))
                )}
              </ul>
              
              {!analyzed && (
                <div className="mt-3 text-sm text-amber-700 bg-amber-100 p-2 rounded">
                  <p className="flex items-center gap-1"><Info className="h-4 w-4" /> For more detailed analysis, click "Analyze with AI" above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeScore;