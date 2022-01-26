import { Avatar, Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const useStyles = makeStyles({
  label: {color: "#A3A3A3"}, // a nested style rule
});

const Title = (props) =>  {
  const classes = useStyles();
  return (

          <Typography
            color="white"
            variant="h2"
            sx={{
              textAlign: 'center',
              // zIndex: "10",
              backgroundColor: "transparent",
              width: '80%',
              // justifySelf: 'center',
              flexWrap: 'wrap',
              mb: 10
            }}
          >
            At Spector, we're serious about <span className={classes.label}>driving results.</span>  Check it out:
          </Typography>

)};

const Likes = (props) => (
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
            2493
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
            Spec Bucks Generated
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            $500m
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
            $424m
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
            8,124
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
    <>
    <Grid container spacing={3} sx={{mt: 0, pt: 4, pb: 12, backgroundColor: '#514BB8'}}>
      <Grid item lg={12} sm={12} xl={12} xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
        <Title />
      </Grid>
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
    </>
  );
}
