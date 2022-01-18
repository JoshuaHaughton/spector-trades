import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const messageObj = {
  DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
  DUPLICATE_USERNAME: "DUPLICATE_USERNAME",
  DUPLICATE_BOTH: "DUPLICATE_BOTH",
  OK: "OK",
  BAD_LOGIN: "BAD_LOGIN",
  SERVER_UNREACHABLE: "SERVER_UNREACHABLE"
}
const severityObj = {
  error: 'error',
  success: 'success'
};


function ErrorSnackbar(props) {
  const { open, message, handleClose, severity } = props;


  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '95vw' }}>
          {message === "OK" && "Congratulations on joining Spector👻👻👻!"}
          {message === "DUPLICATE_BOTH" && "The email and username provided are already in use, please choose again"}
          {message === "DUPLICATE_EMAIL" && "The email provided is already in use, please pick a different one"}
          {message === "DUPLICATE_USERNAME" && "The username provided is already in use, please choose again"}
          {message === "BAD_LOGIN" && "The username or password is incorrect, please try again"}
          {message === "SERVER_UNREACHABLE" && "The server was unreachable"}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

module.exports = { ErrorSnackbar, severityObj, messageObj };
