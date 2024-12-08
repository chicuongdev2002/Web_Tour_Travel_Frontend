import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Fab } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTable from "./table/AssignmentTable";
import AssignmentFilter from "./filter/AssignmentFilter";
import KpiDialog from "./dialog/KpiDialog";
import NavHeader from "../navbar/NavHeader";
const TourGuideAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [assignmentDate, setAssignmentDate] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [openKpiModal, setOpenKpiModal] = useState(false);
  useEffect(() => {
    const userSession = JSON.parse(sessionStorage.getItem("user"));
    setUser(userSession);

    if (userSession?.role === "TOURGUIDE") {
      fetchAssignments(userSession.userId);
    }
  }, []);

  const fetchAssignments = async (guideId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tour-guides/${guideId}/assignments`,
      );
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError("Không thể tải danh sách tour. Vui lòng thử lại sau.");
    }
  };
  const fetchKPI = async (guideId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tour-guides/${guideId}/kpi`,
      );
      const data = await response.json();
      setKpiData(data);
      setOpenKpiModal(true);
    } catch (err) {
      setError("Không thể tải KPI. Vui lòng thử lại sau.");
    }
  };
  const handleOpenKpiModal = () => {
    if (user) {
      fetchKPI(user.userId);
    }
  };
  const handleStatusChange = async (departureId, newStatus) => {
    try {
      await fetch(
        `http://localhost:8080/api/tour-guides/${user.userId}/assignments/${departureId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      fetchAssignments(user.userId);
    } catch (err) {
      setError("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const isExpired = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tourEndDate = new Date(endDate);
    tourEndDate.setHours(0, 0, 0, 0);
    return tourEndDate < today;
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      TODO: {
        label: "Chờ phân công",
        color: "warning",
        icon: <AccessTimeIcon />,
      },
      ACCEPT: {
        label: "Đã đồng ý",
        color: "success",
        icon: <CheckCircleIcon />,
      },
      REJECT: { label: "Đã từ chối", color: "error", icon: <CancelIcon /> },
    };

    const config = statusConfig[status] || { label: status, color: "default" };

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.tourName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || assignment.status === statusFilter;

    const tourStartDate = new Date(assignment.startDate);
    const tourEndDate = new Date(assignment.endDate);
    const matchesStartDate = !startDate || tourStartDate >= startDate;
    const matchesEndDate = !endDate || tourEndDate <= endDate;

    const assignmentDateValue = new Date(assignment.assignmentDate);
    const matchesAssignmentDate =
      !assignmentDate ||
      assignmentDateValue.toDateString() === assignmentDate.toDateString();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStartDate &&
      matchesEndDate &&
      matchesAssignmentDate
    );
  });

  if (!user || user.role !== "TOURGUIDE") {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="subtitle1">
          Bạn không có quyền truy cập trang này. Trang này chỉ dành cho hướng
          dẫn viên.
        </Typography>
      </Alert>
    );
  }

  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      {/* <NavHeader textColor="black" /> */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          padding: 2,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, flexShrink: 0 }}>
          Danh sách tour được phân công
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, flexShrink: 0 }}>
            {error}
          </Alert>
        )}
        <AssignmentFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          assignmentDate={assignmentDate}
          setAssignmentDate={setAssignmentDate}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenKpiModal}
        >
          Xem KPI cá nhân
        </Button>
        <AssignmentTable
          assignments={assignments}
          filteredAssignments={filteredAssignments}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          handleStatusChange={handleStatusChange}
          formatDate={formatDate}
          isExpired={isExpired}
          getStatusChip={getStatusChip}
        />
        <KpiDialog
          open={openKpiModal}
          onClose={() => setOpenKpiModal(false)}
          kpiData={kpiData}
        />
      </Box>
    </div>
  );
};

export default TourGuideAssignments;
