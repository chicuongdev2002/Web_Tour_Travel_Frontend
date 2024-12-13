import React from "react";
import TourProviderManager from "../components/tour/TourProviderManager";
import NavHeader from "../components/navbar/NavHeader";
import "../style/StylePage.css";
const TourProviderManagerPage = () => {
  return (
    <>
       <div className="position">
      <div className="nav-header">
        <NavHeader textColor="black" />
      </div>
      <div className="content">
      <TourProviderManager />
      </div>
    </div>
      
    </>
  );
};

export default TourProviderManagerPage;
