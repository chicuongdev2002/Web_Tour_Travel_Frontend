import React, { useEffect, useCallback, useState } from "react";
import TableComponent from "../table/TableComponent";
import { getTourPage } from "../../functions/getTour";
import { updateStatusTour } from "../../functions/updateStatusTour";
import Switch from "@mui/material/Switch";
import CustomPop from "../../components/popupNotifications/CustomPop";
import ChoosePopup from "../../components/popupNotifications/ChoosePopup";
import { useNavigate, useLocation } from "react-router-dom";

function TourList() {
  const navigate = useNavigate();
  const [notify, setNotify] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [tourList, setTourList] = React.useState([]);
  const [page, setPage] = React.useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });
  useEffect(() => {
    getTourList();
  }, []);

  const getTourList = useCallback(async (page, size) => {
    const data = await getTourPage(page, size);
    setTourList(data.content);
    setPage(data.page);
  });

  const convertData = (data) => {
    return data.map((d) => {
      return {
        "Tour ID": d.tourId,
        Tour: d.tourName,
        "Mô tả": d.tourDescription,
        "Thời gian(giờ)": d.duration,
        "Điểm khởi hành": d.startLocation,
        "Loại tour": d.tourType,
        "Trạng thái": {
          title: <Switch checked={d.active} />,
          onClick: () => {
            setSelectedStatus(d.tourId);
            setNotify(2);
          },
        },
      };
    });
  };

  const updateStatus = useCallback(async (tourID, status) => {
    const result = await updateStatusTour(tourID, !status);
    setTourList((tourList) =>
      tourList.map((tour) => {
        if (tour.tourId == tourID) {
          tour.active = !status;
        }
        return tour;
      }),
    );
    return result;
  }, []);

  const handleAddTour = () => {
    navigate("/add-tour");
  };

  const handleViewTour = () => {
    navigate("/tour-list");
  };

  const handleViewTourDetails = {
    onClick: (id) => navigate("/tour-details/" + id),
  };

  return (
    <div>
      <div className="w-100 d-flex justify-content-end my-2">
        <button onClick={handleAddTour}>Thêm tour</button>
        <button onClick={handleViewTour}>Xem với vai trò khách hàng</button>
      </div>
      <TableComponent
        headers={[
          "Tour ID",
          "Tour",
          "Mô tả",
          "Thời gian(giờ)",
          "Điểm khởi hành",
          "Loại tour",
          "Trạng thái",
        ]}
        data={convertData(tourList)}
        page={page}
        getData={getTourList}
        onClickTr={handleViewTourDetails}
      />
      <CustomPop
        notify={notify}
        onSuccess={() => setNotify(-1)}
        messageSuccess={"Cập nhật thành công"}
        onFail={() => setNotify(-1)}
      />
      {notify == 2 && (
        <ChoosePopup
          open={notify == 2}
          onAccept={() => {
            setNotify(-1);
            let kt = tourList.find(
              (tour) => tour.tourId == selectedStatus,
            ).active;
            if (updateStatus(selectedStatus, kt)) setNotify(1);
            else setNotify(0);
          }}
          message={"Bạn có chắc chắn muốn cập nhật?"}
          onReject={() => setNotify(-1)}
          onclose={() => setNotify(-1)}
          title={"Cập nhật trạng thái tour"}
        />
      )}
    </div>
  );
}

export default TourList;
