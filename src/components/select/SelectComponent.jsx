import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./style.css";

function SelectComponent({ id, label, value, onChange, listData, notMarginTop }) {
  const [focus, setFocus] = React.useState(false);

  return (
    <FormControl style={{ width: "100%", marginTop: notMarginTop? 0 : 20 }} variant="standard">
      <InputLabel
        id={id}
        style={{ color: focus ? "#1976D2" : "black", fontSize: 18 }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={value ? value : ""}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => onChange(e.target.value)}
      >
        {listData.map((item, index) => {
          return (
            <MenuItem style={{ maxWidth: 200 }} key={index} value={Object.keys(item)[0]}>
              {Object.values(item)[0]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default SelectComponent;
