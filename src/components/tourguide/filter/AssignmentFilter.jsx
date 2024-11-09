import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const AssignmentFilter = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  assignmentDate,
  setAssignmentDate,
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        backgroundColor: "#fff",
        p: 2,
        borderRadius: 1,
      }}
    >
      <TextField
        label="Tìm kiếm theo tên tour"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1 }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
        }}
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Trạng thái</InputLabel>
        <Select
          value={statusFilter}
          label="Trạng thái"
          onChange={(e) => setStatusFilter(e.target.value)}
          startAdornment={
            <FilterListIcon sx={{ color: "action.active", mr: 1 }} />
          }
        >
          <MenuItem value="ALL">Tất cả</MenuItem>
          <MenuItem value="TODO">Chờ phân công</MenuItem>
          <MenuItem value="ACCEPT">Đã đồng ý</MenuItem>
          <MenuItem value="REJECT">Đã từ chối</MenuItem>
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <DatePicker
            label="Ngày bắt đầu"
            value={startDate}
            onChange={setStartDate}
            renderInput={(params) => <TextField {...params} size="small" />}
            components={{
              OpenPickerIcon: CalendarTodayIcon,
            }}
          />
          <DatePicker
            label="Ngày kết thúc"
            value={endDate}
            onChange={setEndDate}
            renderInput={(params) => <TextField {...params} size="small" />}
            components={{
              OpenPickerIcon: CalendarTodayIcon,
            }}
          />
          <DatePicker
            label="Ngày phân công"
            value={assignmentDate}
            onChange={setAssignmentDate}
            renderInput={(params) => <TextField {...params} size="small" />}
            components={{
              OpenPickerIcon: CalendarTodayIcon,
            }}
          />
        </Stack>
      </LocalizationProvider>
    </Box>
  );
};

export default AssignmentFilter;
