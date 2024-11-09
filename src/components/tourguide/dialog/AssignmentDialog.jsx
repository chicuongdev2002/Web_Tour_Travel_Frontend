import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip,
  TablePagination,
  Tooltip,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Cancel,
  Warning as WarningIcon,
  PlayCircle as OngoingIcon,
} from "@mui/icons-material";
import KpiDialog from "../dialog/KpiDialog";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentIcon from "@mui/icons-material/Assignment";

const AssignmentDialog = ({ open, onClose, userId, onDataUpdated }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [kpiData, setKpiData] = useState(null);
  const [openKpiModal, setOpenKpiModal] = useState(false);

  const fetchAssignments = async () => {
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/tour-guides/${userId}/assignments`,
        );
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError("Không thể tải phân công. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [userId, onDataUpdated]);

  const fetchKPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/tour-guides/${userId}/kpi`,
      );
      const data = await response.json();
      setKpiData(data);
      setLoading(false);
      setOpenKpiModal(true);
    } catch (err) {
      // Handle error
    }
  };

  const checkTourStatus = (startDate, endDate, assignmentDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if tour is ongoing
    if (start <= currentDate && end >= currentDate) {
      return "ongoing";
    }

    // Check if tour is starting tomorrow
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    if (start.toDateString() === tomorrow.toDateString()) {
      return "upcoming";
    }

    return "normal";
  };

  const getStatusChip = (status, startDate, endDate, assignmentDate) => {
    const tourStatus = checkTourStatus(startDate, endDate, assignmentDate);

    // Chú thích cho tour đang diễn ra
    if (tourStatus === "ongoing") {
      return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Chip
            icon={<OngoingIcon />}
            label="Tour đang diễn ra"
            color="info"
            size="small"
          />
        </div>
      );
    }

    if (tourStatus === "upcoming") {
      return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Tooltip title="Tour sẽ diễn ra trong 1 ngày">
            <Chip
              icon={<WarningIcon />}
              label="Sắp đến hạn"
              color="warning"
              size="small"
            />
          </Tooltip>
        </div>
      );
    }

    // Nếu không có trạng thái đặc biệt, chỉ cần trả về trạng thái phân công
    return getAssignmentStatusChip(status);
  };

  const getAssignmentStatusChip = (status) => {
    const statusConfig = {
      TODO: {
        label: "Đang chờ phê duyệt",
        color: "warning",
        icon: <AccessTime />,
      },
      ACCEPT: { label: "Đã đồng ý", color: "success", icon: <CheckCircle /> },
      REJECT: { label: "Đã từ chối", color: "error", icon: <Cancel /> },
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

  const handleReassign = async (departureId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tour-guides/${userId}/assignments/${departureId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "TODO" }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reassign assignment");
      }

      await fetchAssignments();
    } catch (error) {
      setError("Không thể phân công lại. Vui lòng thử lại sau.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Danh sách phân công
        <Button
          variant="contained"
          color="primary"
          onClick={fetchKPI}
          sx={{ mt: 2 }}
          startIcon={<AssessmentIcon />}
        >
          Xem KPI
        </Button>
      </DialogTitle>
      <DialogContent>
        <TableContainer className="table-container">
          <Table className="table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Tên Tour
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Ngày bắt đầu
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Ngày kết thúc
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Ngày phân công
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Số lượng tối đa
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Chỗ còn trống
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((assignment) => {
                  const tourStatus = checkTourStatus(
                    assignment.startDate,
                    assignment.endDate,
                    assignment.assignmentDate,
                  );

                  return (
                    <TableRow
                      key={assignment.departureId}
                      sx={{
                        backgroundColor:
                          tourStatus === "ongoing"
                            ? "rgba(25, 118, 210, 0.08)"
                            : "inherit",
                        textDecoration:
                          tourStatus === "ongoing" ? "line-through" : "none", // Gạch dòng nếu tour đang diễn ra
                        "&:hover": {
                          backgroundColor:
                            tourStatus === "ongoing"
                              ? "rgba(25, 118, 210, 0.12)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell>{assignment.tourName}</TableCell>
                      <TableCell>{assignment.startDate}</TableCell>
                      <TableCell>{assignment.endDate}</TableCell>
                      <TableCell>
                        {getStatusChip(
                          assignment.status,
                          assignment.startDate,
                          assignment.endDate,
                          assignment.assignmentDate,
                        )}
                      </TableCell>
                      <TableCell>{assignment.assignmentDate}</TableCell>
                      <TableCell>{assignment.maxParticipants}</TableCell>
                      <TableCell>{assignment.availableSeats}</TableCell>
                      <TableCell>
                        {/* Ẩn nút "Phân công lại" nếu tour đang diễn ra */}
                        {tourStatus !== "ongoing" &&
                          assignment.status === "REJECT" && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                handleReassign(assignment.departureId)
                              }
                              startIcon={<AssignmentIcon />}
                              size="small"
                              sx={{ padding: "2px 4px" }}
                            >
                              Phân công lại
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={assignments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
      <KpiDialog
        open={openKpiModal}
        onClose={() => setOpenKpiModal(false)}
        kpiData={kpiData}
      />
    </Dialog>
  );
};

export default AssignmentDialog;
