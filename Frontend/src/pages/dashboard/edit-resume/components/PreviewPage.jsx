import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PersonalDeatailPreview from "./preview-components/PersonalDeatailPreview";
import SummeryPreview from "./preview-components/SummaryPreview";
import ExperiencePreview from "./preview-components/ExperiencePreview";
import EducationalPreview from "./preview-components/EducationalPreview";
import SkillsPreview from "./preview-components/SkillsPreview";
import ProjectPreview from "./preview-components/ProjectPreview";
import CertificationsPreview from "./preview-components/CertificationsPreview";

// Modern template - Default style with primary color accent
const ModernTemplate = ({ resumeInfo }) => {
  return (
    <div
      className="shadow-xl bg-white h-full p-5 pt-6 border-t-[0.5px] rounded-md"
      style={{
        borderColor: resumeInfo?.themeColor ? resumeInfo.themeColor : "#059669",
      }}
    >
      <PersonalDeatailPreview resumeInfo={resumeInfo} />
      <SummeryPreview resumeInfo={resumeInfo} />
      {resumeInfo?.experience && resumeInfo.experience.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
      {resumeInfo?.projects && resumeInfo.projects.length > 0 && <ProjectPreview resumeInfo={resumeInfo} />}
      {resumeInfo?.education && resumeInfo.education.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
      {resumeInfo?.skills && resumeInfo.skills.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
      {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && <CertificationsPreview resumeInfo={resumeInfo} />}

    </div>
  );
};

// Professional template - Enhanced executive layout
const ProfessionalTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#2563eb";
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Header Section - Name and Title with background color */}
      <div 
        className="p-8 text-white relative"
        style={{ backgroundColor: themeColor }}
      >
        {/* Decorative design elements */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 w-60 h-20 rounded-full bg-white/5"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">
            {resumeInfo?.firstName} {resumeInfo?.lastName}
          </h1>
          <h2 className="text-xl mt-1 font-light tracking-wide opacity-90">
            {resumeInfo?.jobTitle}
          </h2>
        </div>
      </div>
      
      {/* Contact Information Strip */}
      <div className="bg-gray-100 p-4 flex flex-wrap justify-center gap-4 text-sm border-b border-gray-200">
        {resumeInfo?.email && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{resumeInfo.email}</span>
          </div>
        )}
        
        {resumeInfo?.phone && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{resumeInfo.phone}</span>
          </div>
        )}
        
        {resumeInfo?.address && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{resumeInfo.address}</span>
          </div>
        )}
        
        {/* Social Links */}
        {resumeInfo?.linkedinUrl && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
            </svg>
            <a href={formatUrl(resumeInfo.linkedinUrl)} target="_blank" rel="noopener noreferrer" 
              className="hover:underline" style={{ color: themeColor }}>
              LinkedIn
            </a>
          </div>
        )}
        
        {resumeInfo?.githubUrl && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <a href={formatUrl(resumeInfo.githubUrl)} target="_blank" rel="noopener noreferrer"
              className="hover:underline" style={{ color: themeColor }}>
              GitHub
            </a>
          </div>
        )}
        
        {resumeInfo?.portfolioUrl && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <a href={formatUrl(resumeInfo.portfolioUrl)} target="_blank" rel="noopener noreferrer"
              className="hover:underline" style={{ color: themeColor }}>
              Portfolio
            </a>
          </div>
        )}
      </div>
      
      {/* Main Content - Two Column Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Wider for main content */}
        <div className="md:w-2/3 p-6">
          {/* Summary Section */}
          {resumeInfo?.summary && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" style={{ borderColor: `${themeColor}40` }}>
                <span style={{ color: themeColor }}>PROFESSIONAL SUMMARY</span>
              </h3>
              <p className="text-sm leading-relaxed text-gray-700">{resumeInfo.summary}</p>
            </div>
          )}
          
          {/* Experience Section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 pb-2 border-b-2" style={{ borderColor: `${themeColor}40` }}>
                <span style={{ color: themeColor }}>WORK EXPERIENCE</span>
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full" style={{ 
                    borderLeft: `2px solid ${themeColor}30`,
                    paddingLeft: "1.5rem",
                    marginLeft: "0.25rem",
                  }}>
                    <div className="absolute top-0 left-0 w-3 h-3 rounded-full mt-1.5 -ml-1.5" style={{ backgroundColor: themeColor }}></div>
                    
                    <h4 className="text-base font-bold" style={{ color: themeColor }}>{exp.title}</h4>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-sm font-medium">
                        {exp.companyName}{exp.city && exp.companyName ? ", " : ""}{exp.city}
                        {exp.state && (exp.city || exp.companyName) ? ", " : ""}{exp.state}
                      </h5>
                      <span className="text-xs text-gray-600">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                        {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects Section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 pb-2 border-b-2" style={{ borderColor: `${themeColor}40` }}>
                <span style={{ color: themeColor }}>PROJECTS</span>
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.projects.map((project, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base font-bold" style={{ color: themeColor }}>{project.projectName}</h4>
                      <div className="flex gap-3">
                        {project?.githubLink && (
                          <a href={formatUrl(project.githubLink)} target="_blank" rel="noopener noreferrer" 
                            className="text-xs hover:underline flex items-center" style={{ color: themeColor }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Code
                          </a>
                        )}
                        {project?.deployedLink && (
                          <a href={formatUrl(project.deployedLink)} target="_blank" rel="noopener noreferrer" 
                            className="text-xs hover:underline flex items-center" style={{ color: themeColor }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <p className="text-xs mb-2 inline-block px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                        <span className="font-semibold">Technologies:</span> {project.techStack}
                      </p>
                    )}
                    
                    <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications Section */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b-2" style={{ borderColor: `${themeColor}40` }}>
                <span style={{ color: themeColor }}>CERTIFICATIONS</span>
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.certifications.map((cert, index) => (
                  <div key={index} className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full" style={{ 
                    borderLeft: `2px solid ${themeColor}30`,
                    paddingLeft: "1.5rem",
                    marginLeft: "0.25rem",
                  }}>
                    <div className="absolute top-0 left-0 w-3 h-3 rounded-full mt-1.5 -ml-1.5" style={{ backgroundColor: themeColor }}></div>
                    
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-bold" style={{ color: themeColor }}>{cert.name}</h4>
                      {cert.date && (
                        <span className="text-xs text-gray-600">{cert.date}</span>
                      )}
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      {cert.issuer}
                    </h5>
                    
                    {cert.description && (
                      <p className="text-sm text-gray-600">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Narrower for skills, education, etc. */}
        <div className="md:w-1/3 p-6 bg-gray-50">
          {/* Skills Section */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 pb-2 border-b-2" style={{ borderColor: `${themeColor}40` }}>
                <span style={{ color: themeColor }}>SKILLS</span>
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {resumeInfo.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-block text-xs px-3 py-1.5 rounded-full border"
                    style={{ 
                      backgroundColor: `${themeColor}10`,
                      borderColor: `${themeColor}30`,
                      color: `${themeColor}`
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b-2" style={{ borderColor: `${themeColor}40` }}>
                <span style={{ color: themeColor }}>EDUCATION</span>
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-base font-medium" style={{ color: themeColor }}>{edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}</h4>
                    <h5 className="text-sm font-medium mb-1">{edu.universityName}</h5>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600">
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      {edu.grade && (
                        <span className="text-xs text-gray-600">
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-700">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Creative Template - Modern and artistic design
const CreativeTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#9333ea"; // Default to purple
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Artistic header design */}
      <div className="relative">
        {/* Background gradient band */}
        <div 
          className="h-28 w-full"
          style={{ 
            background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}99 60%, ${themeColor}55 100%)` 
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-6 right-8 w-16 h-16 rounded-full" style={{ background: `${themeColor}33` }}></div>
          <div className="absolute top-10 right-20 w-8 h-8 rounded-full" style={{ background: `${themeColor}22` }}></div>
          <div className="absolute bottom-2 left-10 w-20 h-3 rounded-full" style={{ background: `${themeColor}22` }}></div>
        </div>
        
        {/* Profile content - overlapping design */}
        <div className="absolute -bottom-16 left-6 right-6 flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg px-6 py-4">
          {/* Profile photo placeholder - circle with user's initials */}
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold -mt-10 mb-2 md:mb-0 md:mt-0 shadow-md"
            style={{ backgroundColor: themeColor }}
          >
            {resumeInfo?.firstName?.charAt(0) || ""}
            {resumeInfo?.lastName?.charAt(0) || ""}
          </div>
          
          {/* Name and title */}
          <div className="md:ml-6 text-center md:text-left flex-grow">
            <h1 className="text-2xl font-bold tracking-tight">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-lg font-light" style={{ color: themeColor }}>
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact info badges */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-3 md:mt-0">
            {resumeInfo?.email && (
              <div 
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: `${themeColor}10` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{resumeInfo.email}</span>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div 
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: `${themeColor}10` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div 
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: `${themeColor}10` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content with margin to account for overlapping header */}
      <div className="mt-20 px-6 pb-6">
        {/* Social links row */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-xs hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
              LinkedIn
            </a>
          )}
          
          {resumeInfo?.githubUrl && (
            <a 
              href={formatUrl(resumeInfo.githubUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-xs hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-xs hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Portfolio
            </a>
          )}
        </div>
        
        {/* Summary Section with artistic border */}
        {resumeInfo?.summary && (
          <div className="mb-8 pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: themeColor }}></div>
            <p className="text-sm leading-relaxed text-gray-700 italic">"{resumeInfo.summary}"</p>
          </div>
        )}
        
        {/* Main two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left column - Experience and Projects */}
          <div className="md:col-span-3">
            {/* Experience Section */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
              <div className="mb-8">
                <h3 
                  className="text-lg font-bold mb-4 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  EXPERIENCE
                </h3>
                
                <div className="space-y-5">
                  {resumeInfo.experience.map((exp, index) => (
                    <div key={index} className="p-4 rounded-md" style={{ backgroundColor: `${themeColor}05` }}>
                      <div className="flex justify-between flex-wrap">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>{exp.title}</h4>
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full" style={{ color: themeColor, border: `1px solid ${themeColor}20` }}>
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                          {exp.currentlyWorking ? "Present" : exp.endDate}
                        </span>
                      </div>
                      
                      <h5 className="text-sm font-medium mb-2">
                        {exp.companyName}
                        {(exp.city || exp.state) && exp.companyName ? " | " : ""}
                        {exp.city}
                        {exp.city && exp.state ? ", " : ""}
                        {exp.state}
                      </h5>
                      
                      <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Projects Section */}
            {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
              <div className="mb-8">
                <h3 
                  className="text-lg font-bold mb-4 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  PROJECTS
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.projects.map((project, index) => (
                    <div key={index} className="p-4 rounded-md" style={{ backgroundColor: `${themeColor}05` }}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>{project.projectName}</h4>
                        <div className="flex gap-2">
                          {project?.githubLink && (
                            <a 
                              href={formatUrl(project.githubLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs px-2 py-0.5 rounded-full flex items-center bg-white"
                              style={{ color: themeColor, border: `1px solid ${themeColor}20` }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              Code
                            </a>
                          )}
                          {project?.deployedLink && (
                            <a 
                              href={formatUrl(project.deployedLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs px-2 py-0.5 rounded-full flex items-center bg-white"
                              style={{ color: themeColor, border: `1px solid ${themeColor}20` }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {project.techStack && (
                        <p className="text-xs my-2">
                          <span className="font-semibold" style={{ color: themeColor }}>Technologies:</span> {project.techStack}
                        </p>
                      )}
                      
                      <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications Section - Added for Creative template */}
            {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
              <div>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  CERTIFICATIONS
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.certifications.map((cert, index) => (
                    <div key={index} className="p-4 rounded-md" style={{ backgroundColor: `${themeColor}05` }}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>{cert.name}</h4>
                        {cert.date && (
                          <span className="text-xs bg-white px-2 py-0.5 rounded-full" style={{ color: themeColor, border: `1px solid ${themeColor}20` }}>
                            {cert.date}
                          </span>
                        )}
                      </div>
                      
                      <h5 className="text-sm font-medium mb-1">{cert.issuer}</h5>
                      
                      {cert.description && (
                        <p className="text-sm text-gray-700 mt-1">{cert.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Education and Skills */}
          <div className="md:col-span-2">
            {/* Education Section */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
              <div className="mb-8">
                <h3 
                  className="text-lg font-bold mb-4 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  EDUCATION
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.education.map((edu, index) => (
                    <div key={index} className="p-4 rounded-md" style={{ backgroundColor: `${themeColor}05` }}>
                      <h4 className="text-base font-bold" style={{ color: themeColor }}>
                        {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                      </h4>
                      <h5 className="text-sm font-medium">{edu.universityName}</h5>
                      
                      <div className="flex flex-wrap justify-between mt-1 mb-2 text-xs">
                        <span className="text-gray-600">
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </span>
                        {edu.grade && (
                          <span className="px-2 py-0.5 rounded-full bg-white" style={{ color: themeColor, border: `1px solid ${themeColor}20` }}>
                            {edu.gradeType}: {edu.grade}
                          </span>
                        )}
                      </div>
                      
                      {edu.description && (
                        <p className="text-xs text-gray-700">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Skills Section with artistic pills */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
              <div>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  SKILLS
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {resumeInfo.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 rounded-full text-xs"
                      style={{ 
                        backgroundColor: index % 2 === 0 ? themeColor : 'white',
                        color: index % 2 === 0 ? 'white' : themeColor,
                        border: index % 2 === 0 ? 'none' : `1px solid ${themeColor}`
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimalist Template - Clean, simple, elegant
const MinimalistTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#111827"; // Default to dark gray
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden p-8">
      {/* Header - Very minimal with just name and title */}
      <div className="text-center mb-8 pb-6 border-b" style={{ borderColor: "#f3f4f6" }}>
        <h1 className="text-3xl font-light tracking-wide uppercase mb-1" style={{ color: themeColor }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
          {resumeInfo?.jobTitle}
        </h2>
        
        {/* Contact and social - simple line */}
        <div className="flex flex-wrap justify-center gap-4 mt-5 text-xs text-gray-500">
          {resumeInfo?.phone && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {resumeInfo.phone}
            </span>
          )}
          
          {resumeInfo?.email && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {resumeInfo.email}
            </span>
          )}
          
          {resumeInfo?.address && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {resumeInfo.address}
            </span>
          )}
          
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
              LinkedIn
            </a>
          )}
          
          {resumeInfo?.githubUrl && (
            <a 
              href={formatUrl(resumeInfo.githubUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Portfolio
            </a>
          )}
        </div>
      </div>
      
      {/* Summary - elegant simple paragraph */}
      {resumeInfo?.summary && (
        <div className="mb-8">
          <p className="text-sm leading-relaxed text-gray-700">{resumeInfo.summary}</p>
        </div>
      )}
      
      {/* Clean two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left sidebar - skills and education */}
        <div>
          {/* Skills Section */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: themeColor }}>
                Skills
              </h3>
              
              <div className="space-y-2">
                {resumeInfo.skills.map((skill, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: themeColor }}>
                Education
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-800">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    <h5 className="text-xs mt-1 mb-1 text-gray-600">{edu.universityName}</h5>
                    
                    <div className="text-xs text-gray-500">
                      {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                      {edu.endDate}
                    </div>
                    
                    {edu.grade && (
                      <div className="text-xs text-gray-600 mt-1">
                        {edu.gradeType}: {edu.grade}
                      </div>
                    )}
                    
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications Section - Added for Minimalist template */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: themeColor }}>
                Certifications
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.certifications.map((cert, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-800">
                      {cert.name}
                    </h4>
                    <h5 className="text-xs mt-1 mb-1 text-gray-600">{cert.issuer}</h5>
                    
                    {cert.date && (
                      <div className="text-xs text-gray-500">
                        {cert.date}
                      </div>
                    )}
                    
                    {cert.description && (
                      <p className="text-xs text-gray-600 mt-2">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Main content - experience and projects */}
        <div className="md:col-span-2">
          {/* Experience Section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: themeColor }}>
                Experience
              </h3>
              
              <div className="space-y-6">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex flex-wrap justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {exp.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                        {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    
                    <h5 className="text-xs text-gray-600 mb-3">
                      {exp.companyName}
                      {(exp.city || exp.state) && exp.companyName ? " | " : ""}
                      {exp.city}
                      {exp.city && exp.state ? ", " : ""}
                      {exp.state}
                    </h5>
                    
                    <div className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects Section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: themeColor }}>
                Projects
              </h3>
              
              <div className="space-y-6">
                {resumeInfo.projects.map((project, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex flex-wrap justify-between items-start mb-1">
                      <h4 className="text-sm font-medium text-gray-800">{project.projectName}</h4>
                      <div className="flex gap-3 text-xs">
                        {project?.githubLink && (
                          <a 
                            href={formatUrl(project.githubLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                            style={{ color: themeColor }}
                          >
                            Code
                          </a>
                        )}
                        {project?.deployedLink && (
                          <a 
                            href={formatUrl(project.deployedLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                            style={{ color: themeColor }}
                          >
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <p className="text-xs text-gray-500 mb-2">
                        <span className="font-medium">Technologies:</span> {project.techStack}
                      </p>
                    )}
                    
                    <div className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function PreviewPage() {
  const resumeData = useSelector((state) => state.editResume.resumeData);
  
  useEffect(() => {
    console.log("PreviewPage rendered with template:", resumeData?.template);
  }, [resumeData]);
  
  // If no data yet, show placeholder
  if (!resumeData) {
    return (
      <div className="shadow-xl bg-white h-full min-h-[800px] p-5 rounded-md flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-pulse">Loading resume data...</div>
        </div>
      </div>
    );
  }
  

  // Executive Template - For senior professionals with elegant styling
  const ExecutiveTemplate = ({ resumeInfo }) => {
    // Helper function to format URLs
    const formatUrl = (url) => {
      if (!url) return null;
      if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
      }
      return url;
    };
  
    const themeColor = resumeInfo?.themeColor || "#1c2434"; // Default to a deep navy
    
    return (
      <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
        {/* Header with initials and name */}
        <div className="flex items-start">
          {/* Left sidebar with initials and contact */}
          <div className="w-1/4 bg-gray-50 min-h-screen py-8 px-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white mb-6 mx-auto"
              style={{ backgroundColor: themeColor }}
            >
              <span className="text-xl font-bold">
                {resumeInfo?.firstName?.charAt(0) || ""}
                {resumeInfo?.lastName?.charAt(0) || ""}
              </span>
            </div>
            
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
                  Contact
                </h3>
                
                {resumeInfo?.phone && (
                  <div className="flex gap-2 items-start text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{resumeInfo.phone}</span>
                  </div>
                )}
                
                {resumeInfo?.email && (
                  <div className="flex gap-2 items-start text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{resumeInfo.email}</span>
                  </div>
                )}
                
                {resumeInfo?.address && (
                  <div className="flex gap-2 items-start text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{resumeInfo.address}</span>
                  </div>
                )}
              </div>
              
              {/* Social Links */}
              {(resumeInfo?.githubUrl || resumeInfo?.linkedinUrl || resumeInfo?.portfolioUrl) && (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
                    Online Profiles
                  </h3>
                  
                  {resumeInfo?.linkedinUrl && (
                    <div className="flex gap-2 items-start text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}>
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                      </svg>
                      <a 
                        href={formatUrl(resumeInfo.linkedinUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-700 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  
                  {resumeInfo?.githubUrl && (
                    <div className="flex gap-2 items-start text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}>
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <a 
                        href={formatUrl(resumeInfo.githubUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-700 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                  
                  {resumeInfo?.portfolioUrl && (
                    <div className="flex gap-2 items-start text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a 
                        href={formatUrl(resumeInfo.portfolioUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-700 hover:underline"
                      >
                        Portfolio Website
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {/* Skills Section */}
              {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
                    Key Skills
                  </h3>
                  
                  <div className="space-y-2">
                    {resumeInfo.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        ></div>
                        <span className="text-xs text-gray-700">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Certifications Section - Added for Executive template */}
              {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
                    Certifications
                  </h3>
                  
                  <div className="space-y-3">
                    {resumeInfo.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div 
                          className="w-2 h-2 rounded-full mt-1"
                          style={{ backgroundColor: themeColor }}
                        ></div>
                        <div>
                          <div className="text-xs font-medium text-gray-700">{cert.name}</div>
                          <div className="text-xs text-gray-600">{cert.issuer}</div>
                          {cert.date && <div className="text-xs text-gray-500">{cert.date}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-3/4 p-8">
            <div className="pb-6 mb-6 border-b" style={{ borderColor: `${themeColor}30` }}>
              <h1 
                className="text-2xl font-bold tracking-wide mb-1"
                style={{ color: themeColor }}
              >
                {resumeInfo?.firstName} {resumeInfo?.lastName}
              </h1>
              <h2 className="text-lg font-medium uppercase tracking-wide text-gray-600">
                {resumeInfo?.jobTitle}
              </h2>
            </div>
            
            {/* Professional Summary */}
            {resumeInfo?.summary && (
              <div className="mb-6">
                <h3 
                  className="text-sm uppercase tracking-wider font-semibold mb-3"
                  style={{ color: themeColor }}
                >
                  Professional Summary
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">{resumeInfo.summary}</p>
              </div>
            )}
            
            {/* Experience Section */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-sm uppercase tracking-wider font-semibold mb-4"
                  style={{ color: themeColor }}
                >
                  Professional Experience
                </h3>
                
                <div className="space-y-5">
                  {resumeInfo.experience.map((exp, index) => (
                    <div key={index} className="relative pl-5">
                      <div 
                        className="absolute top-1.5 left-0 w-2 h-2 rounded-full"
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-800">{exp.title}</h4>
                        <span className="text-xs text-gray-500">
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                          {exp.currentlyWorking ? "Present" : exp.endDate}
                        </span>
                      </div>
                      
                      <h5 className="text-xs font-medium text-gray-600 mb-2">
                        {exp.companyName}
                        {exp.city && exp.companyName ? ", " : ""}
                        {exp.city}
                        {exp.city && exp.state ? ", " : ""}
                        {exp.state}
                      </h5>
                      
                      <div className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Education Section */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-sm uppercase tracking-wider font-semibold mb-4"
                  style={{ color: themeColor }}
                >
                  Education
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.education.map((edu, index) => (
                    <div key={index} className="relative pl-5">
                      <div 
                        className="absolute top-1.5 left-0 w-2 h-2 rounded-full"
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-800">
                          {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </span>
                      </div>
                      
                      <h5 className="text-xs font-medium text-gray-600 mb-1">{edu.universityName}</h5>
                      
                      {edu.grade && (
                        <div className="text-xs text-gray-600 mb-1">
                          {edu.gradeType}: {edu.grade}
                        </div>
                      )}
                      
                      {edu.description && (
                        <p className="text-xs text-gray-700">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Projects Section */}
            {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
              <div>
                <h3 
                  className="text-sm uppercase tracking-wider font-semibold mb-4"
                  style={{ color: themeColor }}
                >
                  Projects
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.projects.map((project, index) => (
                    <div key={index} className="relative pl-5">
                      <div 
                        className="absolute top-1.5 left-0 w-2 h-2 rounded-full"
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-800">{project.projectName}</h4>
                        <div className="flex gap-3">
                          {project?.githubLink && (
                            <a 
                              href={formatUrl(project.githubLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs hover:underline flex items-center"
                              style={{ color: themeColor }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              Code
                            </a>
                          )}
                          {project?.deployedLink && (
                            <a 
                              href={formatUrl(project.deployedLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs hover:underline flex items-center"
                              style={{ color: themeColor }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {project.techStack && (
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-medium">Technologies:</span> {project.techStack}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

// Creative Modern Template - More balanced, moderately creative design
const CreativeModernTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#4b5563"; // Default to a more neutral gray
  
  // Create a lighter version of the theme color for styling
  const createLighterColor = (color, percent) => {
    return `${color}${Math.round(percent * 255).toString(16).padStart(2, '0')}`;
  };
  
  const lighterColor = createLighterColor(themeColor, 0.1); // 10% opacity for more subtle effect
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* More balanced header */}
      <div style={{ backgroundColor: lighterColor }} className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold mb-1" style={{ color: themeColor }}>
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-lg text-gray-700 font-medium">
              {resumeInfo?.jobTitle}
            </h2>
            
            {/* Summary */}
            {resumeInfo?.summary && (
              <div className="max-w-lg mt-3">
                <p className="text-sm text-gray-600">{resumeInfo.summary}</p>
              </div>
            )}
          </div>
          
          {/* Contact info in a simple box */}
          <div 
            className="px-4 py-3 rounded-md shadow-sm"
            style={{ backgroundColor: "white", borderLeft: `2px solid ${themeColor}` }}
          >
            <div className="flex flex-col space-y-2">
              {resumeInfo?.email && (
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{resumeInfo.email}</span>
                </div>
              )}
              
              {resumeInfo?.phone && (
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{resumeInfo.phone}</span>
                </div>
              )}
              
              {resumeInfo?.address && (
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{resumeInfo.address}</span>
                </div>
              )}
              
              {/* Social Links */}
              <div className="flex items-center mt-2 gap-3">
                {resumeInfo?.linkedinUrl && (
                  <a 
                    href={formatUrl(resumeInfo.linkedinUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.githubUrl && (
                  <a 
                    href={formatUrl(resumeInfo.githubUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.portfolioUrl && (
                  <a 
                    href={formatUrl(resumeInfo.portfolioUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with clean layout */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Experience and Projects */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience Section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-4 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Experience
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1 mr-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        ></div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                          <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                          <span className="text-xs text-gray-500">
                            {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                            {exp.currentlyWorking ? "Present" : exp.endDate}
                          </span>
                        </div>
                        
                        <h5 className="text-sm font-medium text-gray-600 mb-2">
                          {exp.companyName}
                          {exp.city && exp.companyName ? ", " : ""}
                          {exp.city}
                          {exp.city && exp.state ? ", " : ""}
                          {exp.state}
                        </h5>
                        
                        <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects Section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-4 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Projects
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.projects.map((project, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-md border"
                    style={{ borderColor: `${themeColor}30` }}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <h4 className="text-base font-bold text-gray-800">{project.projectName}</h4>
                      <div className="flex gap-3 mt-1 md:mt-0">
                        {project?.githubLink && (
                          <a 
                            href={formatUrl(project.githubLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex items-center hover:underline"
                            style={{ color: themeColor }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Code
                          </a>
                        )}
                        
                        {project?.deployedLink && (
                          <a 
                            href={formatUrl(project.deployedLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex items-center hover:underline"
                            style={{ color: themeColor }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <div className="text-xs mb-2 text-gray-600">
                        <span className="font-medium">Tech Stack:</span> {project.techStack}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications Section - Modified to match Projects width */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-4 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Certifications
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.certifications.map((cert, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-md border"
                    style={{ borderColor: `${themeColor}30`, backgroundColor: `${themeColor}10` }}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1 mr-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        ></div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                          <h4 className="text-base font-bold text-gray-800">{cert.name}</h4>
                          {cert.date && (
                            <span className="text-xs text-gray-500">
                              {cert.date}
                            </span>
                          )}
                        </div>
                        
                        <h5 className="text-sm font-medium text-gray-600 mb-2">{cert.issuer}</h5>
                        
                        {cert.description && (
                          <p className="text-sm text-gray-700">{cert.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Education and Skills */}
        <div className="space-y-6">
          {/* Education Section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-4 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Education
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.education.map((edu, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-md border"
                    style={{ borderColor: `${themeColor}20` }}
                  >
                    <h4 className="text-sm font-bold text-gray-800 mb-1">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    
                    <h5 className="text-xs font-medium text-gray-600">{edu.universityName}</h5>
                    
                    <div className="flex justify-between items-center mt-2 mb-1">
                      <span className="text-xs text-gray-500">
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span className="text-xs text-gray-600">
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-700 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Skills Section with more toned down styling */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-4 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Skills
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {resumeInfo.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="px-3 py-1 text-xs rounded-md border"
                    style={{ 
                      borderColor: `${themeColor}40`,
                      color: 'gray'
                    }}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tech Startup Template - Updated with medium-level UI complexity
const TechStartupTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#10b981"; // Default to emerald-500
  
  return (
    <div className="shadow-lg bg-white h-full rounded-md overflow-hidden">
      {/* Simplified header with clean design */}
      <div className="p-6 border-b" style={{ borderColor: `${themeColor}30` }}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: themeColor }}>
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-sm font-medium text-gray-700 mb-3">
              {resumeInfo?.jobTitle}
            </h2>
            
            {/* Simple summary box */}
            {resumeInfo?.summary && (
              <div className="max-w-xl mt-2 text-sm text-gray-700">
                {resumeInfo.summary}
              </div>
            )}
          </div>
          
          {/* Contact info in a clean box */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm space-y-2">
              {resumeInfo?.email && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{resumeInfo.email}</span>
                </div>
              )}
              
              {resumeInfo?.phone && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{resumeInfo.phone}</span>
                </div>
              )}
              
              {resumeInfo?.address && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{resumeInfo.address}</span>
                </div>
              )}
              
              {/* Social profiles */}
              <div className="flex mt-2 space-x-3">
                {resumeInfo?.githubUrl && (
                  <a 
                    href={formatUrl(resumeInfo.githubUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.linkedinUrl && (
                  <a 
                    href={formatUrl(resumeInfo.linkedinUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.portfolioUrl && (
                  <a 
                    href={formatUrl(resumeInfo.portfolioUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6 space-y-6">
        {/* Skills as simple tags */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-lg font-medium mb-3"
              style={{ color: themeColor }}
            >
              Skills
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {resumeInfo.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: `${themeColor}15`,
                    color: themeColor
                  }}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience with cleaner timeline */}
        {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-lg font-medium mb-4"
              style={{ color: themeColor }}
            >
              Experience
            </h3>
            
            <div className="space-y-4">
              {resumeInfo.experience.map((exp, index) => (
                <div key={index} className="border-l-2 pl-4 pb-2" style={{ borderColor: themeColor }}>
                  <div className="flex justify-between items-start flex-wrap mb-1">
                    <h4 className="text-base font-medium">{exp.title}</h4>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                      {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  
                  <h5 className="text-sm text-gray-700 mb-2">
                    {exp.companyName}
                    {exp.city && exp.companyName ? ", " : ""}
                    {exp.city}
                    {exp.city && exp.state ? ", " : ""}
                    {exp.state}
                  </h5>
                  
                  <div 
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications Section - Added for TechStartup template */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-lg font-medium mb-4"
              style={{ color: themeColor }}
            >
              Certifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeInfo.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-md border-l-2"
                  style={{ borderColor: themeColor, backgroundColor: `${themeColor}05` }}
                >
                  <div className="flex justify-between items-start mb-1">
                  <h4 className="text-base font-medium" style={{ color: themeColor }}>{cert.name}</h4>
                    {cert.date && (
                      <span className="text-xs text-gray-500">{cert.date}</span>
                    )}
                  </div>
                  
                  <h5 className="text-sm text-gray-700 mb-1">{cert.issuer}</h5>
                  
                  {cert.description && (
                    <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects Section with simplified design */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-lg font-medium mb-4"
              style={{ color: themeColor }}
            >
              Projects
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeInfo.projects.map((project, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-md border"
                  style={{ borderColor: `${themeColor}30` }}
                >
                  <div className="mb-2">
                    <h4 className="text-base font-medium mb-1" style={{ color: themeColor }}>
                      {project.projectName}
                    </h4>
                    
                    {project.techStack && (
                      <div className="text-xs text-gray-500 mb-2">
                        {project.techStack}
                      </div>
                    )}
                    
                    <div className="flex gap-3 text-xs mb-2">
                      {project?.githubLink && (
                        <a 
                          href={formatUrl(project.githubLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Code
                        </a>
                      )}
                      
                      {project?.deployedLink && (
                        <a 
                          href={formatUrl(project.deployedLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education Section with simplified design */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <div>
            <h3 
              className="text-lg font-medium mb-4"
              style={{ color: themeColor }}
            >
              Education
            </h3>
            
            <div className="space-y-4">
              {resumeInfo.education.map((edu, index) => (
                <div key={index} className="border-l-2 pl-4" style={{ borderColor: themeColor }}>
                  <div className="flex justify-between items-start flex-wrap mb-1">
                    <h4 className="text-base font-medium">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                      {edu.endDate}
                    </span>
                  </div>
                  
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    {edu.universityName}
                  </h5>
                  
                  {edu.grade && (
                    <div className="text-xs text-gray-600 mb-1">
                      {edu.gradeType}: {edu.grade}
                    </div>
                  )}
                  
                  {edu.description && (
                    <p className="text-xs text-gray-600">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Standard Elegant Portfolio Template - Simplified, magazine-style layout
const ElegantPortfolioTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#6d28d9"; // Default to violet-700

  return (
    <div className="bg-white h-full rounded-md overflow-hidden shadow-md">
      {/* Simplified header */}
      <div className="px-8 py-10 border-b" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
            {/* Name and title */}
            <div className="text-center md:text-left flex-grow">
              <h1
                className="text-4xl font-medium tracking-wide mb-2"
                style={{ color: themeColor }}
              >
                {resumeInfo?.firstName} {resumeInfo?.lastName}
              </h1>
              <h2 className="text-lg text-gray-700 uppercase tracking-wide font-medium">
                {resumeInfo?.jobTitle}
              </h2>
            </div>

            {/* Contact details */}
            <div className="flex flex-col items-center md:items-end text-sm space-y-1 text-gray-600">
              {resumeInfo?.email && (
                <div className="flex items-center gap-2">
                  <span>{resumeInfo.email}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    style={{ color: themeColor }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {resumeInfo?.phone && (
                <div className="flex items-center gap-2">
                  <span>{resumeInfo.phone}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    style={{ color: themeColor }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              )}

              {resumeInfo?.address && (
                <div className="flex items-center gap-2">
                  <span>{resumeInfo.address}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    style={{ color: themeColor }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}

              {/* Social links */}
              <div className="flex items-center gap-3 mt-2">
                {resumeInfo?.linkedinUrl && (
                  <a
                    href={formatUrl(resumeInfo.linkedinUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: themeColor }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </a>
                )}

                {resumeInfo?.githubUrl && (
                  <a
                    href={formatUrl(resumeInfo.githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: themeColor }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}

                {resumeInfo?.portfolioUrl && (
                  <a
                    href={formatUrl(resumeInfo.portfolioUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: themeColor }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content in a simplified magazine layout */}
      <div className="max-w-4xl mx-auto px-8 py-6">
        {/* Summary section (simplified, no decorative quotes) */}
        {resumeInfo?.summary && (
          <div className="mb-8">
            <p className="text-base text-gray-600 text-center">
              {resumeInfo.summary}
            </p>
          </div>
        )}

        {/* Two-column layout for content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main column - experience and projects */}
          <div className="md:col-span-8 space-y-8">
            {/* Experience section */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
              <div>
                <h3
                  className="text-lg uppercase tracking-wide font-medium mb-4 pb-2 border-b"
                  style={{ color: themeColor, borderColor: "#e5e7eb" }}
                >
                  Professional Experience
                </h3>

                <div className="space-y-6">
                  {resumeInfo.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-1">
                        <h4
                          className="text-base font-medium"
                          style={{ color: themeColor }}
                        >
                          {exp.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                          {exp.currentlyWorking ? "Present" : exp.endDate}
                        </span>
                      </div>

                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        {exp.companyName}
                        {exp.city && exp.companyName ? ", " : ""}
                        {exp.city}
                        {exp.city && exp.state ? ", " : ""}
                        {exp.state}
                      </h5>

                      <div
                        className="text-sm text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects section */}
            {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
              <div>
                <h3
                  className="text-lg uppercase tracking-wide font-medium mb-4 pb-2 border-b"
                  style={{ color: themeColor, borderColor: "#e5e7eb" }}
                >
                  Selected Projects
                </h3>

                <div className="space-y-6">
                  {resumeInfo.projects.map((project, index) => (
                    <div key={index}>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-1">
                        <h4
                          className="text-base font-medium"
                          style={{ color: themeColor }}
                        >
                          {project.projectName}
                        </h4>

                        <div className="flex gap-3">
                          {project?.githubLink && (
                            <a
                              href={formatUrl(project.githubLink)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline"
                              style={{ color: themeColor }}
                            >
                              View Code
                            </a>
                          )}

                          {project?.deployedLink && (
                            <a
                              href={formatUrl(project.deployedLink)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline"
                              style={{ color: themeColor }}
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>

                      {project.techStack && (
                        <p className="text-xs text-gray-500 mb-1">
                          {project.techStack}
                        </p>
                      )}

                      <div
                        className="text-sm text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications Section - Added for ElegantPortfolio template */}
            {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
              <div>
                <h3
                  className="text-lg uppercase tracking-wide font-medium mb-4 pb-2 border-b"
                  style={{ color: themeColor, borderColor: "#e5e7eb" }}
                >
                  Certifications
                </h3>

                <div className="space-y-4">
                  {resumeInfo.certifications.map((cert, index) => (
                    <div key={index}>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-1">
                        <h4
                          className="text-base font-medium"
                          style={{ color: themeColor }}
                        >
                          {cert.name}
                        </h4>
                        {cert.date && (
                          <span className="text-sm text-gray-500">
                            {cert.date}
                          </span>
                        )}
                      </div>

                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        {cert.issuer}
                      </h5>

                      {cert.description && (
                        <p className="text-sm text-gray-600">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - education and skills */}
          <div className="md:col-span-4 space-y-8">
            {/* Education section */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
              <div>
                <h3
                  className="text-lg uppercase tracking-wide font-medium mb-4 pb-2 border-b"
                  style={{ color: themeColor, borderColor: "#e5e7eb" }}
                >
                  Education
                </h3>

                <div className="space-y-4">
                  {resumeInfo.education.map((edu, index) => (
                    <div key={index}>
                      <h4
                        className="text-base font-medium"
                        style={{ color: themeColor }}
                      >
                        {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                      </h4>

                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        {edu.universityName}
                      </h5>

                      <p className="text-sm text-gray-500 mb-1">
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </p>

                      {edu.grade && (
                        <p className="text-xs text-gray-600">
                          {edu.gradeType}: {edu.grade}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills section */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
              <div>
                <h3
                  className="text-lg uppercase tracking-wide font-medium mb-4 pb-2 border-b"
                  style={{ color: themeColor, borderColor: "#e5e7eb" }}
                >
                  Skills
                </h3>

                <div className="space-y-1">
                  {resumeInfo.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simplified footer */}
      <div className="py-4 px-8">
        <div
          className="max-w-xs mx-auto h-px"
          style={{ backgroundColor: "#e5e7eb" }}
        ></div>
      </div>
    </div>
  );
};


// Modern Timeline Template - Clean design with emphasis on visual timeline
const ModernTimelineTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
   if (!url) return null;
   if (!/^https?:\/\//i.test(url)) {
     return `https://${url}`;
   }
   return url;
 };

 const themeColor = resumeInfo?.themeColor || "#333333"; // Default to dark gray
 
 return (
   <div className="bg-white h-full rounded-md overflow-hidden border border-gray-200">
     {/* Header section with clean design */}
     <div className="p-6 border-b border-gray-200">
       {/* Name and title */}
       <div className="text-center mb-4">
         <h1 className="text-2xl font-bold mb-1">
           {resumeInfo?.firstName} {resumeInfo?.lastName}
         </h1>
         <h2 className="text-lg text-gray-600 mb-2">
           {resumeInfo?.jobTitle}
         </h2>
         
         {/* Contact information in a row */}
         <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
           {resumeInfo?.email && (
             <div className="flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
               <span>{resumeInfo.email}</span>
             </div>
           )}
           
           {resumeInfo?.phone && (
             <div className="flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
               </svg>
               <span>{resumeInfo.phone}</span>
             </div>
           )}
           
           {resumeInfo?.address && (
             <div className="flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
          
          {/* Social links */}
          <div className="flex justify-center gap-4 text-sm">
            {resumeInfo?.linkedinUrl && (
              <a 
                href={formatUrl(resumeInfo.linkedinUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
                LinkedIn
              </a>
            )}
            
            {resumeInfo?.githubUrl && (
              <a 
                href={formatUrl(resumeInfo.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-800 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            
            {resumeInfo?.portfolioUrl && (
              <a 
                href={formatUrl(resumeInfo.portfolioUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-green-600 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Portfolio
              </a>
            )}
          </div>
        </div>
        
        {/* Summary */}
        {resumeInfo?.summary && (
          <div className="mt-4 text-sm text-gray-700 border-t border-gray-200 pt-4">
            <p>{resumeInfo.summary}</p>
          </div>
        )}
      </div>
      
      {/* Main content area with two columns on larger screens */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Experience and Education */}
        <div className="md:col-span-8 space-y-6">
          {/* Experience section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                Experience
              </h3>
              
              <div className="space-y-6">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-wrap justify-between mb-1">
                      <h4 className="text-base font-bold">{exp.title}</h4>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                        {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      {exp.companyName}
                      {exp.city && exp.companyName ? ", " : ""}
                      {exp.city}
                      {exp.city && exp.state ? ", " : ""}
                      {exp.state}
                    </h5>
                    
                    <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                Projects
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.projects.map((project, index) => (
                  <div key={index} className="mb-4 border-b border-gray-100 pb-4">
                    <div className="flex flex-wrap justify-between mb-2">
                      <h4 className="text-base font-medium">{project.projectName}</h4>
                      
                      <div className="flex items-center space-x-3">
                        {project?.githubLink && (
                          <a 
                            href={formatUrl(project.githubLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs inline-flex items-center text-gray-600 hover:text-gray-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Code
                          </a>
                        )}
                        
                        {project?.deployedLink && (
                          <a 
                            href={formatUrl(project.deployedLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <div className="text-xs text-gray-500 mb-2">
                        <span className="font-medium">Tech Stack: </span>{project.techStack}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications Section - Added for ModernTimeline Template */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                Certifications
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.certifications.map((cert, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-wrap justify-between mb-1">
                      <h4 className="text-base font-medium">{cert.name}</h4>
                      {cert.date && (
                        <span className="text-sm text-gray-600">
                          {cert.date}
                        </span>
                      )}
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      {cert.issuer}
                    </h5>
                    
                    {cert.description && (
                      <div className="text-sm text-gray-600">{cert.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Right column - Skills, Education */}
        <div className="md:col-span-4 space-y-6">
          {/* Skills section */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                Skills
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {resumeInfo.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          
          {/* Education section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                Education
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-base font-medium mb-1">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    
                    <h5 className="text-sm text-gray-700 mb-1">
                      {edu.universityName}
                    </h5>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <span>
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span>
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Modern Grid Template - Contemporary design with grid layout
const ModernGridTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#8b5cf6"; // Default to violet-500
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Header with overlapping elements */}
      <div 
        className="pt-12 pb-4 px-8 relative"
        style={{ backgroundColor: `${themeColor}05` }}
      >
        {/* Decorative element */}
        <div 
          className="absolute top-0 right-0 w-60 h-4"
          style={{ backgroundColor: themeColor }}
        ></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Name and title */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 
              className="text-lg font-medium mb-3"
              style={{ color: themeColor }}
            >
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact info in a horizontal layout for larger screens */}
          <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 text-sm">
            {resumeInfo?.email && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{resumeInfo.email}</span>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Social links in a horizontal row */}
        <div className="flex flex-wrap gap-4 mt-4">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs flex items-center hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
              LinkedIn
            </a>
          )}
          
          {resumeInfo?.githubUrl && (
            <a 
              href={formatUrl(resumeInfo.githubUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs flex items-center hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs flex items-center hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Portfolio
            </a>
          )}
        </div>
      </div>
      
      {/* Summary section with background */}
      {resumeInfo?.summary && (
        <div 
          className="py-4 px-8"
          style={{ backgroundColor: `${themeColor}10` }}
        >
          <p className="text-sm text-gray-700 leading-relaxed">{resumeInfo.summary}</p>
        </div>
      )}
      
      {/* Main content in a grid layout */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-8">
          {/* Experience section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <section>
              <h3 
                className="text-lg font-bold mb-6 inline-block relative"
                style={{ color: themeColor }}
              >
                <span>EXPERIENCE</span>
                <span 
                  className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-6">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="pb-5 relative">
                    {/* Add horizontal line between entries */}
                    {index < resumeInfo.experience.length - 1 && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ backgroundColor: `${themeColor}30` }}
                      ></div>
                    )}
                    
                    <div className="flex flex-wrap justify-between mb-2">
                      <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                      <span className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                        {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      {exp.companyName}
                      {exp.city && exp.companyName ? ", " : ""}
                      {exp.city}
                      {exp.city && exp.state ? ", " : ""}
                      {exp.state}
                    </h5>
                    
                    <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Education section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <section>
              <h3 
                className="text-lg font-bold mb-6 inline-block relative"
                style={{ color: themeColor }}
              >
                <span>EDUCATION</span>
                <span 
                  className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.education.map((edu, index) => (
                  <div key={index} className="rounded-lg p-4" style={{ backgroundColor: `${themeColor}05` }}>
                    <h4 className="text-base font-medium mb-1">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    
                    <h5 className="text-sm text-gray-700 mb-1" style={{ color: themeColor }}>
                      {edu.universityName}
                    </h5>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <span>
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span className="font-medium">
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications Section - Added for ModernGrid template */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <section>
              <h3 
                className="text-lg font-bold mb-6 inline-block relative"
                style={{ color: themeColor }}
              >
                <span>CERTIFICATIONS</span>
                <span 
                  className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.certifications.map((cert, index) => (
                  <div key={index} className="rounded-lg p-4" style={{ backgroundColor: `${themeColor}05` }}>
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-medium mb-1">
                        {cert.name}
                      </h4>
                      {cert.date && (
                        <span className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>
                          {cert.date}
                        </span>
                      )}
                    </div>
                    
                    <h5 className="text-sm text-gray-700 mb-1" style={{ color: themeColor }}>
                      {cert.issuer}
                    </h5>
                    
                    {cert.description && (
                      <p className="text-xs text-gray-600 mt-2">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Right column */}
        <div className="space-y-8">
          {/* Skills section with modern styling */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <section>
              <h3 
                className="text-lg font-bold mb-6 inline-block relative"
                style={{ color: themeColor }}
              >
                <span>SKILLS</span>
                <span 
                  className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {resumeInfo.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg flex items-center"
                    style={{ 
                      backgroundColor: index % 2 === 0 ? `${themeColor}10` : `${themeColor}05`,
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <span className="text-sm">{skill.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects section with modern cards */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <section>
              <h3 
                className="text-lg font-bold mb-6 inline-block relative"
                style={{ color: themeColor }}
              >
                <span>PROJECTS</span>
                <span 
                  className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.projects.map((project, index) => (
                  <div 
                    key={index} 
                    className="border-l-2 pl-4 py-2"
                    style={{ borderColor: themeColor }}
                  >
                    <h4 className="text-base font-medium mb-2" style={{ color: themeColor }}>
                      {project.projectName}
                    </h4>
                    
                    {project.techStack && (
                      <div className="inline-block text-xs py-1 px-2 mb-2 rounded-md" style={{ backgroundColor: `${themeColor}10` }}>
                        {project.techStack}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                    
                    <div className="flex gap-3 text-xs">
                      {project?.githubLink && (
                        <a 
                          href={formatUrl(project.githubLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center hover:underline"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub Repository
                        </a>
                      )}
                      
                      {project?.deployedLink && (
                        <a 
                          href={formatUrl(project.deployedLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center hover:underline"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const ModernSidebarTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#0ea5e9"; // Default to sky-500

  return (
    <div className="shadow-md bg-white h-full rounded overflow-hidden flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <div className="md:w-1/3 p-5 md:h-full" style={{ backgroundColor: themeColor }}>
        {/* Profile Section */}
        <div className="text-center mb-6">
          {/* Avatar Circle with Initials */}
          <div className="w-24 h-24 rounded-full bg-white mx-auto flex items-center justify-center mb-3">
            <span className="text-xl font-bold" style={{ color: themeColor }}>
              {resumeInfo?.firstName?.charAt(0) || ""}
              {resumeInfo?.lastName?.charAt(0) || ""}
            </span>
          </div>
          
          <h1 className="text-lg font-bold text-white mb-1">
            {resumeInfo?.firstName} {resumeInfo?.lastName}
          </h1>
          <h2 className="text-base text-white/90 mb-3">
            {resumeInfo?.jobTitle}
          </h2>
        </div>
        
        {/* Contact Information */}
        <div className="mb-6 text-white/90">
          <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
            Contact
          </h3>
          
          <div className="space-y-2">
            {resumeInfo?.email && (
              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">{resumeInfo.email}</span>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Social Links */}
        {(resumeInfo?.linkedinUrl || resumeInfo?.githubUrl || resumeInfo?.portfolioUrl) && (
          <div className="mb-6">
            <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
              Connect
            </h3>
            
            <div className="space-y-2">
              {resumeInfo?.linkedinUrl && (
                <a 
                  href={formatUrl(resumeInfo.linkedinUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-white/90 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
              
              {resumeInfo?.githubUrl && (
                <a 
                  href={formatUrl(resumeInfo.githubUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-white/90 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              )}
              
              {resumeInfo?.portfolioUrl && (
                <a 
                  href={formatUrl(resumeInfo.portfolioUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-white/90 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Skills Section */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
              Skills
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {resumeInfo.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-block text-xs px-2 py-1 rounded bg-white/10 text-white/90"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Education Section */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <div className="mb-6">
            <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
              Education
            </h3>
            
            <div className="space-y-3">
              {resumeInfo.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h4 className="text-sm font-medium text-white">
                    {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                  </h4>
                  <h5 className="text-xs text-white/80 mb-1">{edu.universityName}</h5>
                  <div className="text-xs text-white/70">
                    {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                    {edu.endDate}
                  </div>
                  
                  {edu.grade && (
                    <div className="text-xs text-white/70 mt-1">
                      {edu.gradeType}: {edu.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications Section - Added for ModernSidebar template */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <div>
            <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
              Certifications
            </h3>
            
            <div className="space-y-3">
              {resumeInfo.certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                  <h4 className="text-sm font-medium text-white">
                    {cert.name}
                  </h4>
                  <h5 className="text-xs text-white/80 mb-1">{cert.issuer}</h5>
                  {cert.date && (
                    <div className="text-xs text-white/70">
                      {cert.date}
                    </div>
                  )}
                  {cert.description && (
                    <div className="text-xs text-white/70 mt-1">
                      {cert.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="md:w-2/3 p-5 bg-white">
        {/* Summary Section */}
        {resumeInfo?.summary && (
          <div className="mb-6">
            <h3 
              className="text-base font-bold mb-2 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-sm text-gray-700">{resumeInfo.summary}</p>
          </div>
        )}
        
        {/* Experience Section */}
        {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-base font-bold mb-3 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              WORK EXPERIENCE
            </h3>
            
            <div className="space-y-4">
              {resumeInfo.experience.map((exp, index) => (
                <div 
                  key={index} 
                  className="pl-4 mb-3"
                  style={{ borderLeft: `2px solid ${themeColor}40` }}
                >
                  <div className="flex justify-between items-start flex-wrap mb-1">
                    <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                      {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  
                  <h5 className="text-sm font-medium text-gray-600 mb-1">
                    {exp.companyName}
                    {exp.city && exp.companyName ? ", " : ""}
                    {exp.city}
                    {exp.city && exp.state ? ", " : ""}
                    {exp.state}
                  </h5>
                  
                  <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects Section */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <div>
            <h3 
              className="text-base font-bold mb-3 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              PROJECTS
            </h3>
            
            <div className="space-y-4">
              {resumeInfo.projects.map((project, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded border mb-3"
                  style={{ borderColor: `${themeColor}30` }}
                >
                  <div className="flex justify-between items-start flex-wrap mb-2">
                    <h4 className="text-base font-bold text-gray-800">{project.projectName}</h4>
                    
                    <div className="flex gap-2">
                      {project?.githubLink && (
                        <a 
                          href={formatUrl(project.githubLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs inline-flex items-center"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Code
                        </a>
                      )}
                      
                      {project?.deployedLink && (
                        <a 
                          href={formatUrl(project.deployedLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs inline-flex items-center"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {project.techStack && (
                    <div 
                      className="inline-block text-xs px-2 py-1 rounded mb-2"
                      style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                    >
                      {project.techStack}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Gradient Accent Template with Modified Projects Section
const GradientAccentTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#8b5cf6"; // Default to violet-500
  
  // Function to create a gradient of the theme color
  const createGradient = (color) => {
    return `linear-gradient(135deg, ${color} 0%, ${color}85 100%)`;
  };
  
  return (
    <div className="shadow-md bg-white h-full rounded overflow-hidden">
      {/* Header with Gradient */}
      <div 
        className="p-6 text-white relative"
        style={{ background: createGradient(themeColor) }}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Name and Title */}
          <div>
            <h1 className="text-2xl font-bold">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-lg mt-1 text-white/90">
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact Details */}
          <div className="space-y-2 text-sm">
            {resumeInfo?.email && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{resumeInfo.email}</span>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Social Links Bar */}
      {(resumeInfo?.linkedinUrl || resumeInfo?.githubUrl || resumeInfo?.portfolioUrl) && (
        <div className="bg-gray-100 py-2 px-6 flex flex-wrap justify-center md:justify-end gap-4">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-sm"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
              LinkedIn
            </a>
          )}
          
          {resumeInfo?.githubUrl && (
            <a 
              href={formatUrl(resumeInfo.githubUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-sm"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-sm"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Portfolio
            </a>
          )}
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-6">
        {/* Professional Summary */}
        {resumeInfo?.summary && (
          <div 
            className="mb-6 p-4 rounded relative"
            style={{ 
              backgroundColor: `${themeColor}05`,
              borderLeft: `3px solid ${themeColor}`
            }}
          >
            <h3 
              className="text-base font-bold mb-2"
              style={{ color: themeColor }}
            >
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-sm text-gray-700">{resumeInfo.summary}</p>
          </div>
        )}
        
        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Column - Experience & Projects */}
          <div className="md:col-span-2">
            {/* Experience Section */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-base font-bold mb-4 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  EXPERIENCE
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.experience.map((exp, index) => (
                    <div 
                      key={index} 
                      className="relative pl-4 pb-4"
                      style={{ borderLeft: `2px solid ${themeColor}30` }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
                        <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                        <span 
                          className="text-xs inline-flex items-center px-2 py-1 rounded"
                          style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                        >
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                          {exp.currentlyWorking ? "Present" : exp.endDate}
                        </span>
                      </div>
                      
                      <h5 className="text-sm font-medium text-gray-600 mb-2">
                        {exp.companyName}
                        {exp.city && exp.companyName ? ", " : ""}
                        {exp.city}
                        {exp.city && exp.state ? ", " : ""}
                        {exp.state}
                      </h5>
                      
                      <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications Section - Added for GradientAccent template */}
            {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-base font-bold mb-4 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  CERTIFICATIONS
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.certifications.map((cert, index) => (
                    <div 
                      key={index} 
                      className="relative pl-4 pb-4"
                      style={{ borderLeft: `2px solid ${themeColor}30` }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
                        <h4 className="text-base font-bold text-gray-800">{cert.name}</h4>
                        {cert.date && (
                          <span 
                            className="text-xs inline-flex items-center px-2 py-1 rounded"
                            style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                          >
                            {cert.date}
                          </span>
                        )}
                      </div>
                      
                      <h5 className="text-sm font-medium text-gray-600 mb-2">
                        {cert.issuer}
                      </h5>
                      
                      {cert.description && (
                        <div className="text-sm text-gray-700">{cert.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* MODIFIED: Projects Section with Standard Design */}
            {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
              <div>
                <h3 
                  className="text-base font-bold mb-4 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  PROJECTS
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.projects.map((project, index) => (
                    <div 
                      key={index} 
                      className="p-4 border rounded mb-3"
                      style={{ borderColor: `${themeColor}30` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base font-bold text-gray-800">
                          {project.projectName}
                        </h4>
                        
                        <div className="flex gap-3">
                          {project?.githubLink && (
                            <a 
                              href={formatUrl(project.githubLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs flex items-center"
                              style={{ color: themeColor }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              Code
                            </a>
                          )}
                          
                          {project?.deployedLink && (
                            <a 
                              href={formatUrl(project.deployedLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs flex items-center"
                              style={{ color: themeColor }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {project.techStack && (
                        <div className="mb-2">
                          <span 
                            className="text-xs px-2 py-1 rounded inline-block"
                            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                          >
                            {project.techStack}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Side Column - Education & Skills */}
          <div className="md:col-span-1 space-y-6">
            {/* Education Section */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
              <div>
                <h3 
                  className="text-base font-bold mb-4 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  EDUCATION
                </h3>
                
                <div className="space-y-4">
                  {resumeInfo.education.map((edu, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded mb-2"
                      style={{ backgroundColor: `${themeColor}05` }}
                    >
                      <h4 
                        className="text-sm font-medium"
                        style={{ color: themeColor }}
                      >
                        {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                      </h4>
                      
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        {edu.universityName}
                      </h5>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </span>
                        
                        {edu.grade && (
                          <span className="font-medium">
                            {edu.gradeType}: {edu.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Skills Section */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
              <div>
                <h3 
                  className="text-base font-bold mb-4 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  SKILLS
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {resumeInfo.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 text-sm rounded"
                      style={{ 
                        backgroundColor: `${themeColor}15`,
                        color: themeColor
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Bold Impact Template - High contrast, modern, and impactful design with accent borders
const BoldImpactTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#000000"; // Default to black
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Header with strong accent */}
      <div className="relative">
        {/* Top accent bar */}
        <div 
          className="h-4 w-full"
          style={{ backgroundColor: themeColor }}
        ></div>
        
        <div className="p-6 pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            {/* Name and title with extra large sizing */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-1 text-gray-900">
                {resumeInfo?.firstName} {resumeInfo?.lastName}
              </h1>
              <h2 className="text-xl font-medium text-gray-600 mb-3">
                {resumeInfo?.jobTitle}
              </h2>
              
              {/* Summary statement */}
              {resumeInfo?.summary && (
                <div className="max-w-2xl pr-4 mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed border-l-4 pl-3" 
                    style={{ borderColor: themeColor }}>
                    {resumeInfo.summary}
                  </p>
                </div>
              )}
            </div>
            
            {/* Contact information in a bordered container */}
            <div 
              className="px-5 py-4 mb-4 rounded text-right"
              style={{ 
                backgroundColor: `${themeColor}08`, 
                borderRight: `4px solid ${themeColor}`
              }}
            >
              <div className="space-y-2">
                {resumeInfo?.email && (
                  <div className="flex items-center justify-end text-sm gap-2">
                    <span className="text-gray-700">{resumeInfo.email}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {resumeInfo?.phone && (
                  <div className="flex items-center justify-end text-sm gap-2">
                    <span className="text-gray-700">{resumeInfo.phone}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                )}
                
                {resumeInfo?.address && (
                  <div className="flex items-center justify-end text-sm gap-2">
                    <span className="text-gray-700">{resumeInfo.address}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Social icons in a row */}
              <div className="flex justify-end gap-3 mt-3">
                {resumeInfo?.linkedinUrl && (
                  <a 
                    href={formatUrl(resumeInfo.linkedinUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transition-transform hover:scale-110"
                    style={{ color: themeColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.githubUrl && (
                  <a 
                    href={formatUrl(resumeInfo.githubUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transition-transform hover:scale-110"
                    style={{ color: themeColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.portfolioUrl && (
                  <a 
                    href={formatUrl(resumeInfo.portfolioUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transition-transform hover:scale-110"
                    style={{ color: themeColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom accent bar */}
        <div 
          className="h-1 w-full"
          style={{ backgroundColor: themeColor }}
        ></div>
      </div>
      
      {/* Main content with grid layout */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left column - 8 cols */}
        <div className="md:col-span-8 space-y-6">
          {/* Experience Section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-4 inline-block relative"
                style={{ color: themeColor }}
              >
                <span className="relative z-10">EXPERIENCE</span>
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-3 opacity-20"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-6">
                {resumeInfo.experience.map((exp, index) => (
                  <div 
                    key={index} 
                    className="relative pl-6 pb-5"
                    style={{ 
                      borderLeft: index < resumeInfo.experience.length - 1 ? `2px dashed ${themeColor}40` : 'none'
                    }}
                  >
                    <div 
                      className="absolute top-0 left-0 w-3 h-3 -ml-1.5 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                      <span 
                        className="text-xs px-3 py-1 rounded font-medium"
                        style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                      >
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                        {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      {exp.companyName}
                      {exp.city && exp.companyName ? ", " : ""}
                      {exp.city}
                      {exp.city && exp.state ? ", " : ""}
                      {exp.state}
                    </h5>
                    
                    <div 
                      className="text-sm text-gray-600 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                    ></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects Section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-4 inline-block relative"
                style={{ color: themeColor }}
              >
                <span className="relative z-10">PROJECTS</span>
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-3 opacity-20"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.projects.map((project, index) => (
                  <div 
                    key={index} 
                    className="relative p-4 border-l-4"
                    style={{ borderColor: themeColor }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base font-bold text-gray-800">{project.projectName}</h4>
                      
                      <div className="flex gap-3">
                        {project?.githubLink && (
                          <a 
                            href={formatUrl(project.githubLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex items-center gap-1 px-2 py-1 rounded transition-transform hover:scale-105"
                            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Code
                          </a>
                        )}
                        
                        {project?.deployedLink && (
                          <a 
                            href={formatUrl(project.deployedLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex items-center gap-1 px-2 py-1 rounded transition-transform hover:scale-105"
                            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <div 
                        className="inline-block text-xs mb-2 font-mono"
                        style={{ color: themeColor }}
                      >
                        {project.techStack}
                      </div>
                    )}
                    
                    <div 
                      className="text-sm text-gray-600 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                    ></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications Section - Added for BoldImpact template */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-4 inline-block relative"
                style={{ color: themeColor }}
              >
                <span className="relative z-10">CERTIFICATIONS</span>
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-3 opacity-20"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-5">
                {resumeInfo.certifications.map((cert, index) => (
                  <div 
                    key={index} 
                    className="relative p-4 border-l-4"
                    style={{ borderColor: themeColor }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base font-bold text-gray-800">{cert.name}</h4>
                      {cert.date && (
                        <span 
                          className="text-xs px-3 py-1 rounded font-medium"
                          style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                        >
                          {cert.date}
                        </span>
                      )}
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      {cert.issuer}
                    </h5>
                    
                    {cert.description && (
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {cert.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Right column - 4 cols */}
        <div className="md:col-span-4 space-y-6">
          {/* Skills Section */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-4 inline-block relative"
                style={{ color: themeColor }}
              >
                <span className="relative z-10">SKILLS</span>
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-3 opacity-20"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div 
                className="p-4 rounded"
                style={{ backgroundColor: `${themeColor}05` }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {resumeInfo.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2"
                    >
                      <div 
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      <span className="text-sm text-gray-700">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Education Section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-4 inline-block relative"
                style={{ color: themeColor }}
              >
                <span className="relative z-10">EDUCATION</span>
                <span 
                  className="absolute -bottom-1 left-0 right-0 h-3 opacity-20"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.education.map((edu, index) => (
                  <div 
                    key={index} 
                    className="p-4 relative border-l-4 mb-1"
                    style={{ borderColor: `${themeColor}70` }}
                  >
                    <h4 className="text-sm font-bold mb-1" style={{ color: themeColor }}>
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      {edu.universityName}
                    </h5>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <span>
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span 
                          className="px-2 py-0.5 rounded-md text-xs"
                          style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                        >
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* Footer accent */}
      <div 
        className="h-8 w-full"
        style={{ backgroundColor: themeColor }}
      ></div>
    </div>
  );
};


// Simple Attractive Template - Streamlined yet eye-catching design
const SplitFrameTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#0ea5e9"; // Default to sky-500
  
  return (
    <div className="shadow-sm bg-white h-full rounded-md overflow-hidden">
      {/* Header with accent color */}
      <div className="p-6 border-b-2" style={{ borderColor: themeColor }}>
        <div className="flex flex-col md:flex-row justify-between">
          {/* Name and title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 
              className="text-lg font-medium"
              style={{ color: themeColor }}
            >
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact information */}
          <div className="mt-3 md:mt-0 text-right space-y-1 text-sm">
            {resumeInfo?.email && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-700">{resumeInfo.email}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-700">{resumeInfo.phone}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-700">{resumeInfo.address}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Social links */}
        <div className="flex mt-3 gap-3 justify-center md:justify-start">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-full"
              style={{ color: themeColor, backgroundColor: `${themeColor}10` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
          )}
          
          {resumeInfo?.githubUrl && (
            <a 
              href={formatUrl(resumeInfo.githubUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-full"
              style={{ color: themeColor, backgroundColor: `${themeColor}10` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-full"
              style={{ color: themeColor, backgroundColor: `${themeColor}10` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a>
          )}
        </div>
        
        {/* Summary statement */}
        {resumeInfo?.summary && (
          <div className="mt-3 text-sm text-gray-700">
            <p>{resumeInfo.summary}</p>
          </div>
        )}
      </div>
      
      {/* Technical Skills */}
      {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
        <div className="py-4 px-6 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }}></div>
            <h3 
              className="text-base font-bold"
              style={{ color: themeColor }}
            >
              Technical Skills
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {resumeInfo.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-sm bg-white rounded-md border"
                style={{ borderColor: `${themeColor}30` }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Main content sections without gaps */}
      <div className="px-6">
        {/* Professional Experience */}
        {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }}></div>
              <h3 
                className="text-base font-bold"
                style={{ color: themeColor }}
              >
                Professional Experience
              </h3>
            </div>
            
            <div>
              {resumeInfo.experience.map((exp, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.experience.length - 1 ? "mb-3 pb-3 border-b" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <h4 className="text-base font-bold text-gray-800">
                      {exp.title}
                    </h4>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                    >
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                      {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  
                  <h5 className="text-sm font-medium text-gray-700 mt-1">
                    {exp.companyName}
                    {exp.city && exp.companyName ? ", " : ""}
                    {exp.city}
                    {exp.city && exp.state ? ", " : ""}
                    {exp.state}
                  </h5>
                  
                  <div 
                    className="text-sm text-gray-600 mt-2" 
                    dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                  ></div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Certifications Section - Added for SplitFrame template */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
            <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }}></div>
              <h3 
                className="text-base font-bold"
                style={{ color: themeColor }}
              >
                Certifications
              </h3>
            </div>
            
            <div>
              {resumeInfo.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.certifications.length - 1 ? "mb-3 pb-3 border-b" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <h4 className="text-base font-bold text-gray-800">
                      {cert.name}
                    </h4>
                    {cert.date && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                      >
                        {cert.date}
                      </span>
                    )}
                  </div>
                  
                  <h5 className="text-sm font-medium text-gray-700 mt-1">
                    {cert.issuer}
                  </h5>
                  
                  {cert.description && (
                    <div className="text-sm text-gray-600 mt-2">
                      {cert.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }}></div>
              <h3 
                className="text-base font-bold"
                style={{ color: themeColor }}
              >
                Education
              </h3>
            </div>
            
            <div>
              {resumeInfo.education.map((edu, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.education.length - 1 ? "mb-3 pb-3 border-b" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <div>
                      <h4 className="text-base font-bold text-gray-800">
                        {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                      </h4>
                      <h5 className="text-sm font-medium text-gray-700 mt-1">
                        {edu.universityName}
                      </h5>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full mt-1"
                          style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                        >
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {edu.description && (
                    <p className="text-xs text-gray-600 mt-2">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <section className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }}></div>
              <h3 
                className="text-base font-bold"
                style={{ color: themeColor }}
              >
                Projects
              </h3>
            </div>
            
            <div>
              {resumeInfo.projects.map((project, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.projects.length - 1 ? "mb-3 pb-3 border-b" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <h4 className="text-base font-bold text-gray-800">
                      {project.projectName}
                    </h4>
                    <div className="flex gap-2">
                      {project?.githubLink && (
                        <a 
                          href={formatUrl(project.githubLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs border rounded px-2 py-0.5 flex items-center gap-1"
                          style={{ color: themeColor, borderColor: `${themeColor}30` }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Code
                        </a>
                      )}
                      
                      {project?.deployedLink && (
                        <a 
                          href={formatUrl(project.deployedLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs rounded px-2 py-0.5 flex items-center gap-1 text-white"
                          style={{ backgroundColor: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {project.techStack && (
                    <div className="text-xs mt-1">
                      <span className="font-medium" style={{ color: themeColor }}>Tech:</span> {project.techStack}
                    </div>
                  )}
                  
                  <div 
                    className="text-sm text-gray-600 mt-2" 
                    dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                  ></div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// MinimalistPro Template - Sophisticated, clean design with ample whitespace
const MinimalistProTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#374151"; // Default to gray-700
  
  return (
    <div className="shadow-sm bg-white h-full rounded-md overflow-hidden">
      {/* Header with simple elegant design */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Name and title */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-light tracking-wide mb-2 text-gray-900">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <div className="h-px w-16 mx-auto my-3" style={{ backgroundColor: themeColor }}></div>
            <h2 className="text-lg uppercase tracking-widest text-gray-500 font-light">
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact row */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-500 mb-8">
            {resumeInfo?.email && (
              <a href={`mailto:${resumeInfo.email}`} className="hover:text-gray-800 transition-colors">
                {resumeInfo.email}
              </a>
            )}
            
            {resumeInfo?.phone && (
              <a href={`tel:${resumeInfo.phone}`} className="hover:text-gray-800 transition-colors">
                {resumeInfo.phone}
              </a>
            )}
            
            {resumeInfo?.address && (
              <span>{resumeInfo.address}</span>
            )}
            
            {resumeInfo?.linkedinUrl && (
              <a 
                href={formatUrl(resumeInfo.linkedinUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-800 transition-colors"
              >
                LinkedIn
              </a>
            )}
            
            {resumeInfo?.githubUrl && (
              <a 
                href={formatUrl(resumeInfo.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-800 transition-colors"
              >
                GitHub
              </a>
            )}
            
            {resumeInfo?.portfolioUrl && (
              <a 
                href={formatUrl(resumeInfo.portfolioUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-800 transition-colors"
              >
                Portfolio
              </a>
            )}
          </div>
          
          {/* Summary */}
          {resumeInfo?.summary && (
            <div className="mb-10">
              <p className="text-sm leading-relaxed text-gray-600 text-center max-w-3xl mx-auto">
                {resumeInfo.summary}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Thin divider */}
      <div className="h-px w-full max-w-5xl mx-auto" style={{ backgroundColor: `${themeColor}20` }}></div>
      
      {/* Main content */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left column - Skills & Education */}
            <div className="space-y-10">
              {/* Skills */}
              {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Skills
                  </h3>
                  
                  <div className="space-y-1">
                    {resumeInfo.skills.map((skill, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Education */}
              {resumeInfo?.education && resumeInfo.education.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Education
                  </h3>
                  
                  <div className="space-y-6">
                    {resumeInfo.education.map((edu, index) => (
                      <div key={index} className="mb-3">
                        <h4 className="text-sm font-medium text-gray-800">
                          {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                        </h4>
                        
                        <h5 className="text-xs text-gray-600 mt-1 mb-1">
                          {edu.universityName}
                        </h5>
                        
                        <div className="text-xs text-gray-500">
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </div>
                        
                        {edu.grade && (
                          <div className="text-xs text-gray-700 mt-1 italic">
                            {edu.gradeType}: {edu.grade}
                          </div>
                        )}
                        
                        {edu.description && (
                          <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Certifications */}
              {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Certifications
                  </h3>
                  
                  <div className="space-y-4">
                    {resumeInfo.certifications.map((cert, index) => (
                      <div key={index} className="mb-3">
                        <h4 className="text-sm font-medium text-gray-800">
                          {cert.name}
                        </h4>
                        
                        <h5 className="text-xs text-gray-600 mt-1 mb-1">
                          {cert.issuer}
                        </h5>
                        
                        {cert.date && (
                          <div className="text-xs text-gray-500">
                            {cert.date}
                          </div>
                        )}
                        
                        {cert.description && (
                          <p className="text-xs text-gray-600 mt-1">{cert.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            
            {/* Right column - Experience & Projects */}
            <div className="md:col-span-2 space-y-10">
              {/* Experience */}
              {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Experience
                  </h3>
                  
                  <div className="space-y-8">
                    {resumeInfo.experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex flex-wrap justify-between items-baseline mb-1">
                          <h4 className="text-base font-medium text-gray-800">
                            {exp.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                            {exp.currentlyWorking ? "Present" : exp.endDate}
                          </span>
                        </div>
                        
                        <h5 className="text-sm text-gray-600 mb-3 italic">
                          {exp.companyName}
                          {exp.city && exp.companyName ? ", " : ""}
                          {exp.city}
                          {exp.city && exp.state ? ", " : ""}
                          {exp.state}
                        </h5>
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Projects */}
              {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Projects
                  </h3>
                  
                  <div className="space-y-6">
                    {resumeInfo.projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <h4 className="text-base font-medium text-gray-800">
                            {project.projectName}
                          </h4>
                          
                          <div className="flex gap-3 text-xs">
                            {project?.githubLink && (
                              <a 
                                href={formatUrl(project.githubLink)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="underline"
                                style={{ color: themeColor }}
                              >
                                GitHub
                              </a>
                            )}
                            
                            {project?.deployedLink && (
                              <a 
                                href={formatUrl(project.deployedLink)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="underline"
                                style={{ color: themeColor }}
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {project.techStack && (
                          <p className="text-xs text-gray-500 mb-2 italic">
                            {project.techStack}
                          </p>
                        )}
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple footer */}
      <div className="h-1 w-full" style={{ backgroundColor: themeColor }}></div>
    </div>
  );
};

// DigitalCard Template - Refined, minimalist card design with subtle accents
const DigitalCardTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#374151"; // Default to gray-700
  
  // Function to create lighter shade of theme color
  const createLighterColor = (color, opacity) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };
  
  return (
    <div className="shadow-sm bg-white h-full rounded-md overflow-hidden">
      {/* Header with simple elegant design */}
      <div className="p-8 border-b" style={{ borderColor: `${themeColor}20` }}>
        <div className="max-w-4xl mx-auto">
          {/* Name and title */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-light tracking-wide mb-2 text-gray-900">
                {resumeInfo?.firstName} {resumeInfo?.lastName}
              </h1>
              <h2 className="text-lg font-light tracking-wide text-gray-500">
                {resumeInfo?.jobTitle}
              </h2>
            </div>
            
            {/* Contact info in right column */}
            <div className="text-right text-sm text-gray-500 space-y-1">
              {resumeInfo?.email && (
                <div>{resumeInfo.email}</div>
              )}
              {resumeInfo?.phone && (
                <div>{resumeInfo.phone}</div>
              )}
              {resumeInfo?.address && (
                <div>{resumeInfo.address}</div>
              )}
            </div>
          </div>
          
          {/* Horizontal divider with accent color */}
          <div className="h-px w-16 mx-auto my-4" style={{ backgroundColor: themeColor }}></div>
          
          {/* Social links centered */}
          <div className="flex justify-center gap-6 mb-6">
            {resumeInfo?.linkedinUrl && (
              <a 
                href={formatUrl(resumeInfo.linkedinUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            )}
            
            {resumeInfo?.githubUrl && (
              <a 
                href={formatUrl(resumeInfo.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            
            {resumeInfo?.portfolioUrl && (
              <a 
                href={formatUrl(resumeInfo.portfolioUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
          </div>
          
          {/* Summary */}
          {resumeInfo?.summary && (
            <div className="mb-4">
              <p className="text-sm leading-relaxed text-gray-600 text-center max-w-3xl mx-auto">
                {resumeInfo.summary}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left column - Skills & Education */}
            <div className="space-y-10">
              {/* Skills */}
              {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-6 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Skills
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {resumeInfo.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 text-xs rounded-md border"
                        style={{ 
                          borderColor: `${themeColor}30`,
                          color: 'gray'
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Education */}
              {resumeInfo?.education && resumeInfo.education.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-6 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Education
                  </h3>
                  
                  <div className="space-y-6">
                    {resumeInfo.education.map((edu, index) => (
                      <div key={index} className="mb-3">
                        <h4 className="text-sm font-medium text-gray-800">
                          {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                        </h4>
                        
                        <h5 className="text-xs text-gray-600 mt-1 mb-1">
                          {edu.universityName}
                        </h5>
                        
                        <div className="text-xs text-gray-500">
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </div>
                        
                        {edu.grade && (
                          <div className="text-xs text-gray-700 mt-1 italic">
                            {edu.gradeType}: {edu.grade}
                          </div>
                        )}
                        
                        {edu.description && (
                          <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Certifications */}
              {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-6 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Certifications
                  </h3>
                  
                  <div className="space-y-4">
                    {resumeInfo.certifications.map((cert, index) => (
                      <div key={index} className="mb-3">
                        <h4 className="text-sm font-medium text-gray-800">
                          {cert.name}
                        </h4>
                        
                        <h5 className="text-xs text-gray-600 mt-1 mb-1">
                          {cert.issuer}
                        </h5>
                        
                        {cert.date && (
                          <div className="text-xs text-gray-500">
                            {cert.date}
                          </div>
                        )}
                        
                        {cert.description && (
                          <p className="text-xs text-gray-600 mt-1">{cert.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            
            {/* Right column - Experience & Projects */}
            <div className="md:col-span-2 space-y-10">
              {/* Experience */}
              {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-6 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Experience
                  </h3>
                  
                  <div className="space-y-8">
                    {resumeInfo.experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex flex-wrap justify-between items-baseline mb-1">
                          <h4 className="text-base font-medium text-gray-800">
                            {exp.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                            {exp.currentlyWorking ? "Present" : exp.endDate}
                          </span>
                        </div>
                        
                        <h5 className="text-sm text-gray-600 mb-3 italic">
                          {exp.companyName}
                          {exp.city && exp.companyName ? ", " : ""}
                          {exp.city}
                          {exp.city && exp.state ? ", " : ""}
                          {exp.state}
                        </h5>
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Projects */}
              {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-6 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Projects
                  </h3>
                  
                  <div className="space-y-6">
                    {resumeInfo.projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <h4 className="text-base font-medium text-gray-800">
                            {project.projectName}
                          </h4>
                          
                          <div className="flex gap-3 text-xs">
                            {project?.githubLink && (
                              <a 
                                href={formatUrl(project.githubLink)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="underline"
                                style={{ color: themeColor }}
                              >
                                GitHub
                              </a>
                            )}
                            
                            {project?.deployedLink && (
                              <a 
                                href={formatUrl(project.deployedLink)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="underline"
                                style={{ color: themeColor }}
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {project.techStack && (
                          <p className="text-xs text-gray-500 mb-2 italic">
                            {project.techStack}
                          </p>
                        )}
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple footer */}
      <div className="h-1 w-full" style={{ backgroundColor: themeColor }}></div>
    </div>
  );
};

  // Render the appropriate template based on the template property
  const renderTemplate = () => {
    switch(resumeData?.template) {
      case "professional":
        return <ProfessionalTemplate resumeInfo={resumeData} />;
      case "creative":
        return <CreativeTemplate resumeInfo={resumeData} />;
      case "minimalist":
        return <MinimalistTemplate resumeInfo={resumeData} />;
      case "executive":
        return <ExecutiveTemplate resumeInfo={resumeData} />;
      case "creative-modern":
        return <CreativeModernTemplate resumeInfo={resumeData} />;
      case "tech-startup":
        return <TechStartupTemplate resumeInfo={resumeData} />;
      case "elegant-portfolio":
        return <ElegantPortfolioTemplate resumeInfo={resumeData} />;
      case "modern-timeline":
        return <ModernTimelineTemplate resumeInfo={resumeData} />;
      case "modern-grid":
        return <ModernGridTemplate resumeInfo={resumeData} />;
      case "modern-sidebar":
        return <ModernSidebarTemplate resumeInfo={resumeData} />;
      case "gradient-accent":
        return <GradientAccentTemplate resumeInfo={resumeData} />;
      case "bold-impact":
        return <BoldImpactTemplate resumeInfo={resumeData} />;
      case "split-frame":
        return <SplitFrameTemplate resumeInfo={resumeData} />;
      case "minimalist-pro":
        return <MinimalistProTemplate resumeInfo={resumeData} />;
      case "digital-card":
        return <DigitalCardTemplate resumeInfo={resumeData} />;
      case "modern":
      default:
        return <ModernTemplate resumeInfo={resumeData} />;
    }
  };
  
  return renderTemplate();
}

export default PreviewPage;