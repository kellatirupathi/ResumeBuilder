import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, Briefcase, Building, MapPin, Calendar, Plus, Check } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  workSummary: "",
};

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false);
  const { resume_id } = useParams();
  const [activeExperience, setActiveExperience] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
    } catch (error) {
      console.log("error in experience context update", error.message);
    }
  }, [experienceList]);

  const addExperience = () => {
    if (!experienceList) {
      setExperienceList([formFields]);
      return;
    }
    const newList = [...experienceList, formFields];
    setExperienceList(newList);
    setActiveExperience(newList.length - 1);
  };

  const removeExperience = (index) => {
    const list = [...experienceList];
    const newList = list.filter((item, i) => {
      if (i !== index) return true;
    });
    setExperienceList(newList);
    if (activeExperience >= newList.length) {
      setActiveExperience(Math.max(0, newList.length - 1));
    }
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const handleCheckboxChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { checked } = e.target;
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      currentlyWorking: checked,
      endDate: checked ? "" : list[index].endDate, // Clear end date if currently working
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        experience: experienceList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Experience");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Experience details updated successfully!", {
            description: "Your work history has been saved.",
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
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
        </div>
        <p className="text-gray-500 mb-6">Add your relevant work history to showcase your professional journey</p>
        
        {experienceList?.length === 0 && (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
            <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-2">No experience added yet</h3>
            <p className="text-gray-400 mb-4">Add your work history to make your resume stand out</p>
            <Button 
              onClick={addExperience}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Work Experience
            </Button>
          </div>
        )}
        
        {experienceList?.length > 0 && (
          <div className="space-y-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
              {experienceList.map((experience, index) => (
                <Button
                  key={`tab-${index}`}
                  variant={activeExperience === index ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    activeExperience === index ? "bg-primary" : "border-primary text-primary"
                  }`}
                  onClick={() => setActiveExperience(index)}
                >
                  <span className={`flex items-center justify-center ${activeExperience === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>
                    {index + 1}
                  </span>
                  {experience.title || experience.companyName || `Experience ${index + 1}`}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap"
                onClick={addExperience}
              >
                <Plus className="h-4 w-4 mr-2" /> Add More
              </Button>
            </div>
            
            {experienceList.map((experience, index) => (
              <div
                key={`content-${index}`}
                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${activeExperience === index ? "block" : "hidden"}`}
              >
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{experience.title || experience.companyName || `Experience ${index + 1}`}</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Position Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={experience?.title || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      Company Name
                    </label>
                    <Input
                      type="text"
                      name="companyName"
                      value={experience?.companyName || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Acme Corporation"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={experience?.city || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. San Francisco"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      State/Country
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={experience?.state || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. California"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Start Date
                    </label>
                    <div className="relative">
                      <Input
                        type="month"
                        name="startDate"
                        value={experience?.startDate ? experience.startDate.substring(0, 7) : ""}
                        onChange={(e) => handleChange(e, index)}
                        className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                        placeholder="Select start date"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {experience?.startDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatMonthYear(experience.startDate)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        End Date
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`currently-working-${index}`}
                          checked={!!experience?.currentlyWorking}
                          onChange={(e) => handleCheckboxChange(e, index)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`currently-working-${index}`}
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          Present (Current job)
                        </label>
                      </div>
                    </div>
                    <div className="relative">
                      {experience?.currentlyWorking ? (
                        <div className="p-2 border rounded-md bg-gray-50 border-gray-300 text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 text-primary mr-2" />
                          Present
                        </div>
                      ) : (
                        <>
                          <Input
                            type="month"
                            name="endDate"
                            value={experience?.endDate ? experience.endDate.substring(0, 7) : ""}
                            onChange={(e) => handleChange(e, index)}
                            className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                            placeholder="Select end date"
                            min={experience?.startDate ? experience.startDate.substring(0, 7) : ""}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-400" />
                          </div>
                        </>
                      )}
                    </div>
                    {experience?.endDate && !experience?.currentlyWorking && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatMonthYear(experience.endDate)}
                      </p>
                    )}
                  </div>
                  <div className="col-span-full mt-4">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-primary" />
                      Work Description
                    </label>
                    <RichTextEditor
                      index={index}
                      defaultValue={experience?.workSummary}
                      onRichTextEditorChange={(event) =>
                        handleRichTextEditor(event, "workSummary", index)
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
          {experienceList?.length > 0 && (
            <Button
              onClick={addExperience}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> 
              Add {experienceList?.length > 0 ? "Another" : ""} Experience
            </Button>
          )}
          
          {experienceList?.length > 0 && (
            <Button 
              onClick={onSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save Experiences"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Experience;