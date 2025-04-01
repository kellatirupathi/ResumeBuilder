import React from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/custom/Header"; // Adjust import path as needed
import { useSelector } from "react-redux";

function MainLayout({ children }) {
  const location = useLocation();
  const hideHeaderPaths = ['/dashboard/edit-resume', '/resume-editor'];
  const shouldShowHeader = !hideHeaderPaths.some(path => location.pathname.includes(path));
  const user = useSelector((state) => state.editUser.userData);

  return (
    <>
      {shouldShowHeader && <Header user={user} />}
      {children}
    </>
  );
}

export default MainLayout;