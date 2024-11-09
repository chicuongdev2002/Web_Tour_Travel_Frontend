import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { Add, Lock, LockOpen, Upgrade } from "@mui/icons-material";

const AccountActions = ({
  handleOpenAddDialog,
  handleLockSelectedAccounts,
  handleUnlockSelectedAccounts,
  handleUpgradeSelectedAccounts,
  selectedAccounts,
  accounts,
  handleResetPassword,
  loadingReset,
}) => {
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddDialog}
        startIcon={<Add />}
      >
        Thêm Tài Khoản Mới
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLockSelectedAccounts} // Đảm bảo rằng đây là hàm kế tiếp
        disabled={
          selectedAccounts.size === 0 ||
          [...selectedAccounts].every(
            (id) => accounts.find((acc) => acc.userId === id).active === false,
          )
        }
        startIcon={<Lock />}
      >
        Khóa Tài Khoản Đã Chọn
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleUnlockSelectedAccounts}
        disabled={
          selectedAccounts.size === 0 ||
          [...selectedAccounts].every(
            (id) => accounts.find((acc) => acc.userId === id).active === true,
          )
        }
        startIcon={<LockOpen />}
      >
        Mở Khóa Tài Khoản Đã Chọn
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpgradeSelectedAccounts}
        disabled={
          selectedAccounts.size === 0 ||
          [...selectedAccounts].some(
            (id) => !accounts.find((acc) => acc.userId === id).active,
          )
        }
        startIcon={<Upgrade />}
      >
        Nâng Cấp Tài Khoản Đã Chọn
      </Button>
      <Button
        variant="contained"
        color="warning"
        onClick={handleResetPassword}
        disabled={
          selectedAccounts.size === 0 ||
          [...selectedAccounts].some(
            (id) => !accounts.find((acc) => acc.userId === id).active,
          ) ||
          loadingReset
        }
      >
        {loadingReset ? <CircularProgress size={24} /> : "Đặt lại mật khẩu"}
      </Button>
    </>
  );
};

export default AccountActions;
