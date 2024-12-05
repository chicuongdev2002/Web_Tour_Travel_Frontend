import React, { useEffect, useRef, useState } from "react";
import images from "../components/slider/images";
import "../style/style.css";
import DivSliderBackground from "../components/divCustom/DivSliderBackground";
import NavHeader from "../components/navbar/NavHeader";
import TourList from "./TourList";
import { useNavigate } from "react-router-dom";
import SliderComponent from "../components/slider/SliderComponent";
import Footer from "../components/footer/Footer";
import { getTourInDay } from "../functions/getTour";
import image404 from "../assets/404.png";
import { convertISOToCustomFormat } from "../functions/format";
import { IoChevronDownOutline } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";
import reply from "../functions/replyChatbot";
import { getProvince, getDistrict } from "../functions/getProvince";
import findInList from "../functions/findInList";
import constant from "../assets/constantManage";
import QuickSearch from "../components/search/QuickSearch";
function Home() {
  if (global === undefined) {
    var global = window;
  }
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [objectKey, setObjetKey] = useState({});
  const [hide, setHide] = useState(true);
  const [data, setData] = useState([
    { me: false, content: constant.HI, createDate: new Date() },
    {
      me: false,
      content: constant.SEARCH_TOUR_2,
      onClick: constant.SEARCH_TOUR_2,
    },
    {
      me: false,
      content: constant.CANCLE_TOUR_POLICY,
      onClick: constant.CANCLE_TOUR_POLICY,
    },
    {
      me: false,
      content: constant.PAYMENTS_METHOD,
      onClick: constant.PAYMENTS_METHOD,
    },
  ]);
  // const handleSearch = (params) => {
  //   navigate("/tour-list", { state: { searchParams: params } });
  // };
  const buttonRef = useRef(null);
  const scrollRef = useRef(null);
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
    <div
      className="divCenter"
      style={{ width: 250, height: 250, position: "relative" }}
      onClick={() => navigate(`/tour-details/${tour.tourId}`)}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: 10,
          padding: 5,
          bottom: 5,
          left: 5,
          right: 5,
          textAlign: "center",
        }}
      >
        <h5>{tour.tourName}</h5>
        <div>
          <div className="divRowBetween">
            <p
              className="m-0 text-danger px-2 w-50"
              style={{ textAlign: "start" }}
            >
              {tour.price?.indexOf("-") == -1
                ? tour.price?.split(",")[1]
                : tour.price?.split(",")[1] +
                  " VND - " +
                  tour.price?.split(",")[3]}{" "}
              VND
            </p>
            <button
              className="w-50 h-100"
              style={{ height: 30, paddingTop: 0, paddingBottom: 0 }}
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
      <img
        src={tour.image ?? image404}
        style={{
          width: "100%",
          height: "100%",
          opacity: 0.9,
          zIndex: -1,
        }}
      />
    </div>
  );

  const [tourInDay, setTourInDay] = React.useState([]);

  useEffect(() => {
    getTourInDay().then((data) => {
      setTourInDay(data);
    });
  }, []);

  const handleDoSend = (text, data) => {
    setData((pre) => [
      ...pre,
      { me: true, content: text, createDate: new Date() },
    ]);
    const dataRep = reply(
      text.indexOf(",") == -1 ? text : text.split(",")[1],
      keyWord,
      data,
    );
    setKeyWord(dataRep.keyword);
    setTimeout(() => {
      const lst = dataRep.data ?? dataRep;
      lst.forEach((item) => {
        setData((pre) => [...pre, item]);
      });
    }, 500);
    setInputText("");
    handleScrollToBottom();
  };

  const handleSend = (text) => {
    if (!text) text = inputText;
    if (text === "") return;
    if (keyWord == "where")
      if (text.indexOf(",") === -1)
        getProvince().then((data) => {
          handleDoSend(
            text,
            data.map((item) => item.name),
          );
        });
      else
        getProvince().then((data) => {
          const province = findInList(
            text.split(",")[0],
            data.map((item) => item.name),
          );
          if (province) {
            getDistrict(data.find((item) => item.name === province).id).then(
              (data) => {
                handleDoSend(
                  text,
                  data.map((item) => item.name),
                );
              },
            );
          } else handleDoSend(text);
        });
    else handleDoSend(text);
  };

  const BubbleChat = ({ item }) => {
    const time = convertISOToCustomFormat(item.createDate);
    return (
      <div
        title={time.substring(5)}
        className={`w-100 d-flex ${item.me ? "justify-content-end" : "justify-content-start"}`}
      >
        {item.onClick ? (
          <div className="m-1">
            <button
              className="bg-success"
              onClick={() => handleSend(item.onClick)}
            >
              {item.content}
            </button>
          </div>
        ) : (
          <div
            className={`p-2 m-1 border ${item.me ? "bg-primary border-light" : "bg-light border-dark"}`}
            style={{
              width: "fit-content",
              borderRadius: 15,
              maxWidth: "75%",
              textAlign: "start",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            <p className={`m-0 w-100 ${item.me ? "text-light" : "text-dark"}`}>
              {item.content}
            </p>
            <p className={`m-0 w-100 ${item.me ? "text-light" : "text-dark"}`}>
              {time.substring(0, 5)}
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      buttonRef.current.click();
    }
  };

  useEffect(() => {
    handleScrollToBottom();
  }, [data]);

  const handleScrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div>
      <DivSliderBackground images={images}>
        <NavHeader textColor="white" opacity={true} />
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-64px", // Điều chỉnh nếu cần để căn giữa hoàn hảo
          }}
        >
          <QuickSearch />
        </div>
        <button
          style={{
            width: 70,
            height: 70,
            backgroundColor: "green",
            position: "absolute",
            bottom: 10,
            right: 0,
            borderRadius: "50%",
          }}
          onClick={() => setHide(false)}
        >
          <BsRobot size={30} />
        </button>
        {!hide && (
          <div
            className="bg-light divColumnBetween"
            style={{
              width: 400,
              height: 400,
              position: "absolute",
              bottom: 10,
              right: 0,
            }}
          >
            <div className="w-100 divColumnBetween" style={{ height: 340 }}>
              <div
                className="divCenter w-100 bg-primary"
                style={{ height: 50, position: "relative" }}
              >
                <b className="m-0 h3 text-light">Chat</b>
                <button
                  className="bg-transparent border-0"
                  style={{ position: "absolute", right: 0 }}
                  onClick={() => setHide(true)}
                >
                  <IoChevronDownOutline />
                </button>
              </div>
              <div
                style={{ height: 290, overflowY: "auto" }}
                className="mt-2 pt-1 border border-dark w-95"
                ref={scrollRef}
              >
                {data.map((item, index) => (
                  <div key={index}>
                    <BubbleChat item={item} />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="mt-2 pl-2 divRowBetween w-100"
              style={{ height: 60 }}
            >
              <input
                className="w-90 rounded"
                style={{ height: 40 }}
                placeholder="Type message"
                value={inputText}
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                ref={buttonRef}
                className="w-10 bg-primary ml-2"
                style={{ height: 40 }}
                onClick={() => handleSend("")}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </DivSliderBackground>
      <div className="mt-4 px-3">
        <h1>Tour nổi bật trong tháng</h1>
        <SliderComponent
          images={images}
          settings={settings}
          callBack={callBack}
        />
        <h1 className="my-4">Tour trong ngày</h1>
        <SliderComponent
          images={tourInDay}
          settings={settings}
          callBack={callBack}
        />
        <h1 className="my-4">Tour giảm sốc</h1>
        <SliderComponent
          images={images}
          settings={settings}
          callBack={callBack}
        />
      </div>
      {/* <div>
         <TourList searchParams={searchParams} />
       </div> */}
      <Footer />
    </div>
  );
}

export default Home;
