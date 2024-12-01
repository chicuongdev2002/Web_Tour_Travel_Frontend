import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  CircularProgress,
  Box,
  Chip,
  Container,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  IconButton,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Cancel,
  PlayCircle as OngoingIcon,
  Print as PrintIcon,
  FileDownload as ExportIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import AssignTourGuideDialog from "./AssignTourGuideDialog";
import * as XLSX from "xlsx";
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';
const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [allAssignments, setAllAssignments] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState(new Set());

  const handleAssignmentComplete = () => {
    fetchAssignments(page, rowsPerPage);
  };
  useEffect(() => {
    console.log("Assignments updated:", assignments);
  }, [assignments]);
  const fetchAssignments = async (page = 0, size = 0) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tour-guides/assignments-all?page=${page}&size=${size}`,
      );
      console.log("Fetched assignments:", response.data);
      setAssignments(response.data.content);
      setTotalElements(response.data.page.totalElements);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments(page, rowsPerPage);
    console.log(
      "Fetching assignments for page:",
      page,
      "and rows per page:",
      rowsPerPage,
    );
  }, [page, rowsPerPage]);

  const fetchAllAssignments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/tour-guides/assignments-all?size=999999",
      );
      console.log("Fetched assignments:", response.data);
      return response.data.content;
    } catch (err) {
      console.error("Error fetching all assignments:", err);
      throw err;
    }
  };
  const handleCheckboxChange = (departureId, guideId) => {
    const key = `${departureId}-${guideId}`; // Tạo một key duy nhất cho mỗi cặp
    setSelectedAssignments((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      return newSelected;
    });
  };

  const handleDeleteSelected = async () => {
    const deletePromises = Array.from(selectedAssignments).map(async (key) => {
      const [departureId, guideId] = key.split("-");
      await axios.delete(
        `http://localhost:8080/api/tour-guides/${guideId}/assignments/${departureId}`,
      );
    });

    try {
      await Promise.all(deletePromises);
      fetchAssignments(page, rowsPerPage);
      setSelectedAssignments(new Set());
    } catch (err) {
      console.error("Error deleting assignments:", err);
    }
  };

  const handleExportToExcel = async () => {
    setExportLoading(true);
    try {
      const allData = await fetchAllAssignments();

      const exportData = allData.map((assignment) => ({
        "Mã chuyến đi": assignment.departureId,
        "Tên Tour": assignment.tourName,
        "Ngày bắt đầu": formatDate(assignment.startDate),
        "Ngày kết thúc": formatDate(assignment.endDate),
        "Trạng thái": assignment.status,
        "Ngày phân công": formatDate(assignment.assignmentDate),
        "Số lượng tối đa": assignment.maxParticipants,
        "Chỗ còn trống": assignment.availableSeats,
        "HDV được phân công": assignment.guideName,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Assignments");
      XLSX.writeFile(wb, "tour_assignments.xlsx");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
    } finally {
      setExportLoading(false);
    }
  };

  const handlePrint = async () => {
    setExportLoading(true);
    try {
      const allData = await fetchAllAssignments();
      setAllAssignments(allData);
      setTimeout(() => {
        window.print();
        setAllAssignments([]);
      }, 500);
    } catch (err) {
      console.error("Error preparing print:", err);
    } finally {
      setExportLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    console.log("Changing page to:", newPage); // Log trang mới
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log("Changing rows per page to:", newRowsPerPage); // Log số dòng mỗi trang
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const isTourOngoing = (startDate, endDate) => {
    const now = new Date();
    return new Date(startDate) <= now && now <= new Date(endDate);
  };

  const getStatusChip = (status, startDate, endDate) => {
    if (isTourOngoing(startDate, endDate)) {
      return (
        <Chip
          icon={<OngoingIcon />}
          label="Tour đang diễn ra"
          color="info"
          size="small"
        />
      );
    }

    switch (status?.toUpperCase()) {
      case "TODO":
        return (
          <Chip
            icon={<AccessTime />}
            label="Chờ xác nhận"
            color="warning"
            size="small"
          />
        );
      case "ACCEPT":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Đã đồng ý"
            color="success"
            size="small"
          />
        );
      case "REJECT":
        return (
          <Chip
            icon={<Cancel />}
            label="Đã từ chối"
            color="error"
            size="small"
          />
        );
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };
  const handleDisabled = () => {
    selectedAssignments.size === 0;
    // ||
    // !Array.from(selectedAssignments).some(key => {
    //   const [departureId, guideId] = key.split('-');
    //   const assignment = assignments.find(a => a.departureId === departureId && a.guideId === guideId);
    //   return assignment && assignment.status === 'TODO';
    // })
  };
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearchTerm =
      assignment.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.guideName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter
      ? assignment.status.toUpperCase() === statusFilter.toUpperCase()
      : true;
    const matchesStartDate = startDateFilter
      ? new Date(assignment.startDate) >= new Date(startDateFilter)
      : true;
    const matchesEndDate = endDateFilter
      ? new Date(assignment.endDate) <= new Date(endDateFilter)
      : true;

    return (
      matchesSearchTerm && matchesStatus && matchesStartDate && matchesEndDate
    );
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* <Paper elevation={3} sx={{ p: 3 }}> */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Danh sách phân công tour
        </Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Xuất Excel">
            <IconButton
              onClick={handleExportToExcel}
              color="primary"
              disabled={exportLoading}
            >
              {exportLoading ? <CircularProgress size={24} /> : <ExportIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="In danh sách">
            <IconButton
              onClick={handlePrint}
              color="primary"
              disabled={exportLoading}
            >
              {exportLoading ? <CircularProgress size={24} /> : <PrintIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            onClick={() => setIsAssignDialogOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Phân công hướng dẫn viên
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            disabled={handleDisabled}
            sx={{ textTransform: "none" }}
          >
            Xóa phân công
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo tên tour hoặc HDV"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
          />
          <Tooltip title="Hiển thị bộ lọc">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon color={showFilters ? "primary" : "default"} />
            </IconButton>
          </Tooltip>
        </Stack>

        {showFilters && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="TODO">Chờ xác nhận</MenuItem>
                <MenuItem value="ACCEPT">Đã đồng ý</MenuItem>
                <MenuItem value="REJECT">Đã từ chối</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="date"
              variant="outlined"
              label="Ngày bắt đầu"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              variant="outlined"
              label="Ngày kết thúc"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        )}
      </Box>

      <TableContainer className="table-container">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={
                    assignments.length > 0 &&
                    selectedAssignments.size === assignments.length
                  }
                  onChange={() => {
                    if (selectedAssignments.size === assignments.length) {
                      setSelectedAssignments(new Set());
                    } else {
                      setSelectedAssignments(
                        new Set(
                          assignments.map(
                            (a) => `${a.departureId}-${a.guideId}`,
                          ),
                        ),
                      );
                    }
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Mã chuyến đi
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Tên Tour
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Ngày bắt đầu
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Ngày kết thúc
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Trạng thái
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Ngày phân công
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Số lượng tối đa
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                Chỗ còn trống
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                HDV được phân công
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow
                key={`${assignment.departureId}-${assignment.guideId}`}
                hover
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedAssignments.has(
                      `${assignment.departureId}-${assignment.guideId}`,
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        assignment.departureId,
                        assignment.guideId,
                      )
                    }
                  />
                </TableCell>
                <TableCell>{assignment.departureId}</TableCell>
                <TableCell>{assignment.tourName}</TableCell>
                <TableCell>{formatDate(assignment.startDate)}</TableCell>
                <TableCell>{formatDate(assignment.endDate)}</TableCell>
                <TableCell>
                  {getStatusChip(
                    assignment.status,
                    assignment.startDate,
                    assignment.endDate,
                  )}
                </TableCell>
                <TableCell>{formatDate(assignment.assignmentDate)}</TableCell>
                <TableCell>{assignment.maxParticipants}</TableCell>
                <TableCell>{assignment.availableSeats}</TableCell>
                <TableCell>{assignment.guideName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 40]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count}`
        }
      />

      <AssignTourGuideDialog
        open={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        onAssignmentComplete={handleAssignmentComplete}
      />
      {/* </Paper> */}

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .table-container, .table-container * {
              visibility: visible;
            }
            .table-container {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Assignments;
