import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import TourGuideTable from "./table/TourGuideTable";
import TourGuideFilter from "./filter/TourGuideFilter";
import AssignmentDialog from "./dialog/AssignmentDialog";
import DepartureDialog from "./dialog/DepartureDialog";
import UpdateDialog from "./dialog/UpdateDialog";
import { useNavigate } from "react-router-dom";
const TourGuideManager = () => {
  const navigate = useNavigate();
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [departureDialogOpen, setDepartureDialogOpen] = useState(false);
  const [selectedDeparture, setSelectedDeparture] = useState([]);
  const [selectedDepartureId, setSelectedDepartureId] = useState(null);
  const [updateAssignments, setUpdateAssignments] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedTourGuide, setSelectedTourGuide] = useState(null);
  useEffect(() => {
    fetchTourGuides();
  }, []);
  const fetchTourGuides = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tour-guides");
      setTourGuides(response.data);
      setFilteredGuides(response.data);
    } catch (err) {
      setError("Không thể tải danh sách hướng dẫn viên.");
    } finally {
      setLoading(false);
    }
  };
  const handleRowClick = (userId) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  const handleFilterChange = (searchTerm, sortField, experienceFilter) => {
    let filtered = tourGuides;

    if (searchTerm) {
      filtered = filtered.filter(
        (guide) =>
          guide.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guide.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (experienceFilter) {
      filtered = filtered.filter(
        (guide) => guide.experienceYear >= Number(experienceFilter),
      );
    }
    if (sortField) {
      filtered = filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
      });
    }

    setFilteredGuides(filtered);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const toggleGuideSelection = (userId) => {
    if (selectedGuides.includes(userId)) {
      setSelectedGuides(selectedGuides.filter((id) => id !== userId));
    } else {
      setSelectedGuides([...selectedGuides, userId]);
    }
  };

  const handleAssignClick = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/tours/allWithDeparture",
      );
      console.log(response.data);
      setSelectedDeparture(response.data);
      setDepartureDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin chuyến đi:", error);
    }
  };

  const handleAssign = async () => {
    console.log("Data being sent to API:", {
      guideId: selectedGuides,
      departureId: selectedDepartureId,
    });

    try {
      await axios.post(
        "http://localhost:8080/api/tour-guides/assign-tour-guide",
        {
          guideIds: selectedGuides,
          departureId: selectedDepartureId,
        },
      );
      setDepartureDialogOpen(false);
      setSelectedGuides([]);
      setUpdateAssignments((prev) => !prev);
    } catch (error) {
      console.error("Lỗi khi phân công tour:", error);
    }
  };

  const handleUpdateClick = (selectedGuideIds) => {
    const guideToUpdate = tourGuides.find((guide) =>
      selectedGuideIds.includes(guide.userId),
    );
    if (guideToUpdate) {
      setSelectedTourGuide(guideToUpdate);
      setUpdateDialogOpen(true);
    }
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedTourGuide(null);
  };
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  const goToList = () => {
    navigate("/list-assignment");
  };
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quản lý hướng dẫn viên
      </Typography>
      <TourGuideFilter onFilterChange={handleFilterChange} />
      <TourGuideTable
        tourGuides={filteredGuides}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
        selectedGuides={selectedGuides}
        toggleGuideSelection={toggleGuideSelection}
        onUpdateClick={handleUpdateClick}
        handleAssignClick={handleAssignClick}
        goToList={goToList}
      />
      <AssignmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        userId={selectedUserId}
        onDataUpdated={updateAssignments}
      />
      <DepartureDialog
        open={departureDialogOpen}
        onClose={() => setDepartureDialogOpen(false)}
        tours={selectedDeparture}
        selectedGuides={selectedGuides}
        onAssign={handleAssign}
        setSelectedDepartureId={setSelectedDepartureId}
      />
      <UpdateDialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        tourGuide={selectedTourGuide}
        onRefresh={fetchTourGuides}
      />
    </Container>
  );
};

export default TourGuideManager;
