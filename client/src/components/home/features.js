import * as React from 'react';

// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Container from '@mui/material/Container';
// import Typography from '../components/Typography';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Feed } from '@mui/icons-material';

import {Box, Grid, Container, Typography} from '@mui/material';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function Features() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'white', flexDirection: 'column', pt: 8, fontSize: "24px" }}
    >
        <Box
          sx={{textAlign: "center"}}
        >
          <h2>Learn to trade without breaking the bank!</h2>
        </Box>

      <Container maxWidth="xl" sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
        <Box
          component="img"
          src="/static/themes/onepirate/productCurvyLines.png"
          alt="curvy lines"
          sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>

              <AccountBalanceIcon sx={{ fontSize: '60px'}} />

              <Typography variant="h5" sx={{ my: 5 }}>
                Invest and Profit
              </Typography>
              <Typography variant="h6">
                {
                  'From the latest trendy boutique hotel to the iconic palace with XXL pool'
                }

                {
                  ', go for a mini-vacation just a few subway stops away from your home.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <BarChartIcon sx={{ fontSize: '60px'}} />
              <Typography variant="h5" sx={{ my: 5 }}>
                Sophisticated Analytics
              </Typography>
              <Typography variant="h6">
                {
                  'Privatize a pool, take a Japanese bath or wake up in 900m2 of garden… '
                }

                {'your Sundays will not be alike.'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Feed sx={{ fontSize: '60px'}} />
              <Typography variant="h5" sx={{ my: 5 }}>
                Insider knowledge
              </Typography>
              <Typography variant="h6">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Features;