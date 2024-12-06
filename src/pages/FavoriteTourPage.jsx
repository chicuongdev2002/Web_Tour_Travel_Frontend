import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import FavoriteTourListComponent from "../components/tourfavorite/FavoriteTourListComponent";
import "../style/StylePage.css";
function FavoriteTourPage() {
  return (
    <div>
      <div className="position">
        <div className="nav-header">
          <NavHeader textColor="black" />
        </div>
        <div className="content">
          <FavoriteTourListComponent />
        </div>
      </div>
    </div>
  );
}

export default FavoriteTourPage;
