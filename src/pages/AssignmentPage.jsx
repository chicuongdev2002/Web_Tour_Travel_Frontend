import React from "react";
import { CssBaseline } from "@mui/material";
import Assignments from "../components/tourassignment/Assignments";
import { useLocation, useNavigate } from "react-router-dom";
const AssignmentPage = () => {
  const location = useLocation();
  return (
    <>
      {/* <CssBaseline /> */}
      <Assignments />
    </>
  );
};

export default AssignmentPage;
