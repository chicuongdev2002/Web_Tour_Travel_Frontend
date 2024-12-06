import scriptChatbot from "../assets/scriptChatbot";
import constant from "../assets/constantManage";
import axios from "axios";
import { API_CHAT, TOKEN_CHAT } from "../config/host";
const reply = async (message, userId) => {
  // if(["hi", "hello", "chào", "xin chào", "chào bạn", "hello bạn", "hi bạn", "xin chào bạn"].includes(message.toLowerCase()))
  //     return [
  //         { me: false, content: constant.HI, createDate: new Date() },
  //         { me: false, content: constant.SEARCH_TOUR_2, onClick: constant.SEARCH_TOUR_2 },
  //         { me: false, content: constant.CANCLE_TOUR_POLICY, onClick: constant.CANCLE_TOUR_POLICY },
  //         { me: false, content: constant.PAYMENTS_METHOD, onClick: constant.PAYMENTS_METHOD },
  //     ]
  return [
    {
      me: false,
      content: await getApiChat(message, userId),
      createDate: new Date(),
    },
  ];
};

const getApiChat = async (text, userId) => {
  const response = await axios.post(
    API_CHAT,
    {
      inputs: {},
      query: text,
      response_mode: "streaming",
      conversation_id: "",
      user: userId,
    },
    {
      headers: {
        Authorization: TOKEN_CHAT,
        "Content-Type": "application/json",
      },
    },
  );
  let i = 1;
  let responseArr = response.data.split("data:");
  let dataFound = responseArr[responseArr.length - i];
  while (dataFound.indexOf("answer") === -1) {
    i++;
    dataFound = responseArr[responseArr.length - i];
  }
  const regex = /"answer":\s*"([^"]*)"/;
  const matches = dataFound.match(regex);
  return JSON.parse('"' + matches[1] + '"');
};

export default reply;
