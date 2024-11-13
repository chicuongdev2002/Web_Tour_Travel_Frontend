import React, { useState, useRef, useEffect } from "react";
import images from "../components/slider/images";
import "../style/style.css";
import SearchInput from "../functions/SearchInput";
import DivSliderBackground from "../components/divCustom/DivSliderBackground";
import NavHeader from "../components/navbar/NavHeader";
import TourList from "./TourList";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useNavigate } from "react-router-dom";
function Home() {
  if (global === undefined) {
    var global = window;
  }
  var stompClient = useRef(null);
  const navigate = useNavigate();
  const handleSearch = (params) => {
    navigate("/tour-list", { state: { searchParams: params } });
  };

  useEffect(() => {
    let socket = new SockJS(`http://localhost:8080/ws`);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, onConnected, onError);
  }, []);

  const onConnected = () => {
    stompClient.current.subscribe('/user/' + 1 + '/singleChat', (payload) => {
      const message = JSON.parse(payload.body);
      console.log(message);
    })
  }

  const onError = (error) => {
    console.log('Could not connect to WebSocket server. Please refresh and try again!');
  }

  const sendMessage = (message) => {
    stompClient.current.send('/app/notify', {}, JSON.stringify({ message: "Hello world", userId: 1}));
  }

  return (
    <div>
      <DivSliderBackground images={images}>
        <NavHeader textColor="white" />
        <div className="justify-content-center align-items-center">
          {/* <SearchInput onSearch={handleSearch} /> */}
          <button onClick={sendMessage}>Send</button>
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
