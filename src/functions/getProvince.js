import axios from "axios";

const getProvince = async (collapse) => {
    const result = await axios.get('https://open.oapi.vn/location/provinces?page=0&size=100')
    if(collapse)
        return result.data.data.map(province => ({ [province.name] : province.name }))
    return result.data.data
}

const getDistrict = async (provinceId) => {
  const result = await axios.get(
    `https://open.oapi.vn/location/districts/${provinceId}?page=0&size=100`,
  );
  return result.data.data;
};

export { getProvince, getDistrict };
