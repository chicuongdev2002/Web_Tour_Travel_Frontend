import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TourDetailComponent from "../components/tourDetail/TourDetailComponent";
import { getTourDetail } from "../functions/getTourDetails";
import NavHeader from "../components/navbar/NavHeader";
function TourDetails() {
  const { id } = useParams();
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        const data = await getTourDetail(id);
        console.log("Dữ liệu Tour chi tiết lấy được từ" + { id }, data);
        setTourData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Có lỗi xảy ra: {error}</div>
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">
          Không tìm thấy thông tin tour
        </div>
      </div>
    );
  }

  return (
    <div >
      <NavHeader textColor="black" />
      <TourDetailComponent tourData={tourData} />
    </div>
  );
}

export default TourDetails;
