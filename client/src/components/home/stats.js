import { Avatar, Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Likes = (props) => (
  <Card sx={{display: 'flex', alignItems: 'center'}} {...props}>
       <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Posts Liked
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            $23k
          </Typography>
        </CardContent>
        <CardMedia
            component="img"
            sx={{ height: '100%' }}
            image="/static/images/sitting-bitcoin.svg"
            alt="Live from space album cover"
          />
      </Box>

  </Card>
);

const PortfoliosCreated = (props) => (
  <Card sx={{display: 'flex', alignItems: 'center'}} {...props}>
       <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Portfolios Created
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            $23k
          </Typography>
        </CardContent>
        <CardMedia
            component="img"
            sx={{ height: '100%' }}
            image="/static/images/group-chart.svg"
            alt="Live from space album cover"
          />
      </Box>

  </Card>
);

const SpecBucksSpent = (props) => (
  <Card sx={{display: 'flex', alignItems: 'center'}} {...props}>
       <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Spec Bucks Spent
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            $23k
          </Typography>
        </CardContent>
        <CardMedia
            component="img"
            sx={{ height: '100%' }}
            image="/static/images/personal-finance.svg"
            alt="Live from space album cover"
          />
      </Box>

  </Card>
);

const AssetsTracked = (props) => (
  <Card sx={{display: 'flex', alignItems: 'center'}} {...props}>
       <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Assets Tracked
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            $23k
          </Typography>
        </CardContent>
        <CardMedia
            component="img"
            sx={{ height: '100%', objectPosition: 'top right' }}
            image="/static/images/crypto-flowers.svg"
            alt="Live from space album cover"
          />
      </Box>

  </Card>
);



export default function HomeStats() {
  return (
    <Grid container spacing={3} sx={{p: 3}}>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <AssetsTracked sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <SpecBucksSpent sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12} >
        <PortfoliosCreated sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <Likes sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}