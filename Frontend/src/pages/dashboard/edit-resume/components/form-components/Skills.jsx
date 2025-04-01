import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Plus, Sparkles, XCircle, Code, Database, Server, Cloud, CheckCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { AIChatSession } from "@/Services/AiModel";

const MAX_SKILL_LINES = 4;

// Categories for AI suggestions with icons
const SKILL_CATEGORIES = [
  { key: "Frontend", label: "Frontend", icon: <Code className="h-4 w-4" />, placeholder: "HTML, CSS, JavaScript, React, TypeScript, Redux..." },
  { key: "Backend", label: "Backend", icon: <Server className="h-4 w-4" />, placeholder: "Node.js, Express.js, Python, REST API, GraphQL..." },
  { key: "Database", label: "Database", icon: <Database className="h-4 w-4" />, placeholder: "MongoDB, MySQL, PostgreSQL, SQLite, Redis..." },
  { key: "DevOps", label: "DevOps/Other", icon: <Cloud className="h-4 w-4" />, placeholder: "AWS, Docker, CI/CD, Git, GitHub Actions..." }
];

const PROMPT = `Based on the job title "{jobTitle}", provide EXACTLY 4 lines of related skills. 
Format the response as a JSON object with these 4 key-value pairs:
{
  "line1": "HTML, CSS, JavaScript, React, TypeScript, Redux",
  "line2": "Node.js, Express.js, REST API, GraphQL",
  "line3": "MongoDB, PostgreSQL, Redis, Firebase",
  "line4": "Git, GitHub, Docker, AWS, CI/CD"
}

The first line should contain frontend skills, the second line backend skills, the third line database skills, and the fourth line DevOps/other skills. 
Each line should contain 4-6 related skills, comma-separated.`;

