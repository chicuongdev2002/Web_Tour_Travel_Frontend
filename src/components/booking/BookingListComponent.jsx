import React, { useEffect, useCallback, useState } from "react";
import { getAllBooking, updateBookingStatus } from "../../functions/bookingTour";
import Switch from '@mui/material/Switch';
import CustomPop from '../../components/popupNotifications/CustomPop';
import ChoosePopup from '../../components/popupNotifications/ChoosePopup';
import TableComponent from '../../components/table/TableComponent';
import ModalComponent from "../modal/ModalComponent";
import FormView from "../formView/FormView";
import { FaUser } from "react-icons/fa";
import { MdOutlinePhoneAndroid, MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { formatDate } from '../../functions/format'
import { useNavigate } from 'react-router-dom';
import { BsCashCoin } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { IoReloadCircleSharp } from "react-icons/io5";

function BookingListComponent() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();
    const [notify, setNotify] = useState(-1);
    const [dataGenerate, setDataGenerate] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState({
        size: 10,
        number: 0,
        totalElements: 0,
        totalPages: 0,
    });

    useEffect(() => {
        getBooking();
    }, []);

    const getBooking = useCallback(async (page, size) => {
    
        const result = await getAllBooking(page, size, user && user.role != "ADMIN"? user.userId : 0);
        let t = result.content;
        debugger
        setBookings(result.content)
        setPage(result.page);
    }, []);

    const updateStatus = useCallback(async (bookingId) => {
        const result = await updateBookingStatus(bookingId);
        getBooking();
        return result == "Update thành công";
    }, [])

    const convertData = useCallback((data) => {
        bookings
        debugger
        return data?.map((d) => {
            return {
                "Booking ID": { title: d.booking.bookingId,
                    onClick: () => {
                        generateDataFormView(null, null, null, d.booking)
                        setNotify(-2)
                    }
                },
                "Khách hàng": { title: d.booking.user.fullName,
                    onClick: () => {
                        generateDataFormView({user: d.booking.user, address: d.booking.address})
                        setNotify(-2)
                    }
                },
                "Tour": { title: d.booking.departure.tour.tourName,
                    onClick: () => {
                        generateDataFormView(null, d.booking.departure)
                        setNotify(-2)
                    }
                },
                "Thời gian": new Date(d.booking.departure.startDate).toLocaleDateString() + "-" + new Date(d.booking.departure.endDate).toLocaleDateString(),
                "Vị trí bắt đầu": d.booking.departure.tour.startLocation,
                "Số chỗ(trẻ em, người lớn, người cao tuổi)": d.booking.participants,
                "Ngày đặt": new Date(d.booking.bookingDate).toLocaleString(),
                "Giá": d.price,
                "Thanh toán": d.paymentDate? { title: <BsCashCoin title="Đã thanh toán" size={30} color="green"/>,
                    onClick: () => {
                        generateDataFormView(null, null, { date: formatDate(d.paymentDate), method: d.paymentMethod})
                        setNotify(-2)
                    }
                } : <BsCashCoin title="Chưa thanh toán" size={30} color="red"/>,
                "Trạng thái": {
                    title: <button className="bg-transparent text-dark py-0 px-1">{d.booking.active? <AiFillCheckCircle title="Hoạt động" size={30} color="green"/> : <IoReloadCircleSharp title="Chờ huỷ" size={30} color="blue"/>}</button>,
                    onClick: () => {
                            setSelectedStatus({ id: d.booking.bookingId, active: d.booking.active });
                            setNotify(2);
                    }
                }
            }
        })
    })

    const handleBookingDetails = {
        onClick: (id) => console.log(id)
    }

    const generateDataFormView = (dataUser, dataTour, dataPayment, dataBooking) => {
        debugger
        let data = []
        if (dataUser)
            data = [
                { label: { icon : <FaUser /> }, value: dataUser.user.fullName },
                { label: { icon : <MdOutlinePhoneAndroid size={25} /> }, value: dataUser.user.phoneNumber },
                { label: { icon : <MdEmail size={25} /> }, value: dataUser.user.email },
                { label: { icon : <FaLocationDot size={25} /> }, value: dataUser.address}
            ]
        else if(dataTour)
            data = [
                { label: "Mã lịch trình: ", value: dataTour.departureId },
                { label: "Mã tour: ", value: dataTour.tour.tourId },
                { label: "Tour: ", value: dataTour.tour.tourName },
                { label: "Loại tour: ", value: dataTour.tour.tourType },
                { label: "Khởi hành: ", value: dataTour.tour.startLocation + " - " + formatDate(dataTour.startDate) },
                { label: 'Xem chi tiết', object: {
                    type: 'button',
                    className: 'w-100 my-3',
                    onClick: () => navigate(`/tour-details/${dataTour.tour.tourId}`)
                }}
            ]
        else if(dataPayment)
            data = [
                { label: "Ngày thanh toán: ", value: dataPayment.date },
                { label: "Phương thức thanh toán: ", value: dataPayment.method }
            ]
        else if(dataBooking)
            data = [
                { label: "Mã booking: ", value: dataBooking.bookingId },
                { label: "Mã lịch trình: ", value: dataBooking.departure.departureId },
                { label: "Khách hàng: ", value: dataBooking.user.fullName },
                { label: "Tour: ", value: dataBooking.departure.tour.tourName },
                { label: "Thời gian: ", value: new Date(dataBooking.departure.startDate).toLocaleDateString() + "-" + new Date(dataBooking.departure.endDate).toLocaleDateString() },
                { label: "Vị trí bắt đầu: ", value: dataBooking.departure.tour.startLocation },
                { label: "Số chỗ: ", value: `Trẻ em(${dataBooking.participants.split(",")[0]}), người lớn(${dataBooking.participants.split(",")[1]}), người cao tuổi(${dataBooking.participants.split(",")[2]})` },
                { label: "Ngày đặt: ", value: new Date(dataBooking.bookingDate).toLocaleString() },
                { label: "Thanh toán: ", value: dataBooking.paymentDate? "Đã thanh toán" : "Chưa thanh toán" },
                { label: "Trạng thái: ", value: dataBooking.active? "Hoạt động" : "Chờ huỷ" }
            ]
        setDataGenerate(data)
    }

    return (
        <div>
            <TableComponent headers={["Booking ID", "Khách hàng", "Tour", "Thời gian", "Vị trí bắt đầu", { title: "Số chỗ", tooltip: "Trẻ em, người lớn, người cao tuổi" }, "Ngày đặt", "Giá", "Thanh toán", "Trạng thái"]}
                data={convertData(bookings)} page={page} getData={getBooking} 
                onClickTr={handleBookingDetails}    
            />
            <CustomPop notify={notify} onSuccess={() => setNotify(-1)} messageSuccess={selectedStatus.active? "Yêu cầu huỷ đang chờ duyệt" : "Đã rút yêu cầu huỷ booking"} onFail={() => setNotify(-1)} />
            <ChoosePopup open={notify == 2} onAccept={() => {
                setNotify(-1);
                updateStatus(selectedStatus.id).then(result => {
                    if(result)
                        setNotify(1);
                    else
                        setNotify(0);
                });
            }} message={"Bạn có chắc chắn muốn cập nhật?"} onReject={() => setNotify(-1)}
                onclose={() => setNotify(-1)} title={selectedStatus.active? "Bạn có chắc chắn muốn huỷ booking?" : "Bạn muốn rút yêu cầu huỷ booking?"}
            />
            <ModalComponent open={notify == -2} onclose={()=>setNotify(-1)} >
                <FormView title="Thông tin" notIcon={true} data={dataGenerate}/>
            </ModalComponent>
        </div>
    );
}

export default BookingListComponent;