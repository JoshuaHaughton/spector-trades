import * as React from 'react';

import { Box, Button, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

import HeroLayout from './herolayout';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme({
//   status: {
//     danger: '#e53e3e',
//   },
//   palette: {
//     primary: {
//       main: '#3832A0',
//       darker: '#3832A0',
//     },
//     neutral: {
//       main: '#64748B',
//       contrastText: '#fff',
//     },
//   },
// });

const StyledButton = withStyles({
  root: {
    backgroundColor: '#29256A',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#777777',
      color: '#3c52b2',
  },
}})(Button);

const backgroundImage =
  '/static/images/crypto-portfolio.svg';

export default function Hero() {
  return (
    <HeroLayout
      sxBackground={{
        // backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#5048E5', // Average color of the background image.
        backgroundPosition: 'center top',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        // src={backgroundImage}
        alt="increase priority"
      />
      <Box
      sx={{
        width: '45%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        textAlign: 'left',
        alignItems: 'center'
      }}
      >
        <Typography color="inherit" align="center" variant="h2" marked="center">
          Upgrade your Stonks
        </Typography>
        <Typography
          color="inherit"
          align="center"
          variant="h5"
          sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
        >
          Enjoy secret offers up to -70% off the best luxury hotels every Sunday.
        </Typography>
        {/* <ThemeProvider theme={theme}> */}
          <StyledButton
            color="secondary"
            variant="contained"
            size="large"
            component="a"
            href="/register"
            sx={{ minWidth: 200 }}
          >
            Learn More
          </StyledButton>
        {/* </ThemeProvider> */}
      </Box>
      {/* <Box
        sx={{
          width: '5%',
          // // display: 'flex',
          // // flexWrap: 'wrap',
          // justifyContent: 'center',
          // textAlign: 'left',
          // alignItems: 'center'
        }}
      ></Box> */}

      <Box
        sx={{
          width: '45%',
          // display: 'flex',
          // flexWrap: 'wrap',
          justifyContent: 'center',
          textAlign: 'left',
          alignItems: 'center'
        }}
      >
        <img
          src={backgroundImage}
          alt="increase priority"
          width="100%"
          >
        </img>
      </Box>
      {/* <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover the experience
      </Typography> */}
    </HeroLayout>
  );
}