function Skills({ resumeInfo, enanbledNext }) {
  // Initialize with 4 empty lines or existing skills structured as lines
  const initializeSkillLines = () => {
    if (resumeInfo?.skills && resumeInfo.skills.length > 0) {
      // If skills exist in the resume data
      const lines = Array(MAX_SKILL_LINES).fill("");
      
      // Map existing skills to lines based on their index
      resumeInfo.skills.forEach((skill, index) => {
        if (index < MAX_SKILL_LINES && skill.name) {
          lines[index] = skill.name;
        }
      });
      
      return lines;
    }
    
    // Default to 4 empty lines
    return Array(MAX_SKILL_LINES).fill("");
  };

  const [skillLines, setSkillLines] = useState(initializeSkillLines());
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  // Update Redux store when skills change
  useEffect(() => {
    const skillsArray = skillLines
      .map((line, index) => ({ name: line.trim() }))
      .filter(skill => skill.name !== "");
    
    try {
      dispatch(addResumeData({ ...resumeInfo, skills: skillsArray }));
    } catch (error) {
      console.log("Error in skills context update", error);
    }
  }, [skillLines]);

  const handleLineChange = (index, value) => {
    const newLines = [...skillLines];
    newLines[index] = value;
    setSkillLines(newLines);
  };

  const addNewLine = () => {
    // Find the next empty line or use the last line if all are filled
    for (let i = 0; i < MAX_SKILL_LINES; i++) {
      if (!skillLines[i] || skillLines[i].trim() === "") {
        setActiveLineIndex(i);
        return;
      }
    }
    
    // If all lines are filled, focus on the last line
    setActiveLineIndex(MAX_SKILL_LINES - 1);
  };

  const onSave = () => {
    setLoading(true);
    
    // Filter out empty lines
    const skillsArray = skillLines
      .map((line, index) => ({ name: line.trim() }))
      .filter(skill => skill.name !== "");
      
    const data = {
      data: {
        skills: skillsArray,
      },
    };

    if (resume_id) {
      console.log("Started Updating Skills");
      updateThisResume(resume_id, data)
        .then(() => {
          toast("Skills updated successfully", {
            description: "Your resume skills have been saved"
          });
        })
        .catch((error) => {
          toast("Error updating skills", {
            description: error.message,
            variant: "destructive"
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const generateSkillsFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast("Job title required", {
        description: "Please add a job title in the Personal Details section to get AI suggestions",
        variant: "destructive"
      });
      return;
    }

    setAiLoading(true);
    try {
      const prompt = PROMPT.replace("{jobTitle}", resumeInfo.jobTitle);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text();
      
      try {
        const parsedResponse = JSON.parse(responseText);
        setAiSuggestions(parsedResponse);
        
        toast("AI skills generated", {
          description: `Skill suggestions for ${resumeInfo.jobTitle} are ready`,
        });
      } catch (error) {
        console.error("Error parsing AI response:", error);
        toast("Could not parse AI response", {
          description: "Try again or add skills manually",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating skills:", error);
      toast("Error generating skills", {
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = (lineIndex) => {
    if (!aiSuggestions) return;
    
    const lineKey = `line${lineIndex + 1}`;
    if (aiSuggestions[lineKey]) {
      const newLines = [...skillLines];
      newLines[lineIndex] = aiSuggestions[lineKey];
      setSkillLines(newLines);
      
      // Show success animation for this line
      toast(`Line ${lineIndex + 1} updated`, {
        description: "Skills suggestion applied"
      });
    }
  };

  const applyAllAiSuggestions = () => {
    if (!aiSuggestions) return;
    
    const newLines = [...skillLines];
    for (let i = 0; i < MAX_SKILL_LINES; i++) {
      const lineKey = `line${i + 1}`;
      if (aiSuggestions[lineKey]) {
        newLines[i] = aiSuggestions[lineKey];
      }
    }
    
    setSkillLines(newLines);
    setAiSuggestions(null); // Close suggestions after applying all
    
    toast("All suggestions applied", {
      description: "All AI suggestions have been applied to your skills"
    });
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-primary mt-10 transition-all duration-300 hover:shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="inline-block p-2 bg-primary/10 rounded-lg mr-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </span>
            Skills
          </h2>
          <p className="text-gray-600">Add your professional skills in four organized categories</p>
        </div>
        
        <Button
          onClick={generateSkillsFromAI}
          disabled={aiLoading || !resumeInfo?.jobTitle}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 px-5 py-2.5"
        >
          {aiLoading ? (
            <><LoaderCircle className="h-4 w-4 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Generate Skills with AI</>
          )}
        </Button>
      </div>
      
      {/* AI Suggestions Panel */}
      {aiSuggestions && (
        <div className="mb-8 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white rounded-lg shadow-md border border-purple-100 p-5 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" /> 
                AI Suggestions for {resumeInfo.jobTitle}
              </h3>
              <button 
                onClick={() => setAiSuggestions(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                title="Dismiss suggestions"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {Array(MAX_SKILL_LINES).fill(0).map((_, index) => {
                const lineKey = `line${index + 1}`;
                const category = SKILL_CATEGORIES[index];
                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-medium w-full sm:w-auto justify-center sm:justify-start">
                        {category.icon}
                        <span className="ml-1.5">{category.label}</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow p-3 bg-gray-50 rounded-md border border-gray-200 text-sm font-medium">
                      {aiSuggestions[lineKey] || "No suggestion"}
                    </div>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-shrink-0 border-purple-300 text-purple-700 hover:bg-purple-100 hover:text-purple-800 w-full sm:w-auto justify-center"
                      onClick={() => applyAiSuggestion(index)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Apply
                    </Button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-5 flex justify-end">
              <Button
                onClick={applyAllAiSuggestions}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm"
              >
                Apply All Suggestions
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Skill Lines Input Section */}
      <div className="space-y-5 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="grid gap-6">
          {SKILL_CATEGORIES.map((category, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                {category.icon}
                <span className="ml-2">{category.label} Skills</span>
              </label>
              <div className="relative">
                <Input
                  value={skillLines[index]}
                  onChange={(e) => handleLineChange(index, e.target.value)}
                  placeholder={category.placeholder}
                  className={`w-full py-2.5 bg-white ${
                    activeLineIndex === index 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-primary'
                  }`}
                  onFocus={() => setActiveLineIndex(index)}
                />
                {skillLines[index] && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => handleLineChange(index, "")}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              {!skillLines[index] && (
                <p className="text-xs text-gray-500">Enter comma-separated {category.label.toLowerCase()} skills</p>
              )}
            </div>
          ))}
        </div>
        
        {/* Add Line Button - only show if not all lines are filled */}
        {skillLines.some(line => !line || line.trim() === "") && (
          <Button
            variant="outline"
            onClick={addNewLine}
            className="mt-4 border-dashed border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Focus on Next Empty Line
          </Button>
        )}
      </div>
      
      {/* Preview Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <span className="p-1 bg-gray-100 rounded mr-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </span>
          Preview
        </h3>
        <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
          {skillLines.some(line => line && line.trim() !== "") ? (
            <div className="space-y-2">
              {skillLines.map((line, index) => (
                line && line.trim() !== "" ? (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10">
                        {SKILL_CATEGORIES[index].icon}
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">{line}</p>
                  </div>
                ) : null
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                <Plus className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">No skills added yet</p>
              <p className="text-gray-400 text-xs mt-1">Enter skills above or use AI suggestions</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button 
          onClick={onSave}
          disabled={loading || !skillLines.some(line => line && line.trim() !== "")}
          className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all shadow-md hover:shadow-lg text-white"
        >
          {loading ? (
            <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            "Save Skills"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Skills;