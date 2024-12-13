import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Typography, 
  Button, 
  Box, 
  Container, 
  IconButton 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CookieIcon from '@mui/icons-material/Cookie';

function CookieConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const cookieConsent = localStorage.getItem('cookie_consent');
    
    // Show dialog if no previous consent
    if (!cookieConsent) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000); // Delay to make entrance feel more natural

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptCookies = () => {
    // Set consent in localStorage with timestamp
    localStorage.setItem('cookie_consent', JSON.stringify({
      status: 'accepted',
      timestamp: new Date().toISOString()
    }));
    
    // Close the dialog
    setOpen(false);

    // Additional tracking or analytics initialization
    console.log('Cookies fully accepted');
  };

  const handleRejectCookies = () => {
    // Set consent as rejected with timestamp
    localStorage.setItem('cookie_consent', JSON.stringify({
      status: 'rejected',
      timestamp: new Date().toISOString()
    }));
    
    // Close the dialog
    setOpen(false);

    console.log('Cookies rejected');
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Container maxWidth="sm">
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 4,
              px: 3
            }}
          >
            <CookieIcon 
              sx={{ 
                fontSize: 80, 
                color: 'primary.main', 
                mb: 2 
              }} 
            />
            
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ fontWeight: 'bold' }}
            >
              Quản lý Cookie
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph
            >
              Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng, phân tích lưu lượng truy cập và cung cấp các dịch vụ được cá nhân hóa. 
              Bạn có thể quản lý tùy chọn cookie của mình bất kỳ lúc nào.
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2, 
                mt: 3 
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelOutlinedIcon />}
                onClick={handleRejectCookies}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1.5
                }}
              >
                Từ chối
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={handleAcceptCookies}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1.5
                }}
              >
                Chấp nhận tất cả
              </Button>
            </Box>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
}

export default CookieConsentBanner;