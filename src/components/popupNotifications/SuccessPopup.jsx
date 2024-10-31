import React from 'react'
import DrawTickIcon from '../draw/DrawTickIcon'
import ModalComponent from '../modal/ModalComponent'

function SuccessPopup({ message, open, onClose, onClick }) {
    return (
        <ModalComponent open={open} onclose={onClose}>
            <div className='divCenterColumn' style={{ width: 300, height: 300 }}>
                <DrawTickIcon width={310} color={"green"} />
                <h2 className='text-dark mt-3'>Success</h2>
                <p>{message}</p>
                <button className='btn btn-primary' onClick={onClick}>OK</button>
            </div>
        </ModalComponent>
    )
}

export default SuccessPopup