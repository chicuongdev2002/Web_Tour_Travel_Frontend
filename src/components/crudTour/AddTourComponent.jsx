import React, { useState } from "react";
import InputText from "../../components/inputText/InputText";
import Button from "@mui/material/Button";
import { getAllDestination } from "../../functions/getDestination";
import { POST_TOUR, UPLOAD_IMAGE } from "../../config/host";
import { postData, uploadFile } from "../../functions/postData";
import DestinationList from "../crudDestination/DestinationList";
import ModalComponent from "../modal/ModalComponent";
import moment from "moment";
import CustomPop from "../popupNotifications/CustomPop";
import { useNavigate } from "react-router-dom";
import FormView from "../../components/formView/FormView";

function AddTourComponent() {
  const navigate = useNavigate();
  const [tourName, setTourName] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [type, setType] = useState("");
  const [openNotify, setOpenNotify] = useState(-1);
  const [messageNotify, setMessageNotify] = useState("");

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
  );
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [duration, setDuration] = useState(0);
  const [childrenPrice, setChildrenPrice] = useState(0);
  const [adultPrice, setAdultPrice] = useState(1);
  const [oldPrice, setOldPrice] = useState(0);

  const [open, setOpen] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);
  const [openDeparture, setOpenDeparture] = useState(false);
  const [destination, setDestination] = useState(null);
  const [destinationSelected, setDestinationSelected] = useState({
    content: [],
  });

  const getDestination = async (page, size) => {
    const result = await getAllDestination(page, size);
    setDestination(result);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddTour = async () => {
    try {
      let resultUpload = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        resultUpload = await uploadFile(UPLOAD_IMAGE, formData);
        if (!resultUpload) {
          setMessageNotify(
            "Đã xảy ra lỗi khi upload ảnh! Vui lòng thử lại sau",
          );
          setOpenNotify(0);
          return;
        }
      }
      let result = await postData(POST_TOUR, {
        tour: {
          tourName,
          tourDescription: description,
          startLocation,
          tourType: type,
          duration,
        },
        departures: [
          {
            startDate: moment(startDate, "DD/MM/YYYY HH:mm:ss")
              .add(7, "hours")
              .toDate()
              .toISOString(),
            endDate: moment(endDate, "DD/MM/YYYY HH:mm:ss")
              .add(7, "hours")
              .toDate()
              .toISOString(),
            maxParticipants,
          },
        ],
        tourPricing: [
          { price: childrenPrice, participantType: "CHILDREN" },
          { price: adultPrice, participantType: "ADULTS" },
          { price: oldPrice, participantType: "ELDERLY" },
        ],
        tourDestinations: [
          ...destinationSelected.content.map((d) => ({
            destination: { destinationId: d.destinationId },
            duration: d.duration,
          })),
        ],
        images: [
          {
            imageUrl: resultUpload,
          },
        ],
      });
      debugger;
      if (result) {
        setMessageNotify("Thêm tour thành công");
        setOpenNotify(1);
      } else {
        setMessageNotify("Đã xảy ra lỗi! Vui lòng thử lại sau");
        setOpenNotify(0);
      }
    } catch (error) {
      setMessageNotify("Đã xảy ra lỗi! Vui lòng thử lại sau");
      setOpenNotify(0);
    }
  };

  return (
    <div
      className={`w-100 ${openDestination && openDeparture ? "divRowBetweenNotAlign" : "divCenter"}`}
    >
      <FormView
        title="Thêm tour"
        className="w-30"
        data={[
          {
            label: "Tên tour",
            object: {
              type: "text",
              value: tourName,
              notForm: true,
              onChange: (e) => setTourName(e.target.value),
            },
          },
          {
            label: "Mô tả",
            object: {
              type: "text",
              value: description,
              onChange: (e) => setDescription(e.target.value),
            },
          },
          {
            label: "Địa điểm khởi hành",
            object: {
              type: "text",
              value: startLocation,
              onChange: (e) => setStartLocation(e.target.value),
            },
          },
          {
            label: "Loại tour",
            object: {
              type: "select",
              value: type,
              onChange: (e) => setType(e),
              listData: [{ FAMILY: "FAMILY" }, { GROUP: "GROUP" }],
            },
          },
          {
            label: "Ảnh",
            object: { type: "file", onChange: handleFileChange },
          },
          {
            label: "Thêm địa điểm",
            object: {
              type: "button",
              className: "w-100 my-3",
              onClick: () => {
                getDestination();
                setOpenDestination(true);
              },
            },
          },
        ]}
      />
      {openDestination && (
        <FormView title="Chọn địa điểm" className="w-30">
          <div>
            <DestinationList
              data={destinationSelected}
              isDescription={false}
              onGetData={getDestination}
              changeDuration={(e, destination) => {
                let preValue = destinationSelected.content.filter(
                  (d) => d.destinationId === destination.destinationId,
                )[0].duration;
                if (preValue > e.target.value) {
                  setEndDate(
                    moment(endDate, "DD/MM/YYYY HH:mm:ss")
                      .add(-1, "hours")
                      .format("DD/MM/YYYY HH:mm:ss"),
                  );
                  setDuration((prevState) => prevState - 1);
                } else {
                  setEndDate(
                    moment(endDate, "DD/MM/YYYY HH:mm:ss")
                      .add(1, "hours")
                      .format("DD/MM/YYYY HH:mm:ss"),
                  );
                  setDuration((prevState) => prevState + 1);
                }
                setDestinationSelected((prevState) => ({
                  ...prevState,
                  content: prevState.content.map((item) =>
                    item.destinationId === destination.destinationId
                      ? { ...item, duration: e.target.value }
                      : item,
                  ),
                }));
              }}
            />
            <div className="divRowBetween">
              <Button
                className="btn btn-primary w-50 mb-3 mr-1 mt-3"
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Thêm địa điểm
              </Button>
              <Button
                className="btn btn-primary w-50 mb-3 ml-1 mt-3"
                variant="contained"
                onClick={() => setOpenDeparture(true)}
              >
                Thêm lịch trình
              </Button>
            </div>
          </div>
        </FormView>
      )}
      {openDeparture && (
        <FormView title="Thêm lịch trình" className="w-30">
          <div style={{ marginTop: -20 }}>
            <InputText
              label="Ngày khởi hành"
              type="dateTime"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setEndDate(
                  moment(e.target.value, "DD/MM/YYYY HH:mm:ss")
                    .add(duration, "hours")
                    .format("DD/MM/YYYY HH:mm:ss"),
                );
              }}
            />
            <InputText
              label="Ngày kết thúc"
              disable={true}
              type="dateTime"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <InputText
              label="Số người tham gia"
              type="number"
              value={maxParticipants}
              min={1}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
            <InputText
              label="Thời gian(giờ)"
              disable={true}
              type="number"
              value={duration}
            />
            <div className="divRowBetween">
              <div className="w-30">
                <InputText
                  label="Giá vé trẻ em"
                  type="number"
                  value={childrenPrice}
                  min={0}
                  onChange={(e) => setChildrenPrice(e.target.value)}
                />
              </div>
              <div className="w-30">
                <InputText
                  label="Giá vé người lớn"
                  type="number"
                  value={adultPrice}
                  min={1}
                  onChange={(e) => setAdultPrice(e.target.value)}
                />
              </div>
              <div className="w-30">
                <InputText
                  label="Giá vé người già"
                  type="number"
                  value={oldPrice}
                  min={0}
                  onChange={(e) => setOldPrice(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="btn btn-primary w-100 mb-3 mt-3"
              variant="contained"
              onClick={handleAddTour}
            >
              Thêm
            </Button>
          </div>
        </FormView>
      )}
      {open && (
        <ModalComponent
          open={open}
          onclose={() => setOpen(false)}
          title="Danh sách địa điểm"
        >
          <DestinationList
            selectDestination={(e, destination) => {
              if (e.target.checked) {
                setEndDate(
                  moment(endDate, "DD/MM/YYYY HH:mm:ss")
                    .add(1, "hours")
                    .format("DD/MM/YYYY HH:mm:ss"),
                );
                setDuration((prevState) => prevState + 1);
                setDestinationSelected((prevState) => ({
                  ...prevState,
                  content: [
                    ...prevState.content,
                    { ...destination, duration: 1 },
                  ],
                }));
              } else {
                let filter = destinationSelected.content.filter(
                  (d) => d.destinationId === destination.destinationId,
                )[0].duration;
                setEndDate(
                  moment(endDate, "DD/MM/YYYY HH:mm:ss")
                    .add(-filter, "hours")
                    .format("DD/MM/YYYY HH:mm:ss"),
                );
                setDuration((prevState) => prevState - filter);
                setDestinationSelected((prevState) => ({
                  ...prevState,
                  content: prevState.content.filter(
                    (d) => d.destinationId !== destination.destinationId,
                  ),
                }));
              }
            }}
            destinationSelected={destinationSelected}
            data={destination}
            isDescription={true}
            onGetData={getDestination}
          />
        </ModalComponent>
      )}
      <CustomPop
        notify={openNotify}
        onSuccess={() => {
          navigate("/tour-list");
          setOpenNotify(-1);
        }}
        messageSuccess={"Thêm tour thành công"}
        onFail={() => setOpenNotify(-1)}
        messageFail={messageNotify}
      />
    </div>
  );
}

export default AddTourComponent;
