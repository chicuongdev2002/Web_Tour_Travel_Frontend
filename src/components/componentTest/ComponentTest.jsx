import React, { useState, useEffect } from 'react'
import FormView from '../formView/FormView'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import axios from 'axios'
import { BeatLoader } from 'react-spinners';

function ComponentTest() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Giả lập loading trong 3 giây
  }, []);

  return (
    <div>
      {loading ? (
        <BeatLoader color="#36d7b7" size={15} />
      ) : (
        <p>Content Loaded</p>
      )}
    </div>
  );
}

export default ComponentTest