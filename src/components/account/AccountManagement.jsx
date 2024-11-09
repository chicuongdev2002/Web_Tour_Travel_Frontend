import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, CircularProgress, Pagination } from "@mui/material";
import NavHeader from "../navbar/NavHeader";
import AddAccountDialog from "./dialog/AddAccountDialog";
import ConfirmDialog from "./dialog/ConfirmActionDialog";
import UserDetailsDialog from "./dialog/UserDetailsDialog";
import AccountTable from "./table/AccountTable";
import AccountActions from "./action/AccountActions";
import Filters from "./filter/Filters";
import SuccessPopup from "../popupNotifications/SuccessPopup";
import FailPopup from "../popupNotifications/FailPopup";
import "./AccountManagement.css";
const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [actionType, setActionType] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState(new Set());
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [userDetails, setUserDetails] = useState(null);
  const [openUserDetailsDialog, setOpenUserDetailsDialog] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    open: false,
    message: "",
  });
  const [failPopup, setFailPopup] = useState({ open: false, message: "" });
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    role: "CUSTOMER",
  });
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!newAccount.username) {
      newErrors.username = "Tên đăng nhập không được để trống";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newAccount.email) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!emailPattern.test(newAccount.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!newAccount.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (newAccount.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!newAccount.fullName) {
      newErrors.fullName = "Họ và tên không được để trống";
      isValid = false;
    }

    if (newAccount.phoneNumber && !/^\d{10,15}$/.test(newAccount.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  useEffect(() => {
    fetchAccounts();
  }, [page, roleFilter, statusFilter]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/accounts", {
        params: {
          page,
          size: pageSize,
          role: roleFilter,
          status: statusFilter,
        },
      });
      console.log("Fetched accounts:", response.data);
      setAccounts(response.data.content);
      setTotalPages(response.data.page.totalPages);
      const initialRoles = {};
      response.data.content.forEach((account) => {
        initialRoles[account.userId] = account.role;
      });
      setRoles(initialRoles);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Gọi API để cập nhật role
      await axios.post(
        `http://localhost:8080/api/accounts/upgrade/${userId}/${newRole}`,
      );

      // Cập nhật state roles local
      setRoles((prevRoles) => ({
        ...prevRoles,
        [userId]: newRole,
      }));
      await fetchAccounts();
      setSuccessPopup({
        open: true,
        message: "Thay đổi vai trò thành công!",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      setFailPopup({
        open: true,
        message: "Không thể thay đổi vai trò. Vui lòng thử lại!",
      });
    }
  };
  const handleRowClick = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/accounts/${userId}`,
      );
      setUserDetails(response.data);
      setOpenUserDetailsDialog(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const confirmAction = async () => {
    setLoadingAction(true);
    try {
      const userIds = Array.isArray(selectedUserId)
        ? selectedUserId
        : [selectedUserId];

      if (userIds.length > 0) {
        await Promise.all(
          userIds.map((userId) => {
            const endpoint =
              actionType === "lock"
                ? `http://localhost:8080/api/accounts/lock/${userId}`
                : `http://localhost:8080/api/accounts/unlock/${userId}`;
            return axios.post(endpoint);
          }),
        );

        fetchAccounts();
        setSelectedAccounts(new Set());
        setSuccessPopup({
          open: true,
          message: `${actionType === "lock" ? "Khóa" : "Mở khóa"} tài khoản thành công!`,
        });
      }
    } catch (error) {
      console.error(`Error ${actionType}ing accounts:`, error);
      setFailPopup({
        open: true,
        message: `Không thể ${actionType === "lock" ? "khóa" : "mở khóa"} tài khoản. Vui lòng thử lại!`,
      });
    } finally {
      setOpenDialog(false);
      setLoadingAction(false);
    }
  };

  const handleOpenAddDialog = () => {
    setNewAccount({
      username: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      role: "CUSTOMER",
    });
    setOpenAddDialog(true);
  };

  const handleAddAccount = async (accountData) => {
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/accounts/register",
        accountData,
      );

      if (res.status === 201) {
        setSuccessPopup({
          open: true,
          message: "Tạo tài khoản mới thành công!",
        });
        setOpenAddDialog(false);
      } else {
        setFailPopup({
          open: true,
          message: "Không thể tạo tài khoản. Vui lòng thử lại!",
        });
      }

      await fetchAccounts();
    } catch (error) {
      console.error("Error adding account:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        setFailPopup({
          open: true,
          message: errorMessage || "Không thể tạo tài khoản. Vui lòng thử lại!",
        });
      } else {
        setFailPopup({
          open: true,
          message: "Không thể tạo tài khoản. Vui lòng thử lại!",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (userId) => {
    console.log("Selected User ID:", userId);
    setSelectedAccounts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.has(userId)
        ? newSelected.delete(userId)
        : newSelected.add(userId);
      return newSelected;
    });
  };

  const accountActions = {
    handleLockSelectedAccounts: () => {
      if (selectedAccounts.size > 0) {
        const userIds = Array.from(selectedAccounts);
        setSelectedUserId(userIds);
        setActionType("lock");
        setOpenDialog(true);
      }
    },
    handleUnlockSelectedAccounts: () => {
      if (selectedAccounts.size > 0) {
        const userIds = Array.from(selectedAccounts);
        setSelectedUserId(userIds);
        setActionType("unlock");
        setOpenDialog(true);
      }
    },
    handleUpgradeSelectedAccounts: async () => {
      if (selectedAccounts.size > 0) {
        try {
          const upgradePromises = Array.from(selectedAccounts)
            .map((userId) => {
              // Lấy role hiện tại của user
              const account = accounts.find((acc) => acc.userId === userId);
              let newRole;

              // Logic để xác định role mới dựa trên role hiện tại
              switch (account.role) {
                case "CUSTOMER":
                  newRole = "CUSTOMERVIP";
                  break;
                default:
                  return null;
              }

              if (newRole) {
                return axios.post(
                  `http://localhost:8080/api/accounts/upgrade/${userId}/${newRole}`,
                );
              }
            })
            .filter(Boolean);

          await Promise.all(upgradePromises);
          await fetchAccounts();
          setSelectedAccounts(new Set());
          setSuccessPopup({
            open: true,
            message: "Nâng cấp tài khoản thành công!",
          });
        } catch (error) {
          console.error("Error upgrading accounts:", error);
          setFailPopup({
            open: true,
            message: "Không thể nâng cấp tài khoản. Vui lòng thử lại!",
          });
        }
      }
    },
    handleResetPassword: async () => {
      if (selectedAccounts.size > 0) {
        const userIds = Array.from(selectedAccounts);
        console.log("Selected User IDs:", userIds);
        setLoadingReset(true);
        try {
          await axios.post(
            `http://localhost:8080/api/accounts/admin-reset-password`,
            { userIds },
            {},
          );
          setLoadingReset(false);
          setSuccessPopup({
            open: true,
            message: "Mật khẩu đã được reset và gửi qua email.",
          });
          fetchAccounts();
        } catch (error) {
          console.error("Error resetting password:", error);
          setFailPopup({
            open: true,
            message: "Không thể đặt lại mật khẩu. Vui lòng thử lại!",
          });
        }
      } else {
        setFailPopup({
          open: true,
          message: "Vui lòng chọn ít nhất một tài khoản để đặt lại mật khẩu.",
        });
      }
    },
  };

  return (
    <div className="account-management-paper">
      <Typography variant="h4" gutterBottom align="center">
        Quản Lý Tài Khoản
      </Typography>
      <AccountActions
        {...accountActions}
        handleOpenAddDialog={handleOpenAddDialog}
        selectedAccounts={selectedAccounts}
        accounts={accounts}
        loadingReset={loadingReset}
      />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <AccountTable
          accounts={accounts}
          roles={roles}
          handleRowClick={handleRowClick}
          selectedAccounts={selectedAccounts}
          handleSelectAccount={handleSelectAccount}
          handleRoleChange={handleRoleChange}
        />
      )}
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(event, value) => setPage(value - 1)}
        className="pagination"
      />
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        confirmAction={confirmAction}
        actionType={actionType}
        loading={loadingAction}
      />
      <AddAccountDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        newAccount={newAccount}
        setNewAccount={setNewAccount}
        onAdd={handleAddAccount}
        errors={errors}
      />
      <UserDetailsDialog
        open={openUserDetailsDialog}
        onClose={() => setOpenUserDetailsDialog(false)}
        userDetails={userDetails}
        onUpdateSuccess={fetchAccounts}
      />
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
    </div>
  );
};

export default AccountManagement;
