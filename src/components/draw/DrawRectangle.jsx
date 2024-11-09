import React from "react";
import { motion } from "framer-motion";
import "../draw/style.css";

// x: x position of the rectangle
// y: y position of the rectangle
// width: width of the rectangle
// height: height of the rectangle
// rx: radius of the rectangle
// color: color of the rectangle
// custom: time delay for the animation
// duration: duration of the animation
function DrawRectangle({ width, height, x, y, rx, color, custom, duration }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => {
      const delay = 0.5 + i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: duration, bounce: 0 },
          opacity: { delay, duration: 0.01 },
        },
      };
    },
  };
  return (
    <motion.rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      stroke={color}
      draw={draw}
      custom={custom}
    />
  );
}

export default DrawRectangle;
