import { Avatar, Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MoneyIcon from '@mui/icons-material/Money';
import {centsToDollars, niceMoney} from '../../utils/toHumanDollars';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  negative: {
    color: "#FF4B4B",
    fontWeight: "bold"
  },
  positive: {
    color: "#0F5BFF",
    fontWeight: "bold"
  }
});

export const StockProfitStat = (props) => {
  const {statsData, activePortfolio} = props;
  console.log(statsData);

  const classes = useStyles();

  const handleClick = (e) => {
    e.preventDefault();
    props.setActiveStat("stock-profit")
  };

  const getPercentageChange = (oldNumber, newNumber) => {
    const decreaseValue = oldNumber - newNumber;
    const result = (decreaseValue / oldNumber) * 100
    // if (oldNumber < newNumber)
    return result;
}

  return (
    <button className="stats" onClick={handleClick}>
      <Card
      sx={{ height: '100%', width: '100%' }}
      {...props}
    >
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
          onClick={handleClick}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
            >
              Stock Profit
            </Typography>
            <Typography
              className={
                statsData[activePortfolio] &&
                niceMoney(statsData[activePortfolio].this_month_growth_stocks) < 0 ? classes.negative : classes.positive
                }
              color="textSecoundary"
              variant="h4"
            >
              {statsData[activePortfolio] && niceMoney(statsData[activePortfolio].this_month_growth_stocks)}
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
          {
            statsData[activePortfolio] &&
            statsData[activePortfolio].total_stock_assets === 0 && ''
            }
          {
            statsData[activePortfolio] &&
            getPercentageChange(statsData[activePortfolio].last_month_growth_stocks,
                                statsData[activePortfolio].this_month_growth_stocks) < 0 &&
            <ArrowDownwardIcon color="error" />}
          {
            statsData[activePortfolio] &&
            getPercentageChange(statsData[activePortfolio].last_month_growth_stocks,
              statsData[activePortfolio].this_month_growth_stocks) > 0 &&
            <ArrowUpwardIcon color="primary" />}
          <Typography
            color="error"
            sx={{
              mr: 1
            }}
            variant="body2"
          >
            {
              statsData[activePortfolio] &&
              getPercentageChange(statsData[activePortfolio].last_month_growth_stocks,
                statsData[activePortfolio].this_month_growth_stocks) === NaN &&
              "No Data"}
            {
              statsData[activePortfolio] &&
              niceMoney(statsData[activePortfolio].this_month_growth_stocks) !== 0 &&
              getPercentageChange(statsData[activePortfolio].last_month_growth_stocks, statsData[activePortfolio].this_month_growth_stocks).toFixed(2)}
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
