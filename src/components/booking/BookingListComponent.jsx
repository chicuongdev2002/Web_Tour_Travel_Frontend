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

function BookingListComponent() {
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
        const result = await getAllBooking(page, size);
        setBookings(result.content)
        setPage(result.page);
    }, []);

    const updateStatus = useCallback(async (bookingId) => {
        const result = await updateBookingStatus(bookingId);
        debugger
        setBookings(bookings => bookings.map(booking => {
            if (booking.booking.bookingId == bookingId) {
                booking.booking.active = !booking.booking.active;
            }
            return booking;
        }));
        return result == "Update thành công";
    }, [])

    const convertData = useCallback((data) => {
        return data.map((d) => {
            return {
                "Booking ID": d.booking.bookingId,
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
                "Thanh toán": d.paymentDate? { title:"Đã thanh toán",
                    onClick: () => {
                        generateDataFormView(null, null, { date: formatDate(d.paymentDate), method: d.paymentMethod})
                        setNotify(-2)
                    }
                } : "Chưa thanh toán",
                "Trạng thái": {
                    title: <Switch checked={d.booking.active} />,
                    onClick: () => {
                            setSelectedStatus(d.booking.bookingId);
                            setNotify(2);
                    }
                }
            }
        })
    })

    const handleBookingDetails = {
        onClick: (id) => console.log(id)
    }

    const generateDataFormView = (dataUser, dataTour, dataPayment) => {
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
        else
            data = [
                { label: "Ngày thanh toán: ", value: dataPayment.date },
                { label: "Phương thức thanh toán: ", value: dataPayment.method }
            ]
        setDataGenerate(data)
    }

    return (
        <div>
            <TableComponent headers={["Booking ID", "Khách hàng", "Tour", "Thời gian", "Vị trí bắt đầu", { title: "Số chỗ", tooltip: "Trẻ em, người lớn, người cao tuổi" }, "Ngày đặt", "Giá", "Thanh toán", "Trạng thái"]}
                data={convertData(bookings)} page={page} getData={getBooking} 
                onClickTr={handleBookingDetails}    
            />
            <CustomPop notify={notify} onSuccess={() => setNotify(-1)} messageSuccess={"Cập nhật thành công"} onFail={() => setNotify(-1)} />
            <ChoosePopup open={notify == 2} onAccept={() => {
                setNotify(-1);
                if (updateStatus(selectedStatus))
                    setNotify(1);
                else
                    setNotify(0);
            }} message={"Bạn có chắc chắn muốn cập nhật?"} onReject={() => setNotify(-1)}
                onclose={() => setNotify(-1)} title={"Cập nhật trạng thái booking"}
            />
            <ModalComponent open={notify == -2} onclose={()=>setNotify(-1)} >
                <FormView title="Thông tin" notIcon={true} data={dataGenerate}/>
            </ModalComponent>
        </div>
    );
}

export default BookingListComponent;