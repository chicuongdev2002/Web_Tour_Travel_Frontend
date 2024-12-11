import scriptChatbot from '../assets/scriptChatbot'
import constant from '../assets/constantManage'
import axios from 'axios'
import { API_CHAT, TOKEN_CHAT } from '../config/host'
const reply = async (message, userId) => {
    // if("Cách đặt tour".includes(message.toLowerCase()))
    //     return [
    //         { me: false, content: "nếu muốn đặt tour du lịch bạn hãy chọn vào “Đặt tour” -> chọn tour muốn đặt -> chọn lịch khởi hành mà bạn mong muốn -> thanh toán là xong", createDate: new Date() },
    //     ]
    return  [{ me: false, content: await getApiChat(message, userId), createDate: new Date() }]

}

const getApiChat = async (text, userId) => {
    const response = await axios.post(API_CHAT,
      {
        inputs: {},
        query: text,
        response_mode: "streaming",
        conversation_id: "",
        user: userId
    },{
      headers: {
        'Authorization': TOKEN_CHAT,
        'Content-Type': 'application/json'
      }
    })
    let i = 1
    let responseArr = response.data.split("data:")
    let dataFound = responseArr[responseArr.length - i]
    while(dataFound.indexOf("answer") === -1) {
      i++
      dataFound = responseArr[responseArr.length - i]
    }
    const regex = /"answer":\s*"([^"]*)"/;
    const matches = dataFound.match(regex);
    return JSON.parse('"' + matches[1] + '"')
}

export default reply;
