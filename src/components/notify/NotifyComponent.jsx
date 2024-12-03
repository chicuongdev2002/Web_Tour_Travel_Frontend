import React, { useCallback, useEffect, useState } from "react";
import { getNotify } from "../../functions/getNotify";
import "./style.css";
import ChatComponent from "../chat/ChatComponent";
import { getTimeDifference } from "../../functions/format";
import { useDispatch, useSelector } from "react-redux";
import { saveNotify } from "../../redux/slice";

function NotifyComponent() {
  const notify = useSelector((state) => state.notify);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [selected, setSelected] = useState(0);
  const [editable, setEditable] = React.useState(false);

  useEffect(() => {
    getAllNotify();
  }, []);

  const getAllNotify = useCallback(async () => {
    const result = await getNotify({}, user.userId);
    dispatch(saveNotify(result));
  }, []);

  const chatElement = (item) => {
    return (
      <div
        className="divRow h-100"
        style={{ overflow: "hidden" }}
        onClick={() => {
          setSelected(item.user.userId);
          setEditable(true);
        }}
      >
        <div
          style={{
            borderRadius: "50%",
            width: "20%",
            overflow: "hidden",
            minWidth: 70,
          }}
        >
          <img
            className="w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtWzij7EI8lsrSKd4TgxXIh5criZTEm-vuef1JnV2ox-a_5WW71iLOXsQnUkPxdfS61iY&usqp=CAU"
            alt="avatar"
          />
        </div>
        <div
          className="pl-3 pr-2 divRowBetween"
          style={{ flexGrow: 1, minWidth: 180 }}
        >
          <div
            className="divColumnBetween align-items-start w-90"
            style={{ maxWidth: 160, overflow: "hidden" }}
          >
            <p className="m-0 one-line text-start" style={{ fontSize: 18 }}>
              {item.user.fullName}
            </p>
            <p className="m-0">{item.messages[0]?.content.startsWith("$$##Cancel_Booking##$$")? "Huỷ Booking": item.messages[0]?.content}</p>
          </div>
          <div>
            <p className="m-0">
              {getTimeDifference(item.messages[0]?.createDate)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="divRow h-100">
      <div className="w-25 h-100">
        {notify?.map((item, index) => {
          return (
            <div
              key={index}
              className={`${selected === item.user.userId ? "elementChatSelected" : "elementHover"} d-flex w-100 flex-column p-2 mx-2 mb-2 border border-dark rounded`}
            >
              {chatElement(item)}
            </div>
          );
        })}
      </div>
      <div
        style={{ flexGrow: 1 }}
        className="divCenterColumn p-3 h-100 mx-3 border border-dark rounded"
      >
        <ChatComponent selected={selected} editable={editable} />
      </div>
    </div>
  );
}

export default NotifyComponent;
