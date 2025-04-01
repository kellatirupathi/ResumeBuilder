import React, { useEffect } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Reset scroll position to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch resume data including template information
    getResumeData(resume_id).then((data) => {
      console.log("Fetched resume data with template:", data.data.template);
      dispatch(addResumeData(data.data));
    }).catch(error => {
      console.error("Error fetching resume data:", error);
    });
  }, [resume_id, dispatch]);
  
  return (
    <div className="flex flex-col md:flex-row p-0 md:py-6 md:gap-1">
      {/* Keep the ResumeForm width unchanged but remove left padding */}
      <div className="md:w-1/2 md:pr-0 md:pl-2">
        <ResumeForm />
      </div>
      
      {/* Increase PreviewPage width to cover the gap and remove right gap */}
      <div className="md:w-1/2 md:grow lg:pr-0 mt-6 md:mt-0">
        <div className="md:w-full lg:w-[100%] xl:w-[100%]">
          <PreviewPage />
        </div>
      </div>
    </div>
  );
}

export default EditResume;