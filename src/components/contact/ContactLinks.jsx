// components/ContactLinks.js
import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Phone as PhoneIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";

const ContactLinks = () => {
  const handlePhoneClick = () => {
    window.open("tel:+84367483370", "_self"); // Thay đổi số điện thoại theo ý bạn
  };

  const handleFacebookClick = () => {
    window.open("https://facebook.com", "_blank"); // Thay đổi link Facebook theo ý bạn
  };

  const handleZaloClick = () => {
    window.open("https://zalo.me/0367483370", "_blank"); // Thay đổi link Zalo theo ý bạn
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 12, md: 16 }, // Đặt vị trí dưới màn hình cho mobile
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Gọi ngay">
        <IconButton
          onClick={handlePhoneClick}
          color="primary"
          sx={{
            backgroundColor: "white",
            borderRadius: "50%", // Đổi thành hình tròn
            boxShadow: 2,
            width: 56,
            height: 56,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          <PhoneIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Liên hệ Facebook">
        <IconButton
          onClick={handleFacebookClick}
          color="primary"
          sx={{
            backgroundColor: "white",
            borderRadius: "50%", // Đổi thành hình tròn
            boxShadow: 2,
            width: 56,
            height: 56,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          <FacebookIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Liên hệ Zalo">
        <IconButton
          onClick={handleZaloClick}
          color="primary"
          sx={{
            backgroundColor: "white",
            borderRadius: "50%", // Đổi thành hình tròn
            boxShadow: 2,
            width: 56,
            height: 56,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ContactLinks;
