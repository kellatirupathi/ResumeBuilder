import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LoaderCircle, 
  GraduationCap, 
  School, 
  BookOpen, 
  Calendar, 
  Award, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown,
  ArrowDown,
  ArrowUp 
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Function to get education level weight for better sorting
const getEducationLevelWeight = (degree) => {
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

function Education({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [educationalList, setEducationalList] = useState(
    resumeInfo?.education || []
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first, "asc" = oldest first
  const [isSorting, setIsSorting] = useState(false);
  const [activeEducation, setActiveEducation] = useState(0);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, education: educationalList }));
  }, [educationalList]);

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

  const AddNewEducation = () => {
    const newList = [...educationalList, { ...formFields }];
    setEducationalList(newList);
    setActiveEducation(newList.length - 1);
  };

  const RemoveEducation = (index) => {
    const newList = educationalList.filter((_, i) => i !== index);
    setEducationalList(newList);
    if (activeEducation >= newList.length) {
      setActiveEducation(Math.max(0, newList.length - 1));
    }
  };

  // Sort education entries based on date
  const sortEducation = () => {
    setIsSorting(true);
    
    const sorted = [...educationalList].sort((a, b) => {
      // First check if we have end dates to compare
      if (a.endDate && b.endDate) {
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        
        // If dates are equal, try to use education level
        if (dateA.getTime() === dateB.getTime()) {
          const weightA = getEducationLevelWeight(a.degree);
          const weightB = getEducationLevelWeight(b.degree);
          return sortOrder === "desc" ? weightB - weightA : weightA - weightB;
        }
        
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
      
      // If no end dates, try start dates
      if (a.startDate && b.startDate) {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
      
      // If no dates, try to use education level
      const weightA = getEducationLevelWeight(a.degree);
      const weightB = getEducationLevelWeight(b.degree);
      return sortOrder === "desc" ? weightB - weightA : weightA - weightB;
    });
    
    setEducationalList(sorted);
    
    // Show sorting animation
    setTimeout(() => {
      setIsSorting(false);
      
      toast("Education entries sorted", {
        description: `Sorted from ${sortOrder === "desc" ? "highest to lowest" : "lowest to highest"} qualification`,
        duration: 2000,
      });
    }, 500);
  };

  // Toggle sort order and then sort
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    
    // Sort after state update
    setTimeout(sortEducation, 0);
  };

  const onSave = () => {
    if (educationalList.length === 0) {
      return toast("Please add at least one education", {
        description: "Education details are important for your resume",
        duration: 3000,
      });
    }
    setLoading(true);
    const data = {
      data: {
        education: educationalList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Education");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Education details updated", {
            description: "Your educational background has been saved",
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
          setLoading(false);
          if (enanbledNext) enanbledNext(true);
          if (enanbledPrev) enanbledPrev(true);
        });
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...educationalList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setEducationalList(list);
    if (enanbledNext) enanbledNext(false);
    if (enanbledPrev) enanbledPrev(false);
  };

  const toggleDatePicker = (index, field) => {
    if (datePickerOpen === `${index}-${field}`) {
      setDatePickerOpen(null);
    } else {
      setDatePickerOpen(`${index}-${field}`);
    }
  };

  const handleDateSelection = (index, field, year, month, day) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    handleChange({ target: { name: field, value: formattedDate } }, index);
    setDatePickerOpen(null);
  };

  const DatePicker = ({ index, field, value }) => {
    const isOpen = datePickerOpen === `${index}-${field}`;
    const selectedDate = value ? new Date(value) : new Date();
    
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    
    const generateCalendarDays = () => {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      
      const days = [];
      // Add empty slots for days before the first of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      
      return days;
    };
    
    const calendarDays = generateCalendarDays();
    
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
    
    return (
      <div className="relative w-full">
        <div
          className="date-picker-trigger flex items-center w-full relative cursor-pointer border border-gray-300 rounded-md px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
          onClick={() => toggleDatePicker(index, field)}
        >
          {value ? (
            <span className="flex-1">{new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                <div key={i} className="font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={i} className="w-8 h-8"></div>;
                }
                
                const isSelected = value && 
                  new Date(value).getDate() === day && 
                  new Date(value).getMonth() === currentMonth && 
                  new Date(value).getFullYear() === currentYear;
                
                return (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-primary/10 text-gray-700'
                    }`}
                    onClick={() => handleDateSelection(index, field, currentYear, currentMonth, day)}
                  >
                    {day}
                  </button>
                );
              })}
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
                    today.getDate()
                  );
                }}
              >
                Today
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to get degree description for display
  const getDegreeDescription = (education) => {
    if (!education.universityName && !education.degree && !education.major) {
      return "Education details";
    }
    
    let display = "";
    if (education.degree) display += education.degree;
    if (education.major) {
      if (display) display += " in ";
      display += education.major;
    }
    
    if (!display && education.universityName) {
      return education.universityName;
    }
    
    return display || "Education details";
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Animation class for sorting
  const getSortAnimationClass = (index) => {
    if (!isSorting) return "";
    return "animate-pulse bg-primary/5";
  };

  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-primary mt-10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Education</h2>
          </div>
          
          {educationalList.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="border-primary/60 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort {sortOrder === "desc" ? "Highest" : "Oldest"} First
              {sortOrder === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUp className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
        <p className="text-gray-500 mb-6">Add your educational background to highlight your academic qualifications</p>
        
        {educationalList.length === 0 && (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg mb-6 hover:border-primary transition-all duration-300">
            <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-2">No education added yet</h3>
            <p className="text-gray-400 mb-4">Add your educational background to enhance your resume</p>
            <Button 
              onClick={AddNewEducation}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Education
            </Button>
          </div>
        )}

        {educationalList.length > 0 && (
          <div className="space-y-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
              {educationalList.map((item, index) => (
                <Button
                  key={`tab-${index}`}
                  variant={activeEducation === index ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    activeEducation === index ? "bg-primary" : "border-primary text-primary"
                  }`}
                  onClick={() => setActiveEducation(index)}
                >
                  <span className={`flex items-center justify-center ${activeEducation === index ? "bg-white/20 text-white" : "bg-primary/10 text-primary"} h-5 w-5 rounded-full text-xs font-bold`}>
                    {index + 1}
                  </span>
                  {getDegreeDescription(item)}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="border border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 whitespace-nowrap"
                onClick={AddNewEducation}
              >
                <Plus className="h-4 w-4 mr-2" /> Add More
              </Button>
            </div>
            
            {educationalList.map((item, index) => (
              <div
                key={`content-${index}`}
                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${getSortAnimationClass(index)} ${activeEducation === index ? "block" : "hidden"}`}
              >
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center bg-primary/10 text-primary h-6 w-6 rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{getDegreeDescription(item)}</span>
                    {item.startDate && item.endDate && (
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        {formatDate(item.startDate)} - {formatDate(item.endDate)}
                      </span>
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                    onClick={() => RemoveEducation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                  <div className="col-span-full space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <School className="h-4 w-4 text-primary" />
                      University/Institution Name
                    </label>
                    <Input
                      name="universityName"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.universityName || ""}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Harvard University"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Degree
                    </label>
                    <Input
                      name="degree"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.degree || ""}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Bachelor of Science"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Major/Field of Study
                    </label>
                    <Input
                      name="major"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.major || ""}
                      className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Start Date
                    </label>
                    <DatePicker
                      index={index}
                      field="startDate"
                      value={item?.startDate || ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      End Date
                    </label>
                    <DatePicker
                      index={index}
                      field="endDate"
                      value={item?.endDate || ""}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Grade
                    </label>
                    <div className="flex gap-4">
                      <select
                        name="gradeType"
                        className="py-2 px-4 rounded-md border border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all bg-white"
                        onChange={(e) => handleChange(e, index)}
                        value={item?.gradeType || "CGPA"}
                      >
                        <option value="CGPA">CGPA</option>
                        <option value="GPA">GPA</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                      <Input
                        type="text"
                        name="grade"
                        onChange={(e) => handleChange(e, index)}
                        value={item?.grade || ""}
                        className="flex-1 border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                        placeholder="e.g. 3.8"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Description
                    </label>
                    <Textarea
                      name="description"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.description || ""}
                      className="min-h-24 resize-y border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      placeholder="Describe relevant coursework, achievements, or activities during your education"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {educationalList.length > 0 && (
            <Button
              variant="outline"
              onClick={AddNewEducation}
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> 
              Add {educationalList.length > 0 ? "Another" : ""} Education
            </Button>
          )}
          
          {educationalList.length > 0 && (
            <Button 
              disabled={loading} 
              onClick={onSave}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <><LoaderCircle className="h-4 w-4 animate-spin mr-2" /> Saving...</>
              ) : (
                "Save Education"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Education;