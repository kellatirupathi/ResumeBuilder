import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import FloatingResumeScore from "./FloatingResumeScore"; 
import { 
  ArrowLeft, 
  ArrowRight, 
  HomeIcon, 
  User, 
  FileText, 
  Briefcase, 
  FolderGit, 
  GraduationCap, 
  BadgePlus,
  CheckCircle2,
  Eye,
  ChevronRight,
  Award
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";
import CertificationsForm from "./form-components/CertificationsForm";

function ResumeForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enanbledNext, setEnabledNext] = useState(true);
  const [enanbledPrev, setEnabledPrev] = useState(true);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const { resume_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentIndex === 0) {
      setEnabledPrev(false);
    } else if (currentIndex == 1) {
      setEnabledPrev(true);
    } else if (currentIndex === 6) {
      setEnabledNext(false);
    } else {
      setEnabledNext(true);
    }
  }, [currentIndex]);

  const sections = [
    { name: "Details", icon: <User className="h-4 w-4" /> },
    { name: "Summary", icon: <FileText className="h-4 w-4" /> },
    { name: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Projects", icon: <FolderGit className="h-4 w-4" /> },
    { name: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { name: "Skills", icon: <BadgePlus className="h-4 w-4" /> },
    { name: "Certifications", icon: <Award className="h-4 w-4" /> }
  ];
  
  // Calculate completion percentage for progress bar
  const calculateProgress = () => {
    let completed = 0;
    let totalSections = 7; // Updated to include certifications
    
    if (resumeInfo?.firstName && resumeInfo?.lastName) completed++;
    if (resumeInfo?.summary) completed++;
    if (resumeInfo?.experience && resumeInfo?.experience.length > 0) completed++;
    if (resumeInfo?.projects && resumeInfo?.projects.length > 0) completed++;
    if (resumeInfo?.education && resumeInfo?.education.length > 0) completed++;
    if (resumeInfo?.skills && resumeInfo?.skills.length > 0) completed++;
    if (resumeInfo?.certifications && resumeInfo?.certifications.length > 0) completed++;
    
    return Math.round((completed / totalSections) * 100);
  };
  
  const progressPercent = calculateProgress();

  return (
    <div className="space-y-6 bg-gray-100 min-h-screen">
      {/* Progress bar at the very top */}
      <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      {/* Top section with Dashboard, Theme, completion status, and Preview/Next buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-primary hover:text-white transition-colors duration-300 px-2 border-gray-200 text-gray-700">
              <HomeIcon className="h-4 w-4" /> 
              <span className="text-xs">Dashboard</span>
            </Button>
          </Link>
          <ThemeColor resumeInfo={resumeInfo}/> 
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
            <CheckCircle2 className={`h-4 w-4 ${progressPercent === 100 ? 'text-green-500' : 'text-gray-600'}`} />
            <span>{progressPercent}% completed</span>
          </div>
        </div>
        
        {/* Preview and Next buttons with reduced width */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors duration-300 px-2 min-w-0"
            onClick={() => navigate(`/dashboard/view-resume/${resume_id}`)}
          >
            <Eye className="h-4 w-4" /> 
            <span className="text-xs">Preview</span>
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className={`flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 px-2 min-w-0 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!enanbledPrev || currentIndex === 0}
            onClick={() => {
              if (currentIndex === 0) return;
              setCurrentIndex(currentIndex - 1);
            }}
          >
            <ArrowLeft className="h-4 w-4" /> 
            <span className="text-xs">Prev</span>
          </Button>
          
          <Button
            size="sm"
            className={`flex items-center gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-sm transition-all duration-300 text-white px-2 min-w-0 ${currentIndex >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!enanbledNext || currentIndex >= 6}
            onClick={() => {
              if (currentIndex >= 6) return;
              setCurrentIndex(currentIndex + 1);
            }}
          >
            <span className="text-xs">Next</span> 
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Floating Resume Score */}
      <FloatingResumeScore resumeInfo={resumeInfo} />

      {/* Section tabs - with more compact styling */}
      <div className="hidden sm:flex justify-start overflow-x-auto py-2 no-scrollbar">
        <div className="flex items-center">
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 px-2 ${
                  currentIndex === idx 
                    ? "bg-primary text-white shadow-sm" 
                    : currentIndex > idx
                    ? "text-primary bg-gray-50"
                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                } transition-all duration-300 whitespace-nowrap rounded-md`}
                onClick={() => setCurrentIndex(idx)}
              >
                {section.icon}
                <span className="text-xs font-medium">{section.name}</span>
              </Button>
              
              {idx < sections.length - 1 && (
                <ChevronRight className={`h-4 w-4 mx-1 ${
                  currentIndex > idx ? "text-primary" : "text-gray-300"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Mobile stepper indicator */}
      <div className="sm:hidden flex justify-between items-center px-4 py-2">
        <div className="flex space-x-1">
          {sections.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-primary' 
                  : idx < currentIndex 
                    ? 'bg-primary/40' 
                    : 'bg-gray-700'
              }`}
              onClick={() => setCurrentIndex(idx)}
            ></div>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          Step {currentIndex + 1} of 7
        </div>
      </div>

      {/* Form sections with max-width to constrain content */}
      <div className="transition-all duration-500 transform max-w-3xl mx-auto">
        <div className={`${currentIndex === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full'} transition-all duration-500`}>
          {currentIndex === 0 && (
            <PersonalDetails
              resumeInfo={resumeInfo}
              enanbledNext={setEnabledNext}
            />
          )}
        </div>
        <div className={`${currentIndex === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full'} transition-all duration-500`}>
          {currentIndex === 1 && (
            <Summary
              resumeInfo={resumeInfo}
              enanbledNext={setEnabledNext}
              enanbledPrev={setEnabledPrev}
            />
          )}
        </div>
        <div className={`${currentIndex === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full'} transition-all duration-500`}>
          {currentIndex === 2 && (
            <Experience
              resumeInfo={resumeInfo}
              enanbledNext={setEnabledNext}
              enanbledPrev={setEnabledPrev}
            />
          )}
        </div>
        <div className={`${currentIndex === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full'} transition-all duration-500`}>
          {currentIndex === 3 && (
            <Project
              resumeInfo={resumeInfo}
              setEnabledNext={setEnabledNext}
              setEnabledPrev={setEnabledPrev}
            />
          )}
        </div>
        <div className={`${currentIndex === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full'} transition-all duration-500`}>
          {currentIndex === 4 && (
            <Education
              resumeInfo={resumeInfo}
              enanbledNext={setEnabledNext}
              enabledPrev={setEnabledPrev}
            />
          )}
        </div>
        <div className={`${currentIndex === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full'} transition-all duration-500`}>
          {currentIndex === 5 && (
            <Skills
              resumeInfo={resumeInfo}
              enanbledNext={setEnabledNext}
              enanbledPrev={setEnabledNext}
            />
          )}
        </div>
        <div className={`${currentIndex === 6 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full'} transition-all duration-500`}>
          {currentIndex === 6 && (
            <CertificationsForm
              resumeInfo={resumeInfo}
              enanbledNext={setEnabledNext}
              enanbledPrev={setEnabledPrev}
            />
          )}
        </div>
      </div>

      {/* Mobile navigation buttons with reduced width */}
      <div className="flex justify-between mt-6 sm:hidden bg-white p-4 rounded-lg shadow-md fixed bottom-0 left-0 right-0 z-10 border-t border-gray-100">
        <Button
          size="sm"
          variant="outline"
          className={`flex items-center gap-1 border-primary text-primary px-2 min-w-0 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!enanbledPrev || currentIndex === 0}
          onClick={() => {
            if (currentIndex === 0) return;
            setCurrentIndex(currentIndex - 1);
          }}
        >
          <ArrowLeft className="h-4 w-4" /> <span className="text-xs">Prev</span>
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1 border-green-500 text-green-600 px-2 min-w-0"
          onClick={() => navigate(`/dashboard/view-resume/${resume_id}`)}
        >
          <Eye className="h-4 w-4" /> <span className="text-xs">Preview</span>
        </Button>
        
        <Button
          size="sm"
          className={`flex items-center gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-sm transition-all duration-300 text-white px-2 min-w-0 ${currentIndex >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!enanbledNext || currentIndex >= 6}
          onClick={() => {
            if (currentIndex >= 6) return;
            setCurrentIndex(currentIndex + 1);
          }}
        >
          <span className="text-xs">Next</span> <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Extra bottom padding on mobile to account for fixed nav */}
      <div className="h-16 sm:hidden"></div>
    </div>
  );
}

export default ResumeForm;