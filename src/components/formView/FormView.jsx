import React, { useEffect } from 'react'
import InputText from '../inputText/InputText'
import Button from '@mui/material/Button';
import SelectComponent from '../select/SelectComponent';
import './style.css'
import airplane from '../../assets/bg_airplane.png'
import bg_luggage from '../../assets/bg_luggage.png'
import bus from '../../assets/bg_bus.png'
import map_location from '../../assets/bg_map-location.png'
import road_trip from '../../assets/bg_road-trip.png'
import travel_bag from '../../assets/bg_travel-bag.png'
import left_luggage from '../../assets/left_luggage.png'
import left_airplane from '../../assets/left_airplane.png'
import left_flight from '../../assets/left_flight.png'
import left_travel_and_tourism from '../../assets/left_travel-and-tourism.png'
import left_travel_luggage from '../../assets/left_travel-luggage.png'
import left_travel from '../../assets/left_travel.png'
import right_plane from '../../assets/right_globe.png'
import right_tour_guide from '../../assets/right_tour-guide.png'
import right_travel from '../../assets/right_travel.png'
import LocationSelectCustom from "../../components/location/LocationSelectCustom";

function FormView({ children, title, titleBackground, data, className, notBorder, notIcon, disable }) {
    const listData = [airplane, bg_luggage, bus, map_location, road_trip, travel_bag]
    const listIcon = [left_luggage, left_airplane, left_flight, left_travel_and_tourism, left_travel_luggage, left_travel,
        right_tour_guide, right_travel, right_plane]
    const [bgImg, setBgImg] = React.useState(airplane)
    const [iconLeft, setIconLeft] = React.useState(null)
    const [iconRight, setIconRight] = React.useState(null)
    useEffect(() => {
        const random = Math.floor(Math.random() * listData.length)
        setBgImg(listData[random])
        if(!notIcon){
            const randomLeft = Math.floor(Math.random() * listIcon.length)
            setIconLeft(listIcon[randomLeft])
            const randomRight = Math.floor(Math.random() * listIcon.length)
            setIconRight(listIcon[randomRight])
        }
    }, [])
    return (
        <div className={`${notBorder? "" : "border border-primary"} m-2 formBooking ${className} form-view-container`}>
            { title && 
                <div style={{ position: 'relative' }}>
                    <div className='title divCenter' style={{ "--titleBackground": titleBackground ?? "lightblue" }}>
                        <h4 className='w-100 px-5'>{title}</h4>
                    </div>
                { !notIcon && <img src={iconLeft} alt="iconLeft" style={{ position: 'absolute', 
                    left: -15, top: -10 }}/>}
                { !notIcon && <img src={iconRight} alt="iconRight" style={{ position: 'absolute', 
                    right: -15, top: -10 }}/>}
                </div>
            }
            <div className='content'>
                <div className='bgContent' 
                    style={{ backgroundImage: `url(${bgImg})`, 
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center" }}></div>
            {children ? children :
                data.map((item, index) => {
                    return (
                        !item? null :
                        item.object ?
                            <div key={index}>
                                {  item.object.type === 'location'? 
                                <LocationSelectCustom label={item.object.value.label}
            province={item.object.value.province} provinces={item.object.value.provinces} district={item.object.value.district} districts={item.object.value.districts}
            onChangeProvince={item.object.value.onChangeProvince} onChangeDitricts={item.object.value.onChangeDitricts}
            />
                                :
                                item.object.type === 'image' ?
                                    <div style={{ marginTop: 20 }} className='divRow w-100'>
                                        <p>{item.label}</p>
                                        {item.object.value.map((img, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                { item.object.onRemove && 
                                                <button style={{ width: 20, backgroundColor: 'transparent', border: 0, 
                                                    color: 'red', position: 'absolute', borderRadius: '50%', 
                                                    right: -10, top: -10, fontSize: 14 
                                                    }}
                                                    onClick={() => !disable && item.object.onRemove(index)}>
                                                    X
                                                </button>}
                                                <img style={item.object.style} src={img.imageUrl?? img} alt={item.label} />
                                            </div>
                                        ))}
                                    </div>
                                    : item.object.type === 'button' ?
                                    <Button className={item.object.className} disabled={item.object.disable} variant="contained"
                                        onClick={item.object.onClick}>{item.label}</Button>
                                    : item.object.type === 'select' ?
                                        <SelectComponent disable={disable} label={item.label} listData={item.object.listData} value={item.object.value} onChange={item.object.onChange} />
                                    : item.object.type === 'div' ? item.object.value
                                    : <InputText notForm={item.object.notForm} id={index} label={item.label}
                                        type={item.object.type}
                                        multiline={item.object.multiline? true : false}
                                        value={item.object.value}
                                        disable={disable?? item.object.disable}
                                        min={item.object.min !== undefined ? item.object.min : null}
                                        className={item.object.className}
                                        onChange={item.object.onChange} />
                                }
                            </div>
                            : ( item.label.icon? <div key={index} className='v-align divRow' style={{ height: 50}}>
                                <div className='divCenter' style={{ width: 30 }}>{item.label.icon}</div>
                                <p className='m-0'>{item.value}</p>
                            </div> : <p key={index}>{item.label} {item.value}</p>)
                    )
                })
            }
            </div>
        </div>
    )
}

export default FormView;