import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderComponent from "../slider/SliderComponent";

function DivSliderBackground({ images, children }) {
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
  };
  const callBack = (image) => (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
    ></div>
  );
  return (
    <div style={{ position: "relative", width: "100%", height: "610px" }}>
      <SliderComponent
        images={images}
        settings={settings}
        callBack={callBack}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default DivSliderBackground;
