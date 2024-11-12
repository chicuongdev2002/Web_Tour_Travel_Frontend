import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import "./AccountTable.css";
import {
  Verified,
  Search,
  SortByAlpha,
  GetApp,
  Print,
} from "@mui/icons-material";
const AccountTable = ({
  accounts,
  roles,
  handleRowClick,
  selectedAccounts,
  handleSelectAccount,
  handleRoleChange,
}) => {
  const [sortColumn, setSortColumn] = useState("userId");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortAccounts = (column) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortColumn(column);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleExportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      sortedAccounts
        .map(
          (account) =>
            `${account.userId},${account.username},${roles[account.userId] || account.role},${account.active ? "Hoạt Động" : "Bị Khóa"},${account.fullName}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "accounts.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  };

  const handlePrintTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print Table</title>");
    printWindow.document.write(
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" />',
    );
    printWindow.document.write(
      "<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>",
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write("<h2>Danh Sách Tài Khoản</h2>");
    printWindow.document.write(
      "<table><thead><tr><th>Mã Người Dùng</th><th>Tên Đăng Nhập</th><th>Vai Trò</th><th>Trạng Thái</th><th>Họ Và Tên</th></tr></thead><tbody>",
    );

    sortedAccounts.forEach((account) => {
      printWindow.document.write("<tr>");
      printWindow.document.write(`<td>${account.userId}</td>`);
      printWindow.document.write(`<td>${account.username}</td>`);
      printWindow.document.write(
        `<td>${roles[account.userId] || account.role}</td>`,
      );
      printWindow.document.write(
        `<td>${account.active ? "Hoạt Động" : "Bị Khóa"}</td>`,
      );
      printWindow.document.write(`<td>${account.fullName}</td>`);
      printWindow.document.write("</tr>");
    });

    printWindow.document.write("</tbody></table>");
    printWindow.document.write("</body></html>");

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <Button startIcon={<GetApp />} onClick={handleExportToCSV}>
        Xuất dữ liệu
      </Button>
      <Button startIcon={<Print />} onClick={handlePrintTable}>
        In
      </Button>
      <TableContainer className="table-container">
        <Table className="tableAccount">
          <TableHead>
            <TableRow>
              <TableCell>Chọn</TableCell>
              <TableCell
                onClick={() => sortAccounts("userId")}
                style={{ cursor: "pointer" }}
              >
                Mã Người Dùng
              </TableCell>
              <TableCell
                onClick={() => sortAccounts("username")}
                style={{ cursor: "pointer" }}
              >
                Tên Đăng Nhập
              </TableCell>
              <TableCell
                onClick={() => sortAccounts("role")}
                style={{ cursor: "pointer" }}
              >
                Vai Trò
              </TableCell>
              <TableCell
                onClick={() => sortAccounts("active")}
                style={{ cursor: "pointer" }}
              >
                Trạng Thái
              </TableCell>
              <TableCell
                onClick={() => sortAccounts("fullName")}
                style={{ cursor: "pointer" }}
              >
                Họ Và Tên
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAccounts.map((account) => (
              <TableRow
                key={account.userId}
                hover
                className={account.active ? "" : "locked-row"}
                onClick={(e) => {
                  if (
                    e.target.type !== "checkbox" &&
                    e.target.nodeName !== "SELECT" &&
                    account.active
                  ) {
                    handleRowClick(account.userId);
                  }
                }}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedAccounts.has(account.userId)}
                    onChange={() => handleSelectAccount(account.userId)}
                  />
                </TableCell>
                <TableCell>{account.userId}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>
                  <select
                    className="select-role"
                    value={roles[account.userId] || account.role}
                    onChange={(e) =>
                      handleRoleChange(account.userId, e.target.value)
                    }
                    disabled={!account.active}
                  >
                    <option value="CUSTOMER">Khách Hàng</option>
                    <option value="CUSTOMERVIP">Khách Hàng VIP</option>
                    <option value="TOURGUIDE">Hướng Dẫn Viên</option>
                    <option value="TOURPROVIDER">Nhà Cung Cấp Tour</option>
                  </select>
                </TableCell>
                <TableCell>
                  {account.active ? "Hoạt Động" : "Bị Khóa"}
                </TableCell>
                <TableCell>{account.fullName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AccountTable;
