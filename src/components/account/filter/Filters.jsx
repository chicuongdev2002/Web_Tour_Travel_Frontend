import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const Filters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="filter-container">
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm theo Tên đăng nhập..."
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search />,
        }}
        className="search-bar"
      />
      <FormControl variant="outlined" size="small" className="filter-dropdown">
        <InputLabel>Vai Trò</InputLabel>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          label="Vai Trò"
        >
          <MenuItem value="">
            <em>Tất Cả</em>
          </MenuItem>
          <MenuItem value="CUSTOMER">Khách Hàng</MenuItem>
          <MenuItem value="CUSTOMERVIP">Khách Hàng VIP</MenuItem>
          <MenuItem value="TOURGUIDE">Hướng Dẫn Viên</MenuItem>
          <MenuItem value="TOURPROVIDER">Nhà Cung Cấp Tour</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" size="small" className="filter-dropdown">
        <InputLabel>Trạng Thái</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Trạng Thái"
        >
          <MenuItem value="">
            <em>Tất Cả</em>
          </MenuItem>
          <MenuItem value="active">Hoạt Động</MenuItem>
          <MenuItem value="locked">Bị Khóa</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Filters;
