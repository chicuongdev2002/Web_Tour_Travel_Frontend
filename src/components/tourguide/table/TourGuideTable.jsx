import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  CheckBox,
} from "@mui/icons-material";

const TourGuideTable = ({
  tourGuides,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  selectedGuides,
  toggleGuideSelection,
  onUpdateClick,
  handleAssignClick,
  goToList,
}) => {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Tooltip title="Cập nhật thông tin hướng dẫn viên">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onUpdateClick(selectedGuides)}
            disabled={selectedGuides.length === 0 || selectedGuides.length > 1}
            startIcon={<EditIcon />}
          >
            Cập nhật
          </Button>
        </Tooltip>
        <Tooltip title="Phân công hướng dẫn viên">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAssignClick}
            disabled={selectedGuides.length === 0}
            startIcon={<AssignmentIcon />}
          >
            Phân công
          </Button>
        </Tooltip>
        <Tooltip title="Xem tất cả danh sách phân công">
          <Button variant="contained" color="secondary" onClick={goToList}>
            Xem tất cả danh sách phân công
          </Button>
        </Tooltip>
      </div>

      <TableContainer className="table-container">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Mã hướng dẫn viên
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Họ và tên</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Số điện thoại
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Kinh nghiệm(năm)
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tourGuides
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((guide) => (
                <TableRow
                  key={guide.userId}
                  onClick={() => onRowClick(guide.userId)}
                  style={{ cursor: "pointer" }}
                  hover
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedGuides.includes(guide.userId)}
                      onChange={(event) => {
                        event.stopPropagation();
                        toggleGuideSelection(guide.userId);
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>{guide.userId}</TableCell>
                  <TableCell>{guide.email}</TableCell>
                  <TableCell>{guide.fullName}</TableCell>
                  <TableCell>{guide.phoneNumber}</TableCell>
                  <TableCell>{guide.experienceYear}</TableCell>
                  <TableCell>
                    {guide.addresses.length > 0 ? (
                      guide.addresses.map((address) => (
                        <div
                          key={address.addressId}
                          className="flex items-center gap-2"
                        >
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {address.address}
                          </Typography>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" color="error">
                          Chưa cập nhật
                        </Typography>
                        <Tooltip title="Cập nhật địa chỉ">
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateClick([guide.userId]);
                            }}
                            startIcon={<EditIcon fontSize="small" />}
                          >
                            Cập nhật ngay
                          </Button>
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tourGuides.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Số hàng mỗi trang"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count}`
        }
      />
    </div>
  );
};

export default TourGuideTable;
