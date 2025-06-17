import React, { useMemo } from "react";
import { Calendar, GraduationCap, Award } from "lucide-react";

// Helper function to get education level weight for better sorting
const getEducationLevelWeight = (degree) => {
  if (!degree) return 0;
  
  const degreeText = degree.toLowerCase();
  
  if (degreeText.includes("phd") || degreeText.includes("doctorate")) {
    return 5;
  } else if (degreeText.includes("master") || degreeText.includes("mba") || degreeText.includes("ms") || degreeText.includes("ma")) {
    return 4;
  } else if (degreeText.includes("bachelor") || degreeText.includes("btech") || degreeText.includes("bsc") || degreeText.includes("ba")) {
    return 3;
  } else if (degreeText.includes("diploma") || degreeText.includes("associate")) {
    return 2;
  } else if (degreeText.includes("high school") || degreeText.includes("secondary") || degreeText.includes("ssc") || degreeText.includes("hsc")) {
    return 1;
  }
  
  return 0;
};

function EducationalPreview({ resumeInfo }) {
  // Sort education entries respecting the sortOrder from the form
  const sortedEducation = useMemo(() => {
    if (!resumeInfo?.education || resumeInfo.education.length === 0) {
      return [];
    }
    
    // Clone the array to avoid mutating original data
    // No need to sort if already sorted in the Education component
    return [...resumeInfo.education];
  }, [resumeInfo?.education]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      return `${month} ${year}`;
    } catch (e) {
      return "";
    }
  };

  // Helper function to generate degree description
  const getDegreeDescription = (education) => {
    let display = "";
    if (education.degree) display += education.degree;
    if (education.major) {
      if (display) display += " in ";
      display += education.major;
    }
    
    return display;
  };

  return (
    <div className="my-6">
      {sortedEducation.length > 0 && (
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2
              className="text-center font-bold text-sm"
              style={{ color: resumeInfo?.themeColor }}
            >
              EDUCATION
            </h2>
          </div>
          <hr style={{ borderColor: resumeInfo?.themeColor }} />
        </div>
      )}

      {sortedEducation.map((education, index) => (
        <div key={index} className={index === 0 ? "mt-2 mb-5" : "my-5"}>
          <h2
            className="text-sm font-bold flex items-center gap-1"
            style={{ color: resumeInfo?.themeColor }}
          >
            {education.universityName}
          </h2>
          
          <div className="flex justify-between items-start mt-1">
            <h3 className="text-xs font-medium flex-1">
              {getDegreeDescription(education)}
            </h3>
            
            {(education?.startDate || education?.endDate) && (
              <span className="text-xs text-gray-600 flex items-center whitespace-nowrap ml-2">
                <Calendar className="h-3 w-3 mr-1 inline-block" />
                {formatDate(education?.startDate)}
                {education?.startDate && education?.endDate ? " - " : null}
                {formatDate(education?.endDate)}
              </span>
            )}
          </div>
          
          {education?.grade && (
            <div className="text-xs mt-1.5 flex items-center">
              <Award className="h-3 w-3 mr-1 text-gray-500" />
              <span className="inline-flex items-center bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                {education?.gradeType}: {education?.grade}
              </span>
            </div>
          )}
          
          {education?.description && (
            <p className="text-xs mt-2 text-gray-700">{education?.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default EducationalPreview;