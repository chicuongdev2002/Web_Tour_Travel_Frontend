import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import CustomerTable from "./table/CustomerTable";
import CustomerModal from "./modal/CustomerModal";
import AlertSnackbar from "./snack/AlertSnackbar";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import DiscountListModal from "./modal/DiscountListModal";
import { CircularProgress } from "@mui/material";
import "./CustomerManagement.css";
import { GET_USER } from "../../config/host";
import { getCustomers, updateCustomer } from "../../functions/customercrud";
import { getDiscount, sendDiscountCode } from "../../functions/discountCrud";
const CustomerManagement = ({ notTitle }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response=await getCustomers();
      console.log(response);
      setCustomers(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải danh sách khách hàng!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedCustomers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const openModal = (customer) => {
    setCurrentCustomer(customer);
    setModalOpen(true);
  };
  const handleOpenDiscountModal = async () => {
    setLoading(true);
    try {
      const response = await getDiscount();
      if(response.success){
      setDiscounts(response.data); 
      setDiscountModalOpen(true);
      }else{
        setAlert({
          open: true,
          message: response.error,
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải danh sách mã khuyến mãi!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSendDiscountCode = async (selectedCodes) => {
    const selectedEmails = customers
      .filter((customer) => selectedCustomers.includes(customer.userId))
      .map((customer) => customer.email);
    const discountIds = selectedCodes
      .map((code) => {
        const discount = discounts.find((d) => d.discountCode === code);
        return discount ? discount.id : null;
      })
      .filter((id) => id !== null);

    try {
      setLoadingSend(true);
      const response = await sendDiscountCode(selectedEmails, discountIds);
      setAlert({
        open: true,
        message: "Gửi mã khuyến mãi thành công!",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Gửi mã khuyến mãi thất bại!",
        severity: "error",
      });
    } finally {
      setLoadingSend(false);
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await updateCustomer(currentCustomer.userId, currentCustomer);
      if (response.success) {
      setAlert({
        open: true,
        message: "Cập nhật thành công!",
        severity: "success",
      });
      fetchCustomers();
      setModalOpen(false);
    }else{
      setAlert({
        open: true,
        message: response.error,
        severity: "error",
      });
    }
    } catch (error) {
      setAlert({
        open: true,
        message: "Cập nhật thất bại!",
        severity: "error",
      });
    }
  };

  return (
    <div className="customer-management">
      {!notTitle && <h1>Quản Lý Khách Hàng</h1>}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                selectedCustomers.length > 0 &&
                openModal(
                  customers.find((c) => selectedCustomers.includes(c.userId)),
                )
              }
              disabled={selectedCustomers.length === 0}
            >
              <EditIcon />
              Cập Nhật
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenDiscountModal}
              disabled={selectedCustomers.length === 0}
              startIcon={
                loadingSend ? <CircularProgress size={20} /> : <SendIcon />
              }
            >
              {loadingSend ? "Đang Gửi..." : "Gửi Mã Khuyến Mãi"}
            </Button>
          </div>
          <CustomerTable
            customers={customers}
            selectedCustomers={selectedCustomers}
            handleCheckboxChange={handleCheckboxChange}
            openModal={openModal}
          />
          <CustomerModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            currentCustomer={currentCustomer}
            setCurrentCustomer={setCurrentCustomer}
            handleUpdate={handleUpdate}
          />
          <AlertSnackbar
            open={alert.open}
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
            message={alert.message}
          />
          <DiscountListModal
            open={discountModalOpen}
            onClose={() => setDiscountModalOpen(false)}
            discounts={discounts}
            onSendDiscount={handleSendDiscountCode}
          />
        </>
      )}
    </div>
  );
};

export default CustomerManagement;
