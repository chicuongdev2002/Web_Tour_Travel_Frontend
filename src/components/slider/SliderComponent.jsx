// SliderComponent.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../slider/sliderStyle.css";

const SliderComponent = ({ images, settings, callBack }) => {
  return (
    <div className="slider-container w-100">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>{callBack(image)}</div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
