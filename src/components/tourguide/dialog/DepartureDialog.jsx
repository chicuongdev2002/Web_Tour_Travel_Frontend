import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const DepartureDialog = ({
  open,
  onClose,
  tours = [],
  selectedGuides,
  onAssign,
  setSelectedDepartureId,
}) => {
  const [selectedTourId, setSelectedTourId] = useState("");
  const [selectedDepartureId, setSelectedDepartureIdInternal] = useState("");

  const handleTourChange = (event) => {
    setSelectedTourId(event.target.value);
    setSelectedDepartureIdInternal("");
    setSelectedDepartureId("");
  };

  const handleDepartureChange = (event) => {
    const departureId = event.target.value;
    setSelectedDepartureIdInternal(departureId);
    setSelectedDepartureId(departureId);
    console.log("Selected Departure ID updated:", departureId);
  };

  const selectedTour = tours.find(
    (tour) => tour.tourId === Number(selectedTourId),
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thông tin chuyến đi</DialogTitle>
      <DialogContent>
        <FormControl
          fullWidth
          variant="outlined"
          style={{ marginBottom: "16px" }}
        >
          <InputLabel>Chọn tour</InputLabel>
          <Select
            value={selectedTourId}
            onChange={handleTourChange}
            label="Chọn tour"
          >
            {tours.map((tour) => (
              <MenuItem key={tour.tourId} value={tour.tourId}>
                {tour.tourName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedTour && (
          <>
            <p>Tên tour: {selectedTour.tourName}</p>
            <FormControl
              fullWidth
              variant="outlined"
              style={{ marginBottom: "16px" }}
            >
              <InputLabel>Chọn ngày khởi hành</InputLabel>
              <Select
                value={selectedDepartureId}
                onChange={handleDepartureChange}
                label="Chọn ngày khởi hành"
              >
                {selectedTour.departures.map((departure) => (
                  <MenuItem
                    key={departure.departureId}
                    value={departure.departureId}
                  >
                    {new Date(departure.startDate).toLocaleDateString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedDepartureId && (
              <p>
                Ngày bắt đầu:{" "}
                {new Date(
                  selectedTour.departures.find(
                    (dep) => dep.departureId === selectedDepartureId,
                  )?.startDate,
                ).toLocaleDateString()}
              </p>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={() => {
            onAssign();
            onClose();
          }}
          disabled={selectedGuides.length === 0 || !selectedDepartureId}
        >
          Phân công
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartureDialog;
