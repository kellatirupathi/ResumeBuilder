import React from "react";
import { Eye, Edit, Trash2, MoreVertical, Calendar, ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-600 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600"
];

function ResumeCard({ resume, refreshData, viewMode = "grid" }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  
  // Use resume._id as a seed for consistent gradient for each resume
  const gradientIndex = resume._id ? Math.abs(resume._id.charCodeAt(0) + resume._id.charCodeAt(resume._id.length - 1)) % gradients.length : 0;
  const gradient = gradients[gradientIndex];
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteThisResume(resume._id);
      toast("Resume deleted successfully", {
        description: "Your resume has been permanently removed",
      });
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast("Failed to delete resume", {
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="group flex items-center justify-between rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
        {/* Left side with colored bar and title */}
        <div className="flex items-center flex-1">
          <div className={`w-2 self-stretch bg-gradient-to-b ${gradient}`}></div>
          <div className="p-4 pl-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {resume.title}
            </h3>
            <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Last updated: {formatDate(resume.updatedAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Right side with actions */}
        <div className="flex items-center gap-3 pr-4">
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
              className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="View Resume"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
              className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              title="Edit Resume"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenAlert(true)}
              className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              title="Delete Resume"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden relative">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {/* Mobile menu popup */}
            {showMobileMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      navigate(`/dashboard/view-resume/${resume._id}`);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Resume
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/dashboard/edit-resume/${resume._id}`);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <Edit className="mr-2 h-4 w-4 text-purple-500" /> Edit Resume
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      setOpenAlert(true);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Resume
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
            className={`hidden md:flex items-center gap-2 bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity rounded-md px-4 py-2 shadow-sm`}
          >
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-rose-600 dark:text-rose-400">Delete this resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                resume and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : "Delete Resume"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group relative flex flex-col h-[280px] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Top gradient band */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
      
      {/* Actions dropdown for mobile */}
      <div className="absolute top-3 right-3 z-10 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </Button>
        
        {/* Mobile menu popup */}
        {showMobileMenu && (
          <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              <button
                onClick={() => {
                  navigate(`/dashboard/view-resume/${resume._id}`);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Resume
              </button>
              <button
                onClick={() => {
                  navigate(`/dashboard/edit-resume/${resume._id}`);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <Edit className="mr-2 h-4 w-4 text-purple-500" /> Edit Resume
              </button>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
              <button
                onClick={() => {
                  setOpenAlert(true);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Resume
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Resume title */}
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {resume.title}
        </h3>
        <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400 text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Last updated: {formatDate(resume.updatedAt)}</span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-4 pt-3 pb-3 flex justify-between items-center mt-auto">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="View Resume"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            title="Edit Resume"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenAlert(true)}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
          className={`flex items-center gap-1 bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity rounded-md px-3 py-1 text-xs shadow-sm`}
        >
          Continue <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 dark:text-rose-400">Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : "Delete Resume"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCard;