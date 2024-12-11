import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import { updateTourGuide } from "../../../functions/tourGuideStatistics";
import SuccessPopup from "../../popupNotifications/SuccessPopup";
import FailPopup from "../../popupNotifications/FailPopup";

const UpdateDialog = ({ open, onClose, tourGuide, onRefresh }) => {
  const [formData, setFormData] = useState({ addresses: [{ address: "" }] });
  const [successPopup, setSuccessPopup] = useState({
    open: false,
    message: "",
  });
  const [failPopup, setFailPopup] = useState({ open: false, message: "" });
  useEffect(() => {
    if (tourGuide) {
      setFormData({
        userId: tourGuide.userId,
        email: tourGuide.email,
        fullName: tourGuide.fullName,
        phoneNumber: tourGuide.phoneNumber,
        experienceYear: tourGuide.experienceYear,
        addresses:
          tourGuide.addresses?.length > 0
            ? tourGuide.addresses
            : [{ address: "" }],
      });
    }
  }, [tourGuide]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index].address = value;
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { address: "" }],
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await updateTourGuide(formData);
      if (response.success) {
             setSuccessPopup({
              open: true,
              message: "Cập nhật thông tin thành công",
            });
             
          } else {
           
            setFailPopup({
              open: true,
              message:"Cập nhật thông tin thất bại",
            });
    
          }
             setTimeout(() => {
      onRefresh();
      onClose();
            }, 3000);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật thông tin hướng dẫn viên</DialogTitle>
      <DialogContent>
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="fullName"
          label="Họ và tên"
          value={formData.fullName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="phoneNumber"
          label="Số điện thoại"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="experienceYear"
          label="Năm kinh nghiệm"
          value={formData.experienceYear}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box>
          <DialogTitle>Danh sách địa chỉ</DialogTitle>
          {formData.addresses.map((addressObj, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                name={`addresses[${index}].address`}
                label={`Địa chỉ ${index + 1}`}
                value={addressObj.address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                fullWidth
                margin="normal"
              />
              {index === formData.addresses.length - 1 && (
                <IconButton onClick={handleAddAddress}>
                  <AddIcon />
                </IconButton>
              )}
            </Box>
          ))}
          {formData.addresses.length === 0 && (
            <Button onClick={handleAddAddress}>
              <AddIcon /> Thêm địa chỉ mới
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleUpdate}>Cập nhật</Button>
      </DialogActions>
        <SuccessPopup
        open={successPopup.open}
        message={successPopup.message}
        onClose={() => setSuccessPopup({ open: false, message: "" })}
        onClick={() => setSuccessPopup({ open: false, message: "" })}
      />
      <FailPopup
        open={failPopup.open}
        message={failPopup.message}
        onClose={() => setFailPopup({ open: false, message: "" })}
        onClick={() => setFailPopup({ open: false, message: "" })}
      />
    </Dialog>
   
  );
};

export default UpdateDialog;
