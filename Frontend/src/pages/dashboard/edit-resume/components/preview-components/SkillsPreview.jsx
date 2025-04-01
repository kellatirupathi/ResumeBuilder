import React from "react";

function SkillsPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      {resumeInfo?.skills.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-2"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            SKILLS
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}
      <div className="flex flex-col gap-2 my-4">
        {resumeInfo?.skills.map((skill, index) => (
          <div key={index} className="flex items-center">
            <h2 className="text-xs">{skill.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview;