import * as React from 'react';

// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Container from '@mui/material/Container';
// import Typography from '../components/Typography';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Feed } from '@mui/icons-material';


import {Box, Grid, Container, Typography} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ClassNames } from '@emotion/react';

const useStyles = makeStyles({
  label: {color: "#514BB8"}, // a nested style rule
});


const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function Features() {
  const classes = useStyles();
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'white', flexDirection: 'column', pt: 8, fontSize: "24px" }}
    >
        <Box
          sx={{textAlign: "center"}}
        >
          <h2>Learn to trade without <span className={classes.label}>breaking the bank!</span></h2>
        </Box>

      <Container maxWidth="xl" sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
        <Box
          // component="img"
          // src="/static/themes/onepirate/productCurvyLines.png"
          // alt="curvy lines"
          sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>

              <AccountBalanceIcon sx={{ fontSize: '60px', color: "#514BB8"}} />

              <Typography variant="h5" sx={{ my: 5 }}>
                Study Your Gains
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {
                  'Spec Money allows you to practice market strategies and skills with no real risk!'
                }
              </Typography>
              <br/>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                'Focus on creating your next plan of action without worrying about going broke.'
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <BarChartIcon sx={{ fontSize: '60px', color: "#514BB8"}} />
              <Typography variant="h5" sx={{ my: 5 }}>
                Sophisticated Analytics
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {
                  'With our dynamic charts and historical data, you can accurately track your favourite investment assets without fail.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Feed sx={{ fontSize: '60px', color: "#514BB8"}} />
              <Typography variant="h5" sx={{ my: 5 }}>
                Insider knowledge
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {"Through our Newsfeed, you can do things like interact with other experienced traders, as well as see the most recent articles about your specific assets." }
              </Typography>
              <br/>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {"With a community of skilled investors behind you, you can't go wrong!"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Features;
