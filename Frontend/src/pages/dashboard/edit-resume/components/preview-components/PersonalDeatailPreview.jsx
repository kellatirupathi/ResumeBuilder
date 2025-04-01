import React from "react";

function PersonalDeatailPreview({ resumeInfo }) {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    
    // If it doesn't start with http:// or https://, add https://
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="-mt-1 pt-0">
      <h2
        className="font-bold text-xl text-center mt-0"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <h2 className="text-center text-sm font-medium">
        {resumeInfo?.jobTitle}
      </h2>
      <h2
        className="text-center font-normal text-xs"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        {resumeInfo?.address}
      </h2>

      <div className="flex justify-center items-center flex-wrap gap-3 mt-1">
        <h2
          className="font-normal text-xs"
          style={{
            color: resumeInfo?.themeColor,
          }}
        >
          {resumeInfo?.phone}
        </h2>
        <span className="text-xs text-gray-400">•</span>
        <h2
          className="font-normal text-xs"
          style={{
            color: resumeInfo?.themeColor,
          }}
        >
          {resumeInfo?.email}
        </h2>
        
        {/* New social links section */}
        {(resumeInfo?.githubUrl || resumeInfo?.linkedinUrl || resumeInfo?.portfolioUrl) && (
          <>
            <span className="text-xs text-gray-400">•</span>
            <div className="flex items-center flex-wrap gap-2">
              {resumeInfo?.githubUrl && (
                <a 
                  href={formatUrl(resumeInfo.githubUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-normal text-xs"
                  style={{ color: resumeInfo?.themeColor }}
                >
                  GitHub
                </a>
              )}
              
              {resumeInfo?.githubUrl && resumeInfo?.linkedinUrl && (
                <span className="text-xs text-gray-400">•</span>
              )}
              
              {resumeInfo?.linkedinUrl && (
                <a 
                  href={formatUrl(resumeInfo.linkedinUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-normal text-xs"
                  style={{ color: resumeInfo?.themeColor }}
                >
                  LinkedIn
                </a>
              )}
              
              {resumeInfo?.portfolioUrl && (resumeInfo?.githubUrl || resumeInfo?.linkedinUrl) && (
                <span className="text-xs text-gray-400">•</span>
              )}
              
              {resumeInfo?.portfolioUrl && (
                <a 
                  href={formatUrl(resumeInfo.portfolioUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-normal text-xs"
                  style={{ color: resumeInfo?.themeColor }}
                >
                  Portfolio
                </a>
              )}
            </div>
          </>
        )}
      </div>

      <hr
        className="border-[1.5px] my-2"
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />
    </div>
  );
}

export default PersonalDeatailPreview;