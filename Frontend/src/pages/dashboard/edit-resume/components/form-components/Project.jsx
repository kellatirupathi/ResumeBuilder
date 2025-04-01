import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Code, LoaderCircle } from "lucide-react";
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => {
    setProjectList([...projectList, formFields]);
  };

  const removeProject = (index) => {
    const newList = projectList.filter((_, i) => i !== index);
    setProjectList(newList);
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
          toast("Project details updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Projects</h2>
      <p>Showcase your hands-on projects to demonstrate your practical skills</p>

      <div>
        {projectList?.map((project, index) => (
          <div
            key={index}
            className="mb-4 mt-5 border rounded-lg p-3"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Project {index + 1}</h3>
              <Button
                variant="ghost"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-white hover:bg-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs">Project Name</label>
                <Input
                  type="text"
                  name="projectName"
                  value={project?.projectName || ""}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="e.g. E-commerce Website"
                />
              </div>
              
              <div>
                <label className="text-xs">Tech Stack</label>
                <Input
                  type="text"
                  name="techStack"
                  value={project?.techStack || ""}
                  placeholder="e.g. React, Node.js, MongoDB"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              
              {/* New GitHub Link field */}
              <div>
                <label className="text-xs">GitHub Repository URL</label>
                <Input
                  type="text"
                  name="githubLink"
                  value={project?.githubLink || ""}
                  placeholder="e.g. github.com/username/project"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              
              {/* New Deployed Link field */}
              <div>
                <label className="text-xs">Live Demo URL</label>
                <Input
                  type="text"
                  name="deployedLink"
                  value={project?.deployedLink || ""}
                  placeholder="e.g. myproject.com"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            </div>
            
            <SimpeRichTextEditor
              index={index}
              defaultValue={project?.projectSummary}
              onRichTextEditorChange={(event) =>
                handleRichTextEditor(event, "projectSummary", index)
              }
              resumeInfo={resumeInfo}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={addProject}
          className="text-primary"
        >
          {" "}
          + Add More Project
        </Button>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Project;