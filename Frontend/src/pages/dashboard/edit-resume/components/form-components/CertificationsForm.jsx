import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  X, 
  Award, 
  Calendar, 
  Building2,
  LoaderCircle,
  Plus,
  Trash2,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { updateThisResume } from "@/Services/resumeAPI";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";

// AI prompt for generating certificate descriptions - with explicit warning
const DESCRIPTION_PROMPT = `Write a description of my {certName} certification from {issuer}.

CRITICAL INSTRUCTIONS: 
- Your response must be EXACTLY two plain lines of text.
- DO NOT include square brackets [], quote marks "", or any other delimiter.
- DO NOT format your response as JSON, an array, or code.
- DO NOT include bullet points, numbers, or any special characters.
- DO NOT start or end your response with quotes or brackets.

For example, if writing about AWS certification, write:
Proficient in AWS cloud architecture and deployment of scalable solutions.
Experienced in implementing secure infrastructure and optimizing cloud resources.

Simply provide two clean, professional lines like the example above.`;

const formFields = {
  name: "",
  issuer: "",
  date: "",
  description: "",
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function CertificationsForm({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [certificatesList, setCertificatesList] = useState(
    resumeInfo?.certifications || []
  );
  const [datePickerOpen, setDatePickerOpen] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first, "asc" = oldest first
  const [isSorting, setIsSorting] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(0);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, certifications: certificatesList }));
  }, [certificatesList]);

  useEffect(() => {
    // Close date picker when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.date-picker-container') && !event.target.closest('.date-picker-trigger')) {
        setDatePickerOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const AddNewCertificate = () => {
    const newList = [...certificatesList, { ...formFields }];
    setCertificatesList(newList);
    setActiveCertificate(newList.length - 1);
  };

  const RemoveCertificate = (index) => {
    const newList = certificatesList.filter((_, i) => i !== index);
    setCertificatesList(newList);
    if (activeCertificate >= newList.length) {
      setActiveCertificate(Math.max(0, newList.length - 1));
    }
    
    toast("Certification removed", {
      description: "Your certification has been removed successfully."
    });
  };

  // Sort certifications based on date
  const sortCertificates = () => {
    setIsSorting(true);
    
    const sorted = [...certificatesList].sort((a, b) => {
      // Compare dates if available
      if (a.date && b.date) {
        // Try to parse as dates
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Check if dates are valid
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        }
        
        // Fallback to string comparison if dates are not valid
        return sortOrder === "desc" 
          ? b.date.localeCompare(a.date) 
          : a.date.localeCompare(b.date);
      }
      
      // Fallback to certificate names if dates are not available
      return sortOrder === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    });
    
    setCertificatesList(sorted);
    
    // Show sorting animation
    setTimeout(() => {
      setIsSorting(false);
      
      toast("Certifications sorted", {
        description: `Sorted from ${sortOrder === "desc" ? "newest to oldest" : "oldest to newest"}`,
        duration: 2000,
      });
    }, 500);
  };

  // Toggle sort order and then sort
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    
    // Sort after state update
    setTimeout(sortCertificates, 0);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...certificatesList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setCertificatesList(list);
    if (enanbledNext) enanbledNext(false);
    if (enanbledPrev) enanbledPrev(false);
  };

  // Generate description using AI based on certification name and issuer
  const generateDescriptionFromAI = async (index) => {
    const certificate = certificatesList[index];
    
    if (!certificate.name) {
      toast("Certification Name Required", {
        description: "Please add a certification name to generate a description",
        variant: "destructive"
      });
      return;
    }

    setAiGenerating(true);
    try {
      let prompt = DESCRIPTION_PROMPT.replace(/\{certName\}/g, certificate.name);
      prompt = prompt.replace(/\{issuer\}/g, certificate.issuer || "the issuing organization");
      
      const result = await AIChatSession.sendMessage(prompt);
      let description = result.response.text();
      
      // Aggressively clean the response to remove all JSON-like formatting
      description = description
        .replace(/^\s*\[|\]\s*$/g, '')                // Remove enclosing square brackets
        .replace(/^["'`]|["'`]$/gm, '')               // Remove quotes at start/end of each line
        .replace(/^\s*,\s*$/gm, '')                   // Remove comma-only lines
        .replace(/^\s*\{|\}\s*$/g, '')                // Remove curly braces
        .replace(/["'`][,\s]*["'`]/g, '\n')           // Replace quoted comma separators with newlines
        .replace(/\\n/g, '\n')                        // Convert literal \n to actual line breaks
        .split('\n')                                   // Split into lines
        .map(line => line.trim())                      // Trim each line
        .filter(line => line && !line.match(/^["'`,:{}\[\]\\]$/)) // Remove lines with only special chars
        .slice(0, 2)                                   // Take only first two lines
        .join('\n');                                   // Join back with newlines
      
      // Update the certificate description
      handleChange({ target: { name: "description", value: description } }, index);
      
      toast("AI Description Generated", {
        description: `Generated description for ${certificate.name}`,
      });
    } catch (error) {
      toast("Generation Failed", {
        description: error.message || "An error occurred while generating the description",
        variant: "destructive"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const toggleDatePicker = (index, field) => {
    if (datePickerOpen === `${index}-${field}`) {
      setDatePickerOpen(null);
    } else {
      setDatePickerOpen(`${index}-${field}`);
    }
  };

  const handleDateSelection = (index, field, year, month, day) => {
    const formattedDate = `${months[month]} ${year}`;
    handleChange({ target: { name: field, value: formattedDate } }, index);
    setDatePickerOpen(null);
  };

  const DatePicker = ({ index, field, value }) => {
    const isOpen = datePickerOpen === `${index}-${field}`;
    
    // Parse the date value or use current date as default
    let selectedDate = new Date();
    if (value) {
      const parts = value.split(' ');
      if (parts.length === 2) {
        const monthIndex = months.findIndex(m => m === parts[0]);
        if (monthIndex !== -1) {
          selectedDate = new Date(parseInt(parts[1]), monthIndex, 1);
        }
      }
    }
    
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    
    const previousMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };
    
    const nextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };
    
    const previousYear = () => {
      setCurrentYear(currentYear - 1);
    };
    
    const nextYear = () => {
      setCurrentYear(currentYear + 1);
    };
    
    // Check if this month/year is the selected one
    const isSelectedMonthYear = value && 
      value.includes(months[currentMonth]) && 
      value.includes(currentYear.toString());
    
    return (
      <div className="relative w-full">
        <div
          className="date-picker-trigger flex items-center w-full relative cursor-pointer border border-gray-300 rounded-md px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
          onClick={() => toggleDatePicker(index, field)}
        >
          {value ? (
            <span className="flex-1">{value}</span>
          ) : (
            <span className="text-gray-400 flex-1">Select date</span>
          )}
          <Calendar className="h-4 w-4 text-primary ml-2" />
        </div>
        
        {isOpen && (
          <div className="date-picker-container absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <button
                  onClick={previousYear}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="mx-2 font-medium">{currentYear}</span>
                <button
                  onClick={nextYear}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center">
                <button
                  onClick={previousMonth}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="mx-2 font-medium w-20 text-center">{months[currentMonth]}</span>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <button
                className={`w-full py-2 rounded-md flex items-center justify-center text-sm transition-colors duration-200 ${
                  isSelectedMonthYear 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-primary/10 text-gray-700 border border-gray-200'
                }`}
                onClick={() => handleDateSelection(index, field, currentYear, currentMonth, 1)}
              >
                {months[currentMonth]} {currentYear}
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:bg-primary/10 mr-2"
                onClick={() => setDatePickerOpen(null)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  const today = new Date();
                  handleDateSelection(
                    index, 
                    field, 
                    today.getFullYear(), 
                    today.getMonth(), 
                    1
                  );
                }}
              >
                Current Month
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to get certificate description for display
  const getCertificateDescription = (certificate) => {
    if (!certificate.name && !certificate.issuer) {
      return "Certificate details";
    }
    
    if (certificate.name) {
      return certificate.name;
    }
    
    return certificate.issuer || "Certificate details";
  };

  // Animation class for sorting
  const getSortAnimationClass = (index) => {
    if (!isSorting) return "";
    return "animate-pulse bg-primary/5";
  };

  const onSave = () => {
    if (certificatesList.length === 0) {
      return toast("No certifications to save", {
        description: "Add at least one certification to save",
        duration: 3000,
      });
    }
    setLoading(true);
    const data = {
      data: {
        certifications: certificatesList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Certifications");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Certifications updated", {
            description: "Your certifications have been saved successfully",
            action: {
              label: "OK",
              onClick: () => console.log("Notification closed")
            },
          });
        })
        .catch((error) => {
          toast("Error updating certifications", {
            description: `${error.message}`,
            action: {
              label: "Try Again",
              onClick: () => onSave()
            },
          });
        })
        .finally(() => {
          setLoading(false);
          if (enanbledNext) enanbledNext(true);
          if (enanbledPrev) enanbledPrev(true);
        });
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Professional Certifications</h2>
          </div>
          
          {certificatesList.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="border-primary/60 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort {sortOrder === "desc" ? "Newest" : "Oldest"} First
              {sortOrder === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUp className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
        <p className="text-gray-500 mb-6">Add your professional certifications to enhance your resume</p>
        
        {certificatesList.length === 0 && (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
            <Award className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-2">No certifications added yet</h3>
            <p className="text-gray-400 mb-4">Add your professional certifications to enhance your resume</p>
            <Button 
              onClick={AddNewCertificate}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Certification
            </Button>
          </div>
        )}

        {certificatesList.length > 0 && (
          <div className="space-y-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
              {certificatesList.map((item, index) => (
                <Button
                  key={`tab-${index}`}
                  variant={activeCertificate === index ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    activeCertificate === index ? "bg-primary" : "border-primary text-primary"
                  }`}
                  onClick={() => setActiveCertificate(index)}
                >
                  <span className={`flex items-center justify-center ${activeCertificate === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>
                    {index + 1}
                  </span>
                  {getCertificateDescription(item)}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap"
                onClick={AddNewCertificate}
              >
                <Plus className="h-4 w-4 mr-2" /> Add More
              </Button>
            </div>
            
            {certificatesList.map((item, index) => (
              <div
                key={`content-${index}`}
                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${getSortAnimationClass(index)} ${activeCertificate === index ? "block" : "hidden"}`}
              >
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{getCertificateDescription(item)}</span>
                    {item.date && (
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        {item.date}
                      </span>
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                    onClick={() => RemoveCertificate(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Certification Name*
                    </label>
                    <Input
                      name="name"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.name || ""}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. AWS Certified Solutions Architect"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Issuing Organization*
                    </label>
                    <Input
                      name="issuer"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.issuer || ""}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Amazon Web Services"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Date Received
                    </label>
                    <DatePicker
                      index={index}
                      field="date"
                      value={item?.date || ""}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Description
                      </label>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateDescriptionFromAI(index)}
                        disabled={aiGenerating || !item.name}
                        className="h-8 border-purple-300 text-purple-700 hover:bg-purple-50 transition-all"
                      >
                        {aiGenerating ? (
                          <><LoaderCircle className="h-3 w-3 animate-spin mr-1.5" /> Generating...</>
                        ) : (
                          <><Sparkles className="h-3 w-3 mr-1.5" /> Generate with AI</>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      name="description"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.description || ""}
                      className="min-h-24 resize-y border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="Describe your certification, skills gained, and its relevance to your career"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {certificatesList.length > 0 && (
            <Button
              variant="outline"
              onClick={AddNewCertificate}
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> 
              Add {certificatesList.length > 0 ? "Another" : ""} Certification
            </Button>
          )}
          
          {certificatesList.length > 0 && (
            <Button 
              disabled={loading} 
              onClick={onSave}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <><LoaderCircle className="h-4 w-4 animate-spin mr-2" /> Saving...</>
              ) : (
                "Save Certifications"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertificationsForm;