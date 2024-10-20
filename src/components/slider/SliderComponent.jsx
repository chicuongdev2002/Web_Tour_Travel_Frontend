// SliderComponent.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderComponent = ({ images, settings, callBack }) => {
  // <div key={index}>
  //   <img
  //     src={image}
  //     alt={`Ad ${index + 1}`}
  //     style={{ width: '100%' }}
  //   />
  // </div>
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>{callBack(image)}</div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
