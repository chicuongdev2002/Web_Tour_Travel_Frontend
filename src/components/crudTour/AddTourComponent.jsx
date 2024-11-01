import React, { useState } from 'react'
import InputText from '../../components/inputText/InputText'
import Button from '@mui/material/Button';
import SelectComponent from '../select/SelectComponent';
import { getAllDestination } from '../../functions/getDestination';
import { POST_TOUR } from '../../config/host';
import { postData } from '../../functions/postData';
import DestinationList from '../crudDestination/DestinationList';
import ModalComponent from '../modal/ModalComponent';
import moment from 'moment';

function AddTourComponent() {
  const [tourName, setTourName] = useState('');
  const [description, setDescription] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [type, setType] = useState('');

  const [startDate, setStartDate] = useState(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'))
  const [endDate, setEndDate] = useState(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'))
  const [maxParticipants, setMaxParticipants] = useState(0)
  const [duration, setDuration] = useState(0)

  const [open, setOpen] = useState(false)
  const [openDestination, setOpenDestination] = useState(false)
  const [openDeparture, setOpenDeparture] = useState(false)
  const [destination, setDestination] = useState(null)
  const [destinationSelected, setDestinationSelected] = useState({content: []})

  const getDestination = async (page, size) => {
    const result = await getAllDestination(page, size);
    setDestination(result);
  }

  return (
    <div className={`w-100 ${openDestination && openDeparture? "divRowBetweenNotAlign" : "divCenter"}`}>
      <div className='w-30 border border-primary m-2 formBooking'>
        <h2 className='bg-primary'>Thêm tour</h2>
        <div>
          <InputText label='Tên tour' value={tourName} onChange={(e) => setTourName(e.target.value)} />
          <InputText label='Mô tả' value={description} onChange={(e) => setDescription(e.target.value)} />
          <InputText label='Địa điểm khởi hành' value={startLocation} onChange={(e) => setStartLocation(e.target.value)} />
          <SelectComponent label='Loại tour' listData={[{ FAMILY: "FAMILY" }, { GROUP: "GROUP" }]} value={type} onChange={(e) => setType(e)} />
          <Button className='btn btn-primary w-100 mb-3 mt-3' variant="contained"
            onClick={() => {
                getDestination()
                setOpenDestination(true)
            }}
          >Thêm địa điểm</Button>
        </div>
      </div>
      {
        openDestination &&
        <div className='w-30 border border-primary m-2 formBooking'>
          <h2 className='bg-primary'>Chọn địa điểm</h2>
          <div>
            <DestinationList data={destinationSelected} isDescription={false} onGetData={getDestination} 
              changeDuration={(e, destination) => {
                let preValue = destinationSelected.content.filter(d => d.destinationId === destination.destinationId)[0].duration
                if(preValue > e.target.value){
                  setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(-1, 'hours').format('DD/MM/YYYY HH:mm:ss'))
                  setDuration(prevState => prevState - 1)
                }
                else{
                  setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(1, 'hours').format('DD/MM/YYYY HH:mm:ss'))
                  setDuration(prevState => prevState + 1)
                }
                setDestinationSelected(prevState => ({
                  ...prevState,
                  content: prevState.content.map(item =>
                    item.destinationId === destination.destinationId ? { ...item, duration: e.target.value } : item
                  ),
                }))
                
              }}
            />
            <div className='divRowBetween'>
            <Button className='btn btn-primary w-50 mb-3 mr-1 mt-3' variant="contained"
              onClick={() => setOpen(true)}
            >Thêm địa điểm</Button>
            <Button className='btn btn-primary w-50 mb-3 ml-1 mt-3' variant="contained"
              onClick={() => setOpenDeparture(true)}
            >Thêm lịch trình</Button>
            </div>
          </div>
        </div>
      }
      {
        openDeparture && 
        <div className=' w-30 border border-primary m-2 formBooking'>
          <h2 className='bg-primary'>Thêm lịch trình</h2>
          <div>
            <InputText label='Ngày khởi hành' type="dateTime" value={startDate} onChange={(e) => {
              setStartDate(e.target.value)
              setEndDate(moment(e.target.value, "DD/MM/YYYY HH:mm:ss").add(duration, 'hours').format('DD/MM/YYYY HH:mm:ss'))
              }} />
            <InputText label='Ngày kết thúc' disable={true} type="dateTime" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <InputText label='Số người tham gia' type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
            <InputText label='Thời gian(giờ)' disable={true} type="number" value={duration} />
            <Button className='btn btn-primary w-100 mb-3 mt-3' variant="contained"
              onClick={() => {
                postData(POST_TOUR, {
                  tour: { tourName, tourDescription: description, startLocation, tourType: type, duration },
                  departure: {
                    startDate: moment(startDate, "DD/MM/YYYY HH:mm:ss").add(7, 'hours').toDate().toISOString(),
                    endDate: moment(endDate, "DD/MM/YYYY HH:mm:ss").add(7, 'hours').toDate().toISOString(),
                    maxParticipants,
                  },
                  tourDestinations:[...destinationSelected.content.map(d => (
                    { destination: { destinationId: d.destinationId }, duration: d.duration }
                  ))]
                })
              }}
            >Thêm</Button>
          </div>
        </div>
      }
      {
        open &&
        <ModalComponent open={open} onclose={() => setOpen(false)} title='Danh sách địa điểm'>
          <DestinationList selectDestination={
            (e, destination) => {
              if (e.target.checked) {
                setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(1, 'hours').format('DD/MM/YYYY HH:mm:ss'))
                setDuration(prevState => prevState + 1)
                setDestinationSelected(prevState => ({
                  ...prevState,
                  content: [...prevState.content, { ...destination, duration: 1 }],
                }));
              }
              else{
                let filter = destinationSelected.content.filter(d => d.destinationId === destination.destinationId)[0].duration
                setEndDate(moment(endDate, "DD/MM/YYYY HH:mm:ss").add(-filter, 'hours').format('DD/MM/YYYY HH:mm:ss'))
                setDuration(prevState => prevState - filter)
                setDestinationSelected(prevState => ({
                  ...prevState,
                  content: prevState.content.filter(d => d.destinationId !== destination.destinationId)
                }));
              }
            }
          } destinationSelected={destinationSelected} data={destination} isDescription={true} onGetData={getDestination} />
        </ModalComponent>
      }
    </div>

  )
}

export default AddTourComponent