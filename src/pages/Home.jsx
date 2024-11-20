import React from "react";
import images from "../components/slider/images";
import "../style/style.css";
import SearchInput from "../functions/SearchInput";
import DivSliderBackground from "../components/divCustom/DivSliderBackground";
import NavHeader from "../components/navbar/NavHeader";
import TourList from "./TourList";
import { useNavigate } from "react-router-dom";
import SliderComponent from "../components/slider/SliderComponent";
import Footer from "../components/footer/Footer";
function Home() {
  if (global === undefined) {
    var global = window;
  }
  const navigate = useNavigate();
  const handleSearch = (params) => {
    navigate("/tour-list", { state: { searchParams: params } });
  };

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
  };

  const callBack = (image) => (
    <div className="divCenter" style={{ width: 250, height: 250 }} >
      <img src={image} style={{ width: '100%', height: '100%' }} />
    </div>
  );

  return (
    <div>
      <DivSliderBackground images={images}>
        <NavHeader textColor="white" opacity={true}/>
        <div className="justify-content-center align-items-center">
          {/* <SearchInput onSearch={handleSearch} /> */}
        </div>
      </DivSliderBackground>
      <div className="mt-4 px-3">
        <h1>Tour nổi bật trong tháng</h1>
        <SliderComponent images={images} settings={settings} callBack={callBack} />
        <h1 className="my-4">Tour mới</h1>
        <SliderComponent images={images} settings={settings} callBack={callBack} />
        <h1 className="my-4">Tour giảm sốc</h1>
        <SliderComponent images={images} settings={settings} callBack={callBack} />
      </div>
      {/* <div>
         <TourList searchParams={searchParams} />
       </div> */}
       <Footer />
    </div>
  );
}

export default Home;
