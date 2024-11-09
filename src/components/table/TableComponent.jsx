import React from 'react'
import { Table } from 'react-bootstrap';
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
let i = 0;
function TableComponent({ headers, data, page, getData }) {
  return (
    <div className="booking-table">
      <Table striped bordered hover>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th colSpan={header.colSpan? header.colSpan : 1} key={index} style={{ verticalAlign: 'middle'}}>
                {header.object? header.object : header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((d) => (
              <tr key={d[Object.keys(d)[0]]}>
                {Object.keys(d).map((key, index) => (
                  <td key={i++}>{d[key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">Không có dữ liệu.</td>
            </tr>
          )}
        </tbody>
      </Table>
      {page &&
        <div className="pagination w-100 divCenter">
          <GrCaretPrevious className='mr-2' onClick={() => {
            if (page.number > 0)
              getData(page.number - 1, page.size);
          }} />
          <p>Trang {page.number + 1} / {page.totalPages}</p>
          <GrCaretNext className='ml-2'
            onClick={() => {
              if (page.number < page.totalPages - 1)
                getData(page.number + 1, page.size);
            }}
          />
        </div>
      }
    </div>
  )
}

export default TableComponent