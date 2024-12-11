import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import SuccessPopup from "../popupNotifications/SuccessPopup";
import FailPopup from "../popupNotifications/FailPopup";
import { assignmentTourGuide, getAllDeparture, getTourGuide } from "../../functions/assignmentCrud";
const AssignTourGuideDialog = ({ open, onClose, onAssignmentComplete }) => {
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    open: false,
    message: "",
  });
  const [failPopup, setFailPopup] = useState({ open: false, message: "" });
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const toursResponse = await getAllDeparture();
        const guidesResponse = await getTourGuide();
        setTours(toursResponse.data);
        setGuides(guidesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleTourChange = (event) => {
    const tour = tours.find((t) => t.tourId === event.target.value);
    setSelectedTour(tour);
    setSelectedDeparture(null);
    setSelectedGuides([]);
  };

  const handleDepartureChange = (event) => {
    const departure = selectedTour.departures.find(
      (d) => d.departureId === event.target.value,
    );
    setSelectedDeparture(departure);
  };

  const handleGuideChange = (event, newValue) => {
    setSelectedGuides(newValue);
  };

  const handleSubmit = async () => {
    try {
      console.log(selectedGuides.map((guide) => guide.userId));
      console.log(selectedDeparture.departureId);
      const res= await assignmentTourGuide(selectedGuides.map((guide) => guide.userId),selectedDeparture.departureId);
      console.log(res);
      setSuccessPopup({
        open: true,
        message: `Phân công tour thành công cho ${selectedGuides.map((guide) => guide.fullName).join(", ")} với chuyến đi ${selectedTour.tourName} vào ${format(new Date(selectedDeparture.startDate), "dd/MM/yyyy")}`,
      });

      setTimeout(() => {
        onAssignmentComplete();
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error assigning tour guides:", error);

      if (error.response && error.response.status === 500) {
        setFailPopup({
          open: true,
          message: error.response.data,
        });
      }
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  const handleClose = () => {
    setSelectedTour(null);
    setSelectedDeparture(null);
    setSelectedGuides([]);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          backgroundColor: "primary.main",
          color: "white",
          py: 2,
        }}
      >
        Phân công hướng dẫn viên
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Chọn Tour</InputLabel>
            <Select
              value={selectedTour?.tourId || ""}
              onChange={handleTourChange}
              label="Chọn Tour"
            >
              {tours.map((tour) => (
                <MenuItem key={tour.tourId} value={tour.tourId}>
                  {tour.tourName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedTour && (
            <FormControl fullWidth>
              <InputLabel>Chọn chuyến đi</InputLabel>
              <Select
                value={selectedDeparture?.departureId || ""}
                onChange={handleDepartureChange}
                label="Chọn chuyến đi"
              >
                {selectedTour.departures.map((departure) => (
                  <MenuItem
                    key={departure.departureId}
                    value={departure.departureId}
                  >
                    {`${format(new Date(departure.startDate), "dd/MM/yyyy")} - ${selectedTour.tourName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedDeparture && (
            <Autocomplete
              multiple
              options={guides}
              getOptionLabel={(option) => option.fullName}
              value={selectedGuides}
              onChange={handleGuideChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn hướng dẫn viên"
                  placeholder="Tìm hướng dẫn viên"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.fullName}
                    {...getTagProps({ index })}
                    sx={{ m: 0.5 }}
                  />
                ))
              }
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ mr: 1 }}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedDeparture || selectedGuides.length === 0}
          variant="contained"
          color="primary"
        >
          Phân công
        </Button>
      </DialogActions>
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
    </Dialog>
  );
};

export default AssignTourGuideDialog;
