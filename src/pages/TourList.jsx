import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import TourCard from '../components/tourCard/TourCard'
import image from '../assets/logo.png'
import { getAllTour } from '../functions/getTour'

function TourList() {
    const [dataCard, setDataCard] = useState([]);
    useEffect(() => {
      getAllTour(0,20).then((data) => {
        console.log(data);
        setDataCard(data);
      })
    }, [])
    return (
      <div className='divRow' style={{ flexWrap: 'wrap'}}>
        {dataCard.map((tour, index) => (
            <div key={index} className='ml-2 mt-2'>
              <TourCard tour={{
              image: image,
              title: tour.tourName,
              description: tour.tourDescription,
              departureCity: 'TP. Hồ Chí Minh',
              startDate: '02/10/2024',
              duration: tour.duration + 'N' + (tour.duration - 1) + 'Đ',
              originalPrice: '8,490,000',
              discountedPrice: tour.price,
              countdown: '19:43:49',
            }}
            />
            </div>
          )
        )}
      </div>
    )
}

export default TourList