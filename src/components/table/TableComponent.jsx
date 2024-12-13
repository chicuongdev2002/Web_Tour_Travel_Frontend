import React from "react";
import { Table } from "react-bootstrap";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import Button from "@mui/material/Button";
let i = 0;
function TableComponent({ headers, data, page, getData, onClickTr }) {
  return (
    <div className="booking-table">
      <Table striped bordered hover>
        <thead>
          <tr style={{ backgroundColor: "lightblue" }}>
            {headers.map((header, index) =>
              header.tooltip ? (
                <th
                  title={header.tooltip}
                  key={index}
                  style={{ verticalAlign: "middle" }}
                >
                  {header.title}
                </th>
              ) : (
                <th
                  colSpan={header.colSpan ? header.colSpan : 1}
                  key={index}
                  style={{ verticalAlign: "middle" }}
                >
                  {header.object ? header.object : header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((d, index) => (
              <tr key={index}>
                {Object.keys(d).map((key, indexChild) =>
                  d[key].button? 
                    <Button
            className={d[key].className}
            variant="contained"
            onClick={d[key].onClick}
          >
            {d[key].button}
          </Button>
                  :
                  d[key].onClick ? (
                    <td key={indexChild} onClick={d[key].onClick}>
                      {d[key].title}
                    </td>
                  ) : (
                    <td
                      key={indexChild}
                      onClick={() => {
                        onClickTr.onClick(d[Object.keys(d)[0]]);
                      }}
                    >
                      {d[key]}
                    </td>
                  ),
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                Không có dữ liệu.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {page && (
        <div className="pagination w-100 divCenter">
          <GrCaretPrevious
            className="mr-2"
            onClick={() => {
              if (page.number > 0) getData(page.number - 1, page.size);
            }}
          />
          <p>
            Trang {page.number + 1} / {page.totalPages}
          </p>
          <GrCaretNext
            className="ml-2"
            onClick={() => {
              if (page.number < page.totalPages - 1)
                getData(page.number + 1, page.size);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TableComponent;
