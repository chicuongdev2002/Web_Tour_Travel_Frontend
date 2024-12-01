import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import FavoriteTourListComponent from "../components/tourfavorite/FavoriteTourListComponent";


function FavoriteTourPage() {
  return (
    <div>
      <NavHeader textColor="black" />
      <FavoriteTourListComponent />
    </div>
  );
}

export default FavoriteTourPage;
