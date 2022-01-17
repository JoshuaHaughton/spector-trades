import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ErrorSnackbar(props) {
  const { open, message, handleClose, severity } = props;


  console.log(message)
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '95vw' }}>
          {message === "OK" && "Congratulations on joining Spector👻👻👻!"}
          {message === "DUPLICATE_EMAIL" && "The email provided is already in use, please pick a different one"}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

