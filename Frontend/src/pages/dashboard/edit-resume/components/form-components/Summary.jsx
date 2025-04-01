import React, { useState, useEffect } from "react";
import { Sparkles, LoaderCircle, BookOpen, FileText, CheckCircle, ThumbsUp, LightbulbIcon, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

// AI prompt for generating summaries based on job title
const PROMPT = `Create a JSON object with 3 professional summaries for a {jobTitle} position, with the following structure:
{
  "summaries": [
    {
      "level": "Entry Level",
      "text": "Enthusiastic and technically skilled {jobTitle} with foundational knowledge in [relevant technologies]..."
    },
    {
      "level": "Mid Level",
      "text": "Results-driven {jobTitle} with [X] years of experience developing and implementing..."
    },
    {
      "level": "Senior Level",
      "text": "Accomplished {jobTitle} with extensive experience leading projects and teams..."
    }
  ]
}

Each summary should be 3-4 sentences, professionally written, and focused on key skills and achievements relevant to the role. 
Avoid clichés and generic statements. Focus on specific, relevant technical skills and measurable accomplishments.`;

// Tips for writing good summaries
const SUMMARY_TIPS = [
  "Keep it concise (3-4 sentences)",
  "Focus on your most relevant skills and achievements",
  "Tailor it to the specific job you're applying for",
  "Include keywords from the job description",
  "Quantify accomplishments where possible",
  "Avoid generic statements and clichés"
];

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSummaries, setAiSummaries] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const { resume_id } = useParams();

  // Character count
  const charCount = summary ? summary.length : 0;
  const idealCharRange = {min: 300, max: 600};
  const charCountStatus = 
    charCount === 0 ? "empty" :
    charCount < idealCharRange.min ? "tooShort" :
    charCount > idealCharRange.max ? "tooLong" : "good";

  // Update Redux when summary changes
  useEffect(() => {
    dispatch(
      addResumeData({
        ...resumeInfo,
        summary: summary,
      })
    );
  }, [summary]);

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    setSummary(e.target.value);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = {
      data: { summary },
    };
    
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => {
          toast("Summary Updated", { 
            description: "Your professional summary has been saved successfully"
          });
        })
        .catch((error) => {
          toast("Update Failed", { 
            description: error.message, 
            variant: "destructive" 
          });
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  const generateSummariesFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast("Job Title Required", {
        description: "Please add a job title in the Personal Details section",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      const prompt = PROMPT.replace(/\{jobTitle\}/g, resumeInfo?.jobTitle);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text();
      
      try {
        const parsedResponse = JSON.parse(responseText);
        setAiSummaries(parsedResponse.summaries);
        
        toast("AI Summaries Generated", {
          description: `Generated summaries for ${resumeInfo?.jobTitle} position`,
        });
      } catch (error) {
        toast("Parsing Error", {
          description: "Error processing AI response",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast("Generation Failed", {
        description: error.message || "An error occurred while generating summaries",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const applySummary = (text) => {
    setSummary(text);
    toast("Summary Applied", {
      description: "You can still edit the text to personalize it further"
    });
  };

  // Helper function to get character count styling
  const getCharCountStyle = () => {
    if (charCountStatus === "empty") return "text-gray-400";
    if (charCountStatus === "tooShort") return "text-amber-500";
    if (charCountStatus === "tooLong") return "text-red-500";
    return "text-green-500";
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-primary mt-10 transition-all duration-300 hover:shadow-lg">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="inline-block p-2 bg-primary/10 rounded-lg mr-2">
              <FileText className="h-5 w-5 text-primary" />
            </span>
            Professional Summary
          </h2>
          <p className="text-gray-600">Create a compelling overview of your skills and experience</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTips(!showTips)}
            className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
          >
            <LightbulbIcon className="h-4 w-4 mr-1.5" /> Writing Tips
          </Button>
          
          <Button
            onClick={generateSummariesFromAI}
            disabled={aiGenerating || !resumeInfo?.jobTitle}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            {aiGenerating ? (
              <><LoaderCircle className="h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate with AI</>
            )}
          </Button>
        </div>
      </div>
      
      {/* Writing tips */}
      {showTips && (
        <div className="mb-8 bg-amber-50 rounded-lg border border-amber-200 p-5">
          <div className="flex items-start mb-3">
            <LightbulbIcon className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <h3 className="font-semibold text-amber-800">Tips for Writing an Effective Summary</h3>
          </div>
          
          <ul className="space-y-2 pl-8">
            {SUMMARY_TIPS.map((tip, index) => (
              <li key={index} className="text-amber-700 text-sm list-disc">
                {tip}
              </li>
            ))}
          </ul>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setShowTips(false)}
              className="text-amber-700 text-sm hover:text-amber-900 flex items-center"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Got it
            </button>
          </div>
        </div>
      )}
      
      {/* Main form */}
      <form onSubmit={onSave} className="space-y-6">
        {/* Summary input field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <BookOpen className="h-4 w-4 mr-1.5 text-gray-400" />
              Your Professional Summary
            </label>
            
            <div className={`text-xs ${getCharCountStyle()}`}>
              {charCount} / {idealCharRange.min}-{idealCharRange.max} characters
              {charCountStatus === "tooShort" && " (Add more detail)"}
              {charCountStatus === "tooLong" && " (Consider shortening)"}
              {charCountStatus === "good" && (
                <span className="flex items-center ml-1">
                  <ThumbsUp className="h-3 w-3 inline mr-1" /> Good length
                </span>
              )}
            </div>
          </div>
          
          <Textarea
            name="summary"
            value={summary}
            onChange={handleInputChange}
            className="min-h-40 resize-y border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
            placeholder="Describe your professional background, key skills, and what makes you stand out in your field. For best results, keep this between 300-600 characters."
          />
        </div>
        
        {/* Character count indicator */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              charCountStatus === "empty" ? "bg-gray-400" :
              charCountStatus === "tooShort" ? "bg-amber-500" :
              charCountStatus === "tooLong" ? "bg-red-500" :
              "bg-green-500"
            }`}
            style={{
              width: charCount === 0 ? '0%' : 
                    charCount < idealCharRange.min ? `${(charCount / idealCharRange.min) * 80}%` : 
                    '100%'
            }}
          ></div>
        </div>
        
        {/* Save button - now above AI suggestions */}
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={loading || !summary.trim()}
            className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all shadow-md hover:shadow-lg text-white"
          >
            {loading ? (
              <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Save Summary"
            )}
          </Button>
        </div>
      </form>
      
      {/* AI Suggestions - now at the bottom, after the save button */}
      {aiSummaries && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium text-gray-800 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-purple-500" /> 
              AI-Generated Summaries
            </h3>
            <button 
              onClick={() => setAiSummaries(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Dismiss suggestions"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {aiSummaries.map((summaryItem, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border transition-all ${
                  selectedLevel === index 
                    ? "border-purple-500 bg-purple-50" 
                    : "border-gray-200 hover:border-purple-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-medium">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {summaryItem.level}
                  </div>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedLevel(index);
                      applySummary(summaryItem.text);
                    }}
                    className="h-7 px-2 text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
                  >
                    {selectedLevel === index ? (
                      <><CheckCircle className="h-3 w-3 mr-1.5" /> Applied</>
                    ) : (
                      "Use This"
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {summaryItem.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;