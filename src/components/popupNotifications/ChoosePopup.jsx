import React from "react";
import DrawRejectIcon from "../draw/DrawRejectIcon";
import ModalComponent from "../modal/ModalComponent";
import DrawQuestionMark from "../draw/DrawQuestionMark";

function ChoosePopup({ title, message, open, onclose, onAccept, onReject }) {
  return (
    <ModalComponent open={open} onclose={onclose}>
      <div
        className="divCenterColumnBetween"
        style={{
          width: title.length > 15 || message.length > 20 ? 400 : 200,
          height: 210,
          marginTop: 10,
        }}
      >
        <div className="divCenter" style={{ width: 200, height: 100 }}>
          <DrawQuestionMark duration={2} />
        </div>
        <div className="w-100 divCenterColumn">
          <h3 className="text-dark">{title}</h3>
          <p>{message}</p>
          <div className="w-75 divRowBetween">
            <button
              className="btn btn-primary w-40 bg-light text-dark"
              onClick={onAccept}
            >
              OK
            </button>
            <button
              className="btn btn-primary w-40 bg-light text-dark"
              onClick={onReject}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
}

export default ChoosePopup;
