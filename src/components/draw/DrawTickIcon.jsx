import React from "react";
import "../draw/style.css";
import { motion } from "framer-motion";
import DrawCircle from "../draw/DrawCircle";
import DrawLine from "../draw/DrawLine";

function DrawTickIcon({ width, color }) {
  const circle = {
    x: 0,
    y: 0,
    r: (width - 30) / 2,
  };
  const line1 = {
    x1: (4 * width) / 16,
    y1: (8 * width) / 16,
    x2: (7 * width) / 16,
    y2: (12 * width) / 16,
  };
  const line2 = {
    x1: (7 * width) / 16,
    y1: (12 * width) / 16,
    x2: (12 * width) / 16,
    y2: (6 * width) / 16,
  };
  return (
    <motion.svg
      width={width}
      height={width}
      viewBox={`0 0 ${width} ${width}`}
      initial="hidden"
      animate="visible"
    >
      <DrawCircle
        x={circle.x}
        y={circle.y}
        r={circle.r}
        color={color}
        custom={0}
        duration={0.5}
        weight={20}
      />
      <DrawLine
        x1={line1.x1}
        y1={line1.y1}
        x2={line1.x2}
        y2={line1.y2}
        color={color}
        custom={0.5}
        duration={0.5}
      />
      <DrawLine
        x1={line2.x1}
        y1={line2.y1}
        x2={line2.x2}
        y2={line2.y2}
        color={color}
        custom={1}
        duration={0.5}
      />
    </motion.svg>
  );
}

export default DrawTickIcon;
