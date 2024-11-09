import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

// Hàm chung để xử lý dữ liệu KPI
const prepareKpiData = (kpiData) => {
  const generalInfo = [
    {
      "Họ và tên": kpiData.fullName,
      "Đánh giá trung bình": `${kpiData.averageRating.toFixed(2)}/5⭐`,
      "Tỷ lệ hài lòng": `${kpiData.satisfactionRate.toFixed(1)}%`,
      "Khách hàng độc nhất": kpiData.uniqueCustomers,
      "Thời gian trung bình": `${kpiData.averageDuration} giờ`,
    },
  ];

  const toursData = [
    {
      Loại: "Tổng tours",
      "Số lượng": kpiData.totalAssignedTours,
      "Tỷ lệ": "100%",
    },
    {
      Loại: "Hoàn thành",
      "Số lượng": kpiData.completedTours,
      "Tỷ lệ": `${((kpiData.completedTours / kpiData.totalAssignedTours) * 100).toFixed(1)}%`,
    },
    {
      Loại: "Chờ làm",
      "Số lượng": kpiData.todoTours,
      "Tỷ lệ": `${((kpiData.todoTours / kpiData.totalAssignedTours) * 100).toFixed(1)}%`,
    },
    {
      Loại: "Đã nhận",
      "Số lượng": kpiData.acceptTours,
      "Tỷ lệ": `${((kpiData.acceptTours / kpiData.totalAssignedTours) * 100).toFixed(1)}%`,
    },
    {
      Loại: "Từ chối",
      "Số lượng": kpiData.rejectTours,
      "Tỷ lệ": `${((kpiData.rejectTours / kpiData.totalAssignedTours) * 100).toFixed(1)}%`,
    },
  ];

  const ratesData = [
    { "Trạng thái": "Chấp nhận", "Tỷ lệ": `${kpiData.acceptRate.toFixed(1)}%` },
    { "Trạng thái": "Từ chối", "Tỷ lệ": `${kpiData.rejectRate.toFixed(1)}%` },
    {
      "Trạng thái": "Chờ làm",
      "Tỷ lệ": `${(100 - (kpiData.acceptRate + kpiData.rejectRate)).toFixed(1)}%`,
    },
  ];

  const feedbackData = kpiData.customerFeedback.map(([feedback, date]) => ({
    "Phản hồi": feedback,
    "Thời gian": new Date(date).toLocaleString("vi-VN"),
  }));

  return { generalInfo, toursData, ratesData, feedbackData };
};

