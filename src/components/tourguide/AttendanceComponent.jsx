import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { HowToReg as AttendanceIcon } from '@mui/icons-material';
import axios from 'axios';
import { markAttendance } from '../../functions/attendance';

const AttendanceComponent = ({ departureId, userId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Trình duyệt của bạn không hỗ trợ định vị'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=vi`
            );

            const address = response.data.display_name || '40 Lương Ngọc Quyến';
            
            const locationData = {
              address: address,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            };
            
            resolve(locationData);
          } catch (error) {
            resolve({
              address: '40 Lương Ngọc Quyến',
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            });
          }
        },
        (error) => {
          let errorMessage = 'Lỗi khi lấy vị trí';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Bạn đã từ chối quyền truy cập vị trí';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Không thể lấy được vị trí hiện tại';
              break;
            case error.TIMEOUT:
              errorMessage = 'Hết thời gian yêu cầu vị trí';
              break;
            default:
              errorMessage = 'Có lỗi không xác định xảy ra';
          }
          resolve({
            address: '40 Lương Ngọc Quyến',
            coordinates: null
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  const handleAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      const locationData = await getCurrentLocation();
      const result = await markAttendance(userId, departureId, locationData.address);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi điểm danh');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setError(null); 
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AttendanceIcon />}
        onClick={() => setOpen(true)}
        sx={{ borderRadius: 2 }}
      >
        Điểm Danh
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận điểm danh</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Điểm danh thành công!
            </Alert>
          )}
          <div style={{ marginTop: '16px' }}>
            Bạn có chắc chắn muốn điểm danh cho chuyến đi này?
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            onClick={handleAttendance}
            disabled={loading}
            color="primary"
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttendanceComponent;