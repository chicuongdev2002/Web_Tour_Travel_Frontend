import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { getAllTour } from '../functions/getTour';
import TourCard from '../components/tourCard/TourCard';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../components/navbar/NavHeader'

const TourList = ({ searchParams }) => {
  const navigate = useNavigate(); 
  const [dataCard, setDataCard] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTours = async (currentPage) => {
    setLoading(true);
    const data = await getAllTour({
      // ...searchParams,
      page: currentPage,
      size: pageSize
    });
    console.log(data);
    setDataCard(data.content);
    setTotalPages(data.page.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchTours(page);
  }, [page, searchParams]); 

  const handlePageChange = (direction) => {
    if (direction === 'next' && page < totalPages - 1) {
      setPage((prev) => prev + 1);
    } else if (direction === 'prev' && page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <Container fluid className="px-4">
      <NavHeader textColor="black"/>
      {loading ? (
        <div className="text-center" style={{ height: '100vh' }}>
          <Spinner animation="border" role="status">
            {/* <span className="visually-hidden">Loading...</span> */}
          </Spinner>
        </div>
      ) : (
        <>
          <button onClick={() => navigate(`/add-tour`) }>Thêm tour</button>
          {dataCard.length === 0 ? (
            <div className="text-center mt-4">
              <h5>Không có kết quả</h5>
              <p>Vui lòng thử tìm kiếm lại với các tiêu chí khác.</p>
            </div>
          ) : (
            <Row className="tour-grid g-4 mt-4">
              {dataCard.map((tour, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                  <TourCard
                    tour={{
                      tourId: tour.tourId,
                      image: tour.imageUrl,
                      title: tour.tourName,
                      // description: tour.tourDescription,
                      departureCity: tour.startLocation,
                      startDate: tour.startDate,
                      duration: `${tour.duration}N${tour.duration - 1}Đ`,
                      originalPrice: '8,490,000',
                      availableSeats: tour.availableSeats,
                      discountedPrice: tour.price,
                      countdown: '19:43:49',
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange('prev')}
          disabled={page === 0}
          className="me-2"
        >
          Previous
        </Button>
        <span className="mx-3">
          Page {page + 1} of {totalPages}
        </span>
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange('next')}
          disabled={page >= totalPages - 1}
          className="ms-2"
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default TourList;