// Export to Excel
const exportToExcel = (kpiData) => {
  const { generalInfo, toursData, ratesData, feedbackData } =
    prepareKpiData(kpiData);
  const wb = XLSX.utils.book_new();

  // Tùy chỉnh style cho Excel
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F81BD" } },
    alignment: { horizontal: "center" },
  };

  // Thêm các worksheet với style
  const addWorksheet = (data, sheetName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // Áp dụng style cho header
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      if (!ws[address]) continue;
      ws[address].s = headerStyle;
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Điều chỉnh độ rộng cột
    const wscols = Array(range.e.c + 1).fill({ wch: 25 });
    ws["!cols"] = wscols;
  };

  addWorksheet(generalInfo, "Thông tin chung");
  addWorksheet(toursData, "Thống kê Tours");
  addWorksheet(ratesData, "Tỷ lệ");
  addWorksheet(feedbackData, "Phản hồi");

  // Export file
  const fileName = `KPI_${kpiData.fullName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

const exportToPdf = async (kpiData) => {
  const { generalInfo, toursData, ratesData, feedbackData } =
    prepareKpiData(kpiData);
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 40;

  // Sử dụng font mặc định
  doc.setFont("helvetica", "normal");

  // Cấu hình style chung cho bảng
  const tableStyle = {
    headStyles: {
      fillColor: [79, 129, 189],
      textColor: 255,
      fontSize: 12,
      fontStyle: "normal",
      halign: "center",
      valign: "middle",
    },
    bodyStyles: {
      fontSize: 11,
      halign: "left",
      valign: "middle",
      lineWidth: 0.5,
      lineColor: [128, 128, 128],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { top: 10, left: margin, right: margin },
    tableWidth: "auto",
    willDrawCell: function (data) {
      if (data.row.section === "body") {
        data.cell.styles.fillColor =
          data.row.index % 2 === 0 ? [255, 255, 255] : [240, 240, 240];
      }
    },
  };

  // Thêm header
  const addHeader = () => {
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    const fullNameASCII = convertToASCII(kpiData.fullName);
    doc.text(`Bao cao KPI - ${fullNameASCII}`, pageWidth / 2, margin, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(dateStr, pageWidth / 2, margin + 20, { align: "center" });

    return margin + 40;
  };

  // Thêm section title
  const addSectionTitle = (title, yPosition) => {
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text(title, margin, yPosition);
    return yPosition + 20;
  };

  // Kiểm tra và thêm trang mới nếu cần
  const checkAndAddPage = (currentY, requiredSpace) => {
    if (currentY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      return margin;
    }
    return currentY;
  };

  // Convert Vietnamese to ASCII
  const convertToASCII = (str) => {
    return str
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, "A")
      .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, "E")
      .replace(/[ÌÍỊỈĨ]/g, "I")
      .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, "O")
      .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, "U")
      .replace(/[ỲÝỴỶỸ]/g, "Y")
      .replace(/Đ/g, "D");
  };

  // Convert data to ASCII
  const convertDataToASCII = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) =>
        Array.isArray(item)
          ? item.map(convertToASCII)
          : convertToASCII(item.toString()),
      );
    }
    return convertToASCII(data.toString());
  };

  // Bắt đầu tạo PDF
  let yPos = addHeader();

  // 1. Thông tin chung
  yPos = addSectionTitle("Thong tin chung", yPos);
  const generalInfoASCII = Object.entries(generalInfo[0]).map(
    ([key, value]) => [convertToASCII(key), convertToASCII(value.toString())],
  );

  doc.autoTable({
    body: generalInfoASCII,
    ...tableStyle,
    startY: yPos + 10,
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: "auto" },
    },
  });

  // 2. Thống kê Tours
  yPos = doc.lastAutoTable.finalY + 30;
  yPos = checkAndAddPage(yPos, 200);
  yPos = addSectionTitle("Thong ke Tours", yPos);

  const toursDataASCII = toursData.map((row) =>
    Object.values(row).map((value) => convertToASCII(value.toString())),
  );

  doc.autoTable({
    head: [["Loai", "So luong", "Ty le"]],
    body: toursDataASCII,
    ...tableStyle,
    startY: yPos + 10,
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: 100, halign: "right" },
      2: { cellWidth: 100, halign: "right" },
    },
  });

  // 3. Tỷ lệ chấp nhận/từ chối
  yPos = doc.lastAutoTable.finalY + 30;
  yPos = checkAndAddPage(yPos, 150);
  yPos = addSectionTitle("Ty le chap nhan/tu choi", yPos);

  const ratesDataASCII = ratesData.map((row) =>
    Object.values(row).map((value) => convertToASCII(value.toString())),
  );

  doc.autoTable({
    head: [["Trang thai", "Ty le"]],
    body: ratesDataASCII,
    ...tableStyle,
    startY: yPos + 10,
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: 100, halign: "right" },
    },
  });

  // 4. Phản hồi khách hàng
  yPos = doc.lastAutoTable.finalY + 30;
  yPos = checkAndAddPage(yPos, 150);
  yPos = addSectionTitle("Phan hoi khach hang", yPos);

  const feedbackDataASCII = feedbackData.map((row) =>
    Object.values(row).map((value) => convertToASCII(value.toString())),
  );

  doc.autoTable({
    head: [["Phan hoi", "Thoi gian"]],
    body: feedbackDataASCII,
    ...tableStyle,
    startY: yPos + 10,
    columnStyles: {
      0: { cellWidth: "auto", minCellWidth: 300 },
      1: { cellWidth: 150 },
    },
  });

  // Thêm footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Trang ${i} / ${pageCount}`, pageWidth / 2, pageHeight - 20, {
      align: "center",
    });
  }

  // Tối ưu file name
  const sanitizedName = convertToASCII(kpiData.fullName)
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();
  const fileName = `KPI_${sanitizedName}_${new Date().toISOString().split("T")[0]}.pdf`;

  // Lưu file
  try {
    doc.save(fileName);
  } catch (error) {
    console.error("Lỗi khi xuất PDF:", error);
    throw new Error(`Không thể xuất PDF: ${error.message}`);
  }
};
const exportToPng = async (elementRef) => {
  try {
    const element = elementRef.current;

    // Đảm bảo element đã được render hoàn toàn
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Thêm các options để cải thiện chất lượng và độ tin cậy
    const canvas = await html2canvas(element, {
      scale: 2, // Tăng độ phân giải
      logging: false,
      useCORS: true,
      allowTaint: true, // Cho phép render content từ các domain khác
      backgroundColor: "#ffffff", // Đảm bảo nền trắng
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Xử lý các element ẩn nếu cần
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
          clonedElement.style.visibility = "visible";
          // Đảm bảo tất cả các phần tử con đều visible
          clonedElement.querySelectorAll("*").forEach((el) => {
            el.style.visibility = "visible";
          });
        }
      },
    });

    // Tối ưu chất lượng ảnh
    const dataUrl = canvas.toDataURL("image/png", 1.0);

    // Tạo blob thay vì dùng dataURL trực tiếp
    const blob = await (await fetch(dataUrl)).blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `KPI_Report_${new Date().toISOString().split("T")[0]}.png`;
    link.href = url;
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Lỗi chi tiết khi xuất ảnh:", error);
    throw new Error(`Không thể xuất ảnh: ${error.message}`);
  }
};

// Main export function
export const handleExport = async (
  kpiData,
  type = "excel",
  elementRef = null,
) => {
  try {
    switch (type.toLowerCase()) {
      case "excel":
        exportToExcel(kpiData);
        break;
      case "pdf":
        await exportToPdf(kpiData);
        break;
      case "png":
        if (!elementRef) {
          throw new Error("Element reference is required for PNG export");
        }
        await exportToPng(elementRef);
        break;
      default:
        throw new Error("Unsupported export type");
    }
  } catch (error) {
    console.error("Lỗi khi xuất file:", error);
    throw error;
  }
};
