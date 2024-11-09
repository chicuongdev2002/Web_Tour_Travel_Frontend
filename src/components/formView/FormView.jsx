import React from 'react'
import InputText from '../inputText/InputText'
import Button from '@mui/material/Button';
import SelectComponent from '../select/SelectComponent';

function FormView({ children, title, titleBackground, data, className, notBorder }) {
    return (
        <div className={`${notBorder? "" : "border border-primary"} m-2 formBooking ${className}`}>
            { title && <h4 style={{ backgroundColor: titleBackground ? titleBackground : 'green' }}>{title}</h4>}
            {children ? children :
                data.map((item, index) => {
                    return (
                        item.object ?
                            <div key={index}>
                                { item.object.type === 'image' ?
                                    <div style={{ marginTop: 20 }} className='divRow w-100'>
                                        <p>{item.label}</p>
                                        {item.object.value.map((img, index) => {
                                            return <img key={index} style={item.object.style} src={img.imageUrl} alt={item.label} />
                                        })}
                                    </div>
                                    : item.object.type === 'button' ?
                                    <Button className={item.object.className} variant="contained"
                                        onClick={item.object.onClick}>{item.label}</Button>
                                    : item.object.type === 'select' ?
                                        <SelectComponent label={item.label} listData={item.object.listData} value={item.object.value} onChange={item.object.onChange} />
                                        : <InputText notForm={item.object.notForm} id={index} label={item.label}
                                            type={item.object.type} value={item.object.value}
                                            disable={item.object.disable}
                                            min={item.object.min !== undefined ? item.object.min : null}
                                            className={item.object.className}
                                            onChange={item.object.onChange} />
                                }
                            </div>
                            : <p key={index}>{item.label}: {item.value}</p>
                    )
                })
            }
        </div>
    )
}

export default FormView