import React, { useState, useEffect, useRef } from "react";
import "./sliderStyle.css";

function Slider({ children, quantity }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDone, setSlideDone] = useState(true);
  const [timeID, setTimeID] = useState(null);

  useEffect(() => {
    if (slideDone) {
      setSlideDone(false);
      setTimeID(
        setTimeout(() => {
          slideNext();
          setSlideDone(true);
        }, 2000)
      );
    }
  }, [slideDone]);

  const slideNext = () => {
    setActiveIndex((val) => {
      if (val >= children.length - quantity) {
        return 0;
      } else {
        return val + 1;
      }
    });
  };

  const slidePrev = () => {
    setActiveIndex((val) => {
      if (val <= 0) {
        return children.length - quantity;
      } else {
        return val - 1;
      }
    });
  };

  const AutoPlayStop = () => {
    if (timeID > 0) {
      clearTimeout(timeID);
      setSlideDone(false);
    }
  };

  const AutoPlayStart = () => {
    if (!slideDone) {
      setSlideDone(true);
    }
  };

  return (
    <div
      className="container__slider"
      onMouseEnter={AutoPlayStop}
      onMouseLeave={AutoPlayStart}
    >
      {children.map((item, index) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%',
          transform: `translateX(-${activeIndex * 100/quantity}%)`
           }}
            className={"slider__item"}
            key={index}
          >
            {
              quantity === 1 ?
                <div style={{ width: '100%' }}>{item}</div> :
              quantity === 2 ?
                index === 0 ?
                  <>
                    <div style={{ width: '50%' }}>{item}</div>
                    <div style={{ width: '50%', float: 'left' }}>{children[index + 1]}</div>
                  </> :
                  index <= children.length - quantity ?
                    <>
                      <div style={{ width: '50%' }}>{children[2 * index]}</div>
                      <div style={{ width: '50%' }}>{children[2 * index + 1]}</div>
                    </> : null
                    : 
                  index === 0 ?
                  <>
                    <div style={{ width: '33.33%' }}>{item}</div>
                    <div style={{ width: '33.33%' }}>{children[index + 1]}</div>
                    <div style={{ width: '33.33%' }}>{children[index + 2]}</div>
                  </>
                  : index <= children.length - quantity ?
                    <>
                      <div style={{ width: '33.33%' }}>{children[3 * index]}</div>
                      <div style={{ width: '33.33%' }}>{children[3 * index + 1]}</div>
                      <div style={{ width: '33.33%' }}>{children[3 * index + 2]}</div>
                    </> : null
            }
          </div>
        )
      })}

      <div className="container__slider__links">
        {children.map((item, index) => {
          return index >= children.length - quantity + 1 ? null : (
            <button
              key={index}
              className={
                activeIndex === index
                  ? "container__slider__links-small container__slider__links-small-active"
                  : "container__slider__links-small"
              }
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
              }}
            ></button>
          )
        })}
      </div>

      <button
        className="slider__btn-next"
        onClick={(e) => {
          e.preventDefault();
          slideNext();
        }}
      >
        {">"}
      </button>
      <button
        className="slider__btn-prev"
        onClick={(e) => {
          e.preventDefault();
          slidePrev();
        }}
      >
        {"<"}
      </button>
    </div>
  );
}

export default Slider;
