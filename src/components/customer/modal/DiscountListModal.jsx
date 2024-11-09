import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LocalOffer as TagIcon,
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const DiscountListModal = ({
  open,
  onClose,
  discounts = [],
  onSendDiscount,
}) => {
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const currentDate = new Date();
  const theme = useTheme();

  const handleToggle = (code) => {
    setSelectedDiscounts((prevSelected) =>
      prevSelected.includes(code)
        ? prevSelected.filter((c) => c !== code)
        : [...prevSelected, code],
    );
  };

  const handleSend = () => {
    if (selectedDiscounts.length > 0) {
      onSendDiscount(selectedDiscounts);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TagIcon />
            <Typography variant="h6">Danh Sách Mã Khuyến Mãi</Typography>
          </Stack>
          <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            maxHeight: "calc(90vh - 180px)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.primary.main,
              borderRadius: "8px",
            },
          }}
        >
          <Stack spacing={2}>
            {discounts.length > 0 ? (
              discounts.map((discount) => {
                const isExpired = new Date(discount.endDate) < currentDate;
                const isSelected = selectedDiscounts.includes(
                  discount.discountCode,
                );

                return (
                  <Paper
                    key={discount.id}
                    elevation={isSelected ? 4 : 1}
                    sx={{
                      p: 2,
                      cursor: isExpired ? "default" : "pointer",
                      transition: "all 0.2s ease-in-out",
                      borderLeft: 6,
                      borderColor: isSelected
                        ? theme.palette.primary.main
                        : "transparent",
                      backgroundColor: isExpired
                        ? alpha(theme.palette.grey[500], 0.1)
                        : isSelected
                          ? alpha(theme.palette.primary.main, 0.05)
                          : "white",
                      "&:hover": {
                        backgroundColor:
                          !isExpired &&
                          !isSelected &&
                          alpha(theme.palette.primary.main, 0.02),
                        transform: !isExpired && "translateY(-2px)",
                      },
                    }}
                    onClick={() =>
                      !isExpired && handleToggle(discount.discountCode)
                    }
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          {isExpired ? (
                            <ErrorIcon color="error" />
                          ) : (
                            <CheckIcon color="success" />
                          )}
                          <Typography
                            variant="h6"
                            sx={{
                              color: isExpired
                                ? theme.palette.text.disabled
                                : "inherit",
                            }}
                          >
                            {discount.discountCode}
                          </Typography>
                        </Stack>
                        <Chip
                          label={isExpired ? "Đã hết hạn" : "Còn hiệu lực"}
                          color={isExpired ? "error" : "success"}
                          size="small"
                          variant={isSelected ? "filled" : "outlined"}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          opacity: isExpired ? 0.7 : 1,
                        }}
                      >
                        Giảm giá {discount.discountAmount}%
                      </Typography>
                    </Stack>
                  </Paper>
                );
              })
            ) : (
              <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                <TagIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography color="text.secondary">
                  Không có mã khuyến mãi nào.
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SendIcon />}
              onClick={handleSend}
              disabled={selectedDiscounts.length === 0}
            >
              Gửi Mã Khuyến Mãi
              {selectedDiscounts.length > 0 && ` (${selectedDiscounts.length})`}
            </Button>
            <Button variant="outlined" fullWidth onClick={onClose}>
              Đóng
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Modal>
  );
};

export default DiscountListModal;
