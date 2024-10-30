import React, { useEffect } from 'react'
import SuccessPopup from '../popupNotifications/SuccessPopup';
import DrawRejectIcon from '../draw/DrawRejectIcon';
import FailPopup from '../popupNotifications/FailPopup';
import { motion } from "framer-motion";
import DrawCircle from '../draw/DrawCircle';
import DrawQuestionMark from '../draw/DrawQuestionMark';
import ChoosePopup from '../popupNotifications/ChoosePopup';

function ComponentTest({ width, height }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Click me!</button>
      {open && (
        // <ChoosePopup width={250} height={200} title='ChoosePopup' message={"This is a test"}
        // open={open} onclose={() => setOpen(false)}
        // onClick={() => setOpen(false)} />
        <SuccessPopup width={300} height={300} title='SuccessPopup' message={"This is a test"}
        open={open} onClose={() => setOpen(false)} onClick={() => setOpen(false)} />
        // <FailPopup width={300} height={300} title='FailPopup' message={"This is a test"}
        // open={open} onClose={() => setOpen(false)} onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

export default ComponentTest