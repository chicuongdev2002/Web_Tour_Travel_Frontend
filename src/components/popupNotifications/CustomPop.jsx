import React from "react";
import SuccessPopup from "./SuccessPopup";
import FailPopup from "./FailPopup";

function CustomPop({ notify, onSuccess, messageSuccess, onFail, messageFail }) {
  return (
    <>
      {notify > -1 &&
        (notify == 1 ? (
          <SuccessPopup
            open={notify == 1}
            message={messageSuccess}
            onClose={onSuccess}
            onClick={onSuccess}
          />
        ) : (
          <FailPopup
            open={notify == 0}
            message={
              messageFail
                ? messageFail
                : "Đã xảy ra lỗi, vui lòng thử lại hoặc liên hệ với bộ phận CSKH để được hướng dẫn xử lý"
            }
            onClose={onFail}
            onClick={onFail}
          />
        ))}
    </>
  );
}

export default CustomPop;
