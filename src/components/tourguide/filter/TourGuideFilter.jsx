import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
} from "@mui/material";

const TourGuideFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onFilterChange(event.target.value, sortField, experienceFilter);
  };

  const handleSortChange = (event) => {
    setSortField(event.target.value);
    onFilterChange(searchTerm, event.target.value, experienceFilter);
  };

  const handleExperienceChange = (event) => {
    setExperienceFilter(event.target.value);
    onFilterChange(searchTerm, sortField, event.target.value);
  };

  return (
    <Box display="flex" justifyContent="space-between" mb={2}>
      <TextField
        label="Tìm kiếm bởi tên hướng dẫn viên hoặc email"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ flex: 1, marginRight: "16px" }}
      />
      <FormControl
        variant="outlined"
        style={{ minWidth: 120, marginRight: "16px" }}
      >
        <InputLabel>Sắp xếp bởi</InputLabel>
        <Select value={sortField} onChange={handleSortChange} label="Sort By">
          <MenuItem value="">
            <em>Mặc định</em>
          </MenuItem>
          <MenuItem value="fullName">Họ và tên</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="experienceYear">Số năm kinh nghiệm</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel>Năm kinh nghiệm</InputLabel>
        <Select
          value={experienceFilter}
          onChange={handleExperienceChange}
          label="Experience"
        >
          <MenuItem value="">
            <em>Tất cả</em>
          </MenuItem>
          <MenuItem value="0">0+</MenuItem>
          <MenuItem value="1">1+</MenuItem>
          <MenuItem value="2">2+</MenuItem>
          <MenuItem value="3">3+</MenuItem>
          <MenuItem value="5">5+</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default TourGuideFilter;
