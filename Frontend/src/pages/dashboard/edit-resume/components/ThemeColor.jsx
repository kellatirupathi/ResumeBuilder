import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  CheckCircle, 
  Layout, 
  ChevronRight, 
  X, 
  Star, 
  Sparkles, 
  Crown, 
  Wand2 
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI";

function ThemeColor({ resumeInfo }) {
  const dispatch = useDispatch();
  
  // Enhanced color palette with premium options
  const colors = [
    // Professional colors
    "#0077B5", // LinkedIn Blue
    "#2E77BC", // Professional Blue
    "#336699", // Navy Blue
    "#339999", // Teal
    "#33CC99", // Mint Green
    "#669933", // Olive
    
    // Creative colors  
    "#FF5733", // Red-Orange
    "#FF3366", // Pink
    "#9933CC", // Purple
    "#6633CC", // Indigo
    "#33CCFF", // Sky Blue
    "#FF9933", // Orange
    
    // Classic colors
    "#333333", // Black
    "#666666", // Dark Gray
    "#993366", // Burgundy
    "#CC6633", // Brown
    "#CC9933", // Gold
    "#66CC33", // Green
    "#CC3366", // Rose
    "#3366FF", // Blue
  ];

  // Enhanced template options with categories
  const templates = [
    {
      id: "modern",
      name: "Modern Resume",
      category: "popular",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743444630/fa2w5fkfpcnglzwfwt1v.png"
    },
    {
      id: "professional",
      name: "Professional Resume",
      category: "popular",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743444455/jko6sfsaxmxadrgmmblz.png"
    },
    {
      id: "creative",
      name: "Creative Resume",
      category: "creative",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743450155/imxzfrluvh6ydsstxf0a.png"
    },
    {
      id: "minimalist",
      name: "Minimalist Resume",
      category: "popular",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743450251/a9sbzzlogbizmk6lj3c2.png"
    },
    {
      id: "executive",
      name: "Executive Resume",
      category: "professional",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743497057/bqpgmsxwagupoczs450n.png"
    },
    {
      id: "creative-modern",
      name: "Creative Modern",
      category: "creative",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743497241/cbchg22wpxl504lpmjsn.png"
    },
    {
      id: "tech-startup",
      name: "Tech Startup",
      category: "tech",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743497373/jawf8ckgfo48tiy3rqpl.png"
    },
    {
      id: "elegant-portfolio",
      name: "Elegant Portfolio",
      category: "creative",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743497498/yqsz4dluansattmpfuqu.png"
    },
    {
      id: "modern-timeline",
      name: "Modern Timeline",
      category: "popular",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743514299/m9vqud4upybn1yok8va0.png" 
    },
    {
      id: "modern-grid",
      name: "Modern Grid",
      category: "modern",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743514405/zfeg6fkhm3rzqm87jsbq.png" 
    },
    {
      id: "modern-sidebar",
      name: "Modern Sidebar",
      category: "modern",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743526978/h80det00u4kzzxv4wovi.png" 
    },
    {
      id: "gradient-accent",
      name: "Gradient Accent",
      category: "creative",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743527045/biu6siaj8smice1ijjnn.png" 
    },
    {
      id: "bold-impact",
      name: "Bold Impact",
      category: "modern",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743697056/q1bi1rcgmy2phbjyxyz2.png" 
    },
    {
      id: "split-frame",
      name: "Split Frame",
      category: "creative",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743697141/npgbqssxd07j13tvopyj.png" 
    },
    {
      id: "minimalist-pro",
      name: "Minimalist Pro",
      category: "professional",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743962988/adaq8djiqcuiuka16ayt.png" // Replace with actual preview URL
    },
    {
      id: "digital-card",
      name: "Digital Card",
      category: "modern",
      previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1743963208/roye2ja2wmcsatv4rlcm.png" // Replace with actual preview URL
    }
  ];

  // Template categories
  const categories = [
    { id: "all", name: "All Templates", icon: Layout },
    { id: "popular", name: "Popular", icon: Star },
    { id: "professional", name: "Professional", icon: Crown },
    { id: "creative", name: "Creative", icon: Sparkles },
    { id: "tech", name: "Tech", icon: Wand2 },
  ];

  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor || "#333333");
  const [selectedTemplate, setSelectedTemplate] = useState(resumeInfo?.template || "modern");
  const [activeTab, setActiveTab] = useState("color"); // 'color' or 'template' tab
  const [activeCategory, setActiveCategory] = useState("all");
  const [applying, setApplying] = useState(false);
  const [open, setOpen] = useState(false);
  const [previewHover, setPreviewHover] = useState(null);
  const [fullPreview, setFullPreview] = useState(null);
  const { resume_id } = useParams();
  
  // Filter templates based on selected category
  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === activeCategory);

  // Handle color hover effect
  const [hoverColor, setHoverColor] = useState(null);
  
  const onColorSelect = async (color) => {
    setSelectedColor(color);
    setApplying(true);
    
    dispatch(
      addResumeData({
        ...resumeInfo,
        themeColor: color,
      })
    );
    
    const data = {
      data: {
        themeColor: color,
      },
    };
    
    await updateThisResume(resume_id, data)
      .then(() => {
        toast.success("Theme color updated", {
          description: "Your resume styling has been refreshed",
          icon: <CheckCircle className="h-4 w-4" style={{ color }} />,
          duration: 3000,
        });
      })
      .catch((error) => {
        toast("Error updating theme color", {
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setApplying(false);
      });
  };

  const onTemplateSelect = async (templateId) => {
    setSelectedTemplate(templateId);
    setApplying(true);
    
    // Ensure template tab is active
    setActiveTab('template');
    
    dispatch(
      addResumeData({
        ...resumeInfo,
        template: templateId,
      })
    );
    
    const data = {
      data: {
        template: templateId,
      },
    };
    
    await updateThisResume(resume_id, data)
      .then(() => {
        toast.success("Resume template updated", {
          description: "Your resume layout has been changed",
          icon: <CheckCircle className="h-4 w-4" style={{ color: selectedColor }} />,
          duration: 3000,
        });
      })
      .catch((error) => {
        toast("Error updating template", {
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setApplying(false);
      });
  };

  return (
    <>
      {/* Fullscreen preview that completely replaces the UI */}
      {fullPreview ? (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setFullPreview(null)}>
          <div className="relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img 
              src={fullPreview.previewUrl} 
              alt={fullPreview.name}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
            />
            <Button 
              size="sm" 
              className="absolute top-4 right-4 rounded-full h-10 w-10 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all"
              onClick={() => {
                setFullPreview(null);
                // Ensure template tab is active when returning from preview
                setActiveTab('template');
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-gray-300 bg-white/90 backdrop-blur-sm shadow-sm hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-md"
              size="sm"
            >
              {activeTab === "color" ? (
                <Palette className="h-4 w-4" style={{ color: selectedColor }} />
              ) : (
                <Layout className="h-4 w-4" style={{ color: selectedColor }} />
              )}
              <span className="hidden sm:inline font-medium">Templates</span>
              <div 
                className="h-3 w-3 rounded-full ml-1 ring-2 ring-white shadow-sm"
                style={{ backgroundColor: selectedColor }}
              />
            </Button>
          </PopoverTrigger>
        <PopoverContent 
          className="p-0 shadow-xl border rounded-xl overflow-hidden bg-white transition-all duration-300"
          style={{ 
            width: activeTab === 'template' ? '760px' : '400px',
            maxWidth: '95vw',
            transform: 'translateX(-20%) translateX(-10px)'
          }}
          side="bottom"
          align="start"
          sideOffset={5}
        >
          {/* Enhanced Header with tabs */}
          <div className="relative bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex border-b mb-0">
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === 'color' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('color')}
                style={{ 
                  borderColor: activeTab === 'color' ? selectedColor : '',
                  color: activeTab === 'color' ? selectedColor : ''
                }}
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Color Theme</span>
                </div>
                {activeTab === 'color' && (
                  <div 
                    className="absolute bottom-0 left-0 w-full h-0.5"
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                )}
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === 'template' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('template')}
                style={{ 
                  borderColor: activeTab === 'template' ? selectedColor : '',
                  color: activeTab === 'template' ? selectedColor : ''
                }}
              >
                <div className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  <span>Resume Template</span>
                </div>
                {activeTab === 'template' && (
                  <div 
                    className="absolute bottom-0 left-0 w-full h-0.5" 
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                )}
              </button>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 duration-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Enhanced Content Area */}
          <div className="max-h-[80vh] overflow-y-auto">
            {activeTab === "color" ? (
              <div className="p-6">
                <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4" style={{ color: selectedColor }} />
                  <span style={{ color: selectedColor }}>Choose Resume Accent Color</span>
                </h2>
                
                <div className="grid grid-cols-5 gap-3 sm:grid-cols-7">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => onColorSelect(color)}
                      onMouseEnter={() => setHoverColor(color)}
                      onMouseLeave={() => setHoverColor(null)}
                      className={`h-12 w-12 rounded-full cursor-pointer flex items-center justify-center focus:outline-none transition-all duration-300 hover:scale-110 shadow-sm ${
                        selectedColor === color ? 'ring-2 ring-offset-2' : 'hover:shadow-md'
                      }`}
                      style={{
                        backgroundColor: color,
                        ringColor: color,
                        transform: hoverColor === color || selectedColor === color ? 'scale(1.1)' : 'scale(1)'
                      }}
                      title={`Select color ${index + 1}`}
                      disabled={applying}
                    >
                      {selectedColor === color && (
                        <CheckCircle className="h-5 w-5 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Enhanced preview section */}
                <div 
                  className="mt-8 p-6 rounded-lg border transition-all duration-300"
                  style={{ 
                    borderColor: hoverColor || selectedColor,
                    backgroundColor: `${hoverColor || selectedColor}10`
                  }}
                >
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2" 
                    style={{ color: hoverColor || selectedColor }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Live Preview</span>
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div 
                      className="w-20 h-20 rounded-md flex items-center justify-center shadow-sm transition-all duration-300" 
                      style={{ backgroundColor: hoverColor || selectedColor }}
                    >
                      <span className="text-white font-bold text-xl">Aa</span>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="h-4 w-32 rounded-full mb-3 transition-all duration-300" 
                        style={{ backgroundColor: hoverColor || selectedColor }}
                      ></div>
                      <div className="h-2 w-full bg-gray-200 rounded-full mb-2"></div>
                      <div className="h-2 w-4/5 bg-gray-200 rounded-full mb-2"></div>
                      <div className="h-2 w-3/4 bg-gray-200 rounded-full"></div>
                      
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-8 px-4 rounded-md flex items-center justify-center text-white text-xs font-medium transition-all duration-300" 
                          style={{ backgroundColor: hoverColor || selectedColor }}
                        >
                          Button
                        </div>
                        <div className="h-8 px-4 rounded-md flex items-center justify-center text-xs font-medium border transition-all duration-300" 
                          style={{ 
                            borderColor: hoverColor || selectedColor,
                            color: hoverColor || selectedColor
                          }}
                        >
                          Outline
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 italic">
                  The selected color will be applied to headings, borders, and other accent elements in your resume
                </p>
              </div>
            ) : (
              <div>
                {/* Category selection for templates */}
                <div className="px-6 pt-4 pb-2 flex overflow-x-auto gap-2 hide-scrollbar">
                  {categories.map((category) => {
                    const CategoryIcon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-3 py-2 text-sm rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                          activeCategory === category.id
                            ? 'text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: activeCategory === category.id ? selectedColor : '',
                        }}
                      >
                        <CategoryIcon className="h-3.5 w-3.5" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>

                {/* Template grid */}
                <div className="p-6 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => onTemplateSelect(template.id)}
                      onMouseEnter={() => setPreviewHover(template.id)}
                      onMouseLeave={() => setPreviewHover(null)}
                      className="group relative border-2 rounded-lg cursor-pointer transition-all overflow-hidden"
                      style={{
                        borderColor: selectedTemplate === template.id || previewHover === template.id
                          ? selectedColor
                          : 'rgb(229, 231, 235)',
                        transform: selectedTemplate === template.id || previewHover === template.id
                          ? 'translateY(-2px)'
                          : 'translateY(0)',
                        boxShadow: selectedTemplate === template.id || previewHover === template.id
                          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          : 'none'
                      }}
                    >
                      {selectedTemplate === template.id && (
                        <div 
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white z-10 shadow-md" 
                          style={{ backgroundColor: selectedColor }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 z-10">
                        {template.category === "popular" && (
                          <div className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="h-3 w-3" /> Popular
                          </div>
                        )}
                      </div>
                      <div className="h-48 overflow-hidden bg-white">
                        <img 
                          src={template.previewUrl} 
                          alt={template.name}
                          className="w-full h-full object-cover object-top transition-transform group-hover:scale-105 duration-500"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                        >
                          <button 
                            className="text-white text-xs font-medium px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullPreview(template);
                            }}
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                      <div 
                        className="text-center font-medium text-sm py-2 px-3 border-t flex items-center justify-between transition-colors duration-300"
                        style={{ 
                          backgroundColor: selectedTemplate === template.id || previewHover === template.id
                            ? `${selectedColor}10`
                            : 'rgb(249, 250, 251)',
                          borderColor: selectedTemplate === template.id
                            ? selectedColor
                            : 'rgb(229, 231, 235)'
                        }}
                      >
                        <span>{template.name}</span>
                        <ChevronRight 
                          className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" 
                          style={{ 
                            color: selectedTemplate === template.id || previewHover === template.id
                              ? selectedColor
                              : 'rgb(156, 163, 175)'
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 px-6 pb-4 italic">
                  Select the template that best showcases your professional background
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div 
            className="border-t px-5 py-3 flex justify-between items-center backdrop-blur-sm transition-colors duration-300"
            style={{ 
              backgroundColor: `${selectedColor}05`,
              borderColor: `${selectedColor}20`
            }}
          >
            <div className="text-xs text-gray-600">
              {activeTab === "color" ? (
                <div className="flex items-center gap-2">
                  <span>Current color:</span>
                  <div className="flex items-center gap-1">
                    <div 
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                    <span className="font-mono">{selectedColor}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span>Current template:</span>
                  <span className="font-medium ml-1" style={{ color: selectedColor }}>
                    {templates.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
                  </span>
                </div>
              )}
            </div>
            <Button 
              size="sm" 
              className="text-xs text-white transition-all duration-300 hover:shadow-md" 
              onClick={() => setOpen(false)}
              style={{ backgroundColor: selectedColor }}
            >
              Apply & Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      )}
    </>
  );
}

export default ThemeColor;