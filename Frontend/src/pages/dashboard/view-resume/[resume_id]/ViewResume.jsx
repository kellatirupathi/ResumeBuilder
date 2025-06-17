import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from 'html2pdf.js';
import { 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Maximize,
  Trophy,
  ChevronRight,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("download");
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingState, setDownloadingState] = useState(false);
  
  const resumeRef = useRef(null);
  const { resume_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchResumeInfo();
  }, []);

  const fetchResumeInfo = async () => {
    setIsLoading(true);
    try {
      const response = await getResumeData(resume_id);
      
      // Ensure template info is included
      const resumeData = {
        ...response.data,
        template: response.data.template || "modern" // Default to modern if no template specified
      };
      
      console.log("Resume loaded with template:", resumeData.template);
      dispatch(addResumeData(resumeData));
      setResumeInfo(resumeData);
    } catch (error) {
      toast("Error loading resume", {
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Modified handleDownloadPDF function with fixed variable naming to avoid conflicts
const handleDownloadPDF = async () => {
  try {
    setDownloadingState(true);
    setDownloadProgress(10);
    
    // Get the template type from resumeInfo
    const templateType = resumeInfo.template || "modern";
    
    setDownloadProgress(20);
    
    // Create a new jsPDF instance - A4 paper, portrait orientation
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Define standard dimensions for A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15; // margin in mm
    const usableWidth = pageWidth - (margin * 2);
    
    // Set initial y position (from top of page)
    let yPos = margin;
    
    // Calculate font sizes based on page dimensions
    const fontSizes = {
      header: 16,
      subheader: 12,
      normal: 10,
      small: 8
    };
    
    // Get theme color with fallback
    const themeColor = resumeInfo.themeColor || "#059669"; // Default to emerald-600
    
    setDownloadProgress(40);
    
    // Configure the PDF based on template
    switch(templateType) {
      case "modern": 
        // Modern template styling
        pdf.setFillColor(themeColor);
        pdf.rect(0, 0, pageWidth, 2, 'F'); // Top accent bar
        
        // Set up header section with personal details
        yPos += 10;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(fontSizes.header);
        pdf.setTextColor(40, 40, 40);
        pdf.text(`${resumeInfo.firstName || ''} ${resumeInfo.lastName || ''}`, margin, yPos);
        
        yPos += 6;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.subheader);
        pdf.setTextColor(70, 70, 70);
        pdf.text(resumeInfo.jobTitle || '', margin, yPos);
        
        // Contact info
        yPos += 8;
        pdf.setFontSize(fontSizes.normal);
        pdf.setTextColor(70, 70, 70);
        
        let contactText = '';
        if (resumeInfo.email) contactText += `Email: ${resumeInfo.email}`;
        if (resumeInfo.phone) contactText += contactText ? `   |   Phone: ${resumeInfo.phone}` : `Phone: ${resumeInfo.phone}`;
        if (resumeInfo.address) contactText += contactText ? `   |   ${resumeInfo.address}` : resumeInfo.address;
        
        pdf.text(contactText, margin, yPos);
        
        // Links row
        let linksText = '';
        if (resumeInfo.linkedinUrl) linksText += `LinkedIn: ${resumeInfo.linkedinUrl}`;
        if (resumeInfo.githubUrl) linksText += linksText ? `   |   GitHub: ${resumeInfo.githubUrl}` : `GitHub: ${resumeInfo.githubUrl}`;
        if (resumeInfo.portfolioUrl) linksText += linksText ? `   |   Portfolio: ${resumeInfo.portfolioUrl}` : `Portfolio: ${resumeInfo.portfolioUrl}`;
        
        if (linksText) {
          yPos += 5;
          pdf.text(linksText, margin, yPos);
        }
        
        // Summary section
        if (resumeInfo.summary) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("SUMMARY", margin, yPos);
          
          yPos += 5;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          // Handle text wrapping for summary
          const splitSummary = pdf.splitTextToSize(resumeInfo.summary, usableWidth);
          pdf.text(splitSummary, margin, yPos);
          yPos += splitSummary.length * 5;
        }
        
        // Experience section
        if (resumeInfo.experience && resumeInfo.experience.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("EXPERIENCE", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.experience.forEach((exp, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(exp.title || '', margin, yPos);
            
            // Handle dates right-aligned
            const dateText = `${exp.startDate || ''} ${exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""} ${exp.currentlyWorking ? "Present" : exp.endDate || ''}`;
            const dateWidth = pdf.getStringUnitWidth(dateText) * fontSizes.normal / pdf.internal.scaleFactor;
            pdf.text(dateText, pageWidth - margin - dateWidth, yPos);
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(70, 70, 70);
            
            const companyText = `${exp.companyName || ''} ${exp.city && exp.companyName ? ", " : ""} ${exp.city || ''} ${exp.city && exp.state ? ", " : ""} ${exp.state || ''}`;
            pdf.text(companyText, margin, yPos);
            
            yPos += 5;
            
            // Strip HTML from work summary for plain text PDF
            const workSummary = exp.workSummary ? exp.workSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitWorkSummary = pdf.splitTextToSize(workSummary, usableWidth);
            pdf.text(splitWorkSummary, margin, yPos);
            
            yPos += splitWorkSummary.length * 5 + 5;
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        
        // Projects section
        if (resumeInfo.projects && resumeInfo.projects.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("PROJECTS", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.projects.forEach((project, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(project.projectName || '', margin, yPos);
            
            if (project.techStack) {
              yPos += 5;
              pdf.setFont("helvetica", "italic");
              pdf.setFontSize(fontSizes.small);
              pdf.text(`Technologies: ${project.techStack}`, margin, yPos);
            }
            
            let linksLine = '';
            if (project.githubLink) linksLine += `GitHub: ${project.githubLink}`;
            if (project.deployedLink) linksLine += linksLine ? `   |   Demo: ${project.deployedLink}` : `Demo: ${project.deployedLink}`;
            
            if (linksLine) {
              yPos += 4;
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(fontSizes.small);
              pdf.setTextColor(0, 0, 255); // Blue for links
              pdf.text(linksLine, margin, yPos);
              pdf.setTextColor(70, 70, 70); // Reset color
            }
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.normal);
            
            // Strip HTML from project summary
            const projectSummary = project.projectSummary ? project.projectSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitProjectSummary = pdf.splitTextToSize(projectSummary, usableWidth);
            pdf.text(splitProjectSummary, margin, yPos);
            
            yPos += splitProjectSummary.length * 5 + 5;
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        
        // Education section
        if (resumeInfo.education && resumeInfo.education.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("EDUCATION", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.education.forEach((edu, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            
            const degreeText = `${edu.degree || ''} ${edu.major && edu.degree ? "in " : ""} ${edu.major || ''}`;
            pdf.text(degreeText, margin, yPos);
            
            const dateText = `${edu.startDate || ''} ${edu.startDate && edu.endDate ? " - " : ""} ${edu.endDate || ''}`;
            const dateWidth = pdf.getStringUnitWidth(dateText) * fontSizes.normal / pdf.internal.scaleFactor;
            pdf.text(dateText, pageWidth - margin - dateWidth, yPos);
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(70, 70, 70);
            pdf.text(edu.universityName || '', margin, yPos);
            
            if (edu.grade) {
              yPos += 4;
              pdf.setFontSize(fontSizes.small);
              pdf.text(`${edu.gradeType || 'Grade'}: ${edu.grade}`, margin, yPos);
            }
            
            yPos += 5;
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        
        // Skills section
        if (resumeInfo.skills && resumeInfo.skills.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("SKILLS", margin, yPos);
          
          yPos += 5;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          // Group skills in rows
          const skillNames = resumeInfo.skills.map(skill => skill.name);
          let skillText = skillNames.join(" • ");
          const splitSkills = pdf.splitTextToSize(skillText, usableWidth);
          pdf.text(splitSkills, margin, yPos);
          
          yPos += splitSkills.length * 5;
        }
        
        // Certifications section
        if (resumeInfo.certifications && resumeInfo.certifications.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("CERTIFICATIONS", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.certifications.forEach((cert, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(cert.name || '', margin, yPos);
            
            if (cert.date) {
              const dateWidth = pdf.getStringUnitWidth(cert.date) * fontSizes.normal / pdf.internal.scaleFactor;
              pdf.text(cert.date, pageWidth - margin - dateWidth, yPos);
            }
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(70, 70, 70);
            pdf.text(cert.issuer || '', margin, yPos);
            
            if (cert.description) {
              yPos += 4;
              pdf.setFontSize(fontSizes.small);
              const splitDescription = pdf.splitTextToSize(cert.description, usableWidth);
              pdf.text(splitDescription, margin, yPos);
              yPos += splitDescription.length * 4;
            } else {
              yPos += 5;
            }
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        break;
        
      case "professional":
        // Professional template styling (more formal with strong header)
        // Header with background color
        pdf.setFillColor(themeColor);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        
        // Name and title in header
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(fontSizes.header + 2);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${resumeInfo.firstName || ''} ${resumeInfo.lastName || ''}`, margin, margin + 5);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.subheader);
        pdf.text(resumeInfo.jobTitle || '', margin, margin + 12);
        
        // Contact strip
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, 30, pageWidth, 12, 'F');
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.small);
        pdf.setTextColor(60, 60, 60);
        
        // Centered contact info
        let contactInfoPro = [];
        if (resumeInfo.email) contactInfoPro.push(resumeInfo.email);
        if (resumeInfo.phone) contactInfoPro.push(resumeInfo.phone);
        if (resumeInfo.address) contactInfoPro.push(resumeInfo.address);
        
        const contactTextPro = contactInfoPro.join(' | ');
        const contactWidthPro = pdf.getStringUnitWidth(contactTextPro) * fontSizes.small / pdf.internal.scaleFactor;
        pdf.text(contactTextPro, (pageWidth - contactWidthPro) / 2, 37);
        
        // Reset position for main content
        yPos = 45;
        
        // Two-column layout
        const leftColWidth = usableWidth * 0.65;
        const rightColWidth = usableWidth * 0.3;
        const rightColX = margin + leftColWidth + 5;
        let leftColYPos = yPos;
        let rightColYPos = yPos;
        
        // Left column content - Summary, Experience, Projects
        if (resumeInfo.summary) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("PROFESSIONAL SUMMARY", margin, leftColYPos);
          
          leftColYPos += 5;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          const splitSummary = pdf.splitTextToSize(resumeInfo.summary, leftColWidth);
          pdf.text(splitSummary, margin, leftColYPos);
          leftColYPos += splitSummary.length * 5 + 5;
        }
        
        // Experience section
        if (resumeInfo.experience && resumeInfo.experience.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("WORK EXPERIENCE", margin, leftColYPos);
          
          leftColYPos += 6;
          
          resumeInfo.experience.forEach((exp, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(exp.title || '', margin, leftColYPos);
            
            leftColYPos += 5;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            
            const companyText = `${exp.companyName || ''} ${exp.city && exp.companyName ? ", " : ""} ${exp.city || ''} ${exp.city && exp.state ? ", " : ""} ${exp.state || ''}`;
            pdf.text(companyText, margin, leftColYPos);
            
            const dateText = `${exp.startDate || ''} ${exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""} ${exp.currentlyWorking ? "Present" : exp.endDate || ''}`;
            const dateWidth = pdf.getStringUnitWidth(dateText) * fontSizes.small / pdf.internal.scaleFactor;
            pdf.text(dateText, margin + leftColWidth - dateWidth, leftColYPos);
            
            leftColYPos += 5;
            
            // Strip HTML from work summary
            const workSummary = exp.workSummary ? exp.workSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitWorkSummary = pdf.splitTextToSize(workSummary, leftColWidth);
            pdf.text(splitWorkSummary, margin, leftColYPos);
            
            leftColYPos += splitWorkSummary.length * 4 + 7;
            
            // Check if we need a new page
            if (leftColYPos > pageHeight - margin) {
              pdf.addPage();
              leftColYPos = margin;
            }
          });
        }
        
        // Projects section
        if (resumeInfo.projects && resumeInfo.projects.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("PROJECTS", margin, leftColYPos);
          
          leftColYPos += 6;
          
          resumeInfo.projects.forEach((project, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(project.projectName || '', margin, leftColYPos);
            
            leftColYPos += 5;
            
            if (project.techStack) {
              pdf.setFont("helvetica", "italic");
              pdf.setFontSize(fontSizes.small);
              pdf.text(`Technologies: ${project.techStack}`, margin, leftColYPos);
              leftColYPos += 4;
            }
            
            // Links for projects
            let linksText = '';
            if (project.githubLink) linksText += `Code: ${project.githubLink}`;
            if (project.deployedLink) {
              if (linksText) {
                const linkWidth = pdf.getStringUnitWidth(linksText) * fontSizes.small / pdf.internal.scaleFactor;
                if (linkWidth + 20 + margin > margin + leftColWidth) {
                  // If not enough space on same line, move to next line
                  pdf.setFont("helvetica", "normal");
                  pdf.setFontSize(fontSizes.small);
                  pdf.setTextColor(0, 0, 255);
                  pdf.text(linksText, margin, leftColYPos);
                  leftColYPos += 4;
                  pdf.text(`Demo: ${project.deployedLink}`, margin, leftColYPos);
                  leftColYPos += 4;
                } else {
                  // Enough space on same line
                  linksText += `  |  Demo: ${project.deployedLink}`;
                  pdf.setFont("helvetica", "normal");
                  pdf.setFontSize(fontSizes.small);
                  pdf.setTextColor(0, 0, 255);
                  pdf.text(linksText, margin, leftColYPos);
                  leftColYPos += 4;
                }
              } else {
                linksText = `Demo: ${project.deployedLink}`;
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(fontSizes.small);
                pdf.setTextColor(0, 0, 255);
                pdf.text(linksText, margin, leftColYPos);
                leftColYPos += 4;
              }
            } else if (linksText) {
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(fontSizes.small);
              pdf.setTextColor(0, 0, 255);
              pdf.text(linksText, margin, leftColYPos);
              leftColYPos += 4;
            }
            
            pdf.setTextColor(70, 70, 70);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            
            // Strip HTML from project summary
            const projectSummary = project.projectSummary ? project.projectSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitProjectSummary = pdf.splitTextToSize(projectSummary, leftColWidth);
            pdf.text(splitProjectSummary, margin, leftColYPos);
            
            leftColYPos += splitProjectSummary.length * 4 + 7;
            
            // Check if we need a new page
            if (leftColYPos > pageHeight - margin) {
              pdf.addPage();
              leftColYPos = margin;
            }
          });
        }
        
        // Right column - Skills, Education, Certifications
        // Skills Section
        if (resumeInfo.skills && resumeInfo.skills.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("SKILLS", rightColX, rightColYPos);
          
          rightColYPos += 6;
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          resumeInfo.skills.forEach((skill, index) => {
            pdf.text(`• ${skill.name}`, rightColX, rightColYPos);
            rightColYPos += 5;
            
            // Check if we need a new page
            if (rightColYPos > pageHeight - margin) {
              pdf.addPage();
              rightColYPos = margin;
            }
          });
          
          rightColYPos += 5; // Extra space after skills
        }
        
        // Education section
        if (resumeInfo.education && resumeInfo.education.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("EDUCATION", rightColX, rightColYPos);
          
          rightColYPos += 6;
          
          resumeInfo.education.forEach((edu, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(40, 40, 40);
            
            const degreeText = `${edu.degree || ''} ${edu.major && edu.degree ? "in " : ""} ${edu.major || ''}`;
            const splitDegree = pdf.splitTextToSize(degreeText, rightColWidth);
            pdf.text(splitDegree, rightColX, rightColYPos);
            
            rightColYPos += splitDegree.length * 4 + 1;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            pdf.text(edu.universityName || '', rightColX, rightColYPos);
            
            rightColYPos += 4;
            
            const dateText = `${edu.startDate || ''} ${edu.startDate && edu.endDate ? " - " : ""} ${edu.endDate || ''}`;
            pdf.text(dateText, rightColX, rightColYPos);
            
            if (edu.grade) {
              rightColYPos += 4;
              pdf.text(`${edu.gradeType || 'Grade'}: ${edu.grade}`, rightColX, rightColYPos);
            }
            
            rightColYPos += 7; // Space between education entries
            
            // Check if we need a new page
            if (rightColYPos > pageHeight - margin) {
              pdf.addPage();
              rightColYPos = margin;
            }
          });
        }
        
        // Certifications section
        if (resumeInfo.certifications && resumeInfo.certifications.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("CERTIFICATIONS", rightColX, rightColYPos);
          
          rightColYPos += 6;
          
          resumeInfo.certifications.forEach((cert, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(40, 40, 40);
            
            const splitName = pdf.splitTextToSize(cert.name || '', rightColWidth);
            pdf.text(splitName, rightColX, rightColYPos);
            
            rightColYPos += splitName.length * 4 + 1;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            pdf.text(cert.issuer || '', rightColX, rightColYPos);
            
            if (cert.date) {
              rightColYPos += 4;
              pdf.text(cert.date, rightColX, rightColYPos);
            }
            
            rightColYPos += 7; // Space between certification entries
            
            // Check if we need a new page
            if (rightColYPos > pageHeight - margin) {
              pdf.addPage();
              rightColYPos = margin;
            }
          });
        }
        break;
      
      case "minimalist":
        // Minimalist template styling
        // Simple header with just name and title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(fontSizes.header);
        pdf.setTextColor(40, 40, 40);
        pdf.text(`${resumeInfo.firstName || ''} ${resumeInfo.lastName || ''}`, margin, margin + 10);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.subheader);
        pdf.setTextColor(100, 100, 100);
        pdf.text(resumeInfo.jobTitle || '', margin, margin + 18);
        
        // Contact info horizontal line
        yPos = margin + 25;
        let contactPartsMini = [];
        
        if (resumeInfo.email) contactPartsMini.push(resumeInfo.email);
        if (resumeInfo.phone) contactPartsMini.push(resumeInfo.phone);
        if (resumeInfo.address) contactPartsMini.push(resumeInfo.address);
        if (resumeInfo.linkedinUrl) contactPartsMini.push(`LinkedIn: ${resumeInfo.linkedinUrl}`);
        if (resumeInfo.githubUrl) contactPartsMini.push(`GitHub: ${resumeInfo.githubUrl}`);
        if (resumeInfo.portfolioUrl) contactPartsMini.push(`Portfolio: ${resumeInfo.portfolioUrl}`);
        
        const contactStringMini = contactPartsMini.join(' • ');
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.small);
        pdf.setTextColor(100, 100, 100);
        
        const splitContactStringMini = pdf.splitTextToSize(contactStringMini, usableWidth);
        pdf.text(splitContactStringMini, margin, yPos);
        
        yPos += splitContactStringMini.length * 4 + 5;
        
        // Horizontal divider
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        
        yPos += 5;
        
        // Summary section if present
        if (resumeInfo.summary) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          const splitSummary = pdf.splitTextToSize(resumeInfo.summary, usableWidth);
          pdf.text(splitSummary, margin, yPos);
          yPos += splitSummary.length * 5 + 5;
          
          // Divider after summary
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 5;
        }
        
        // Two-column layout for content
        const colWidth = (usableWidth - 10) / 2; // 10mm gap between columns
        const rightColXMini = margin + colWidth + 10;
        let leftYPosMini = yPos;
        let rightYPosMini = yPos;
        
        // Left column for Experience and Projects
        // Experience section
        if (resumeInfo.experience && resumeInfo.experience.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          pdf.text("Experience", margin, leftYPosMini);
          
          leftYPosMini += 5;
          
          resumeInfo.experience.forEach((exp, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(exp.title || '', margin, leftYPosMini);
            
            leftYPosMini += 4;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            
            const companyText = `${exp.companyName || ''} ${exp.city && exp.companyName ? ", " : ""} ${exp.city || ''} ${exp.city && exp.state ? ", " : ""} ${exp.state || ''}`;
            pdf.text(companyText, margin, leftYPosMini);
            
            leftYPosMini += 4;
            
            const dateText = `${exp.startDate || ''} ${exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""} ${exp.currentlyWorking ? "Present" : exp.endDate || ''}`;
            pdf.text(dateText, margin, leftYPosMini);
            
            leftYPosMini += 4;
            
            // Strip HTML from work summary
            const workSummary = exp.workSummary ? exp.workSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitWorkSummary = pdf.splitTextToSize(workSummary, colWidth);
            pdf.text(splitWorkSummary, margin, leftYPosMini);
            
            leftYPosMini += splitWorkSummary.length * 4 + 5;
            
            // Check if we need a new page
            if (leftYPosMini > pageHeight - margin) {
              pdf.addPage();
              leftYPosMini = margin;
            }
          });
        }
        
        // Projects section
        if (resumeInfo.projects && resumeInfo.projects.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          pdf.text("Projects", margin, leftYPosMini);
          
          leftYPosMini += 5;
          
          resumeInfo.projects.forEach((project, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(project.projectName || '', margin, leftYPosMini);
            
            leftYPosMini += 4;
            
            if (project.techStack) {
              pdf.setFont("helvetica", "italic");
              pdf.setFontSize(fontSizes.small);
              pdf.text(`Technologies: ${project.techStack}`, margin, leftYPosMini);
              leftYPosMini += 4;
            }
            
            // Links on separate lines for minimalist style
            if (project.githubLink) {
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(fontSizes.small);
              pdf.setTextColor(70, 70, 70);
              pdf.text(`GitHub: ${project.githubLink}`, margin, leftYPosMini);
              leftYPosMini += 4;
            }
            
            if (project.deployedLink) {
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(fontSizes.small);
              pdf.setTextColor(70, 70, 70);
              pdf.text(`Demo: ${project.deployedLink}`, margin, leftYPosMini);
              leftYPosMini += 4;
            }
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            
            // Strip HTML from project summary
            const projectSummary = project.projectSummary ? project.projectSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitProjectSummary = pdf.splitTextToSize(projectSummary, colWidth);
            pdf.text(splitProjectSummary, margin, leftYPosMini);
            
            leftYPosMini += splitProjectSummary.length * 4 + 5;
            
            // Check if we need a new page
            if (leftYPosMini > pageHeight - margin) {
              pdf.addPage();
              leftYPosMini = margin;
            }
          });
        }
        
        // Right column - Skills, Education, Certifications
        // Skills Section
        if (resumeInfo.skills && resumeInfo.skills.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          pdf.text("Skills", rightColXMini, rightYPosMini);
          
          rightYPosMini += 5;
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          resumeInfo.skills.forEach((skill, index) => {
            pdf.text(skill.name, rightColXMini, rightYPosMini);
            rightYPosMini += 5;
            
            // Check if we need a new page
            if (rightYPosMini > pageHeight - margin) {
              pdf.addPage();
              rightYPosMini = margin;
            }
          });
          
          rightYPosMini += 5; // Extra space after skills
        }
        
        // Education section
        if (resumeInfo.education && resumeInfo.education.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          pdf.text("Education", rightColXMini, rightYPosMini);
          
          rightYPosMini += 5;
          
          resumeInfo.education.forEach((edu, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            
            const degreeText = `${edu.degree || ''} ${edu.major && edu.degree ? "in " : ""} ${edu.major || ''}`;
            const splitDegree = pdf.splitTextToSize(degreeText, colWidth);
            pdf.text(splitDegree, rightColXMini, rightYPosMini);
            
            rightYPosMini += splitDegree.length * 4 + 1;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            pdf.text(edu.universityName || '', rightColXMini, rightYPosMini);
            
            rightYPosMini += 4;
            
            const dateText = `${edu.startDate || ''} ${edu.startDate && edu.endDate ? " - " : ""} ${edu.endDate || ''}`;
            pdf.text(dateText, rightColXMini, rightYPosMini);
            
            if (edu.grade) {
              rightYPosMini += 4;
              pdf.text(`${edu.gradeType || 'Grade'}: ${edu.grade}`, rightColXMini, rightYPosMini);
            }
            
            rightYPosMini += 7; // Space between education entries
            
            // Check if we need a new page
            if (rightYPosMini > pageHeight - margin) {
              pdf.addPage();
              rightYPosMini = margin;
            }
          });
        }
        
        // Certifications section
        if (resumeInfo.certifications && resumeInfo.certifications.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          pdf.text("Certifications", rightColXMini, rightYPosMini);
          
          rightYPosMini += 5;
          
          resumeInfo.certifications.forEach((cert, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            
            const splitName = pdf.splitTextToSize(cert.name || '', colWidth);
            pdf.text(splitName, rightColXMini, rightYPosMini);
            
            rightYPosMini += splitName.length * 4 + 1;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            
            pdf.text(cert.issuer || '', rightColXMini, rightYPosMini);
            
            rightYPosMini += 4;
            
            if (cert.date) {
              pdf.text(cert.date, rightColXMini, rightYPosMini);
              rightYPosMini += 4;
            }
            
            rightYPosMini += 3; // Space between certification entries
            
            // Check if we need a new page
            if (rightYPosMini > pageHeight - margin) {
              pdf.addPage();
              rightYPosMini = margin;
            }
          });
        }
        break;
        
      case "creative":
        // Creative template styling with artistic elements
        // Header with name in color
        pdf.setFillColor(245, 245, 250); // Light background
        pdf.rect(0, 0, pageWidth, 35, 'F');
        
        // Draw circular element in header
        pdf.setFillColor(themeColor);
        pdf.circle(pageWidth - 30, 15, 10, 'F');
        
        // Name and title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(fontSizes.header + 2);
        pdf.setTextColor(themeColor);
        pdf.text(`${resumeInfo.firstName || ''} ${resumeInfo.lastName || ''}`, margin, margin + 8);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.subheader);
        pdf.setTextColor(70, 70, 70);
        pdf.text(resumeInfo.jobTitle || '', margin, margin + 16);
        
        // Contact info below header
        yPos = 42;
        pdf.setFillColor(250, 250, 255);
        pdf.roundedRect(margin, yPos - 5, pageWidth - (margin * 2), 15, 2, 2, 'F');
        
        let contactInfoCreative = [];
        if (resumeInfo.email) contactInfoCreative.push(resumeInfo.email);
        if (resumeInfo.phone) contactInfoCreative.push(resumeInfo.phone);
        if (resumeInfo.address) contactInfoCreative.push(resumeInfo.address);
        
        const contactTextCreative = contactInfoCreative.join(' • ');
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.small);
        pdf.setTextColor(70, 70, 70);
        
        // Center the contact info
        const contactWidthCreative = pdf.getStringUnitWidth(contactTextCreative) * fontSizes.small / pdf.internal.scaleFactor;
        pdf.text(contactTextCreative, (pageWidth - contactWidthCreative) / 2, yPos + 3);
        
        // Social links in centered row
        yPos += 15;
        
        let socialLinks = [];
        if (resumeInfo.linkedinUrl) socialLinks.push(`LinkedIn: ${resumeInfo.linkedinUrl}`);
        if (resumeInfo.githubUrl) socialLinks.push(`GitHub: ${resumeInfo.githubUrl}`);
        if (resumeInfo.portfolioUrl) socialLinks.push(`Portfolio: ${resumeInfo.portfolioUrl}`);
        
        if (socialLinks.length > 0) {
          const socialText = socialLinks.join(' • ');
          const socialWidth = pdf.getStringUnitWidth(socialText) * fontSizes.small / pdf.internal.scaleFactor;
          
          pdf.setTextColor(themeColor);
          pdf.text(socialText, (pageWidth - socialWidth) / 2, yPos);
          yPos += 10;
        }
        
        // Summary styled as a quote
        if (resumeInfo.summary) {
          yPos += 5;
          pdf.setFont("helvetica", "italic");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          // Add quote marks
          pdf.text('"', margin, yPos);
          
          const quoteWidth = pdf.getStringUnitWidth('"') * fontSizes.normal / pdf.internal.scaleFactor;
          
          const splitSummary = pdf.splitTextToSize(resumeInfo.summary, usableWidth - quoteWidth * 2);
          pdf.text(splitSummary, margin + quoteWidth, yPos);
          
          yPos += splitSummary.length * 5;
          
          // Closing quote
          pdf.text('"', margin, yPos);
          
          yPos += 10;
        }
        
        // Grid layout for content - 5 columns grid
        const gridColWidth = usableWidth / 5;
        
        // Main content - Experience and Projects - span 3 columns
        const mainColWidth = gridColWidth * 3;
        
        // Side content - Skills and Education - span 2 columns
        const sideColWidth = gridColWidth * 2;
        const sideColXCreative = margin + mainColWidth + 5;
        
        let mainYPosCreative = yPos;
        let sideYPosCreative = yPos;
        
        // Experience section in main column
        if (resumeInfo.experience && resumeInfo.experience.length > 0) {
          pdf.setFillColor(themeColor);
          pdf.rect(margin, mainYPosCreative, 10, 1, 'F');
          
          mainYPosCreative += 5;
          
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("EXPERIENCE", margin, mainYPosCreative);
          
          mainYPosCreative += 6;
          
          resumeInfo.experience.forEach((exp, index) => {
            // Add creative styling with colored box for each experience
            pdf.setFillColor(250, 250, 255);
            pdf.roundedRect(margin, mainYPosCreative - 3, mainColWidth, 10, 2, 2, 'F');
            
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(themeColor);
            pdf.text(exp.title || '', margin + 2, mainYPosCreative);
            
            // Date on right
            const dateText = `${exp.startDate || ''} ${exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""} ${exp.currentlyWorking ? "Present" : exp.endDate || ''}`;
            const dateWidth = pdf.getStringUnitWidth(dateText) * fontSizes.small / pdf.internal.scaleFactor;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            pdf.text(dateText, margin + mainColWidth - dateWidth - 2, mainYPosCreative);
            
            mainYPosCreative += 5;
            
            const companyText = `${exp.companyName || ''} ${exp.city && exp.companyName ? " | " : ""} ${exp.city || ''} ${exp.city && exp.state ? ", " : ""} ${exp.state || ''}`;
            pdf.text(companyText, margin + 2, mainYPosCreative);
            
            mainYPosCreative += 5;
            
            // Strip HTML from work summary
            const workSummary = exp.workSummary ? exp.workSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitWorkSummary = pdf.splitTextToSize(workSummary, mainColWidth - 4);
            pdf.text(splitWorkSummary, margin + 2, mainYPosCreative);
            
            mainYPosCreative += splitWorkSummary.length * 4 + 7;
            
            // Check if we need a new page
            if (mainYPosCreative > pageHeight - margin) {
              pdf.addPage();
              mainYPosCreative = margin;
            }
          });
        }
        
        // Projects section in main column
        if (resumeInfo.projects && resumeInfo.projects.length > 0) {
          pdf.setFillColor(themeColor);
          pdf.rect(margin, mainYPosCreative, 10, 1, 'F');
          
          mainYPosCreative += 5;
          
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("PROJECTS", margin, mainYPosCreative);
          
          mainYPosCreative += 6;
          
          resumeInfo.projects.forEach((project, index) => {
            // Add creative styling with colored box for each project
            pdf.setFillColor(245, 245, 250);
            pdf.roundedRect(margin, mainYPosCreative - 3, mainColWidth, 10, 2, 2, 'F');
            
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(themeColor);
            pdf.text(project.projectName || '', margin + 2, mainYPosCreative);
            
            mainYPosCreative += 5;
            
            if (project.techStack) {
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(fontSizes.small);
              pdf.setTextColor(70, 70, 70);
              pdf.text(`Technologies: ${project.techStack}`, margin + 2, mainYPosCreative);
              mainYPosCreative += 4;
            }
            
            // Links row
            let linksRowCreative = '';
            if (project.githubLink) linksRowCreative += `Code: ${project.githubLink}`;
            if (project.deployedLink) linksRowCreative += linksRowCreative ? ` • Demo: ${project.deployedLink}` : `Demo: ${project.deployedLink}`;
            
            if (linksRowCreative) {
              const splitLinks = pdf.splitTextToSize(linksRowCreative, mainColWidth - 4);
              pdf.setTextColor(themeColor);
              pdf.text(splitLinks, margin + 2, mainYPosCreative);
              mainYPosCreative += splitLinks.length * 4;
            }
            
            pdf.setTextColor(70, 70, 70);
            
            // Strip HTML from project summary
            const projectSummary = project.projectSummary ? project.projectSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitProjectSummary = pdf.splitTextToSize(projectSummary, mainColWidth - 4);
            pdf.text(splitProjectSummary, margin + 2, mainYPosCreative);
            
            mainYPosCreative += splitProjectSummary.length * 4 + 7;
            
            // Check if we need a new page
            if (mainYPosCreative > pageHeight - margin) {
              pdf.addPage();
              mainYPosCreative = margin;
            }
          });
        }
        
        // Skills in side column with creative styling
        if (resumeInfo.skills && resumeInfo.skills.length > 0) {
          pdf.setFillColor(themeColor);
          pdf.rect(sideColXCreative, sideYPosCreative, 10, 1, 'F');
          
          sideYPosCreative += 5;
          
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("SKILLS", sideColXCreative, sideYPosCreative);
          
          sideYPosCreative += 6;
          
          // Create pill-style skills
          let currentLineWidth = 0;
          let currentLineY = sideYPosCreative;
          
          resumeInfo.skills.forEach((skill, index) => {
            const skillText = skill.name;
            const skillWidth = pdf.getStringUnitWidth(skillText) * fontSizes.small / pdf.internal.scaleFactor + 6; // +6 for padding
            
            // Check if we need to move to next line
            if (currentLineWidth + skillWidth > sideColWidth) {
              currentLineWidth = 0;
              currentLineY += 6; // Move to next line
              
              // Check if we need a new page
              if (currentLineY > pageHeight - margin) {
                pdf.addPage();
                currentLineY = margin;
              }
            }
            
            // Draw pill background
            const isEven = index % 2 === 0;
            
            if (isEven) {
              // Filled pill
              pdf.setFillColor(themeColor);
              pdf.roundedRect(sideColXCreative + currentLineWidth, currentLineY - 3, skillWidth, 6, 3, 3, 'F');
              pdf.setTextColor(255, 255, 255);
            } else {
              // Outlined pill
              pdf.setDrawColor(themeColor);
              pdf.setFillColor(255, 255, 255);
              pdf.roundedRect(sideColXCreative + currentLineWidth, currentLineY - 3, skillWidth, 6, 3, 3, 'FD');
              pdf.setTextColor(themeColor);
            }
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.text(skillText, sideColXCreative + currentLineWidth + 3, currentLineY);
            
            currentLineWidth += skillWidth + 2; // +2 for gap between pills
          });
          
          sideYPosCreative = currentLineY + 10; // Update the Y position after skills
        }
        
        // Education section
        if (resumeInfo.education && resumeInfo.education.length > 0) {
          pdf.setFillColor(themeColor);
          pdf.rect(sideColXCreative, sideYPosCreative, 10, 1, 'F');
          
          sideYPosCreative += 5;
          
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("EDUCATION", sideColXCreative, sideYPosCreative);
          
          sideYPosCreative += 6;
          
          resumeInfo.education.forEach((edu, index) => {
            // Add creative styling with light background
            pdf.setFillColor(245, 245, 250);
            pdf.roundedRect(sideColXCreative, sideYPosCreative - 3, sideColWidth, 10, 2, 2, 'F');
            
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(themeColor);
            
            const degreeText = `${edu.degree || ''} ${edu.major && edu.degree ? "in " : ""} ${edu.major || ''}`;
            const splitDegree = pdf.splitTextToSize(degreeText, sideColWidth - 4);
            pdf.text(splitDegree, sideColXCreative + 2, sideYPosCreative);
            
            sideYPosCreative += splitDegree.length * 4 + 1;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            pdf.text(edu.universityName || '', sideColXCreative + 2, sideYPosCreative);
            
            sideYPosCreative += 4;
            
            const dateText = `${edu.startDate || ''} ${edu.startDate && edu.endDate ? " - " : ""} ${edu.endDate || ''}`;
            pdf.text(dateText, sideColXCreative + 2, sideYPosCreative);
            
            if (edu.grade) {
              sideYPosCreative += 4;
              pdf.text(`${edu.gradeType || 'Grade'}: ${edu.grade}`, sideColXCreative + 2, sideYPosCreative);
            }
            
            sideYPosCreative += 7; // Space between education entries
            
            // Check if we need a new page
            if (sideYPosCreative > pageHeight - margin) {
              pdf.addPage();
              sideYPosCreative = margin;
            }
          });
        }
        
        // Certifications section
        if (resumeInfo.certifications && resumeInfo.certifications.length > 0) {
          pdf.setFillColor(themeColor);
          pdf.rect(sideColXCreative, sideYPosCreative, 10, 1, 'F');
          
          sideYPosCreative += 5;
          
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(themeColor);
          pdf.text("CERTIFICATIONS", sideColXCreative, sideYPosCreative);
          
          sideYPosCreative += 6;
          
          resumeInfo.certifications.forEach((cert, index) => {
            // Creative styling with border
            pdf.setDrawColor(themeColor);
            pdf.setFillColor(250, 250, 255);
            pdf.roundedRect(sideColXCreative, sideYPosCreative - 3, sideColWidth, 10, 2, 2, 'FD');
            
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(themeColor);
            
            const splitName = pdf.splitTextToSize(cert.name || '', sideColWidth - 4);
            pdf.text(splitName, sideColXCreative + 2, sideYPosCreative);
            
            sideYPosCreative += splitName.length * 4 + 1;
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.small);
            pdf.setTextColor(70, 70, 70);
            
            pdf.text(cert.issuer || '', sideColXCreative + 2, sideYPosCreative);
            
            sideYPosCreative += 4;
            
            if (cert.date) {
              pdf.text(cert.date, sideColXCreative + 2, sideYPosCreative);
              sideYPosCreative += 4;
            }
            
            sideYPosCreative += 5; // Space between certification entries
            
            // Check if we need a new page
            if (sideYPosCreative > pageHeight - margin) {
              pdf.addPage();
              sideYPosCreative = margin;
            }
          });
        }
        break;
        
      // Add more cases for other templates as needed
      default:
        // Use modern template styling as default
        pdf.setFillColor(themeColor);
        pdf.rect(0, 0, pageWidth, 2, 'F'); // Top accent bar
        
        // Set up header section with personal details
        yPos += 10;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(fontSizes.header);
        pdf.setTextColor(40, 40, 40);
        pdf.text(`${resumeInfo.firstName || ''} ${resumeInfo.lastName || ''}`, margin, yPos);
        
        yPos += 6;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSizes.subheader);
        pdf.setTextColor(70, 70, 70);
        pdf.text(resumeInfo.jobTitle || '', margin, yPos);
        
        // Contact info
        yPos += 8;
        pdf.setFontSize(fontSizes.normal);
        pdf.setTextColor(70, 70, 70);
        
        let contactTextDefault = '';
        if (resumeInfo.email) contactTextDefault += `Email: ${resumeInfo.email}`;
        if (resumeInfo.phone) contactTextDefault += contactTextDefault ? `   |   Phone: ${resumeInfo.phone}` : `Phone: ${resumeInfo.phone}`;
        if (resumeInfo.address) contactTextDefault += contactTextDefault ? `   |   ${resumeInfo.address}` : resumeInfo.address;
        
        pdf.text(contactTextDefault, margin, yPos);
        
        // Links row
        let linksTextDefault = '';
        if (resumeInfo.linkedinUrl) linksTextDefault += `LinkedIn: ${resumeInfo.linkedinUrl}`;
        if (resumeInfo.githubUrl) linksTextDefault += linksTextDefault ? `   |   GitHub: ${resumeInfo.githubUrl}` : `GitHub: ${resumeInfo.githubUrl}`;
        if (resumeInfo.portfolioUrl) linksTextDefault += linksTextDefault ? `   |   Portfolio: ${resumeInfo.portfolioUrl}` : `Portfolio: ${resumeInfo.portfolioUrl}`;
        
        if (linksTextDefault) {
          yPos += 5;
          pdf.text(linksTextDefault, margin, yPos);
        }
        
        // Summary section
        if (resumeInfo.summary) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("SUMMARY", margin, yPos);
          
          yPos += 5;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          // Handle text wrapping for summary
          const splitSummary = pdf.splitTextToSize(resumeInfo.summary, usableWidth);
          pdf.text(splitSummary, margin, yPos);
          yPos += splitSummary.length * 5;
        }
        
        // Experience section
        if (resumeInfo.experience && resumeInfo.experience.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("EXPERIENCE", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.experience.forEach((exp, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(exp.title || '', margin, yPos);
            
            // Handle dates right-aligned
            const dateText = `${exp.startDate || ''} ${exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""} ${exp.currentlyWorking ? "Present" : exp.endDate || ''}`;
            const dateWidth = pdf.getStringUnitWidth(dateText) * fontSizes.normal / pdf.internal.scaleFactor;
            pdf.text(dateText, pageWidth - margin - dateWidth, yPos);
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(70, 70, 70);
            
            const companyText = `${exp.companyName || ''} ${exp.city && exp.companyName ? ", " : ""} ${exp.city || ''} ${exp.city && exp.state ? ", " : ""} ${exp.state || ''}`;
            pdf.text(companyText, margin, yPos);
            
            yPos += 5;
            
            // Strip HTML from work summary for plain text PDF
            const workSummary = exp.workSummary ? exp.workSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitWorkSummary = pdf.splitTextToSize(workSummary, usableWidth);
            pdf.text(splitWorkSummary, margin, yPos);
            
            yPos += splitWorkSummary.length * 5 + 5;
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        
        // Projects section
        if (resumeInfo.projects && resumeInfo.projects.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("PROJECTS", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.projects.forEach((project, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(project.projectName || '', margin, yPos);
            
            if (project.techStack) {
              yPos += 5;
              pdf.setFont("helvetica", "italic");
              pdf.setFontSize(fontSizes.small);
              pdf.text(`Technologies: ${project.techStack}`, margin, yPos);
            }
            
            let linksLine = '';
            if (project.githubLink) linksLine += `GitHub: ${project.githubLink}`;
            if (project.deployedLink) linksLine += linksLine ? `   |   Demo: ${project.deployedLink}` : `Demo: ${project.deployedLink}`;
            
            if (linksLine) {
              yPos += 4;
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(fontSizes.small);
              pdf.setTextColor(0, 0, 255); // Blue for links
              pdf.text(linksLine, margin, yPos);
              pdf.setTextColor(70, 70, 70); // Reset color
            }
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(fontSizes.normal);
            
            // Strip HTML from project summary
            const projectSummary = project.projectSummary ? project.projectSummary.replace(/<[^>]*>?/gm, '') : '';
            const splitProjectSummary = pdf.splitTextToSize(projectSummary, usableWidth);
            pdf.text(splitProjectSummary, margin, yPos);
            
            yPos += splitProjectSummary.length * 5 + 5;
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        
        // Education section
        if (resumeInfo.education && resumeInfo.education.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("EDUCATION", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.education.forEach((edu, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            
            const degreeText = `${edu.degree || ''} ${edu.major && edu.degree ? "in " : ""} ${edu.major || ''}`;
            pdf.text(degreeText, margin, yPos);
            
            const dateText = `${edu.startDate || ''} ${edu.startDate && edu.endDate ? " - " : ""} ${edu.endDate || ''}`;
            const dateWidth = pdf.getStringUnitWidth(dateText) * fontSizes.normal / pdf.internal.scaleFactor;
            pdf.text(dateText, pageWidth - margin - dateWidth, yPos);
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(70, 70, 70);
            pdf.text(edu.universityName || '', margin, yPos);
            
            if (edu.grade) {
              yPos += 4;
              pdf.setFontSize(fontSizes.small);
              pdf.text(`${edu.gradeType || 'Grade'}: ${edu.grade}`, margin, yPos);
            }
            
            yPos += 5;
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        
        // Skills section
        if (resumeInfo.skills && resumeInfo.skills.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("SKILLS", margin, yPos);
          
          yPos += 5;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSizes.normal);
          pdf.setTextColor(70, 70, 70);
          
          // Group skills in rows
          const skillNames = resumeInfo.skills.map(skill => skill.name);
          let skillText = skillNames.join(" • ");
          const splitSkills = pdf.splitTextToSize(skillText, usableWidth);
          pdf.text(splitSkills, margin, yPos);
          
          yPos += splitSkills.length * 5;
        }
        
        // Certifications section
        if (resumeInfo.certifications && resumeInfo.certifications.length > 0) {
          yPos += 8;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(fontSizes.subheader);
          pdf.setTextColor(40, 40, 40);
          pdf.text("CERTIFICATIONS", margin, yPos);
          
          yPos += 5;
          
          resumeInfo.certifications.forEach((cert, index) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(fontSizes.normal);
            pdf.setTextColor(40, 40, 40);
            pdf.text(cert.name || '', margin, yPos);
            
            if (cert.date) {
              const dateWidth = pdf.getStringUnitWidth(cert.date) * fontSizes.normal / pdf.internal.scaleFactor;
              pdf.text(cert.date, pageWidth - margin - dateWidth, yPos);
            }
            
            yPos += 5;
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(70, 70, 70);
            pdf.text(cert.issuer || '', margin, yPos);
            
            if (cert.description) {
              yPos += 4;
              pdf.setFontSize(fontSizes.small);
              const splitDescription = pdf.splitTextToSize(cert.description, usableWidth);
              pdf.text(splitDescription, margin, yPos);
              yPos += splitDescription.length * 4;
            } else {
              yPos += 5;
            }
            
            // Check if we need a new page
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
          });
        }
        break;
    }
    
    setDownloadProgress(90);
    
    // Generate a filename with resume title
    const fileName = `${resumeInfo.firstName || 'Resume'}_${resumeInfo.lastName || ''}_Resume.pdf`;
    pdf.save(fileName);
    
    setDownloadProgress(100);
    
    toast("Resume Downloaded", { 
      description: "Your resume has been saved as a PDF file",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    toast("Download failed", { 
      description: "Please try again",
      variant: "destructive"
    });
  } finally {
    setTimeout(() => {
      setDownloadingState(false);
      setDownloadProgress(0);
    }, 1000);
  }
};
  return (
    <>
      {/* Normal view mode */}
      <AnimatePresence>
        {!fullscreenPreview && (
          <motion.div 
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 pb-10 pt-20"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Main content with split layout */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Resume preview - left side */}
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                  className="lg:w-2/3 relative"
                >
                  {isLoading ? (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 flex justify-center items-center min-h-[600px]">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-6 text-indigo-200 text-lg">Preparing your professional resume...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      {/* Floating elements for visual flair */}
                      <div className="absolute -left-12 top-20 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl"></div>
                      <div className="absolute right-10 top-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 left-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>
                      
                      {/* Glow effect for the resume */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-blue-500/30 to-indigo-500/30 rounded-2xl blur-xl transform -translate-y-4 scale-105 opacity-80"></div>
                      
                      {/* Resume container with frame effect */}
                      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative">
                        {/* Frame effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 rounded-xl opacity-30"></div>
                        
                        {/* Resume viewer */}
                        <div className="relative">
                          {/* Status badge */}
                          <div className="absolute -right-2 -top-2 z-10">
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1, duration: 0.5 }}
                              className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Ready to Apply
                            </motion.div>
                          </div>
                          
                          {/* The actual resume preview */}
                          <div 
                            ref={resumeRef} 
                            id="resume-container"
                            className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl"
                            style={{ 
                              width: "290mm", 
                              maxWidth: "100%", 
                              height: "auto", 
                              minHeight: "500px",
                              padding: "0",
                              boxSizing: "border-box"
                            }}
                          >
                            <ResumePreview />
                          </div>
                          
                          {/* Fullscreen button overlay */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              size="sm" 
                              className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
                              onClick={() => setFullscreenPreview(true)}
                            >
                              <Maximize className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Control panel - right side */}
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="lg:w-1/3"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    {/* Tabs - Single tab only for Download */}

                    
                    {/* Tab content with glass morphism */}
                    <div className="p-6 space-y-6">
                      {/* Download tab */}
                      {activeSidebarTab === 'download' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
                              <Download className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Download Your Resume</h3>
                            <p className="text-indigo-200 text-sm mb-6">Get your professional resume as a PDF file</p>
                          </div>
                          
                          {/* Download options */}
                          <div className="space-y-4">
                            {/* Download button or progress */}
                            {downloadingState ? (
                              <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${downloadProgress}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full"
                                  ></motion.div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-center text-sm text-indigo-200">Processing your resume...</p>
                                  <span className="text-sm text-white font-medium">{downloadProgress}%</span>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                className="w-full py-6 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base rounded-xl relative overflow-hidden group"
                                onClick={handleDownloadPDF}
                              >
                                {/* Animated background */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                
                                <span className="flex items-center relative z-10">
                                  <Download className="mr-2 h-5 w-5" />
                                  Download as PDF
                                </span>
                              </Button>
                            )}
                            
                            {/* Navigation buttons */}
                            <div className="mt-4 space-y-3">
                              <Button 
                                className="w-full py-4 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 text-white rounded-xl transition-all duration-300"
                                onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                              >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="font-medium">Return to Editor</span>
                              </Button>
                              
                              <Button 
                                className="w-full py-4 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                                onClick={() => navigate('/dashboard')}
                              >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="font-medium">Back to Dashboard</span>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Pro Tips with glass effect */}
                          <div className="mt-6 bg-emerald-900/20 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/30">
                            <h4 className="text-sm font-medium text-emerald-300 mb-3 flex items-center">
                              <Trophy className="h-4 w-4 mr-2" />
                              Career Expert Tips
                            </h4>
                            <ul className="text-xs text-emerald-200 space-y-3">
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                PDF format is best for ATS systems and online job applications
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                Keep your resume sections concise and focused on relevant achievements
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                Tailor your resume to each job description for best results
                              </li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Settings tab */}
                      {activeSidebarTab === 'settings' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-600/20">
                              <Layout className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Resume Options</h3>
                            <p className="text-indigo-200 text-sm mb-6">Manage and edit your professional resume</p>
                          </div>
                          
                          <div className="space-y-4">
                            <Button 
                              className="w-full py-6 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                              onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                            >
                              <ArrowLeft className="h-5 w-5" />
                              <span className="font-medium">Return to Editor</span>
                            </Button>
                            
                            <Button 
                              className="w-full py-6 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                              onClick={() => navigate('/dashboard')}
                            >
                              <ArrowLeft className="h-5 w-5" />
                              <span className="font-medium">Back to Dashboard</span>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Full-screen preview mode with enhanced design */}
      <AnimatePresence>
        {fullscreenPreview && (
          <motion.div 
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 sm:p-10"
          >
            {/* Floating elements for visual interest */}
            <div className="absolute left-10 top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute right-10 top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            {/* Top bar with controls */}
            <div className="w-full max-w-5xl flex justify-between items-center py-4 px-6 bg-white/5 backdrop-blur-xl rounded-t-xl border border-white/10 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-white font-bold flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2 text-emerald-400" /> Full Resume Preview
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex gap-3"
              >
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white border-none shadow-lg"
                  onClick={handleDownloadPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white/30 bg-white/5 hover:bg-white/10"
                  onClick={() => setFullscreenPreview(false)}
                >
                  Close
                </Button>
              </motion.div>
            </div>
            
            {/* Resume preview with subtle glow */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative w-full max-w-5xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-indigo-500/20 rounded-b-xl blur-xl transform scale-105 opacity-50"></div>
              <div className="bg-white overflow-auto max-h-[80vh] w-full rounded-b-xl shadow-2xl relative z-10">
                <div 
                  id="fullscreen-resume" 
                  className="print-area mx-auto"
                  style={{
                    width: "250mm",
                    padding: "0",
                    margin: "0 auto",
                    boxSizing: "border-box"
                  }}
                >
                  <ResumePreview />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add style for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
}

export default ViewResume;