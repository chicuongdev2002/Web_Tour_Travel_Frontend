import React from 'react'
import SelectComponent from '../select/SelectComponent'

function LocationSelectCustom({ label, province, provinces, district, districts, onChangeProvince, onChangeDitricts}) {

  return (
    <div className="d-flex flex-column w-100" style={{ marginTop: 10 }}>
      <p className='m-0' style={{ fontSize: 18 }}>{label}</p>
      <div className='divRow'>
        <div className='w-50'>
          <SelectComponent notMarginTop={true} listData={provinces}
            value={province} onChange={(e) => onChangeProvince(e)}
          />
        </div>
        <div className='ml-2 w-50'>
          <SelectComponent notMarginTop={true} listData={districts}
            value={district} onChange={(e) => onChangeDitricts(e)}
          />
        </div>
      </div>
    </div>
  )
}

export default LocationSelectCustom