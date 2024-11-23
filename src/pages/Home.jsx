import React from "react";
import images from "../components/slider/images";
import "../style/style.css";
import DivSliderBackground from "../components/divCustom/DivSliderBackground";
import NavHeader from "../components/navbar/NavHeader";
import TourList from "./TourList";
import { useNavigate } from "react-router-dom";
function Home() {
  if (global === undefined) {
    var global = window;
  }
  const navigate = useNavigate();
  const handleSearch = (params) => {
    navigate("/search-page");
  };

  return (
    <div>
      <DivSliderBackground images={images}>
        <NavHeader textColor="white" />
        <div className="justify-content-center align-items-center">
          {/* <SearchInput onSearch={handleSearch} /> */}
          <button
            onClick={() => {
              sendNotification({ sender: 21, receiver: 22, message: "Hello" });
            }}
          >
            Send
          </button>
            <button
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </DivSliderBackground>
      {/* <div style={{ display: 'flex', flexDirection: 'column', marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
        <h1>Tour nổi bật trong tháng</h1>
        <div style={{ display: 'flex', width: '70%', justifyContent: 'center', alignItems: 'center' }}>
          <SliderComponent quantity={3} images={images} />
        </div>
      </div> */}
      {/* <div>
         <TourList searchParams={searchParams} />
       </div> */}
    </div>
  );
}

export default Home;
