import React from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
function InputText({
  id,
  label,
  type,
  value,
  onChange,
  children,
  disable,
  notForm,
}) {
  const [focus, setFocus] = React.useState(false);
  return (
    <FormControl
      style={{ width: "100%", marginTop: notForm ? 0 : 20 }}
      variant="standard"
    >
      <InputLabel
        htmlFor={id}
        style={{ color: focus ? "" : "black", fontSize: 18 }}
      >
        {label}
      </InputLabel>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        disabled={disable ? true : false}
        style={{ color: "black", fontSize: 18 }}
        endAdornment={
          children !== undefined ? (
            <InputAdornment
              position="end"
              style={{ color: focus ? "#1976D2" : "black", paddingRight: 12 }}
            >
              {children}
            </InputAdornment>
          ) : null
        }
      />
    </FormControl>
  );
}

export default InputText;
