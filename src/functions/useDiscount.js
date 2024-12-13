import axios from "axios";
import { USE_DISCOUNT, getAPI } from "../config/host";

const useDiscount = async (discountCode) => {
    const result = await axios.put(getAPI(USE_DISCOUNT, { discountCode }));
    return result.data;
};

export default useDiscount;