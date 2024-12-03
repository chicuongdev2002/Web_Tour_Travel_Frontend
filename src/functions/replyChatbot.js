import scriptChatbot from '../assets/scriptChatbot'
import constant from '../assets/constantManage'
const reply = (message, keyWord, lstProvince) => {
    if(["hi", "hello", "chào", "xin chào", "chào bạn", "hello bạn", "hi bạn", "xin chào bạn"].includes(message.toLowerCase()))
        return [
            { me: false, content: constant.HI, createDate: new Date() },
            { me: false, content: constant.SEARCH_TOUR_2, onClick: constant.SEARCH_TOUR_2 },
            { me: false, content: constant.CANCLE_TOUR_POLICY, onClick: constant.CANCLE_TOUR_POLICY },
            { me: false, content: constant.PAYMENTS_METHOD, onClick: constant.PAYMENTS_METHOD },
        ]
    if(keyWord == "where")
        return scriptChatbot(message, lstProvince)
    return scriptChatbot(message)
}

export default reply;