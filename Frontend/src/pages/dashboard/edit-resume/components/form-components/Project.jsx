import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Code, LoaderCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
  githubLink: "",
  deployedLink: "",
};

function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [projectList, setProjectList] = useState(resumeInfo?.projects || []);
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const [activeProject, setActiveProject] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => {
    const newList = [...projectList, formFields];
    setProjectList(newList);
    setActiveProject(newList.length - 1);
  };

  const removeProject = (index) => {
    const newList = projectList.filter((_, i) => i !== index);
    setProjectList(newList);
    if (activeProject >= newList.length) {
      setActiveProject(Math.max(0, newList.length - 1));
    }
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...projectList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setProjectList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...projectList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setProjectList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        projects: projectList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Project");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Project details updated successfully!", {
            description: "Your projects have been saved.",
            action: {
              label: "OK",
              onClick: () => console.log("Notification closed")
            },
          });
        })
        .catch((error) => {
          toast("Error updating resume", {
            description: `${error.message}`,
            action: {
              label: "Try Again",
              onClick: () => onSave()
            },
          });
        })
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Code className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        </div>
        <p className="text-gray-500 mb-6">Showcase your hands-on projects to demonstrate your practical skills</p>
        
        {projectList.length === 0 && (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
            <Code className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-2">No projects added yet</h3>
            <p className="text-gray-400 mb-4">Add your projects to showcase your technical skills</p>
            <Button 
              onClick={addProject}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </div>
        )}
        
        {projectList.length > 0 && (
          <div className="space-y-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
              {projectList.map((project, index) => (
                <Button
                  key={`tab-${index}`}
                  variant={activeProject === index ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    activeProject === index ? "bg-primary" : "border-primary text-primary"
                  }`}
                  onClick={() => setActiveProject(index)}
                >
                  <span className={`flex items-center justify-center ${activeProject === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>
                    {index + 1}
                  </span>
                  {project.projectName || `Project ${index + 1}`}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap"
                onClick={addProject}
              >
                <Plus className="h-4 w-4 mr-2" /> Add More
              </Button>
            </div>
            
            {projectList.map((project, index) => (
              <div
                key={`content-${index}`}
                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${activeProject === index ? "block" : "hidden"}`}
              >
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{project.projectName || `Project ${index + 1}`}</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Project Name</label>
                    <Input
                      type="text"
                      name="projectName"
                      value={project?.projectName || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. E-commerce Website"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tech Stack</label>
                    <Input
                      type="text"
                      name="techStack"
                      value={project?.techStack || ""}
                      placeholder="e.g. React, Node.js, MongoDB"
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">GitHub Repository URL</label>
                    <Input
                      type="text"
                      name="githubLink"
                      value={project?.githubLink || ""}
                      placeholder="e.g. github.com/username/project"
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Live Demo URL</label>
                    <Input
                      type="text"
                      name="deployedLink"
                      value={project?.deployedLink || ""}
                      placeholder="e.g. myproject.com"
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    />
                  </div>
                  
                  <div className="col-span-full mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Project Description</label>
                    <SimpeRichTextEditor
                      index={index}
                      defaultValue={project?.projectSummary}
                      onRichTextEditorChange={(event) =>
                        handleRichTextEditor(event, "projectSummary", index)
                      }
                      resumeInfo={resumeInfo}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {projectList.length > 0 && (
            <Button
              onClick={addProject}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> 
              Add {projectList.length > 0 ? "Another" : ""} Project
            </Button>
          )}
          
          {projectList.length > 0 && (
            <Button 
              onClick={onSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save Projects"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;