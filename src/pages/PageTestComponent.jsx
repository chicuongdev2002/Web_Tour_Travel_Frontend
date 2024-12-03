import React from "react";
import ComponentTest from "../components/componentTest/ComponentTest";

function PageTestComponent() {
  const destinations = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Huế", "Nha Trang"];
  return (
    <div className="divCenter">
      <ComponentTest width={400} height={400} destinations={destinations}/>
    </div>
  );
}

export default PageTestComponent;
