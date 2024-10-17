import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function DivSliderBackground({ images, children }) {
    const settings = {
        // dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: false
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '610px' }}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <div
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '610px',
                                width: '100%'
                            }}
                        >
                        </div>
                    </div>
                ))}
            </Slider>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
                {children}
            </div>
        </div>
    );
}

export default DivSliderBackground;