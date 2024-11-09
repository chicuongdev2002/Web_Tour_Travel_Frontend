import React, { useRef } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { handleExport } from "../action/handleExport";

const ExportButton = ({ kpiData }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const contentRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportClick = async (type) => {
    try {
      await handleExport(kpiData, type, contentRef);
      handleClose();
    } catch (error) {
      console.error("Export error:", error);
      // Thêm xử lý lỗi tại đây (ví dụ: hiển thị thông báo)
    }
  };

  return (
    <Box>
      <Button
        startIcon={<DownloadIcon />}
        onClick={handleClick}
        variant="contained"
        color="primary"
      >
        Xuất báo cáo
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleExportClick("excel")}>
          Xuất Excel
        </MenuItem>
        <MenuItem onClick={() => handleExportClick("pdf")}>Xuất PDF</MenuItem>
        <MenuItem onClick={() => handleExportClick("png")}>Xuất PNG</MenuItem>
      </Menu>
    </Box>
  );
};

export default ExportButton;
