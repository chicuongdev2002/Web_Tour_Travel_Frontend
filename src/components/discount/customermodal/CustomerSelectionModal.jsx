import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Modal,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";

const ITEMS_PER_PAGE = 5;

const CustomerSelectionModal = ({ discountIds, open, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [sentEmails, setSentEmails] = useState(() => {
    const savedEmails = localStorage.getItem("sentEmails");
    return savedEmails ? JSON.parse(savedEmails) : [];
  });
  const [showSentOnly, setShowSentOnly] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setSnackbarMessage("Không thể tải danh sách khách hàng");
        setSnackbarOpen(true);
      }
    };

    if (open) {
      fetchCustomers();
    }
  }, [open]);

  const handleCustomerSelect = (email) => {
    setSelectedCustomers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const handleSendDiscountCode = async () => {
    if (selectedCustomers.length === 0) {
      setSnackbarMessage("Vui lòng chọn ít nhất một khách hàng");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      console.log(discountIds);
      const response = await axios.post(
        "http://localhost:8080/api/discounts/send-discount-code",
        {
          emails: selectedCustomers,
          discountIds: discountIds,
        },
      );

      const newSentEmails = [...new Set([...sentEmails, ...selectedCustomers])];
      setSentEmails(newSentEmails);
      localStorage.setItem("sentEmails", JSON.stringify(newSentEmails));

      setSnackbarMessage(response.data);
      setSnackbarOpen(true);
      onClose();
      setSelectedCustomers([]);
    } catch (error) {
      console.error("Error sending discount code:", error);
      setSnackbarMessage("Gửi mã khuyến mãi thất bại");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const filteredCustomers = roleFilter
    ? customers.filter((customer) => customer.accountRole === roleFilter)
    : customers;

  const displayedCustomers = showSentOnly
    ? filteredCustomers.filter((customer) =>
        sentEmails.includes(customer.email),
      )
    : filteredCustomers;

  const totalPages = Math.ceil(displayedCustomers.length / ITEMS_PER_PAGE);
  const currentCustomers = displayedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600, // Tăng độ rộng
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "80vh",
    overflowY: "auto",
    border: "1px solid #ccc", // Thêm đường viền
    backgroundColor: "#f9f9f9", // Màu nền nhẹ
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        disableEscapeKeyDown
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h5" gutterBottom align="center">
            Chọn Khách Hàng
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Tất cả vai trò</em>
              </MenuItem>
              <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
              <MenuItem value="CUSTOMERVIP">CUSTOMERVIP</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={showSentOnly}
                onChange={(e) => setShowSentOnly(e.target.checked)}
              />
            }
            label="Chỉ hiển thị khách hàng đã nhận mã"
          />

          <List>
            {currentCustomers.map((customer) => (
              <ListItem
                key={customer.email}
                sx={{
                  bgcolor:
                    customer.accountRole === "CUSTOMERVIP"
                      ? "#fff3cd"
                      : "inherit",
                  borderRadius: 1,
                  padding: "10px",
                  margin: "5px 0",
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <Checkbox
                  checked={selectedCustomers.includes(customer.email)}
                  onChange={() => handleCustomerSelect(customer.email)}
                />
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {customer.accountRole === "CUSTOMERVIP" && (
                        <StarIcon sx={{ color: "gold", mr: 1 }} />
                      )}
                      <Typography variant="body1">
                        {customer.fullName}{" "}
                        {sentEmails.includes(customer.email) && "(Đã nhận mã)"}
                      </Typography>
                    </Box>
                  }
                  secondary={customer.email}
                />
              </ListItem>
            ))}
          </List>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          )}

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button onClick={onClose} variant="outlined" sx={{ flex: 1 }}>
              Hủy
            </Button>
            <Button
              onClick={handleSendDiscountCode}
              variant="contained"
              disabled={loading || selectedCustomers.length === 0}
              sx={{ flex: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : "Gửi Mã Khuyến Mãi"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default CustomerSelectionModal;
