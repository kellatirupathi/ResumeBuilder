import React from "react";
import { Award, Calendar } from "lucide-react";

function CertificationsPreview({ resumeInfo }) {
  // Exit early if no certifications exist
  if (!resumeInfo?.certifications || resumeInfo.certifications.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      <div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2
            className="text-center font-bold text-sm"
            style={{ color: resumeInfo?.themeColor }}
          >
            CERTIFICATIONS
          </h2>
        </div>
        <hr style={{ borderColor: resumeInfo?.themeColor }} />
      </div>

      {resumeInfo.certifications.map((certification, index) => (
        <div key={index} className={index === 0 ? "mt-2 mb-5" : "my-5"}>
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {certification.name}
          </h2>
          
          <div className="flex justify-between items-start mt-1">
            <h3 className="text-xs">
              {certification.issuer}
            </h3>
            
            {certification?.date && (
              <span className="text-xs text-gray-600 flex items-center whitespace-nowrap ml-2">
                <Calendar className="h-3 w-3 mr-1 inline-block" />
                {certification.date}
              </span>
            )}
          </div>
          
          {certification?.description && (
            <p className="text-xs mt-2 text-gray-700">{certification.description}</p>
          )}
          
          {index < resumeInfo.certifications.length - 1 && (
            <div 
              className="mt-4 border-b" 
              style={{ borderColor: `${resumeInfo?.themeColor}20` }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CertificationsPreview;