import React, { useEffect, useCallback, useState } from 'react'
import TableComponent from '../table/TableComponent'
import { getTourPage } from '../../functions/getTour'
import { updateStatusTour } from '../../functions/updateStatusTour'
import Switch from '@mui/material/Switch';
import CustomPop from '../../components/popupNotifications/CustomPop';
import ChoosePopup from '../../components/popupNotifications/ChoosePopup';

function TourList() {
  const [notify, setNotify] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [tourList, setTourList] = React.useState([])
  const [page, setPage] = React.useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  })
  useEffect(() => {
    getTourList()
  }, [])

  const getTourList = useCallback(async (page, size) => {
    const data = await getTourPage(page, size)
    setTourList(data.content)
    setPage(data.page)
  })

  const convertData = (data) => {
    return data.map((d) => {
      return {
        "Tour ID": d.tourId,
        "Tour": d.tourName,
        "Mô tả": d.tourDescription,
        "Thời gian(giờ)": d.duration,
        "Điểm khởi hành": d.startLocation,
        "Loại tour": d.tourType,
        "Trạng thái": <Switch checked={d.active} onChange={
          () => {
            setSelectedStatus(d.tourId);
            setNotify(2);
          }
        } />
      }
    })
  }

  const updateStatus = useCallback(async (tourID, status) => {
    const result = await updateStatusTour(tourID, !status);
    setTourList(tourList.map(tour => {
      if (tour.tourId == tourID) {
        tour.active = !status;
      }
      return tour;
    }))
    return result == "Update thành công";
  }, [])

  return (
    <div>
      <TableComponent headers={["Tour ID", "Tour", "Mô tả", "Thời gian(giờ)", "Điểm khởi hành", "Loại tour", "Trạng thái"]}
        data={convertData(tourList)} page={page} getData={getTourList} />
      <CustomPop notify={notify} onSuccess={() => setNotify(-1)} messageSuccess={"Cập nhật thành công"} onFail={() => setNotify(-1)} />
      {
        notify == 2 && <ChoosePopup open={notify == 2} onAccept={() => {
          setNotify(-1);
          if (updateStatus(selectedStatus, tourList.find(tour => tour.tourId == selectedStatus).active))
            setNotify(1);
          else
            setNotify(0);
        }} message={"Bạn có chắc chắn muốn cập nhật?"} onReject={() => setNotify(-1)}
          onclose={() => setNotify(-1)} title={"Cập nhật trạng thái tour"}
        />
      }
    </div>
  )
}

export default TourList