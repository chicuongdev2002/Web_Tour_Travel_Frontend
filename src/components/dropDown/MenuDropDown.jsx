import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import './style.css'

export default function MenuDropDown({ children, options }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        className="m-0 bg-transparent border-0 p-0"
        onClick={handleClick}
      >
        {children}
      </Button>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: 48 * 4.5,
              maxWidth: '21ch',
            },
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} selected={option === 'Pyxis'} onClick={()=>{
            handleClose();
            option.onClick();
          }}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}