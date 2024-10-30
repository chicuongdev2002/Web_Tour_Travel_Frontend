import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

function ModalComponent({ children, open, onclose, title }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onclose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ paddingTop: 0}}>
          { title && <Typography id="modal-modal-title" className='text-center' variant="h3" component="h2">
            {title}
          </Typography>}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {children}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
export default ModalComponent