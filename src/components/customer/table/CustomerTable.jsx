import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  styled,
  Icon,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Menu,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Verified,
  Search,
  SortByAlpha,
  GetApp,
  Print,
} from "@mui/icons-material";
import { exportToExcel } from "../action/utils.js";

const StyledTableContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiTableCell-root": {
    padding: theme.spacing(1, 2),
  },
  "& .MuiTableRow-root": {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.selected": {
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

const CustomerTable = ({
  customers,
  selectedCustomers,
  handleCheckboxChange,
  openModal,
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortColumn, setSortColumn] = useState("userId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterAndSortCustomers(term, filterType, sortColumn, sortDirection);
  };

  const handleFilterTypeChange = (event) => {
    const type = event.target.value;
    setFilterType(type);
    filterAndSortCustomers(searchTerm, type, sortColumn, sortDirection);
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortColumn(column);
    setSortDirection(isAsc ? "desc" : "asc");
    filterAndSortCustomers(
      searchTerm,
      filterType,
      column,
      isAsc ? "desc" : "asc",
    );
  };

  const filterAndSortCustomers = (term, type, column, direction) => {
    let filtered = customers;
    if (term) {
      filtered = customers.filter(
        (customer) =>
          customer.userId.toString().includes(term) ||
          customer.fullName.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term) ||
          customer.phoneNumber.includes(term) ||
          customer.addresses.some((address) =>
            address.address.toLowerCase().includes(term),
          ),
      );
    }
    if (type) {
      filtered = filtered.filter((customer) => customer.accountRole === type);
    }
    filtered.sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCustomers(filtered);
  };

  const handleExportToExcel = () => {
    exportToExcel(customers, "customers.xlsx");
  };

  const handlePrintTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print Table</title>");
    printWindow.document.write(
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" />',
    );
    printWindow.document.write(
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mui/5.0.0-alpha.36/material-ui.min.css" />',
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write("<h2>Danh Sách Khách Hàng</h2>");
    printWindow.document.write('<div id="print-content">');
    printWindow.document.write(
      "<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>",
    );
    printWindow.document.write('<div style="overflow-x:auto;">');
    printWindow.document.write("<table>");
    printWindow.document.write(
      "<thead><tr><th>Mã khách hàng</th><th>Họ Tên</th><th>Email</th><th>Số Điện Thoại</th><th>Địa Chỉ</th><th>Loại khách hàng</th></tr></thead><tbody>",
    );

    filteredCustomers.forEach((customer) => {
      printWindow.document.write("<tr>");
      printWindow.document.write(`<td>${customer.userId}</td>`);
      printWindow.document.write(`<td>${customer.fullName}</td>`);
      printWindow.document.write(`<td>${customer.email}</td>`);
      printWindow.document.write(`<td>${customer.phoneNumber}</td>`);
      printWindow.document.write(
        `<td>${customer.addresses.map((a) => a.address).join(", ")}</td>`,
      );
      printWindow.document.write(
        `<td>${customer.accountRole === "CUSTOMER" ? "Khách hàng" : "Khách hàng VIP"}</td>`,
      );
      printWindow.document.write("</tr>");
    });

    printWindow.document.write("</tbody></table>");
    printWindow.document.write("</div></div>");
    printWindow.document.write("</body></html>");

    printWindow.document.close();
    printWindow.print();
  };

  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  const handleSortByColumn = (column) => {
    handleSort(column);
    handleCloseSortMenu();
  };

  return (
    <StyledTableContainer>
      <div className="flex justify-between mb-4">
        <TextField
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <div className="flex items-center space-x-2">
          <FormControl>
            <InputLabel id="filter-type-label">Loại khách hàng</InputLabel>
            <Select
              labelId="filter-type-label"
              id="filter-type"
              value={filterType}
              onChange={handleFilterTypeChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
              <MenuItem value="CUSTOMERVIP">Khách hàng VIP</MenuItem>
            </Select>
          </FormControl>
          <Button startIcon={<SortByAlpha />} onClick={handleOpenSortMenu}>
            Sắp xếp
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseSortMenu}
          >
            <MenuItem onClick={() => handleSortByColumn("userId")}>
              <ListItemIcon>
                <SortByAlpha />
              </ListItemIcon>
              <ListItemText>Mã khách hàng</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleSortByColumn("fullName")}>
              <ListItemIcon>
                <SortByAlpha />
              </ListItemIcon>
              <ListItemText>Họ Tên</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleSortByColumn("email")}>
              <ListItemIcon>
                <SortByAlpha />
              </ListItemIcon>
              <ListItemText>Email</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleSortByColumn("phoneNumber")}>
              <ListItemIcon>
                <SortByAlpha />
              </ListItemIcon>
              <ListItemText>Số Điện Thoại</ListItemText>
            </MenuItem>
          </Menu>
          <Button startIcon={<GetApp />} onClick={handleExportToExcel}>
            Xuất dữ liệu
          </Button>
          <Button startIcon={<Print />} onClick={handlePrintTable}>
            In
          </Button>
        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Mã khách hàng</TableCell>
            <TableCell>Họ Tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Số Điện Thoại</TableCell>
            <TableCell>Địa Chỉ</TableCell>
            <TableCell>Loại khách hàng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((customer) => (
              <TableRow
                key={customer.userId}
                className={
                  selectedCustomers.includes(customer.userId) ? "selected" : ""
                }
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomers.includes(customer.userId)}
                    onChange={() => handleCheckboxChange(customer.userId)}
                  />
                </TableCell>
                <TableCell>{customer.userId}</TableCell>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>
                  {customer.addresses.map((a) => a.address).join(", ")}
                </TableCell>
                <TableCell>
                  {customer.accountRole === "CUSTOMER" ? (
                    "Khách hàng"
                  ) : (
                    <>
                      Khách hàng VIP
                      <Icon color="primary">
                        <Verified />
                      </Icon>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </StyledTableContainer>
  );
};

export default CustomerTable;
