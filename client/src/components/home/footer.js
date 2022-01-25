import * as React from 'react';

import {Box, Grid, Link, Container, Typography, TextField } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <Link color="inherit" href="https://github.com/JoshuaHaughton/spector-trades/">
        Spector Trades
      </Link>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
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
      sx={{ display: 'flex', bgcolor: 'secondary.light' }}
    >
      <Container sx={{ my: 8, display: 'flex' }}>
        <Grid container spacing={5} alignItems='end'>
          <Grid item xs={6} sm={4} md={3} lg={6}>
            <Box
              direction="column"
              justifyContent="flex-end"
              spacing={2}
            >
                <Box component="a" href="https://instagram.com/" >
                  <img
                      src="/static/images/spector-trades-logo-2-cropped.svg"
                      alt="Spector Trades"
                      height="80px"
                    />
                </Box>
                <Copyright />
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
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
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
