import React, { useEffect } from 'react'
import { motion } from "framer-motion";

function DrawQuestionMark({ duration }) {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setOpen((prevOpen) => !prevOpen);
      }, 2000);
  
      return () => clearInterval(intervalId);
    }, []);
  
    return (
      <motion.svg initial={{ scale: 0.25 }} style={{ position: 'absolute', top: -120 }} width={200} height={350} viewBox={`0 0 ${200} ${350}`}>
        <motion.path
          d="M20,100 Q20,10 100,10 Q180,10 180,100 
            Q180,150 140,200 Q125,220 125,250 
            Q65,250 65,250
            Q50,220 85,180 Q120,140 120,100 Q120,60 95,60
            Q75,60 70,100 Q20,100 15,100"
          fill={open? "red": "none"}
          stroke="red"
          strokeWidth="10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: duration, repeat: Infinity, repeatDelay: duration }}
        />
        <motion.circle cx={95} cy={300}
          r="30" stroke="red"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: duration, repeat: Infinity,
            repeatDelay: duration
          }}
          className={open? 'styleFill' : ''}
          style={{
            rotate: "-90deg", strokeWidth: 10
          }}
        />
      </motion.svg>
    );
}

export default DrawQuestionMark