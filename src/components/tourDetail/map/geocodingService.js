
export const geocodeLocation = async (province) => {
  const query = encodeURIComponent(`${province}, Vietnam`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'vi', // Ưu tiên kết quả tiếng Việt
        'User-Agent': 'TourWebsite/1.0' // Định danh ứng dụng của bạn
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    // Trả về tọa độ mặc định của Việt Nam nếu không tìm thấy
    return {
      latitude: 16.0469,
      longitude: 108.2069
    };
  } catch (error) {
    console.error('Error geocoding location:', error);
    // Trả về tọa độ mặc định của Việt Nam nếu có lỗi
    return {
      latitude: 16.0469,
      longitude: 108.2069
    };
  }
};