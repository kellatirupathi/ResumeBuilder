import React, { useState } from "react";
import { CopyPlus, Loader, Plus, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

function AddResume({ viewMode = "grid" }) {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define templates and colors to use for backend
  const templates = [
    { 
      id: "modern", 
      name: "Modern Resume", 
      color: "#059669", // emerald-600 as default color
    },
    { 
      id: "professional", 
      name: "Professional Resume", 
      color: "#2563eb", // blue-600 as default color
    }
  ];

  // Set default template - using professional
  const defaultTemplate = "professional";
  const templateColors = {
    modern: "#059669",     // emerald-600
    professional: "#2563eb", // blue-600
  };

  const resetForm = () => {
    setResumeTitle("");
    setOpenDialog(false);
  };

  const createResume = async () => {
    setLoading(true);
    if (resumeTitle.trim() === "") {
      toast("Please add a title to your resume");
      setLoading(false);
      return;
    }
      
    const data = {
      data: {
        title: resumeTitle.trim(),
        themeColor: templateColors[defaultTemplate],
        template: defaultTemplate,
      },
    };
    
    try {
      const res = await createNewResume(data);
      console.log("Response from Create Resume:", res);
      
      toast("Resume created successfully", {
        description: `"${resumeTitle}" is ready to edit`,
      });
      
      navigate(`/dashboard/edit-resume/${res.data.resume._id}`);
    } catch (error) {
      console.error("Error creating resume:", error);
      toast("Failed to create resume", {
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const handleCloseDialog = () => {
    resetForm();
  };
  
  if (viewMode === "list") {
    return (
      <>
        <div
          onClick={() => setOpenDialog(true)}
          className="add-resume-trigger flex items-center justify-between rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 group cursor-pointer overflow-hidden"
        >
          <div className="flex items-center flex-1">
            <div className="w-1 h-full self-stretch bg-gradient-to-b from-blue-500 to-purple-500 opacity-40 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 pl-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Create New Resume
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Design a professional resume with AI assistance
              </p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        <CreateResumeDialog
          isOpen={isDialogOpen}
          setIsOpen={setOpenDialog}
          title={resumeTitle}
          setTitle={setResumeTitle}
          onCreate={createResume}
          onClose={handleCloseDialog}
          loading={loading}
        />
      </>
    );
  }
  
  // Grid View
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenDialog(true)}
        className="add-resume-trigger flex flex-col items-center justify-center h-[280px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 cursor-pointer group transition-all duration-300"
      >
        <div className="w-16 h-16 mb-5 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-colors duration-300">
          <CopyPlus className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Create New Resume
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3 max-w-[200px]">
          Design a professional resume with AI assistance
        </p>
      </motion.div>

      <CreateResumeDialog
        isOpen={isDialogOpen}
        setIsOpen={setOpenDialog}
        title={resumeTitle}
        setTitle={setResumeTitle}
        onCreate={createResume}
        onClose={handleCloseDialog}
        loading={loading}
      />
    </>
  );
}

// Simplified dialog component without template selection
function CreateResumeDialog({ 
  isOpen, 
  setIsOpen, 
  title, 
  setTitle, 
  onCreate, 
  onClose,
  loading
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Create a New Resume
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-blue-100">
            Give your resume a name that reflects the job role you're targeting
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/30 text-lg py-6"
                type="text"
                placeholder="Ex: Software Engineer Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value.trimStart())}
                autoFocus
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-1">
              This will help you organize multiple resumes for different positions
            </p>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between">
          <div className="w-full flex justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={onCreate}
              disabled={loading || !title.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Resume"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddResume;