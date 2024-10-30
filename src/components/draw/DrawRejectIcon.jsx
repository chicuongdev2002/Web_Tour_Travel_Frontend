import React from 'react'
import "../draw/style.css";
import { motion } from "framer-motion";
import DrawCircle from '../draw/DrawCircle';
import DrawLine from '../draw/DrawLine';

function DrawRejectIcon({ width, color }) {
    const circle = {
        x: 0,
        y: 0,
        r: (width - 30) / 2
    }
    const line1 = {
        x1: 8 * width / 16,
        y1: 8 * width / 16,
        x2: 5 * width / 16,
        y2: 5 * width / 16
    }
    const line2 = {
        x1: 8 * width / 16,
        y1: 8 * width / 16,
        x2: 11 * width / 16,
        y2: 5 * width / 16
    }
    const line3 = {
        x1: 8 * width / 16,
        y1: 8 * width / 16,
        x2: 5 * width / 16,
        y2: 11 * width / 16
    }
    const line4 = {
        x1: 8 * width / 16,
        y1: 8 * width / 16,
        x2: 11 * width / 16,
        y2: 11 * width / 16
    }
    return (
        <motion.svg width={width} height={width} viewBox={`0 0 ${width} ${width}`} initial="hidden" animate="visible">
            <DrawCircle x={circle.x} y={circle.y} r={circle.r} color={color} custom={0} duration={0.5} weight={20} />
            <DrawLine x1={line1.x1} y1={line1.y1} x2={line1.x2} y2={line1.y2} color={color} custom={0.15} duration={0.5} />
            <DrawLine x1={line2.x1} y1={line2.y1} x2={line2.x2} y2={line2.y2} color={color} custom={0.15} duration={0.5} />
            <DrawLine x1={line3.x1} y1={line3.y1} x2={line3.x2} y2={line3.y2} color={color} custom={0.15} duration={0.5} />
            <DrawLine x1={line4.x1} y1={line4.y1} x2={line4.x2} y2={line4.y2} color={color} custom={0.15} duration={0.5} />
        </motion.svg>
    );
}

export default DrawRejectIcon