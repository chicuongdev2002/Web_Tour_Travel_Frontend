import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

const ConfirmActionDialog = ({
  open,
  onClose,
  actionType,
  confirmAction,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="dialog-title">Xác Nhận Hành Động</DialogTitle>
      <DialogContent>
        <DialogContentText className="dialog-content">
          Bạn có chắc muốn {actionType === "lock" ? "khóa" : "mở khóa"} tài
          khoản này?
        </DialogContentText>
        {loading && <CircularProgress />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Hủy
        </Button>
        <Button onClick={confirmAction} color="secondary" disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác Nhận"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionDialog;
