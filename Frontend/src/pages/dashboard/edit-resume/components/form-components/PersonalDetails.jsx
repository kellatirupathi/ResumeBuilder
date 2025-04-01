import React from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function PersonalDetails({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: resumeInfo?.firstName || "",
    lastName: resumeInfo?.lastName || "",
    jobTitle: resumeInfo?.jobTitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
    // New social profile fields
    githubUrl: resumeInfo?.githubUrl || "",
    linkedinUrl: resumeInfo?.linkedinUrl || "",
    portfolioUrl: resumeInfo?.portfolioUrl || "",
  });

  const handleInputChange = (e) => {
    enanbledNext(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Personal Details Save Started");
    const data = {
      data: {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        jobTitle: e.target.jobTitle.value,
        address: e.target.address.value,
        phone: e.target.phone.value,
        email: e.target.email.value,
        // Include new social fields
        githubUrl: e.target.githubUrl?.value || "",
        linkedinUrl: e.target.linkedinUrl?.value || "",
        portfolioUrl: e.target.portfolioUrl?.value || "",
      },
    };
    if (resume_id) {
      try {
        const response = await updateThisResume(resume_id, data);
        toast("Resume Updated", "success");
      } catch (error) {
        toast(error.message, `failed`);
        console.log(error.message);
      } finally {
        enanbledNext(true);
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Get started with your basic information</p>

      <form className="mt-7" onSubmit={onSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs">First Name</label>
            <Input
              name="firstName"
              defaultValue={resumeInfo?.firstName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-xs">Last Name</label>
            <Input
              name="lastName"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.lastName}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Job Title</label>
            <Input
              name="jobTitle"
              defaultValue={resumeInfo?.jobTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Address</label>
            <Input
              name="address"
              required
              defaultValue={resumeInfo?.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-xs">Phone</label>
            <Input
              name="phone"
              required
              defaultValue={resumeInfo?.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-xs">Email</label>
            <Input
              name="email"
              type="email"
              required
              defaultValue={resumeInfo?.email}
              onChange={handleInputChange}
            />
          </div>
          
          {/* New Social Media Links Section */}
          <div className="col-span-2 mt-4 border-t pt-4">
            <h3 className="text-md font-medium mb-3">Social & Portfolio Links</h3>
          </div>
          
          <div>
            <label className="text-xs">GitHub Profile</label>
            <Input
              name="githubUrl"
              placeholder="github.com/yourusername"
              defaultValue={resumeInfo?.githubUrl}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="text-xs">LinkedIn Profile</label>
            <Input
              name="linkedinUrl"
              placeholder="linkedin.com/in/yourprofile"
              defaultValue={resumeInfo?.linkedinUrl}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="col-span-2">
            <label className="text-xs">Portfolio Website</label>
            <Input
              name="portfolioUrl"
              placeholder="yourportfolio.com"
              defaultValue={resumeInfo?.portfolioUrl}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="mt-5 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;