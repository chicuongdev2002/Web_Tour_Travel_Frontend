import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import "./DiscountManament.css";
import CustomerSelectionModal from "./customermodal/CustomerSelectionModal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SuccessPopup from "../popupNotifications/SuccessPopup";
import FailPopup from "../popupNotifications/FailPopup";
const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [tours, setTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [tourFilter, setTourFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparedDiscounts, setComparedDiscounts] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    open: false,
    message: "",
  });
  const [failPopup, setFailPopup] = useState({ open: false, message: "" });
  const [activeDiscounts, setSelectedActiveDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    tourId: "",
    discountAmount: "",
    startDate: "",
    endDate: "",
    countUse: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchDiscounts();
    fetchTours();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/discounts");
      if (!response.ok) throw new Error("Không thể tải giảm giá");
      const data = await response.json();
      setDiscounts(data);
    } catch (err) {
      setFailPopup({
        open: true,
        message: "Không thể tại giảm giá vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/tours/simple");
      if (!response.ok) throw new Error("Không thể tải tour");
      const data = await response.json();
      setTours(data);
    } catch (err) {
      setFailPopup({
        open: true,
        message: "Không thể tại tour vui lòng thử lại",
      });
    }
  };
  const getDiscountStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { text: "Chưa bắt đầu", class: "status-upcoming" };
    } else if (now > end) {
      return { text: "Đã kết thúc", class: "status-expired" };
    } else {
      return { text: "Đang diễn ra", class: "status-active" };
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!formData.tourId) errors.tourId = "Tour là bắt buộc";
    if (!formData.discountAmount)
      errors.discountAmount = "Số tiền giảm giá là bắt buộc";
    if (formData.discountAmount <= 0 || formData.discountAmount > 100) {
      errors.discountAmount = "Giảm giá phải từ 1 đến 100";
    }
    if (!formData.startDate) errors.startDate = "Ngày bắt đầu là bắt buộc";
    if (!formData.endDate) errors.endDate = "Ngày kết thúc là bắt buộc";
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (!formData.countUse) errors.countUse = "Giới hạn sử dụng là bắt buộc";
    if (formData.countUse <= 0)
      errors.countUse = "Giới hạn sử dụng phải lớn hơn 0";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleCheckboxChange = (id) => {
    setSelectedDiscounts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((discountId) => discountId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const url = isEditMode
        ? `http://localhost:8080/api/discounts/${selectedDiscount.id}`
        : "http://localhost:8080/api/discounts";

      const dataToSubmit = {
        tourId: Number(formData.tourId),
        discountAmount: formData.discountAmount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        countUse: formData.countUse,
        discountCode: selectedDiscount?.discountCode,
      };
      console.log(dataToSubmit);
      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) throw new Error("Không thể lưu giảm giá");

      // showAlert(isEditMode ? 'Cập nhật giảm giá thành công' : 'Tạo giảm giá mới thành công', 'success');
      setSuccessPopup({
        open: true,
        message: isEditMode
          ? "Cập nhật giảm giá thành công!"
          : "Tạo giảm giá mới thành công!",
      });
      fetchDiscounts();
      closeModal();
    } catch (err) {
      setFailPopup({
        open: true,
        message: isEditMode
          ? "Cập nhật giảm giá thất bại"
          : "Tạo giảm giá thất bại",
      });
    } finally {
      setLoading(false);
    }
  };
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedDiscounts([]);
    } else {
      setSelectedDiscounts(discounts.map((discount) => discount.id));
    }
    setSelectAll(!selectAll);
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      for (const id of selectedDiscounts) {
        const response = await fetch(
          `http://localhost:8080/api/discounts/${id}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) throw new Error("Không thể xóa giảm giá");
      }

      setSuccessPopup({
        open: true,
        message: "Xóa giảm giá thành công!",
      });
      fetchDiscounts();
      setIsDeleteModalOpen(false);
      setSelectedDiscounts([]);
    } catch (err) {
      setFailPopup({
        open: true,
        message: "Xóa giảm giá thành công!",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (discount) => {
    setSelectedDiscount(discount);
    setFormData({
      tourId: discount.tourId.toString(),
      discountAmount: discount.discountAmount.toString(),
      startDate: formatDateForInput(discount.startDate),
      endDate: formatDateForInput(discount.endDate),
      countUse: discount.countUse.toString(),
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const openCustomerModal = () => {
    const activeDiscounts = selectedDiscounts.filter((id) => {
      const discount = discounts.find((d) => d.id === id);
      return discount && new Date() <= new Date(discount.endDate);
    });

    if (
      activeDiscounts.length > 0 &&
      activeDiscounts.length === selectedDiscounts.length
    ) {
      setIsCustomerModalOpen(true);
      setSelectedActiveDiscounts(activeDiscounts);
    } else {
      setFailPopup({
        open: true,
        message: "Không thể gửi mã khuyến mãi cho giảm giá đã kết thúc!",
      });
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      tourId: "",
      discountAmount: "",
      startDate: "",
      endDate: "",
      countUse: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setSelectedDiscount(null);
  };
  const openCompareModal = () => {
    if (selectedDiscounts.length === 2) {
      const discountsToCompare = discounts.filter((discount) =>
        selectedDiscounts.includes(discount.id),
      );
      setComparedDiscounts(discountsToCompare);
      setIsCompareModalOpen(true);
    } else {
      setFailPopup({
        open: true,
        message: "Vui lòng chọn 2 giảm giá để so sánh!",
      });
    }
  };
  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
    setTimeout(
      () => setAlert({ open: false, message: "", severity: "" }),
      5000,
    );
  };

  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const formatDateForDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredDiscounts = discounts.filter((discount) => {
    const matchesCode = discount.discountCode
      ? discount.discountCode.toLowerCase().includes(filter.toLowerCase())
      : false;
    const matchesTour = tourFilter ? discount.tourId === tourFilter : true;
    const matchesAmount = amountFilter
      ? discount.discountAmount >= Number(amountFilter)
      : true;

    return matchesCode && matchesTour && matchesAmount;
  });

  const indexOfLastDiscount = currentPage * itemsPerPage;
  const indexOfFirstDiscount = indexOfLastDiscount - itemsPerPage;
  const currentDiscounts = filteredDiscounts.slice(
    indexOfFirstDiscount,
    indexOfLastDiscount,
  );
  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  return (
    <div className="discount-management">
      <Typography variant="h4" component="h1">
        Quản Lý Giảm Giá
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
      >
        <AddIcon /> Thêm Giảm Giá Mới
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={selectedDiscounts.length === 0}
      >
        <DeleteIcon /> Xóa
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          if (selectedDiscounts.length === 1) {
            openEditModal(discounts.find((d) => d.id === selectedDiscounts[0]));
          }
        }}
        disabled={selectedDiscounts.length !== 1}
      >
        <EditIcon /> Chỉnh Sửa
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={openCustomerModal}
        disabled={selectedDiscounts.length === 0}
      >
        <SendIcon /> Gửi Mã Khuyến Mãi
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={openCompareModal}
        disabled={selectedDiscounts.length < 2}
      >
        <CompareArrowsIcon /> So Sánh
      </Button>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <div className="filter">
        <TextField
          label="Tìm kiếm theo mã giảm giá"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <FormControl variant="outlined">
          <InputLabel>Chọn tour</InputLabel>
          <Select
            value={tourFilter}
            onChange={(e) => setTourFilter(e.target.value)}
            label="Chọn tour"
          >
            <MenuItem value="">
              <em>Chọn tour</em>
            </MenuItem>
            {tours.map((tour) => (
              <MenuItem key={tour.id} value={tour.id}>
                {tour.tourName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Chọn mức giảm giá</InputLabel>
          <Select
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
            label="Chọn mức giảm giá"
          >
            <MenuItem value="">
              <em>Chọn mức giảm giá</em>
            </MenuItem>
            <MenuItem value="0">0%</MenuItem>
            <MenuItem value="10">10%</MenuItem>
            <MenuItem value="20">20%</MenuItem>
            <MenuItem value="30">30%</MenuItem>
            <MenuItem value="40">40%</MenuItem>
            <MenuItem value="50">50%</MenuItem>
            <MenuItem value="100">100%</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer className="table-container">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox checked={selectAll} onChange={toggleSelectAll} />
              </TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Tour</TableCell>
              <TableCell>Giảm Giá</TableCell>
              <TableCell>Thời Gian</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Giới Hạn Sử Dụng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              currentDiscounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDiscounts.includes(discount.id)}
                      onChange={() => handleCheckboxChange(discount.id)}
                    />
                  </TableCell>
                  <TableCell>{discount.discountCode}</TableCell>
                  <TableCell>{discount.tourName}</TableCell>
                  <TableCell>{discount.discountAmount}%</TableCell>
                  <TableCell>
                    <div className="date-range">
                      <div>Từ: {formatDateForDisplay(discount.startDate)}</div>
                      <div>Đến: {formatDateForDisplay(discount.endDate)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`status-badge ${getDiscountStatus(discount.startDate, discount.endDate).class}`}
                    >
                      {
                        getDiscountStatus(discount.startDate, discount.endDate)
                          .text
                      }
                    </span>
                  </TableCell>
                  <TableCell>{discount.countUse}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        variant="outlined"
        shape="rounded"
      />

      {/* Modal for Add/Edit */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <div className="modal-content">
          <Typography variant="h6">
            {isEditMode ? "Chỉnh Sửa Giảm Giá" : "Thêm Giảm Giá Mới"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="body1">
              Mã Giảm Giá: {selectedDiscount?.discountCode}
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tour</InputLabel>
              <Select
                value={formData.tourId}
                onChange={(e) =>
                  setFormData({ ...formData, tourId: e.target.value })
                }
                error={!!formErrors.tourId}
              >
                <MenuItem value="">
                  <em>Chọn một tour</em>
                </MenuItem>
                {tours.map((tour) => (
                  <MenuItem key={tour.id} value={tour.id}>
                    {tour.tourName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.tourId && (
                <span className="error-message">{formErrors.tourId}</span>
              )}
            </FormControl>
            <TextField
              label="Số Tiền Giảm Giá (%)"
              type="number"
              value={formData.discountAmount}
              onChange={(e) =>
                setFormData({ ...formData, discountAmount: e.target.value })
              }
              error={!!formErrors.discountAmount}
              fullWidth
              margin="normal"
            />
            {formErrors.discountAmount && (
              <span className="error-message">{formErrors.discountAmount}</span>
            )}

            <div className="form-row">
              <TextField
                label="Ngày Bắt Đầu"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                error={!!formErrors.startDate}
                fullWidth
                margin="normal"
              />
              {formErrors.startDate && (
                <span className="error-message">{formErrors.startDate}</span>
              )}

              <TextField
                label="Ngày Kết Thúc"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                error={!!formErrors.endDate}
                fullWidth
                margin="normal"
              />
              {formErrors.endDate && (
                <span className="error-message">{formErrors.endDate}</span>
              )}
            </div>

            <TextField
              label="Giới Hạn Sử Dụng"
              type="number"
              value={formData.countUse}
              onChange={(e) =>
                setFormData({ ...formData, countUse: e.target.value })
              }
              error={!!formErrors.countUse}
              fullWidth
              margin="normal"
            />
            {formErrors.countUse && (
              <span className="error-message">{formErrors.countUse}</span>
            )}
            <div className="modal-footer">
              <Button variant="outlined" color="secondary" onClick={closeModal}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : isEditMode ? "Cập Nhật" : "Tạo"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="modal-content">
          <Typography variant="h6">Xác Nhận Xóa</Typography>
          <Typography>
            Bạn có chắc chắn muốn xóa giảm giá này không? Hành động này không
            thể hoàn tác.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </Modal>
      <Modal
        open={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      >
        <div className="modal-content">
          <Typography variant="h6">So Sánh Giảm Giá</Typography>
          {comparedDiscounts.map((discount) => (
            <div key={discount.id} className="compare-item">
              <Typography variant="body1">
                <strong>Mã Giảm Giá:</strong> {discount.discountCode}
              </Typography>
              <Typography variant="body1">
                <strong>Tour:</strong> {discount.tourName}
              </Typography>
              <Typography variant="body1">
                <strong>Giảm Giá:</strong> {discount.discountAmount}%
              </Typography>
              <Typography variant="body1">
                <strong>Thời Gian:</strong> Từ{" "}
                {formatDateForDisplay(discount.startDate)} đến{" "}
                {formatDateForDisplay(discount.endDate)}
              </Typography>
              <Typography variant="body1">
                <strong>Giới Hạn Sử Dụng:</strong> {discount.countUse}
              </Typography>
              <hr />
            </div>
          ))}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsCompareModalOpen(false)}
          >
            Đóng
          </Button>
        </div>
      </Modal>
      <CustomerSelectionModal
        discountIds={activeDiscounts}
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
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

export default DiscountManagement;
