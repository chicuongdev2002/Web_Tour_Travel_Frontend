import React, { useEffect, useState } from "react";
import FormView from '../../components/formView/FormView';
import { getProvince } from "../../functions/getProvince";
import CustomPop from '../popupNotifications/CustomPop';
import { POST_DESTINATION, UPLOAD_IMAGE } from '../../config/host';
import { postData, uploadFile } from '../../functions/postData';
import { ClipLoader } from 'react-spinners';
import ModalComponent from '../modal/ModalComponent';

function AddDestination() {
  const [loading, setLoading] = useState(false);
  const [destinationName, setDestinationName] = useState("");
  const [description, setDescription] = useState("");
  const [listProvince, setListProvince] = useState(["Phú Yên"]);
  const [province, setProvince] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [openNotify, setOpenNotify] = useState(-1);
  const [messageNotify, setMessageNotify] = useState("");

  useEffect(() => {
    getProvince(true).then((res) => {
      setListProvince(res);
    })
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDestination = async () => {
    try {
      setLoading(true);
      let resultUpload = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        debugger
        resultUpload = await uploadFile(UPLOAD_IMAGE, formData);
        if (!resultUpload) {
          setLoading(false);
          setMessageNotify(
            "Đã xảy ra lỗi khi upload ảnh! Vui lòng thử lại sau",
          );
          setOpenNotify(0);
          return;
        }
      }
      let result = await postData(POST_DESTINATION, {
        name: destinationName,
        description: description,
        province: province,
        image: resultUpload ? resultUpload : null,
      })
      if (result) {
        setLoading(false);
        setMessageNotify("Thêm địa điểm du lịch thành công");
        setOpenNotify(1);
      } else {
        setLoading(false);
        setMessageNotify("Đã xảy ra lỗi! Vui lòng thử lại sau");
        setOpenNotify(0);
      }
    } catch (error) {
      setLoading(false);
      setMessageNotify("Đã xảy ra lỗi! Vui lòng thử lại sau");
      setOpenNotify(0);
    }
  }

  const handleAffterAdd = () => {
    setDestinationName("");
    setDescription("");
    setProvince("");
    setImage(null);
    setFile(null);
    setOpenNotify(-1);
  }

  return (
    <div className="w-100 m-2 formBooking">
      <FormView title="Thêm địa điểm du lịch" data={[
        { label: 'Tên địa điểm', object: { type: 'text', value: destinationName, notForm: true,
          onChange: (e) => setDestinationName(e.target.value) }},
        { label: 'Mô tả', object: { type: 'text', value: description, 
          onChange: (e) => setDescription(e.target.value) }},
        { label: 'Tỉnh/thành phố', object: { type: 'select', value: province, 
          listData: listProvince, 
          onChange: (e) => setProvince(e)}},
        image && {
          label: '', object: {
            type: 'image', value: [{ imageUrl: image }],
            style: {
              width: 70,
              height: 70,
              marginLeft: 10
            },
            onRemove: () => { setImage(null); setFile(null) }
          }
        },
        { label: '', object: { type: 'file', onChange: handleFileChange }},
        { label: 'Thêm', object: { type: 'button', className: 'w-100 my-3',
          onClick: () => {
            handleAddDestination()
          }}}
      ]} 
      />
      <CustomPop
        notify={openNotify}
        onSuccess={handleAffterAdd}
        messageSuccess={"Thêm địa điểm du lịch thành công"}
        onFail={() => setOpenNotify(-1)}
        messageFail={messageNotify}
      />
      {
        loading &&
        <ModalComponent open={loading} onclose={null}>
          <ClipLoader color="#000" loading={loading} size={50} />
        </ModalComponent>
      }
    </div>
  );
}

export default AddDestination;
