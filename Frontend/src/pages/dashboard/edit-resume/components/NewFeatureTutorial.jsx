import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function NewFeatureTutorial({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  
  useEffect(() => {
    const tutorialSeen = localStorage.getItem('social-links-tutorial-seen');
    if (tutorialSeen) {
      setHasSeenTutorial(true);
    }
  }, []);
  
  const markTutorialSeen = () => {
    localStorage.setItem('social-links-tutorial-seen', 'true');
    setHasSeenTutorial(true);
    onClose();
  };
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markTutorialSeen();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const tutorialSteps = [
    {
      title: "New Feature: Social Media Links",
      description: "Add your GitHub, LinkedIn, and portfolio URL to enhance your resume.",
      tip: "Social links help employers verify your experience and see more of your work."
    },
    {
      title: "Project Links",
      description: "You can now add GitHub repository and live demo links to each project.",
      tip: "Providing direct links to your code and live demos makes it easier for employers to evaluate your skills."
    }
  ];

  return (
    <Dialog open={isOpen && !hasSeenTutorial} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>
          {tutorialSteps[currentStep].title}
        </DialogTitle>
        
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            {tutorialSteps[currentStep].description}
          </p>
          
          <div className="bg-blue-50 text-blue-800 p-4 rounded-md border border-blue-100">
            <p className="text-sm">
              <strong>Pro Tip:</strong> {tutorialSteps[currentStep].tip}
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          
          <Button onClick={nextStep}>
            {currentStep < tutorialSteps.length - 1 ? "Next" : "Got it!"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewFeatureTutorial;