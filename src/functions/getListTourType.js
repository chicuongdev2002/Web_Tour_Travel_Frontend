import axios from 'axios';
import { GET_TOUR_TYPE } from '../config/host';

const getListTourType = async () => {
    const result = await axios.get(GET_TOUR_TYPE);
    return result.data;
}

export { getListTourType };