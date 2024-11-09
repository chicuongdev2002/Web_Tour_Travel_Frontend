import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Stack,
  Button,
  Checkbox,
} from "@mui/material";
import { AccessTime, CheckCircle, Cancel } from "@mui/icons-material";
import SuccessPopup from "../../popupNotifications/SuccessPopup";
import FailPopup from "../../popupNotifications/FailPopup";
import ChoosePopup from "../../popupNotifications/ChoosePopup";
const AssignmentTable = ({
  assignments,
  filteredAssignments,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  handleStatusChange,
  formatDate,
  isExpired,
  getStatusChip,
}) => {
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [successPopup, setSuccessPopup] = useState({
    open: false,
    message: "",
  });
  const [failPopup, setFailPopup] = useState({ open: false, message: "" });
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState(null);
  const handleSelectAll = () => {
    const allValidAssignments = filteredAssignments
      .filter(
        (assignment) =>
          assignment.status === "TODO" && !isExpired(assignment.endDate),
      )
      .map((assignment) => assignment.departureId);

    if (selectedAssignments.length === allValidAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(allValidAssignments);
    }
  };

  const handleStatusChangeForSelected = () => {
    const validAssignments = selectedAssignments.filter((departureId) => {
      const assignment = assignments.find((a) => a.departureId === departureId);
      return (
        assignment &&
        assignment.status === "TODO" &&
        !isExpired(assignment.endDate)
      );
    });

    validAssignments.forEach((departureId) =>
      handleStatusChange(departureId, "ACCEPT"),
    );

    setSuccessPopup({
      open: true,
      message: `Đã đồng ý ${validAssignments.length} phân công.`,
    });

    setSelectedAssignments([]);
  };
  const handleRejectClick = (departureId) => {
    setCurrentRejectId(departureId);
    setRejectPopupOpen(true);
  };

  const handleRejectConfirm = () => {
    if (currentRejectId) {
      handleStatusChange(currentRejectId, "REJECT");
      setSuccessPopup({
        open: true,
        message: "Đã từ chối phân công.",
      });
    }
    setRejectPopupOpen(false);
    setCurrentRejectId(null);
  };

  return (
    <div>
      <TableContainer className="table-container">
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleStatusChangeForSelected}
            disabled={selectedAssignments.every((departureId) => {
              const assignment = assignments.find(
                (a) => a.departureId === departureId,
              );
              return (
                assignment &&
                assignment.status !== "TODO" &&
                !isExpired(assignment.endDate)
              );
            })}
          >
            Đồng ý tất cả
          </Button>
        </Box>
        <Table className="table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#000", width: 50 }}>
                <Checkbox
                  checked={
                    selectedAssignments.length ===
                    filteredAssignments.filter(
                      (a) => a.status === "TODO" && !isExpired(a.endDate),
                    ).length
                  }
                  indeterminate={
                    selectedAssignments.length > 0 &&
                    selectedAssignments.length !==
                      filteredAssignments.filter(
                        (a) => a.status === "TODO" && !isExpired(a.endDate),
                      ).length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 150 }}
              >
                Tên Tour
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 120 }}
              >
                Ngày bắt đầu
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 120 }}
              >
                Ngày kết thúc
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 150 }}
              >
                Số lượng tối đa
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 120 }}
              >
                Chỗ còn trống
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 150 }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 120 }}
              >
                Ngày phân công
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#000", minWidth: 150 }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((assignment) => {
                const expired = isExpired(assignment.endDate);
                const isSelected = selectedAssignments.includes(
                  assignment.departureId,
                );
                return (
                  <TableRow
                    key={assignment.departureId}
                    sx={{
                      opacity: expired ? 0.7 : 1,
                      textDecoration: expired ? "line-through" : "none",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setSelectedAssignments(
                              selectedAssignments.filter(
                                (id) => id !== assignment.departureId,
                              ),
                            );
                          } else {
                            if (
                              assignment.status === "TODO" &&
                              !isExpired(assignment.endDate)
                            ) {
                              setSelectedAssignments([
                                ...selectedAssignments,
                                assignment.departureId,
                              ]);
                            }
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{assignment.tourName}</TableCell>
                    <TableCell>{formatDate(assignment.startDate)}</TableCell>
                    <TableCell>{formatDate(assignment.endDate)}</TableCell>
                    <TableCell>{assignment.maxParticipants}</TableCell>
                    <TableCell>{assignment.availableSeats}</TableCell>
                    <TableCell>{getStatusChip(assignment.status)}</TableCell>
                    <TableCell>
                      {formatDate(assignment.assignmentDate)}
                    </TableCell>
                    <TableCell>
                      {!expired && assignment.status === "TODO" && (
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() =>
                              handleStatusChange(
                                assignment.departureId,
                                "ACCEPT",
                              )
                            }
                            sx={{
                              padding: "2px 4px",
                              fontSize: "0.6rem",
                              minWidth: "40px",
                              "&:hover": {
                                backgroundColor: "#4caf50",
                              },
                            }}
                          >
                            Đồng ý
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() =>
                              handleRejectClick(assignment.departureId)
                            }
                            sx={{
                              padding: "2px 4px",
                              fontSize: "0.6rem",
                              minWidth: "30px",
                              "&:hover": {
                                backgroundColor: "#f44336",
                              },
                            }}
                          >
                            Từ chối
                          </Button>
                        </Stack>
                      )}
                      {(expired || assignment.status !== "TODO") &&
                        getStatusChip(assignment.status)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          sx={{ flexShrink: 0 }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAssignments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </TableContainer>
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
      <ChoosePopup
        title="Xác nhận từ chối"
        message="Bạn có chắc chắn muốn từ chối không?"
        open={rejectPopupOpen}
        onclose={() => setRejectPopupOpen(false)}
        onAccept={handleRejectConfirm}
        onReject={() => setRejectPopupOpen(false)}
      />
    </div>
  );
};

export default AssignmentTable;
