import React, { useEffect } from "react";
import images from "../components/slider/images";
import "../style/style.css";
import DivSliderBackground from "../components/divCustom/DivSliderBackground";
import NavHeader from "../components/navbar/NavHeader";
import TourList from "./TourList";
import { useNavigate } from "react-router-dom";
import SliderComponent from "../components/slider/SliderComponent";
import Footer from "../components/footer/Footer";
import { getTourInDay } from "../functions/getTour";
import image404 from '../assets/404.png'
import Fab from '@mui/material/Fab';
import QuickSearch from "../components/search/QuickSearch";
function Home() {
  if (global === undefined) {
    var global = window;
  }
  const navigate = useNavigate();
  // const handleSearch = (params) => {
  //   navigate("/tour-list", { state: { searchParams: params } });
  // };

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
  };

  const callBack = (tour) => (
    <div className="divCenter" style={{ width: 250, height: 250, position: 'relative' }} 
      onClick={() => navigate(`/tour-details/${tour.tourId}`)}
    >
      <div style={{
        position: 'absolute', backgroundColor: 'white', borderRadius: 10,
        padding: 5, bottom: 5, left: 5, right: 5, textAlign: 'center'
      }}>
        <h5>{tour.tourName}</h5>
        <div>
        <div className="divRowBetween">
        <p className="m-0 text-danger px-2 w-50" style={{ textAlign: 'start' }}>{tour.price?.indexOf("-") == -1 ?
          tour.price?.split(",")[1] :
          tour.price?.split(",")[1] + " VND - " + tour.price?.split(",")[3]} VND</p>
        <button className="w-50 h-100" style={{ height: 30, paddingTop: 0, paddingBottom: 0 }}>Đặt ngay</button>
        </div>
        </div>
      </div>
      <img src={tour.image ?? image404} style={{
        width: '100%', height: '100%',
        opacity: 0.9, zIndex: -1
      }} />
    </div>
  );

  const [tourInDay, setTourInDay] = React.useState([]);

  useEffect(() => {
    getTourInDay().then((data) => {
      setTourInDay(data);
    });
  }, []);

  return (
    <div>
      <DivSliderBackground images={images}>
        <NavHeader textColor="white" opacity={true}/>
          <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-64px' // Điều chỉnh nếu cần để căn giữa hoàn hảo
        }}>
          <QuickSearch />
        </div>
      </DivSliderBackground>
      <div className="mt-4 px-3">
        <h1>Tour nổi bật trong tháng</h1>
        <SliderComponent images={images} settings={settings} callBack={callBack} />
        <h1 className="my-4">Tour trong ngày</h1>
        <SliderComponent images={tourInDay} settings={settings} callBack={callBack} />
        <h1 className="my-4">Tour giảm sốc</h1>
        <SliderComponent images={images} settings={settings} callBack={callBack} />
      </div>
      {/* <div>
         <TourList searchParams={searchParams} />
       </div> */}
       <Footer />
       <Fab size="medium" color="secondary" aria-label="add">
          Click!
       </Fab>
    </div>
  );
}

export default Home;
