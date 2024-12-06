import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Fade,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isValid, parseISO, isBefore, isToday } from "date-fns";
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import "./CalendarDialog.css"; // Import file CSS riêng

const CalendarDialog = ({ open, onClose, itineraries }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const departureDates = itineraries.reduce((dates, tour) => {
    tour.departures.forEach((departure) => {
      const startDate = parseISO(departure.startDate);
      const endDate = parseISO(departure.endDate);
      if (isValid(startDate) && isValid(endDate)) {
        dates[format(startDate, "yyyy-MM-dd")] = {
          tourName: tour.tourName,
          destinations: tour.destinations.map((d) => d.name).join(" → "),
          startDate,
          endDate,
          type: "departure",
        };

        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);
        while (isBefore(currentDate, endDate) || isToday(currentDate)) {
          dates[format(currentDate, "yyyy-MM-dd")] = {
            ...dates[format(startDate, "yyyy-MM-dd")],
            type: "in-range",
          };
          currentDate.setDate(currentDate.getDate() + 1);
        }

        dates[format(endDate, "yyyy-MM-dd")] = {
          ...dates[format(startDate, "yyyy-MM-dd")],
          type: "end",
        };
      }
    });
    return dates;
  }, {});

  const getDepartureStatus = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    if (dateKey in departureDates) {
      const { endDate } = departureDates[dateKey];
      if (isBefore(endDate, new Date())) {
        return "past";
      } else if (isToday(date)) {
        return "current";
      } else {
        return "upcoming";
      }
    }
    return null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getSelectedDateInfo = () => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    if (dateKey in departureDates) {
      return (
        <Paper
          elevation={4}
          sx={{
            p: 2,
            mt: 2,
            bgcolor: "primary.dark",
            color: "white",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Tour khởi hành ngày {format(selectedDate, "dd/MM/yyyy")}:
          </Typography>
          <Typography variant="body1">
            {departureDates[dateKey].tourName}
          </Typography>
          <Typography variant="subtitle2" display="block" sx={{ mt: 1 }}>
            Hành trình: {departureDates[dateKey].destinations}
          </Typography>
          <Typography variant="subtitle2" display="block" sx={{ mt: 1 }}>
            Thời gian: {format(departureDates[dateKey].startDate, "dd/MM/yyyy")}{" "}
            - {format(departureDates[dateKey].endDate, "dd/MM/yyyy")}
          </Typography>
          {isToday(selectedDate) && (
            <Typography
              variant="subtitle2"
              display="block"
              sx={{ mt: 1, fontStyle: "italic", color: "#FFD700" }}
            >
              * Hôm nay có chuyến khởi hành!
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CalendarIcon />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Lịch Khởi Hành Tours
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": { color: "grey.300" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date }) => {
            const status = getDepartureStatus(date);
            const dateKey = format(date, "yyyy-MM-dd");
            if (dateKey in departureDates) {
              const { type } = departureDates[dateKey];
              if (type === "departure") return "departure-date";
              if (type === "end") return "end-date";
            }
            return status === "past"
              ? "departure-date-past"
              : status === "current"
                ? "departure-date-current"
                : status === "upcoming"
                  ? "departure-date-upcoming"
                  : "";
          }}
          tileContent={({ date }) => {
            const dateKey = format(date, "yyyy-MM-dd");
            if (dateKey in departureDates) {
              const { type } = departureDates[dateKey];
              return (
                <div>
                  {type === "departure" && (
                    <div className="date-label">Ngày khởi hành</div>
                  )}
                  {type === "end" && (
                    <div className="date-label">Ngày kết thúc</div>
                  )}
                  {type === "in-range" && (
                    <div className="date-label">Ngày đi</div>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        {getSelectedDateInfo()}
        <Typography variant="caption" sx={{ mt: 2 }}>
          <div>
            <span style={{ color: "red" }}>●</span> Ngày khởi hành đã qua
          </div>
          <div>
            <span style={{ color: "yellow" }}>●</span> Ngày khởi hành hiện tại
          </div>
          <div>
            <span style={{ color: "green" }}>●</span> Ngày khởi hành sắp tới
          </div>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
