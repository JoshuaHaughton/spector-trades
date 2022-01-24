import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MoneyIcon from '@mui/icons-material/Money';

export const CryptoProfitStat = (props) => {
  const { assets, assetPerformance } = props;
  const handleClick = (e) => {
    e.preventDefault();
    props.setActiveStat("crypto-profit")
  };
  const initialCost = [];

  // assets.forEach(asset => {
  //   if (asset.type === 'Cryptocurrency') {
  //     initialCost.push({
  //       name: asset.name,
  //       symbol: asset.symbol,

  //     })
  //   }
  // });

  return (
    <button className="stats" onClick={handleClick} >
      <Card
      sx={{ height: '100%', width: '100%' }}
      {...props}
    >
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
            >
              Crypto Profit
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              $100k
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'error.main',
                height: 56,
                width: 56
              }}
            >
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowUpwardIcon color="success" />
          <Typography
            color="success"
            sx={{
              mr: 1
            }}
            variant="body2"
          >
            12%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
    </button>
  )};
