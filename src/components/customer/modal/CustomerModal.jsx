import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomerModal = ({
  open,
  onClose,
  currentCustomer,
  setCurrentCustomer,
  handleUpdate,
}) => {
  const [newAddress, setNewAddress] = useState("");

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setCurrentCustomer((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses,
          { addressId: Date.now(), address: newAddress.trim() },
        ],
      }));
      setNewAddress(""); // Clear input after adding
    }
  };

  const handleDeleteAddress = (addressToDelete) => {
    setCurrentCustomer((prev) => ({
      ...prev,
      addresses: prev.addresses.filter(
        (address) => address.address !== addressToDelete,
      ),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cập Nhật Thông Tin Khách Hàng</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={currentCustomer?.email || ""}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  email: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Họ Tên"
              value={currentCustomer?.fullName || ""}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  fullName: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Số Điện Thoại"
              value={currentCustomer?.phoneNumber || ""}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  phoneNumber: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Thêm Địa Chỉ"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              fullWidth
              onKeyPress={(e) => e.key === "Enter" && handleAddAddress()}
            />
            <Button
              onClick={handleAddAddress}
              variant="contained"
              color="primary"
              style={{ marginTop: 10 }}
            >
              Thêm Địa Chỉ
            </Button>
          </Grid>
          <Grid item xs={12}>
            {currentCustomer?.addresses.map((addressObj, index) => (
              <Grid container key={index} alignItems="center" spacing={2}>
                <Grid item xs={10}>
                  <Typography variant="body1">{addressObj.address}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteAddress(addressObj.address)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleUpdate}
          variant="contained"
          color="primary"
          fullWidth
        >
          Cập Nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerModal;
