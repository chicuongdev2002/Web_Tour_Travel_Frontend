import React from "react";
import DrawRejectIcon from "../draw/DrawRejectIcon";
import ModalComponent from "../modal/ModalComponent";

function FailPopup({ message, open, onClose, onClick }) {
    return (
        <ModalComponent open={open} onclose={onClose}>
            <div className='divCenterColumn' style={{ width: 300, height: 300 }}>
                <DrawRejectIcon width={310} color={"red"} />
                <h2 className='text-dark mt-2 mb-0'>Fail</h2>
                <p>{message}</p>
                <button className='btn btn-primary' onClick={onClick}>OK</button>
            </div>
        </ModalComponent>
    )
}

export default FailPopup;
