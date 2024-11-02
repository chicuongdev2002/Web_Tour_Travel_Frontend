import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Card, CardContent, CardHeader, Alert,
  IconButton, Tabs, Tab, Box, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AddCircle as AddCircleIcon,
  Lock as LockIcon,
  PersonOutline as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import '../style/UserInfo.css';
import axios from 'axios';
import NavHeader from '../components/navbar/NavHeader';
import SuccessPopup from '../components/popupNotifications/SuccessPopup';
import FailPopup from '../components/popupNotifications/FailPopup';
import changePassword from '../functions/changePassword';
import updateUser from '../functions/updateUser';
const StyledCard = styled(Card)({
  maxWidth: '70%',
  margin: '2rem auto',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '1rem',
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease-in-out',
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
    },
  },
});

const AnimatedButton = styled(Button)({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  },
});

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    addresses: [],
  });


  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [failPopupOpen, setFailPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
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
        { addressId: Date.now(), address: '' },
      ],
    });
  };

  const handleRemoveAddress = (addressId) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((addr) => addr.addressId !== addressId),
    });
  };

  const handleSave = async () => {
    const result = await updateUser(user.userId, formData);
    if (result.isUpdateSuccessful) {
      setUser(formData);
      setEditing(false);
      setShowAlert(false);
      setPopupMessage('Cập nhật thông tin thành công!');
      setSuccessPopupOpen(true);
    } else {
      setPopupMessage(result.error);
      setFailPopupOpen(true);
    }
  };


const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPopupMessage('Mật khẩu xác nhận không khớp!');
      setFailPopupOpen(true);
      return;
    }
    const result = await changePassword(user.userId, passwordData.currentPassword, passwordData.newPassword);
    if (result.isChangeSuccessful) {
      setChangePasswordDialogOpen(false);
      setPopupMessage('Đổi mật khẩu thành công!');
      setSuccessPopupOpen(true);
      // Reset dữ liệu mật khẩu
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setPopupMessage(result.error);
      setFailPopupOpen(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${user.userId}`);
      sessionStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error);
      setPopupMessage('Xóa tài khoản thất bại!');
      setFailPopupOpen(true);
    }
  };

  return (
    <div className="user-profile-container">
      <NavHeader textColor="black" />
      <StyledCard>
        <CardHeader
          title="Thông tin cá nhân"
          titleTypographyProps={{
            align: 'center',
            variant: 'h4',
            color: 'primary',
            style: { fontWeight: 600 },
          }}
        />
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="Thông tin người dùng" 
            icon={<PersonIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Tài khoản" 
            icon={<LockIcon />} 
            iconPosition="start"
          />
        </Tabs>

        <CardContent>
          {/* User Information Tab */}
          <TabPanel value={tabValue} index={0}>
            {showAlert && (
              <Alert 
                severity="error" 
                style={{ marginBottom: '1rem' }}
                onClose={() => setShowAlert(false)}
              >
                Vui lòng điền đầy đủ thông tin bắt buộc
              </Alert>
            )}

            <StyledTextField
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={editing ? formData.fullName : user?.fullName}
              onChange={editing ? handleInputChange : null}
              disabled={!editing}
            />

            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={editing ? formData.email : user?.email}
              onChange={editing ? handleInputChange : null}
              disabled={!editing}
            />

            <StyledTextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={editing ? formData.phoneNumber : user?.phoneNumber}
              onChange={editing ? handleInputChange : null}
              disabled={!editing}
            />

            {/* Addresses Section */}
            <div style={{ marginTop: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
                <Typography variant="h6" color="primary">Địa chỉ</Typography>
                {editing && (
                  <AnimatedButton
                    startIcon={<AddCircleIcon />}
                    onClick={handleAddAddress}
                    variant="outlined"
                    size="small"
                  >
                    Thêm địa chỉ
                  </AnimatedButton>
                )}
              </div>

              {formData.addresses.map((address, index) => (
                <div key={address.addressId} style={{ position: 'relative', marginBottom: '1rem' }}>
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
                  />
                  {editing && (
                    <IconButton
                      size="small"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#f44336',
                      }}
                      onClick={() => handleRemoveAddress(address.addressId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
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
          </TabPanel>

          {/* Account Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AnimatedButton
                variant="contained"
                startIcon={<LockIcon />}
                onClick={() => setChangePasswordDialogOpen(true)}
              >
                Đổi mật khẩu
              </AnimatedButton>
              
              <AnimatedButton
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Xóa tài khoản
              </AnimatedButton>
            </Box>
          </TabPanel>
        </CardContent>
      </StyledCard>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialogOpen} onClose={() => setChangePasswordDialogOpen(false)}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            margin="dense"
            name="currentPassword"
            label="Mật khẩu hiện tại"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <StyledTextField
            margin="dense"
            name="newPassword"
            label="Mật khẩu mới"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <StyledTextField
            margin="dense"
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
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

export default UserProfile;