import React, { useState } from "react";
import "../style/SearchInput.css";

const SearchInput = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [tourType, setTourType] = useState("");
  const [participantType, setParticipantType] = useState("");
  const [isTourTypeOpen, setIsTourTypeOpen] = useState(false);
  const [isParticipantTypeOpen, setIsParticipantTypeOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const handleSearch = () => {
    onSearch({ keyword, startLocation, tourType, participantType });
  };

  const toggleTourType = () => setIsTourTypeOpen(!isTourTypeOpen);
  const toggleParticipantType = () =>
    setIsParticipantTypeOpen(!isParticipantTypeOpen);
  const toggleProvince = () => setIsProvinceOpen(!isProvinceOpen);
  const selectTourType = (type) => {
    setTourType(type);
    setIsTourTypeOpen(false);
  };
  const provinces = [
    "",
    "Hà Nội",
    "TP Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];
  const selectParticipantType = (type) => {
    setParticipantType(type);
    setIsParticipantTypeOpen(false);
  };
  const selectProvince = (province) => {
    setStartLocation(province);
    setIsProvinceOpen(false);
  };
  const tourTypeOptions = {
    "": "Loại Tour",
    FAMILY: "Gia đình",
    GROUP: "Nhóm",
  };

  const participantTypeOptions = {
    "": "Loại Khách",
    ADULTS: "Người lớn",
    CHILDREN: "Trẻ em",
    ELDERLY: "Người già",
  };

  return (
    <div className="search-input-container mt-3">
      <div className="row g-3">
        <div className="col-md-3">
          <input
            className="form-control search-input"
            type="text"
            placeholder="Tìm kiếm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <div className="custom-select" onClick={toggleProvince}>
            <span>{startLocation || "Địa điểm bắt đầu"}</span>
            <div className={`options ${isProvinceOpen ? "open" : ""}`}>
              {provinces.map((province) => (
                <div
                  key={province}
                  className="option"
                  onClick={() => selectProvince(province)}
                >
                  {province}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="custom-select" onClick={toggleTourType}>
            <span>{tourTypeOptions[tourType] || "Loại Tour"}</span>
            <div className={`options ${isTourTypeOpen ? "open" : ""}`}>
              {Object.entries(tourTypeOptions).map(([key, value]) => (
                <div
                  key={key}
                  className="option"
                  onClick={() => selectTourType(key)}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="custom-select" onClick={toggleParticipantType}>
            <span>
              {participantTypeOptions[participantType] || "Loại Khách"}
            </span>
            <div className={`options ${isParticipantTypeOpen ? "open" : ""}`}>
              {Object.entries(participantTypeOptions).map(([key, value]) => (
                <div
                  key={key}
                  className="option"
                  onClick={() => selectParticipantType(key)}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100 search-button"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
