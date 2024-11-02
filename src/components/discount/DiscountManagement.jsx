import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import './DiscountManament.css';
import SuccessPopup from '../../components/popupNotifications/SuccessPopup';
import FailPopup from '../../components/popupNotifications/FailPopup';
import NavHeader from '../navbar/NavHeader';
const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [tours, setTours] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
 const [failPopupOpen, setFailPopupOpen] = useState(false);
const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    tourId: '',
    discountAmount: '',
    startDate: '',
    endDate: '',
    countUse: '',
  });

  useEffect(() => {
    fetchDiscounts();
    fetchTours();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/discounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tours/simple');
      const data = await response.json();
      console.log(data);
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formattedStartDate = new Date(formData.startDate).toISOString().slice(0, 19);
  const formattedEndDate = new Date(formData.endDate).toISOString().slice(0, 19);
  
  const dataToSend = {
    ...formData,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };

  try {

    if (isEditMode) {
      await fetch(`http://localhost:8080/api/discounts/${selectedDiscount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
    } else {
      await fetch(`http://localhost:8080/api/discounts?tourId=${formData.tourId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
    }
    setMessage('Thêm thành công mã giảm giá');
    setSuccessPopupOpen(true);
    setIsOpen(false);
    resetForm();
    fetchDiscounts();
  } catch (error) {
    console.error('Error saving discount:', error);
    setMessage("Thêm thất bại");
    setFailPopupOpen(true);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảm giá này không?')) {
      try {
        await fetch(`http://localhost:8080/api/discounts/${id}`, { method: 'DELETE' });
        fetchDiscounts();
      } catch (error) {
        console.error('Error deleting discount:', error);
      }
    }
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setFormData({
      tourId: discount.tourId.toString(),
      discountAmount: discount.discountAmount.toString(),
      startDate: formatDateForInput(discount.startDate),
      endDate: formatDateForInput(discount.endDate),
      countUse: discount.countUse.toString(),
    });
    setIsEditMode(true);
    setIsOpen(true);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateForDisplay = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const resetForm = () => {
    setFormData({
      tourId: '',
      discountAmount: '',
      startDate: '',
      endDate: '',
      countUse: '',
    });
    setIsEditMode(false);
    setSelectedDiscount(null);
  };

  return (
    <div className="p-4">
     <NavHeader textColor="black"/>
      <Card>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Quản Lý Giảm Giá</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }}
            startIcon={<PlusCircle className="w-4 h-4" />}
          >
            Thêm Giảm Giá Mới
          </Button>
        </div>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <DialogTitle>{isEditMode ? 'Chỉnh Sửa Giảm Giá' : 'Tạo Giảm Giá Mới'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label>Tour</label>
                <Select
                  value={formData.tourId}
                  onChange={(e) => setFormData({ ...formData, tourId: e.target.value })}
                  fullWidth
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
              </div>

              <div className="space-y-2">
                <label>Số Tiền Giảm Giá</label>
                <Input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                  placeholder="Nhập số tiền giảm giá"
                  fullWidth
                />
              </div>

              <div className="space-y-2">
                <label>Ngày Bắt Đầu</label>
                <Input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  fullWidth
                />
              </div>

              <div className="space-y-2">
                <label>Ngày Kết Thúc</label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  fullWidth
                />
              </div>

              <div className="space-y-2">
                <label>Giới Hạn Sử Dụng</label>
                <Input
                  type="number"
                  value={formData.countUse}
                  onChange={(e) => setFormData({ ...formData, countUse: e.target.value })}
                  placeholder="Nhập giới hạn sử dụng"
                  fullWidth
                />
              </div>

              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEditMode ? 'Cập Nhật' : 'Tạo'} Giảm Giá
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="p-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Giảm Giá</TableCell>
                <TableCell>Tour</TableCell>
                <TableCell>Số Tiền</TableCell>
                <TableCell>Ngày Bắt Đầu</TableCell>
                <TableCell>Ngày Kết Thúc</TableCell>
                <TableCell>Giới Hạn Sử Dụng</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount.discountCode}</TableCell>
                  <TableCell>{discount.tourName}</TableCell>
                  <TableCell>{discount.discountAmount}%</TableCell>
                  <TableCell>{formatDateForDisplay(discount.startDate)}</TableCell>
                  <TableCell>{formatDateForDisplay(discount.endDate)}</TableCell>
                  <TableCell>{discount.countUse}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(discount)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDelete(discount.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
        <SuccessPopup
                message={message}
                open={successPopupOpen}
                onClose={() => setSuccessPopupOpen(false)}
                onClick={() => setSuccessPopupOpen(false)}
            />

        <FailPopup
                message={message}
                open={failPopupOpen}
                onClose={() => setFailPopupOpen(false)}
                onClick={() => setFailPopupOpen(false)}
            />
    </div>
  );
};

export default DiscountManagement;