import axios from "axios"
import { GET_LINK_MOMO, INIT_MOMO, getAPI } from "../config/host"

const createLinkMomoPayment = async (amount, orderId) => {
    let url = getAPI(GET_LINK_MOMO, { amount, orderId })
    const result = await axios.get(url).then(data => initMomoPayment(data.data))
    return result
}

const initMomoPayment = async (data) => {
    debugger
    try{
        const result = await axios.post(INIT_MOMO, data, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': new TextEncoder().encode(data).length
            },
        })
        return result.data
    } catch(e){
        return null
    }
}

export { createLinkMomoPayment }