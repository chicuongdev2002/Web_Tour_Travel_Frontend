import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  TablePagination,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Container,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  LocalActivity as TicketIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { getBookingDetail } from "../../functions/bookingDetails";

const BookingDetailUser = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const userJson = sessionStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const paymentMethodDescriptions = {
    CASH: { label: "Tiền mặt", color: "default" },
    BANKING: { label: "Ngân hàng", color: "primary" },
  };

  const checkInStatusDescriptions = {
    NOT_CHECKED_IN: { label: "Chưa check-in", color: "warning" },
    CHECKED_IN: { label: "Đã check-in", color: "success" },
    CHECK_IN_FAILED: { label: "Check-in thất bại", color: "error" },
  };

  const convertParticipants = (participantsString) => {
    const participants = participantsString.split(",").map(Number);
    const labels = ["Trẻ em", "Người lớn", "Người cao tuổi"];

    return (
      participants
        .reduce((acc, count, index) => {
          if (count > 0) {
            acc.push(`${count} ${labels[index]}`);
          }
          return acc;
        }, [])
        .join(", ") || "Không có vé"
    );
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (user && user.userId) {
        try {
          const response = await getBookingDetail(user.userId);
          setBookings(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin đặt chỗ", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("ID người dùng không có trong session.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        }}
      >
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: theme.palette.primary.contrastText,
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
          }}
        />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 4 },
        background: alpha(theme.palette.background.default, 0.9),
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: 3,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <TicketIcon sx={{ fontSize: 40 }} />
        Danh Sách Đặt Chỗ
      </Typography>

      <TableContainer
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        }}
      >
        <Table
          sx={{
            minWidth: 1000,
            "& thead": {
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
            },
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "ID Đặt Chỗ",
                "Ngày Đặt Chỗ",
                "Số Lượng Người",
                "Tên Tour",
                "Hướng Dẫn Viên",
                "Đại Lý",
                "Số Tiền Thanh Toán",
                "Phương Thức Thanh Toán",
                "Trạng Thái Check-in",
                "Đang Hoạt Động",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.secondary,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? bookings.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : bookings
            ).map((booking) => (
              <TableRow
                key={booking.bookingId}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  },
                }}
              >
                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                  {booking.bookingId}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <EventIcon
                        sx={{
                          marginRight: 1,
                          color: theme.palette.text.secondary,
                          fontSize: 20,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      {new Date(booking.bookingDate).toLocaleString()}
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Tooltip title={convertParticipants(booking.participants)}>
                    <Chip
                      icon={<PersonIcon />}
                      label={convertParticipants(booking.participants)}
                      variant="soft"
                      color="primary"
                      size="small"
                      sx={{
                        fontWeight: 600,
                        boxShadow: theme.shadows[1],
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                  {booking.tour.tourName}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          marginRight: 1,
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          fontWeight: 600,
                        }}
                      >
                        {booking.tourGuide?.fullName.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid item>
                      {booking.tourGuide
                        ? booking.tourGuide.fullName
                        : "Không xác định"}
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                  {booking.tourProvider.fullName}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <PaymentIcon
                        sx={{
                          marginRight: 1,
                          color: theme.palette.success.main,
                          fontSize: 20,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      {booking.payments
                        .reduce((sum, payment) => sum + payment.amount, 0)
                        .toLocaleString()}{" "}
                      VND
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {booking.payments.map((payment) => (
                    <Chip
                      key={payment.paymentMethod}
                      label={
                        paymentMethodDescriptions[payment.paymentMethod].label
                      }
                      color={
                        paymentMethodDescriptions[payment.paymentMethod].color
                      }
                      size="small"
                      variant="soft"
                      sx={{
                        margin: 0.5,
                        fontWeight: 600,
                        boxShadow: theme.shadows[1],
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    icon={
                      booking.checkinStatus === "CHECKED_IN" ? (
                        <CheckCircleIcon />
                      ) : (
                        <ErrorIcon />
                      )
                    }
                    label={
                      checkInStatusDescriptions[booking.checkinStatus].label
                    }
                    color={
                      checkInStatusDescriptions[booking.checkinStatus].color
                    }
                    variant="soft"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      boxShadow: theme.shadows[1],
                    }}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    label={booking.active ? "Có" : "Không"}
                    color={booking.active ? "success" : "error"}
                    size="small"
                    variant="soft"
                    sx={{
                      fontWeight: 600,
                      boxShadow: theme.shadows[1],
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "Tất cả", value: -1 }]}
        component="div"
        count={bookings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
          "& .MuiTablePagination-toolbar": {
            justifyContent: "flex-end",
          },
        }}
      />
      {/* </CardContent>
      </Card> */}
    </Container>
  );
};

export default BookingDetailUser;
