import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AddCircle as AddCircleIcon,
  Lock as LockIcon,
  PersonOutline as PersonIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import "../style/UserInfo.css";
import axios from "axios";
import NavHeader from "../components/navbar/NavHeader";
import SuccessPopup from "../components/popupNotifications/SuccessPopup";
import FailPopup from "../components/popupNotifications/FailPopup";
import changePassword from "../functions/changePassword";
import updateUser from "../functions/updateUser";
import { deleteUser } from "../functions/customercrud";
const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "70%",
    margin: "2rem auto",
  },
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1),
    width: "calc(100% - 16px)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    transition: "all 0.3s ease-in-out",
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderWidth: "2px",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiInputLabel-root": {
      fontSize: "0.9rem",
    },
    "& .MuiOutlinedInput-root": {
      fontSize: "0.9rem",
    },
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    padding: theme.spacing(1, 2),
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const UserInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    addresses: [],
  });

  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [failPopupOpen, setFailPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { addressId: Date.now(), address: "" },
      ],
    });
  };

  const handleRemoveAddress = (addressId) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter(
        (addr) => addr.addressId !== addressId,
      ),
    });
  };

  const handleSave = async () => {
    const result = await updateUser(user.userId, formData);
    if (result.isUpdateSuccessful) {
      setUser(formData);
      setEditing(false);
      setShowAlert(false);
      setPopupMessage("Cập nhật thông tin thành công!");
      setSuccessPopupOpen(true);
    } else {
      setPopupMessage(result.error);
      setFailPopupOpen(true);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPopupMessage("Mật khẩu xác nhận không khớp!");
      setFailPopupOpen(true);
      return;
    }
    const result = await changePassword(
      user.userId,
      passwordData.currentPassword,
      passwordData.newPassword,
    );
    if (result.isChangeSuccessful) {
      setChangePasswordDialogOpen(false);
      setPopupMessage("Đổi mật khẩu thành công!");
      setSuccessPopupOpen(true);
      // Reset dữ liệu mật khẩu
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setPopupMessage(result.error);
      setFailPopupOpen(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response= await deleteUser(user.userId);
      if (response.success) {
        setTimeout(() => {
          setPopupMessage("Xóa tài khoản thành công!");
          setSuccessPopupOpen(true);
                  }, 2000);
          sessionStorage.clear();
          window.location.href = "/login-register";

      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setPopupMessage("Xóa tài khoản thất bại!");
      setFailPopupOpen(true);
    }
  };

  return (
    <div className="user-profile-container">
      {/* <NavHeader textColor="black" /> */}
      <StyledCard>
        <CardHeader
          title="Thông tin cá nhân"
          titleTypographyProps={{
            align: "center",
            variant: isMobile ? "h5" : "h4",
            color: "primary",
            style: { fontWeight: 600 },
          }}
        />
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              fontSize: isMobile ? "0.8rem" : "inherit",
              minHeight: isMobile ? 48 : 64,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon
                  sx={{ fontSize: isMobile ? "1.2rem" : "inherit" }}
                />
                <span>Thông tin người dùng</span>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockIcon sx={{ fontSize: isMobile ? "1.2rem" : "inherit" }} />
                <span>Tài khoản</span>
              </Box>
            }
          />
        </Tabs>

        <CardContent>
          <TabPanel value={tabValue} index={0}>
            {showAlert && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setShowAlert(false)}
              >
                Vui lòng điền đầy đủ thông tin bắt buộc
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <StyledTextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={editing ? formData.fullName : user?.fullName}
                onChange={editing ? handleInputChange : null}
                disabled={!editing}
                size={isMobile ? "small" : "medium"}
              />

              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editing ? formData.email : user?.email}
                onChange={editing ? handleInputChange : null}
                disabled={!editing}
                size={isMobile ? "small" : "medium"}
              />

              <StyledTextField
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={editing ? formData.phoneNumber : user?.phoneNumber}
                onChange={editing ? handleInputChange : null}
                disabled={!editing}
                size={isMobile ? "small" : "medium"}
              />

              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    color="primary"
                  >
                    Địa chỉ
                  </Typography>
                  {editing && (
                    <AnimatedButton
                      startIcon={<AddCircleIcon />}
                      onClick={handleAddAddress}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    >
                      Thêm địa chỉ
                    </AnimatedButton>
                  )}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {formData.addresses.map((address, index) => (
                    <Box key={address.addressId} sx={{ position: "relative" }}>
                      <StyledTextField
                        fullWidth
                        label={`Địa chỉ ${index + 1}`}
                        value={editing ? address.address : address.address}
                        onChange={(e) => {
                          const newAddresses = [...formData.addresses];
                          newAddresses[index].address = e.target.value;
                          setFormData({ ...formData, addresses: newAddresses });
                        }}
                        disabled={!editing}
                        size={isMobile ? "small" : "medium"}
                      />
                      {editing && (
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "error.main",
                          }}
                          onClick={() => handleRemoveAddress(address.addressId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 4,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                {!editing ? (
                  <AnimatedButton
                    fullWidth
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                  >
                    Chỉnh sửa
                  </AnimatedButton>
                ) : (
                  <>
                    <AnimatedButton
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        setEditing(false);
                        setFormData(user);
                      }}
                      sx={{ flex: 1 }}
                    >
                      Hủy
                    </AnimatedButton>
                    <AnimatedButton
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ flex: 1 }}
                    >
                      Lưu
                    </AnimatedButton>
                  </>
                )}
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <AnimatedButton
                variant="contained"
                startIcon={<LockIcon />}
                onClick={() => setChangePasswordDialogOpen(true)}
                fullWidth
              >
                Đổi mật khẩu
              </AnimatedButton>

              <AnimatedButton
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth
              >
                Xóa tài khoản
              </AnimatedButton>
            </Box>
          </TabPanel>
        </CardContent>
      </StyledCard>

      <Dialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <StyledTextField
              autoFocus
              label="Mật khẩu hiện tại"
              type="password"
              fullWidth
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              size={isMobile ? "small" : "medium"}
            />
            <StyledTextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              size={isMobile ? "small" : "medium"}
            />
            <StyledTextField
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setChangePasswordDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleChangePassword} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Xóa tài khoản
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success and Error Popups */}
      <SuccessPopup
        open={successPopupOpen}
        onClose={() => setSuccessPopupOpen(false)}
        message={popupMessage}
      />
      <FailPopup
        open={failPopupOpen}
        onClose={() => setFailPopupOpen(false)}
        message={popupMessage}
      />
    </div>
  );
};

export default UserInfo;
