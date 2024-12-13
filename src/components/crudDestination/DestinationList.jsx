import React from "react";
import { Table } from "react-bootstrap";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";

const DestinationList = ({
  data,
  isDescription,
  onGetData,
  selectDestination,
  destinationSelected,
  changeDuration,
  duration,
  disable
}) => {
  return (
    <div className="destination-table">
      <Table striped bordered hover>
        <thead className="one-line-text">
          <tr>
            <th>ID</th>
            <th>Tên điểm đến</th>
            {isDescription && <th>Mô tả</th>}
            <th>Tỉnh/Thành phố</th>
            {selectDestination && <th>Chọn</th>}
            {!selectDestination && <th>Số giờ</th>}
          </tr>
        </thead>
        <tbody>
          {data?.content?.length > 0 ? (
            data.content.map((destination) => (
              <tr
                className="truncate-multiline"
                key={destination.destinationId}
              >
                <td>{destination.destinationId}</td>
                <td>{destination.name}</td>
                {isDescription && (
                  <td>
                    <div className="truncate-multiline">
                      {destination.description}
                    </div>
                  </td>
                )}
                <td>{destination.province}</td>
                {selectDestination && (
                  <td>
                    <input
                      checked={
                        destinationSelected?.content?.some(
                          (d) => d.destinationId == destination.destinationId,
                        )
                          ? true
                          : false
                      }
                      type="checkbox"
                      onChange={(e) => selectDestination(e, destination)}
                    />
                  </td>
                )}
                {!selectDestination && (
                  <td>
                    <input
                      min={1}
                      style={{
                        width: 50,
                        backgroundColor: "white",
                        color: "black",
                      }}
                      disabled={disable}
                      type="number"
                      value={destination.duration}
                      onChange={(e) => changeDuration(e, destination)}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Không có dữ liệu điểm đến.
              </td>
            </tr>
          )}
        </tbody>
        {duration && (
          <tfoot>
            <tr>
              <td colSpan={3}>Tổng thời gian(giờ):</td>
              <td>{duration}</td>
            </tr>
          </tfoot>
        )}
      </Table>
      {data?.page?.totalPages > 1 && (
        <div className="pagination divCenter">
          <GrCaretPrevious
            className="mr-2"
            onClick={() => {
              if (data.page.number > 0)
                onGetData(data.page.number - 1, data.page.size);
            }}
          />
          <p>
            Trang {data?.page?.number + 1} / {data?.page?.totalPages}
          </p>
          <GrCaretNext
            className="ml-2"
            onClick={() => {
              if (data.page.number < data.page.totalPages - 1)
                onGetData(data.page.number + 1, data.page.size);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DestinationList;
