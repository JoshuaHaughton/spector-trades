import * as React from 'react';

import {Box, Grid, Link, Container, Typography, TextField } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Copyright() {
  return (
    <Box sx={{display: "flex", justifyContent: "space-evenly", width: "25%"}}>
      <Link color="secondary" href="https://github.com/JoshuaHaughton/spector-trades/">
      {'© '}
      {`Spector Trades `}
      {new Date().getFullYear()}
      </Link>{' '}
    </Box>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'warning.main',
  mr: 1,
  '&:hover': {
    bgcolor: 'warning.dark',
  },
};

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
];

export default function Footer() {

  return (
    <Typography
      component="footer"
      sx={{ display: 'flex', bgcolor: '#242424' }}
    >
      <Container sx={{ my: 8, display: 'flex', justifyContent: "center" }}>
        <Grid container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", width: "75%"}}>
          <Grid item sx={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: "center", padding: 0, width: "100%"}} xs={12} sm={12} md={12} lg={12}>


            <Box
              direction="column"
              justifyContent="flex-end"
              spacing={2}
            >
                <Box component="a" href="https://instagram.com/" >
                  <img
                      src="/static/images/Find-Investments-Find-Wealth.svg"
                      alt="Spector Trades"
                      height="150px"
                    />
                </Box>
            </Box>

                <Copyright />


            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", mt: 2}}>


            <Typography variant="h6" marked="left" gutterBottom>
              Team:
            </Typography>

            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0, ml: 3 }}>

              <Box component="li" sx={{ py: 0.1 }}>
                <Link href="https://github.com/Drumshtick">Erik</Link>
              </Box>
              <Box component="li" sx={{ py: 0.1 }}>
                <Link href="https://github.com/JoshuaHaughton">Josh</Link>
              </Box>
              <Box component="li" sx={{ py: 0.1 }}>
                <Link href="https://github.com/kencruz">Ken</Link>
              </Box>


              </Box>



            </Box>


          </Grid>




          {/* <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Team
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="https://github.com/Drumshtick">Erik</Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="https://github.com/JoshuaHaughton">Josh</Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="https://github.com/kencruz">Ken</Link>
              </Box>
            </Box>
          </Grid> */}
          {/* <Grid item>
            <Typography variant="caption">
              {'Icons made by '}
              <Link href="https://www.freepik.com" rel="sponsored" title="Freepik">
                Freepik
              </Link>
              {' from '}
              <Link href="https://www.flaticon.com" rel="sponsored" title="Flaticon">
                www.flaticon.com
              </Link>
              {' is licensed by '}
              <Link
                href="https://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0 BY
              </Link>
            </Typography>
          </Grid> */}
        </Grid>
      </Container>
    </Typography>
  );
}
