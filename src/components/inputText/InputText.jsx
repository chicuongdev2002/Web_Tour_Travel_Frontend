import React from 'react';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function InputText({ id, label, type, value, onChange }) {
    const [focus, setFocus] = React.useState(false);
    return (
        <FormControl style={{ width: '100%', marginTop: 20 }} variant="standard">
            <InputLabel htmlFor={id} style={{ color: focus? '' : 'black', fontSize: 18 }}>{label}</InputLabel>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{ color: 'black', fontSize: 18 }}
            />
        </FormControl>
    )
}

export default InputText