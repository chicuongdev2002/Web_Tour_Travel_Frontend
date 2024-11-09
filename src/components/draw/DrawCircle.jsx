import React from "react";
import { motion } from "framer-motion";
import "../draw/style.css";

// x: x position of the circle
// y: y position of the circle
// r: radius of the circle
// color: color of the circle
// custom: time delay for the animation
// duration: duration of the animation
function DrawCircle({ x, y, r, color, custom, duration, weight }) {
  const cx = `${x + r + weight}`;
  const cy = `${y + r + weight}`;
  // const draw = {
  //     hidden: { pathLength: 0, opacity: 0 },
  //     visible: (i) => {
  //         const delay = 0.5 + i * 0.5;
  //         return {
  //             pathLength: 1,
  //             opacity: 1,
  //             transition: {
  //                 pathLength: { delay, type: "spring", duration: duration, bounce: 0 },
  //                 opacity: { delay, duration: 0.01 }
  //             }
  //         };
  //     }
  // };
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={color}
      custom={custom}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: duration, delay: custom }}
      style={{ rotate: "-90deg", strokeWidth: weight }}
    />
  );
}

export default DrawCircle;
