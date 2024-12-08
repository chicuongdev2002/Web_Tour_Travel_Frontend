import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WEB_SOCKET } from "../config/host";

var stompClient = null;
const user = JSON.parse(sessionStorage.getItem("user"));
const initSocket = (connectSocket, handlePayment) => {
  if (user) {
    if (!connectSocket) {
      let socket = new SockJS(WEB_SOCKET);
      stompClient = Stomp.over(socket);
      stompClient.connect({}, () => onConnected(handlePayment), onError);
      return true;
    }
  }
  return false;
};

const handleDoWithSocket = (socket) => {
  if (socket.type === "ADD_NOTIFICATION" && stompClient) {
    sendNotification(socket.content);
  }
};

const onConnected = (handlePayment) => {
  stompClient.subscribe("/user/" + user.userId + "/notify", (payload) => {
    const message = JSON.parse(payload.body);
    alert(message);
  });
  stompClient.subscribe(
    "/user/" + user.userId + "/callBackPayment",
    (payload) => {
      const message = JSON.parse(payload.body);
      handlePayment(message);
    },
  );
};

const onError = (error) => {
  console.log(
    "Could not connect to WebSocket server. Please refresh and try again!",
  );
};

const sendNotification = (notify) => {
  stompClient.send("/app/notify", {}, JSON.stringify(notify));
};

export { initSocket, handleDoWithSocket };
