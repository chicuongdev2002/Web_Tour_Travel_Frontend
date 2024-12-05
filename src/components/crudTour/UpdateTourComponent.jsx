import React, { useState, useEffect, useRef } from "react";
import FormView from "../formView/FormView";
import DestinationList from "../crudDestination/DestinationList";
import Button from "@mui/material/Button";
import { getAllDestination } from "../../functions/getDestination";
import ModalComponent from "../modal/ModalComponent";
import moment from "moment";
import InputText from "../../components/inputText/InputText";
import TableComponent from "../table/TableComponent";
import { UPDATE_TOUR, UPLOAD_IMAGE } from "../../config/host";
import { putData } from "../../functions/putData";
import { uploadFile } from "../../functions/postData";
import CustomPop from "../popupNotifications/CustomPop";
import { useNavigate } from "react-router-dom";
import ChoosePopup from "../popupNotifications/ChoosePopup";
import { getListTourType } from "../../functions/getListTourType";
import LocationSelectCustom from "../../components/location/LocationSelectCustom";
import { getProvince, getDistrict } from "../../functions/getProvince";

function UpdateTourComponent({ data }) {
  console.log(data);
  const navigate = useNavigate();
  let count = useRef(0).current;
  const [dataConvert, setDataConvert] = useState([]);
  const [tourName, setTourName] = useState(data.tourName);
  const [tourType, setTourType] = useState([]);
  const [description, setDescription] = useState(data.tourDescription);
  const [type, setType] = useState(data.tourType);
  const [file, setFile] = useState(null);
  const [messageNotify, setMessageNotify] = useState("");
  const [images, setImages] = useState(data.images);

  const [openDestination, setOpenDestination] = useState(false);
  const [destination, setDestination] = useState(null);
  const [destinationSelected, setDestinationSelected] = useState({
    content: data.destinations,
  });
  const [duration, setDuration] = useState(data.duration);

  const [openDeparture, setOpenDeparture] = useState(false);
  const [departureId, setDepartureId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [childrenPrice, setChildrenPrice] = useState(0);
  const [adultPrice, setAdultPrice] = useState(1);
  const [oldPrice, setOldPrice] = useState(0);

  const [open, setOpen] = useState(false);
  const [updateDeparture, setUpdateDeparture] = useState(false);
  const [notification, setNotification] = useState(-1);

  const [openAddDeparture, setOpenAddDeparture] = useState(false);
  const [departureSelected, setDepartureSelected] = useState(null);
  const [province, setProvince] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [district, setDistrict] = useState(null);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    getTourType();
    getDataProvince().then((d) => {
      if (data.startLocation.split(",").length === 1) {
        for (let i = 0; i < d.length; i++) {
          if (Object.values(d[i])[0] === data.startLocation) {
            setProvince(Object.keys(d[i])[0]);
            getDitricts(Object.keys(d[i])[0]).then(() => setDistrict(null));
            break;
          }
        }
      } else {
        for (let i = 0; i < d.length; i++) {
          if (Object.values(d[i])[0] === data.startLocation.split(", ")[0]) {
            setProvince(Object.keys(d[i])[0]);
            getDitricts(Object.keys(d[i])[0]).then(() =>
              setDistrict(data.startLocation.split(", ")[1]),
            );
            break;
          }
        }
      }
    });
  }, []);

  const getTourType = async () => {
    let result = await getListTourType();
    let data = [];
    for (const key in result) data.push({ [key]: result[key] });
    setTourType(data);
  };

  const getDestination = async (page, size) => {
    const result = await getAllDestination(page, size);
    setDestination(result);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    setDataConvert(addButton(convertData(data.departures)));
  }, [data]);

  const convertData = (data) => {
    return data.map((d) => {
      return {
        id: d.departureId,
        startDate: moment(d.startDate).format("HH:mm:ss DD/MM/YYYY"),
        endDate: moment(d.endDate).format("HH:mm:ss DD/MM/YYYY"),
        maxParticipants: d.maxParticipants,
        childPrice: d.tourPricing.filter(
          (t) => t.participantType === "CHILDREN",
        )[0]?.price,
        adultsPrice: d.tourPricing.filter(
          (t) => t.participantType === "ADULTS",
        )[0]?.price,
        elderlyPrice: d.tourPricing.filter(
          (t) => t.participantType === "ELDERLY",
        )[0]?.price,
      };
    });
  };

  const addButton = (departure) => {
    let d = departure.map((d) => {
      return {
        ...d,
        update: (
          <Button
            className="btn btn-primary bg-success"
            variant="contained"
            onClick={() => handleFillUpdateTourModal(d)}
          >
            Cập nhật
          </Button>
        ),
        delete: (
          <Button
            className="btn btn-danger bg-danger"
            variant="contained"
            onClick={() => {
              setNotification(-2);
              setDepartureSelected(d);
            }}
          >
            Xóa
          </Button>
        ),
      };
    });
    return d;
  };

  const handleDeleteTour = () => {
    setDataConvert(dataConvert.filter((d) => d.id !== departureSelected.id));
  };
  const handleAddDeparture = () => {
    const newDeparture = {
      id: count--,
      startDate: startDate,
      endDate: endDate,
      maxParticipants: maxParticipants,
      childPrice: childrenPrice,
      adultsPrice: adultPrice,
      elderlyPrice: oldPrice,
    };
    setDataConvert(addButton([...dataConvert, newDeparture]));
    setOpenAddDeparture(false);
  };

  const handleUpdateTour = async () => {
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
          setNotification(0);
          return;
        }
      }
      let dataRequest = {
        tour: {
          tourId: data.tourId,
          tourName: tourName,
          tourDescription: description,
          startLocation: district
            ? getProvinceName(province) + ", " + district
            : getProvinceName(province),
          tourType: type,
          duration: duration,
        },
        departures: dataConvert.map((d) => {
          return {
            departureId: d.id,
            startDate: moment(d.startDate, "HH:mm:ss DD/MM/YYYY").format(
              "YYYY-MM-DDTHH:mm:ss",
            ),
            endDate: moment(d.endDate, "HH:mm:ss DD/MM/YYYY").format(
              "YYYY-MM-DDTHH:mm:ss",
            ),
            maxParticipants: d.maxParticipants,
          };
        }),
        tourPricing: dataConvert
          .map((d) => {
            return {
              departure: {
                departureId: d.id,
              },
              price: d.childPrice,
              participantType: "CHILDREN",
            };
          })
          .concat(
            dataConvert.map((d) => {
              return {
                departure: {
                  departureId: d.id,
                },
                price: d.adultsPrice,
                participantType: "ADULTS",
              };
            }),
          )
          .concat(
            dataConvert.map((d) => {
              return {
                departure: {
                  departureId: d.id,
                },
                price: d.elderlyPrice,
                participantType: "ELDERLY",
              };
            }),
          ),
        tourDestinations: [
          ...destinationSelected.content.map((d) => ({
            destination: { destinationId: d.destinationId },
            duration: d.duration,
          })),
        ],
        images: [
          ...images,
          {
            imageUrl: resultUpload,
          },
        ],
      };
      if (putData(UPDATE_TOUR, dataRequest)) setNotification(1);
      else setNotification(0);
    } catch (error) {
      setNotification(0);
      setMessageNotify("Đã xảy ra lỗi! Vui lòng thử lại sau");
    }
  };

  const getDataProvince = async () => {
    const result = await getProvince();
    let data = [];
    result.forEach((element) => {
      data.push({ [element.id]: element.name });
    });
    setProvinces(data);
    return data;
  };

  const getProvinceName = (provinceId) => {
    let result = provinces.filter((p) => Object.keys(p)[0] == provinceId);
    return result[0][provinceId];
  };

  const getDitricts = async (provinceId) => {
    const result = await getDistrict(provinceId);
    let data = [];
    result.forEach((element) => {
      data.push({ [element.name]: element.name });
    });
    setDistricts(data);
  };

  const onChangeProvince = (e) => {
    setProvince(e);
    setDistrict(null);
    getDitricts(e);
  };

  const onChangeDitricts = (e) => setDistrict(e);

  const handleFillUpdateTourModal = (departure) => {
    setDepartureId(departure.id);
    setStartDate(
      moment(departure.startDate, "HH:mm:ss DD/MM/YYYY").format(
        "HH:mm:ss DD/MM/YYYY",
      ),
    );
    setEndDate(
      moment(departure.endDate, "HH:mm:ss DD/MM/YYYY").format(
        "HH:mm:ss DD/MM/YYYY",
      ),
    );
    setMaxParticipants(departure.maxParticipants);
    setChildrenPrice(departure.childPrice);
    setAdultPrice(departure.adultsPrice);
    setOldPrice(departure.elderlyPrice);
    setUpdateDeparture(true);
  };

  const handleFillAddTourModal = () => {
    setDepartureId("");
    setStartDate("");
    setEndDate("");
    setMaxParticipants(0);
    setChildrenPrice(0);
    setAdultPrice(0);
    setOldPrice(0);
    setOpenAddDeparture(true);
  };

  const handleChangeHourEndDate = (hour) => {
    let newDeparture = dataConvert.map((d) => {
      let endDate = moment(d.endDate, "HH:mm:ss DD/MM/YYYY")
        .add(hour, "hours")
        .format("HH:mm:ss DD/MM/YYYY");
      return {
        ...d,
        endDate: endDate,
      };
    });
    setDataConvert(newDeparture);
  };

  const handleUpdateDeparture = () => {
    setDataConvert(
      addButton(
        dataConvert.map((d) => {
          if (d.id === departureId) {
            d.startDate = startDate;
            d.endDate = endDate;
            d.maxParticipants = maxParticipants;
            d.childPrice = childrenPrice;
            d.adultsPrice = adultPrice;
            d.elderlyPrice = oldPrice;
          }
          return d;
        }),
      ),
    );
    setUpdateDeparture(false);
  };

  const removeImage = (index) => {
    setImages(images.filter((img, i) => i !== index));
  };

  return (
    <div>
      <div
        className={`w-100 ${openDestination ? "divRowBetweenNotAlign" : "divCenter"}`}
      >
        <FormView
          title={`Cập nhật tour`}
          className="w-50"
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
              object: {
                type: "div",
                value: (
                  <LocationSelectCustom
                    label="Địa điểm khởi hành"
                    province={province}
                    provinces={provinces}
                    district={district}
                    districts={districts}
                    onChangeProvince={onChangeProvince}
                    onChangeDitricts={onChangeDitricts}
                  />
                ),
              },
            },
            {
              label: "Loại tour",
              object: {
                type: "select",
                value: type,
                onChange: (e) => setType(e),
                listData: tourType,
              },
            },
            {
              label: "Ảnh",
              object: {
                type: "image",
                value: images,
                style: {
                  width: 100,
                  height: 70,
                  marginLeft: 10,
                },
                onRemove: removeImage,
              },
            },
            {
              label: "Ảnh",
              object: { type: "file", onChange: handleFileChange },
            },
            {
              label: "Sửa địa điểm",
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
          <FormView title="Chọn địa điểm" className="w-50">
            <div>
              <DestinationList
                duration={duration}
                data={destinationSelected}
                isDescription={false}
                onGetData={getDestination}
                changeDuration={(e, destination) => {
                  let preValue = destinationSelected.content.filter(
                    (d) => d.destinationId === destination.destinationId,
                  )[0].duration;
                  if (preValue > e.target.value) {
                    handleChangeHourEndDate(-1);
                    // setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(-1, 'hours').format('DD/MM/YYYY HH:mm:ss'))
                    setDuration((prevState) => prevState - 1);
                  } else {
                    handleChangeHourEndDate(1);
                    // setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(1, 'hours').format('DD/MM/YYYY HH:mm:ss'))
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
                  Xem lịch trình
                </Button>
              </div>
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
                  handleChangeHourEndDate(1);
                  // setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(1, 'hours').format('DD/MM/YYYY HH:mm:ss'))
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
                  handleChangeHourEndDate(-filter);
                  // setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(-filter, 'hours').format('DD/MM/YYYY HH:mm:ss'))
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
      </div>
      {openDeparture && (
        <TableComponent
          headers={[
            "Id",
            "Ngày khởi hành",
            "Ngày kết thúc",
            "Số người tham gia",
            "Giá vé trẻ em",
            "Giá vé người lớn",
            "Giá vé người già",
            {
              colSpan: 2,
              object: (
                <Button
                  className="btn btn-primary"
                  variant="contained"
                  onClick={handleFillAddTourModal}
                >
                  Thêm
                </Button>
              ),
            },
          ]}
          data={dataConvert}
        />
      )}
      {updateDeparture && (
        <ModalComponent
          open={updateDeparture}
          onclose={() => setUpdateDeparture(false)}
          title="Cập nhật lịch trình"
        >
          <FormView notBorder={true}>
            <div style={{ marginTop: -20 }}>
              <InputText
                label="Id"
                disable={true}
                type="text"
                value={departureId}
              />
              <InputText
                label="Ngày khởi hành"
                type="dateTime"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate(
                    moment(e.target.value, "HH:mm:ss DD/MM/YYYY")
                      .add(duration, "hours")
                      .format("HH:mm:ss DD/MM/YYYY"),
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
                onClick={handleUpdateDeparture}
              >
                Cập nhật
              </Button>
            </div>
          </FormView>
        </ModalComponent>
      )}
      <ModalComponent
        open={openAddDeparture}
        onclose={() => setOpenAddDeparture(false)}
        title="Thêm lịch trình"
      >
        <FormView notBorder={true}>
          <div style={{ marginTop: -20 }}>
            <InputText
              label="Id"
              disable={true}
              type="text"
              value={departureId}
            />
            <InputText
              label="Ngày khởi hành"
              type="dateTime"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setEndDate(
                  moment(e.target.value, "HH:mm:ss DD/MM/YYYY")
                    .add(duration, "hours")
                    .format("HH:mm:ss DD/MM/YYYY"),
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
              onClick={handleAddDeparture}
            >
              Thêm
            </Button>
          </div>
        </FormView>
      </ModalComponent>
      <ChoosePopup
        open={notification === -2}
        onclose={() => setNotification(-1)}
        title="Xoá lịch trình"
        message="Bạn có chắc chắn muốn xoá lịch trình này?"
        onAccept={() => {
          setNotification(-1);
          handleDeleteTour(departureSelected);
        }}
        onReject={() => setNotification(-1)}
      />
      <Button
        className="btn btn-primary w-50 mt-3"
        variant="contained"
        onClick={handleUpdateTour}
      >
        Cập nhật tour
      </Button>
      <CustomPop
        notify={notification}
        onSuccess={() => {
          navigate("/tour-details/" + data.tourId);
          setNotification(-1);
        }}
        messageSuccess="Cập nhật tour thành công"
        onFail={() => setNotification(-1)}
        messageFail={messageNotify ? messageNotify : "Cập nhật tour thất bại"}
      />
    </div>
  );
}

export default UpdateTourComponent;
