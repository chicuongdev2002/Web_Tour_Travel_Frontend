import React, { useEffect, useRef, useState } from "react";
import images from "../components/slider/images";
import "../style/style.css";
import DivSliderBackground from "../components/divCustom/DivSliderBackground";
import NavHeader from "../components/navbar/NavHeader";
import { useNavigate } from "react-router-dom";
import SliderComponent from "../components/slider/SliderComponent";
import Footer from "../components/footer/Footer";
import { getTourInDay } from "../functions/getTour";
import image404 from '../assets/404.png'
import { convertISOToCustomFormat } from '../functions/format'
import { IoChevronDownOutline, IoSendSharp  } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";
import reply from "../functions/replyChatbot";
import constant from '../assets/constantManage'
import QuickSearch from "../components/search/QuickSearch";
import img from '../assets/left_flight.png'
function Home() {
  if (global === undefined) {
    var global = window;
  }
  const user = JSON.parse(global.localStorage.getItem('user'))
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('')
  const [hide, setHide] = useState(true)
  // const [data, setData] = useState([
  //   { me: false, content: constant.HI, createDate: new Date() },
  //   { me: false, content: constant.SEARCH_TOUR_2, onClick: constant.SEARCH_TOUR_2 },
  //   { me: false, content: constant.CANCLE_TOUR_POLICY, onClick: constant.CANCLE_TOUR_POLICY },
  //   { me: false, content: constant.PAYMENTS_METHOD, onClick: constant.PAYMENTS_METHOD },
  // ])
  const [data, setData] = useState([])
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

  const handleSend = (text) => {
    if(!text) text = inputText
    if(text === '') return
    setData(pre => [...pre, 
      { me: true, content: text, createDate: new Date() }
    ])
    const dataRep = reply(text, user? user.userId : '123').then(data => {
      const lst = dataRep.data?? data
      setTimeout(() => {
        lst.forEach(item => {
          setData(pre => [...pre, item])
        })
      }, 500)
      setInputText('')
      handleScrollToBottom()
    })
  }

  const BubbleChat = ({ item }) => {
    const time = convertISOToCustomFormat(item.createDate)
    return (
      <div title={time.substring(5)} className={`w-100 d-flex ${item.me ? 'justify-content-end' : 'justify-content-start'}`}>
        {
          item.onClick? 
            <div className='m-1'>
              <button className="bg-success" onClick={() => handleSend(item.onClick)}>{item.content}</button>
            </div> : 
            <div className={`p-2 m-1 border ${item.me ? 'bg-primary border-light' : 'bg-light border-dark'}`}
              style={{
                width: 'fit-content', borderRadius: 15, maxWidth: '75%', textAlign: 'start',
                wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal',
              }}>
              <p className={`m-0 w-100 ${item.me ? 'text-light' : 'text-dark'}`}>{item.content}</p>
              <p className={`m-0 w-100 ${item.me ? 'text-light' : 'text-dark'}`}>{time.substring(0, 5)}</p>
            </div>
        }
      </div>
    )
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      buttonRef.current.click();
    }
  };

  useEffect(() => {
    handleScrollToBottom()
  }, [data])

  const handleScrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div>
      <DivSliderBackground images={images}>
        <NavHeader textColor="white" opacity={true}/>
          <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-64px'
        }}>
          <QuickSearch />
        </div>
        <button style={{ width: 70, height: 70, backgroundColor: 'green', position: 'absolute', bottom: 10, right: 0, borderRadius: '50%'}} 
          onClick={() => setHide(false) }>
            <BsRobot size={30}/>
          </button>
        {!hide && <div className="bg-light divColumnBetween" style={{ width: 400, height: 400, borderRadius: 20, overflow: 'hidden', position: 'absolute', bottom: 10, right: 5 }}>
          <div className="w-100 divColumnBetween" style={{ height: 340 }}>
            <div className='divCenter w-100' style={{ height: 50, backgroundColor: 'lightgreen', position: 'relative' }}>
              <b className='m-0 h3 text-dark'>Chat</b>
              <img src={img} style={{ position: 'absolute', left: 5, top: 5 }}/>
              <button className="bg-transparent border-0" 
                style={{ position: 'absolute', right: 0}}
                onClick={() => setHide(true)}>
                <IoChevronDownOutline color="black"/>
              </button>
            </div>
            <div style={{ height: 290, overflowY: 'auto' }} className='mt-2 pt-1 border border-dark w-95'
              ref={scrollRef}
            >
              {
                data.map((item, index) => (
                  <div key={index}>
                    <BubbleChat item={item} />
                  </div>
                ))
              }
            </div>
          </div>
          <div className='mt-2 pl-2 divRowBetween w-100' style={{ height: 60 }}>
            <input className='w-90 rounded' style={{ height: 40 }} placeholder='Type message'
              value={inputText}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button ref={buttonRef} className='w-10 ml-2 divCenter' style={{ height: 40, backgroundColor: 'lightgreen' }} onClick={() => handleSend('')}>
            <IoSendSharp size={25} color="green"/>
            </button>
          </div>
        </div>}
      </DivSliderBackground>
      <div className="mt-4 px-3">
        <h1>Tour nổi bật trong tháng</h1>
        <SliderComponent images={images} settings={settings} callBack={callBack} />
        <h1 className="my-4">Tour trong ngày</h1>
        <SliderComponent images={tourInDay} settings={settings} callBack={callBack} />
        <h1 className="my-4">Tour giảm sốc</h1>
        <SliderComponent images={images} settings={settings} callBack={callBack} />
      </div>
       <Footer />
    </div>
  );
}

export default Home;