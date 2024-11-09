import React, { useRef, useState } from 'react'
import '../style/style.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from '../functions/format'
import bookingTour from '../functions/bookingTour'
import NavHeader from '../components/navbar/NavHeader';
import CustomPop from '../components/popupNotifications/CustomPop';
import FormView from '../components/formView/FormView';

function Booking() {
    const navigate = useNavigate();
    const location = useLocation();
    const [notify, setNotify] = useState(-1)
    const [messageNotify, setMessageNotify] = useState('')
    const [numOfChildren, setNumOfChildren] = useState(0)
    const [numOfAdults, setNumOfAdults] = useState(1)
    const [numOfOlds, setNumOfOlds] = useState(0)
    let tourDetail = useRef(location.state).current;
    let user = useRef(sessionStorage.getItem("user") ?
        JSON.parse(sessionStorage.getItem("user")) :
        {
            userId: 1,
            fullName: "Nguyễn Thanh Sơn",
            phoneNumber: "0923465232",
            email: "son1105@gmail.com",
            address: "TP.HCM"
        }).current;
    const bookingSuccess = () => {
        setNotify(-1)
        navigate('/booking-list')
    }
    return (
        <div>
            <NavHeader textColor="black" />
            <div className='divRowBetween align-items-start p-5'>
                <div className='w-60'>
                    <FormView title='Dịch vụ tour' data={[
                        { label: 'Mã tour', value: tourDetail.tourId },
                        { label: 'Tour yêu cầu', value: tourDetail.tourName },
                        { label: 'Số ngày', value: tourDetail.duration }
                    ]} />
                    <FormView title='Chi tiết tour'>
                        <div className='divRowBetween'>
                            <div>
                                <p>Mã lịch trình: {tourDetail.departures[0].departureId}</p>
                                <p>Ngày khởi hành: {formatDate(tourDetail.departures[0].startDate)}</p>
                                <p>Ngày kết thúc: {formatDate(tourDetail.departures[0].endDate)}</p>
                                <p>Lịch trình: </p>
                            </div>
                            <FormView className="w-30" title='Số người tham gia' data={[
                                { label: 'Trẻ em', object: {
                                    type: 'number',
                                    min: 0,
                                    value: numOfChildren,
                                    onChange: (e) => setNumOfChildren(e.target.value)
                                }},
                                { label: 'Người lớn', object: {
                                    type: 'number',
                                    className: 'my-2',
                                    min: 1,
value: numOfAdults,
                                    onChange: (e) => setNumOfAdults(e.target.value)
                                }},
                                { label: 'Người cao tuổi', object: {
                                    type: 'number',
                                    min: 0,
                                    value: numOfOlds,
                                    onChange: (e) => setNumOfOlds(e.target.value)
                                }}
                            ]} />
                        </div>
                    </FormView>
                    <FormView title='Lưu ý' data={[
                        { label: 'Điều kiện hủy tour', value: 'Không hủy' },
                        { label: 'Điều kiện hoàn tiền', value: 'Không hoàn tiền' },
                        { label: 'Điều kiện thay đổi', value: 'Không thay đổi' }
                    ]} />
                </div>
                <div className='w-40'>
                    <FormView title='Thông tin liên lạc' titleBackground="yellow" data={[
                        { label: 'Họ và tên', value: user.fullName },
                        { label: 'Điện thoại', value: user.phoneNumber },
                        { label: 'Email', value: user.email },
                        { label: 'Địa chỉ', value: user.address },
                        { label: 'Ghi chú', object: {
                            type: 'text',
                            value: '',
                            onChange: (e) => console.log(e.target.value)
                        }},
                        { label: 'Xác nhận', object: {
                            type: 'button',
                            className: 'w-100 my-3',
                            onClick: async () => {
                                try{
                                    await bookingTour({ 
                                        userId: user.userId, 
                                        departureId: tourDetail.departures[0].departureId, 
                                        participants: numOfChildren + ',' + numOfAdults + ',' + numOfOlds 
                                    })
                                    setNotify(1)
                                } catch(err){
                                    setNotify(0)
                                    setMessageNotify(err.response.data)
                                }
                            }
                        }}
                    ]} />
                </div>
                <CustomPop notify={notify} onSuccess={bookingSuccess} messageSuccess={"Đặt tour thành công"} 
                    onFail={() => setNotify(-1)} messageFail={messageNotify} />
            </div>
        </div>
    )
}

export default Booking