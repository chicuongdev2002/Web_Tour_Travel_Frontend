import React from 'react'
import { motion } from "framer-motion";
import "../draw/style.css";

// x1: x position of the start point
// y1: y position of the start point
// x2: x position of the end point
// y2: y position of the end point
// color: color of the line
// custom: time delay for the animation
// duration: duration of the animation
function DrawLine({ x1, y1, x2, y2, color, custom, duration }) {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i) => {
            const delay = 0.5 + i * 0.5;
            return {
                pathLength: 1,
                opacity: 1,
                transition: {
                    pathLength: { delay, type: "spring", duration: duration, bounce: 0 },
                    opacity: { delay, duration: 0.01 }
                }
            };
        }
    };
    return (
        <motion.line x1={x1} y1={y1}
            x2={x2} y2={y2} stroke={color}
            variants={draw} custom={custom}
        />
    )
}

export default DrawLine