import React, { useState, useEffect, useCallback } from 'react';
import QrReader from 'react-qr-scanner';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography, 
  Container, 
  Paper, 
  Box, 
  Snackbar, 
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Grid
} from '@mui/material';
import { 
  QrCodeScanner as QrCodeIcon, 
  Close as CloseIcon, 
  CheckCircle as SuccessIcon, 
  Error as ErrorIcon,
  LocalActivity as TicketIcon,
  BlurOn as ScannerIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function CheckInApp() {
  const [showCamera, setShowCamera] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const SOCKET_URL = 'http://localhost:8080/ws';

  const initializeStompClient = useCallback(() => {
    const socket = new SockJS(SOCKET_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('STOMP Client Connected');
        setConnectionStatus('connected');
        client.subscribe('/checkin/response', (message) => {
          const response = JSON.parse(message.body);
          handleCheckInResponse(response);
          console.log('Check-in Response:', response);  
        });
        console.log('STOMP Client Subscribed to /checkin/response');
        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error('Broker connection error:', frame);
        setConnectionStatus('error');
        setCheckInStatus({
          status: 'error',
          message: 'Lỗi kết nối. Đang thử kết nối lại...'
        });
      },
      onDisconnect: () => {
        console.log('STOMP Client Disconnected');
        setConnectionStatus('disconnected');
        initializeStompClient();
      }
    });

    client.activate();
    return client;
  }, []);

  useEffect(() => {
    const client = initializeStompClient();
    
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [initializeStompClient]);

  const handleCheckInResponse = (response) => {
    if (response.status === 'SUCCESS') {
      setCheckInStatus({
        status: 'success',
        message: 'Check-in thành công!',
        booking: response.booking
      });
      setShowCamera(false);
    } else {
      setCheckInStatus({
        status: 'error',
        message: response.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
      });
    }

    setIsProcessing(false);
  };

 const handleQrCodeScan = useCallback((result) => {
  // Log toàn bộ thông tin để debug
  console.log('Raw Scan Result:', result);

  // Kiểm tra kỹ hơn về dữ liệu quét
  if (result && result.text) {
    const scannedText = result.text.trim();
    
    // Kiểm tra tính hợp lệ của mã QR (nếu cần)
    if (scannedText && scannedText.length > 0) {
      // Đảm bảo không trong quá trình xử lý
      if (!isProcessing) {
        // Kiểm tra kết nối socket
        if (stompClient && stompClient.active) {
          try {
            // Log mã QR để kiểm tra
            console.log('Attempting to publish QR code:', scannedText);
            stompClient.publish({ 
              destination: "/app/checkin", 
              body: scannedText 
            });
            
            // Đánh dấu đang xử lý để tránh quét trùng
            setIsProcessing(true);
          } catch (error) {
            console.error('Publish Error:', error);
            setCheckInStatus({
              status: 'error',
              message: 'Lỗi kết nối. Vui lòng thử lại.'
            });
            setIsProcessing(false);
          }
        } else {
          console.warn('STOMP Client not ready');
          setCheckInStatus({
            status: 'error',
            message: 'Kết nối máy chủ chưa sẵn sàng.'
          });
        }
      } else {
        console.warn('Already processing');
      }
    }
  }
}, [stompClient, isProcessing]);

  const qrReaderPreview = {
    width: '100%',
    height: 'auto',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const qrReaderConstraints = {
    video: {
      facingMode: 'environment'
    }
  };

  const connectionStatusIndicator = {
    connecting: { color: 'warning', text: 'Đang kết nối' },
    connected: { color: 'success', text: 'Đã kết nối' },
    disconnected: { color: 'error', text: 'Mất kết nối' },
    error: { color: 'error', text: 'Lỗi kết nối' }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)',
        py: 4
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={6} 
            sx={{ 
              width: '100%', 
              borderRadius: 4, 
              overflow: 'hidden',
              background: 'white',
              maxWidth: 500
            }}
          >
            <Box sx={{ 
              background: 'linear-gradient(to right, #1976d2, #4791db)', 
              color: 'white', 
              p: 2, 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                <TicketIcon sx={{ mr: 2 }} /> Check-in Tour
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: 'white',
                  p: 1,
                  borderRadius: 2,
                  background: `${connectionStatusIndicator[connectionStatus].color === 'success' ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.2)'}`
                }}
              >
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {connectionStatusIndicator[connectionStatus].text}
                </Typography>
                <CircularProgress 
                  color={connectionStatusIndicator[connectionStatus].color} 
                  size={20} 
                  thickness={5}
                />
              </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      startIcon={showCamera ? <CloseIcon /> : <QrCodeIcon />}
                      onClick={() => setShowCamera(!showCamera)}
                      sx={{ 
                        mb: 2, 
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(to right, #1976d2, #4791db)',
                        '&:hover': { 
                          background: 'linear-gradient(to right, #4791db, #1976d2)' 
                        }
                      }}
                    >
                      {showCamera ? 'Đóng Camera' : 'Quét Mã QR'}
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>

              <Dialog 
                open={showCamera} 
                onClose={() => setShowCamera(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                  sx: {
                    borderRadius: 4
                  }
                }}
              >
                <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ScannerIcon sx={{ mr: 2, color: 'primary.main' }} />
                    Quét Mã QR
                  </Typography>
                </DialogTitle>
                <DialogContent sx={{ position: 'relative', p: 0 }}>
                  <QrReader
                    delay={300}
                    style={qrReaderPreview}
                    constraints={qrReaderConstraints}
                    onError={(error) => console.error('QR Scanner Error:', error)}
                    onScan={(data) => {
                      if (data) {
                        handleQrCodeScan(data);
                      }
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '250px',
                    height: '250px',
                    border: '4px solid #1976d2',
                    borderRadius: 3,
                    pointerEvents: 'none',
                    boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  <Typography 
                    variant="body1" 
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {isProcessing 
                      ? 'Đang xử lý...' 
                      : 'Đưa mã QR vào khung hình để quét'}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button 
                    onClick={() => setShowCamera(false)} 
                    color="secondary"
                    fullWidth
                    sx={{ m: 2, borderRadius: 2 }}
                  >
                    Đóng
                  </Button>
                </DialogActions>
              </Dialog>

              <Snackbar 
            open={!!checkInStatus} 
            autoHideDuration={5000} 
            onClose={() => setCheckInStatus(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              severity={checkInStatus?.status === 'success' ? 'success' : 'error'}
              icon={checkInStatus?.status === 'success' ? <SuccessIcon /> : <ErrorIcon />}
            >
              {checkInStatus?.message}
            </Alert>
          </Snackbar>

          {checkInStatus?.booking && (
            <Dialog 
              open={!!checkInStatus?.booking} 
              onClose={() => setCheckInStatus(null)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  Chi Tiết Đặt Chỗ
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      <strong>Mã đặt chỗ:</strong> {checkInStatus.booking.bookingId}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Người đặt:</strong> {checkInStatus.booking.user.fullName}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Đại lý:</strong> {checkInStatus.booking.departure.tour.user.fullName}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1">
                      <strong>HDV:</strong> {checkInStatus.booking.tourGuide.fullName}
                    </Typography>
                     <Divider sx={{ my: 1 }} />
                    <Typography variant="body1">
                      <strong>Ngày bắt đầu:</strong> {checkInStatus.booking.departure.startDate}
                    </Typography>
                     <Divider sx={{ my: 1 }} />
                    <Typography variant="body1">
                      <strong>Ngày kết thúc:</strong> {checkInStatus.booking.departure.endDate}
                    </Typography>
                  </CardContent>
                </Card>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setCheckInStatus(null)} 
                  color="primary" 
                  fullWidth
                  sx={{ m: 2 }}
                >
                  Đóng
                </Button>
              </DialogActions>
            </Dialog>
          )}
            </CardContent>
          </Paper>
        </motion.div>
      </AnimatePresence>

      {/* Thêm hiệu ứng và trạng thái kết nối */}
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </Container>
  );
}

export default CheckInApp;