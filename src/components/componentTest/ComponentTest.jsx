import React, { useEffect } from "react";
import SuccessPopup from "../popupNotifications/SuccessPopup";
import DrawRejectIcon from "../draw/DrawRejectIcon";
import FailPopup from "../popupNotifications/FailPopup";
import { motion } from "framer-motion";
import DrawCircle from "../draw/DrawCircle";
import DrawQuestionMark from "../draw/DrawQuestionMark";
import ChoosePopup from "../popupNotifications/ChoosePopup";
import TableComponent from "../table/TableComponent";

function ComponentTest({ width, height }) {
  const [open, setOpen] = React.useState(false);
  return (
    <TableComponent
      headers={["Header 1", "Header 2", "Header 3"]}
      data={{
        content: [
          { "Header 1": "Data 1", "Header 2": "Data 2", "Header 3": "Data 3" },
        ],
      }}
      getData={() => {}}
    />
  );
}

export default ComponentTest;
