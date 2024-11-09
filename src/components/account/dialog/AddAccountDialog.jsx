import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const AddAccountDialog = ({
  open,
  onClose,
  newAccount,
  setNewAccount,
  onAdd,
  errors,
}) => {
  const handleSubmit = () => {
    onAdd(newAccount);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm Tài Khoản Mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên Đăng Nhập"
          type="text"
          fullWidth
          variant="outlined"
          value={newAccount.username}
          onChange={(e) =>
            setNewAccount({ ...newAccount, username: e.target.value })
          }
          error={Boolean(errors.username)}
          helperText={errors.username}
        />
        <TextField
          margin="dense"
          label="Mật Khẩu"
          type="password"
          fullWidth
          variant="outlined"
          value={newAccount.password}
          onChange={(e) =>
            setNewAccount({ ...newAccount, password: e.target.value })
          }
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          margin="dense"
          label="Họ Và Tên"
          type="text"
          fullWidth
          variant="outlined"
          value={newAccount.fullName}
          onChange={(e) =>
            setNewAccount({ ...newAccount, fullName: e.target.value })
          }
          error={Boolean(errors.fullName)}
          helperText={errors.fullName}
        />
        <TextField
          margin="dense"
          label="Số Điện Thoại"
          type="text"
          fullWidth
          variant="outlined"
          value={newAccount.phoneNumber}
          onChange={(e) =>
            setNewAccount({ ...newAccount, phoneNumber: e.target.value })
          }
          error={Boolean(errors.phoneNumber)}
          helperText={errors.phoneNumber}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={newAccount.email}
          onChange={(e) =>
            setNewAccount({ ...newAccount, email: e.target.value })
          }
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          margin="dense"
          label="Địa Chỉ"
          type="text"
          fullWidth
          variant="outlined"
          value={newAccount.address}
          onChange={(e) =>
            setNewAccount({ ...newAccount, address: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Vai Trò"
          select
          fullWidth
          variant="outlined"
          value={newAccount.role || "CUSTOMER"}
          onChange={(e) =>
            setNewAccount({ ...newAccount, role: e.target.value })
          }
        >
          <MenuItem value="CUSTOMER">Khách Hàng</MenuItem>
          <MenuItem value="CUSTOMERVIP">Khách Hàng VIP</MenuItem>
          <MenuItem value="TOURGUIDE">Hướng dẫn viên</MenuItem>
          <MenuItem value="TOURPROVIDER">Nhà cung cấp tour</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Thêm Tài Khoản
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountDialog;
