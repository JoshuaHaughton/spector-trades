import * as React from 'react';

import { Box, Button, Typography } from '@mui/material';
import { withStyles, makeStyles } from '@mui/styles';

import HeroLayout from './herolayout';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-scroll';

const useStyles = makeStyles({
  label: {color: "#29256A"}, // a nested style rule
});

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
    backgroundColor: '#29256a',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#29256A',
  },
}})(Button);

const backgroundImage =
  '/static/images/crypto-portfolio.svg';

export default function Hero() {
  const classes = useStyles();
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
        width: '40%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        textAlign: 'left',
        alignItems: 'center'
      }}
      >
        <Typography color="inherit" align="center" variant="h2" marked="center">
          Make huge trades, without the risk.
        </Typography>
        <Typography
          color="inherit"
          align="center"
          variant="h5"
          sx={{ mb: 6, mt: { sx: 4, sm: 10 } }}
        >
          At Spector Trades, <span className={classes.label}>you're</span> in the big leagues!
        </Typography>
        {/* <ThemeProvider theme={theme}> */}
        <Link to="features" spy={true} smooth={true} duration={1000}>
          <StyledButton
            // color="secondary"
            variant="contained"
            size="large"
            component="a"
            sx={{ minWidth: 200 }}
          >
            Learn More
          </StyledButton>
        </Link>
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
