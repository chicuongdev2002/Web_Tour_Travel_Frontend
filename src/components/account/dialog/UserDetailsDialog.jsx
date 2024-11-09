import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const UserDetailsDialog = ({ open, onClose, userDetails, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserDetails, setEditedUserDetails] = useState({});

  useEffect(() => {
    if (userDetails) {
      setEditedUserDetails(userDetails);
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserDetails({ ...editedUserDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/accounts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUserDetails),
      });

      if (response.ok) {
        alert("Cập nhật thành công!");
        onUpdateSuccess();
        onClose();
      } else {
        alert("Có lỗi xảy ra khi cập nhật.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const roleOptions = [
    { value: "CUSTOMER", label: "Khách hàng" },
    { value: "CUSTOMERVIP", label: "Khách hàng Vip" },
    { value: "TOURGUIDE", label: "Hướng dẫn viên" },
    { value: "TOURPROVIDER", label: "Nhà cung cấp tour" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
        Thông Tin Chi Tiết
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#f5f5f5" }}>
        {editedUserDetails && (
          <div style={{ padding: "10px" }}>
            <Typography variant="h6" gutterBottom>
              Tên tài khoản:
              {isEditing ? (
                <TextField
                  name="username"
                  value={editedUserDetails.username}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                />
              ) : (
                <strong>{editedUserDetails.username}</strong>
              )}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Vai trò:
              {isEditing ? (
                <FormControl fullWidth margin="dense">
                  <Select
                    labelId="role-select-label"
                    name="role"
                    value={editedUserDetails.role}
                    onChange={handleInputChange}
                  >
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <strong>{editedUserDetails.role}</strong>
              )}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Họ và tên:
              {isEditing ? (
                <TextField
                  name="fullName"
                  value={editedUserDetails.fullName}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                />
              ) : (
                <strong>{editedUserDetails.fullName}</strong>
              )}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Trạng thái:
              <strong>
                {editedUserDetails.isActive ? "Bị Khóa" : "Hoạt động"}
              </strong>
            </Typography>
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#e0e0e0" }}>
        {isEditing ? (
          <>
            <Button onClick={handleSave} color="primary">
              Lưu
            </Button>
            <Button onClick={() => setIsEditing(false)} color="secondary">
              Hủy
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} color="primary">
            Chỉnh sửa
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;
