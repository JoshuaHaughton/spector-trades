import { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MoneyIcon from '@mui/icons-material/Money';
import {centsToDollars, niceMoney} from '../../utils/toHumanDollars';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  custom: {
    color: "#FF4B4B",
    fontWeight: "bold"
  }
});

export const StockProfitStat = (props) => {
  const [state, setState] = useState({
    profit: 0,
    lastMonthProfit: 0,
    profitChange: 0,
    hasStocks: false,
    loading: true
  });

  const classes = useStyles();
//   const {assetPerformance, dashboardState, activePortfolio} = props;
//   console.log(props)
//   const assetOrders = [];
//   const totalInvested = centsToDollars(dashboardState.total_stock_assets);
//   let currentValue = 0;
//   const noAssets = false;
//   let lastMonthValue = 0;
//   let lastMonthSpent = 0;
//   let lastMonthProfit = 0;
//   let existedLastMonth = false;
//   let currentProfit;
//   const monthAgo = new Date(new Date().setHours(0, 0, 0, 0))
//   monthAgo.setMonth(monthAgo.getMonth() - 1);
//   monthAgo.setDate(monthAgo.getDate() - 2);
//   console.log("monthAgo: ", monthAgo)

//   if (monthAgo.getTime() > new Date(dashboardState.portfolioInfo.created_at)) {
//     existedLastMonth = true;
//   }
//   dashboardState.assets.forEach(asset => {
//     if (asset.type === 'Stocks' && assetPerformance.stocks[asset.symbol] != undefined) {
//       assetOrders.push({
//         ...asset,
//         initialCostDollars: centsToDollars((asset.price_at_purchase) * asset.units),
//         currentPrice: assetPerformance.stocks[asset.symbol][0].close
//       });
//       if (asset.sold) {
//         if (new Date(asset.created_at) <= monthAgo) {
//           lastMonthValue -= assetPerformance.stocks[asset.symbol][20].close * asset.units;
//         }
//         currentValue -= (assetPerformance.stocks[asset.symbol][0].close) * asset.units;
//       } else {
//         if (new Date(asset.created_at) <= monthAgo.getTime()) {
//           lastMonthValue += assetPerformance.stocks[asset.symbol][20].close * asset.units;
//         }
//         currentValue += (assetPerformance.stocks[asset.symbol][0].close) * asset.units;
//       }
//     }
//   });
//   if (assetOrders.length === 0) {
//     noAssets = true;
//   }
//   assetOrders.forEach(asset => {
//     if (!asset.sold) {
//       if (new Date(asset.created_at) <= monthAgo.getTime()) {
//         lastMonthSpent +=  asset.units * asset.price_at_purchase
//       }
//     } else {
//       if (new Date(asset.created_at) <= monthAgo.getTime()) {
//         lastMonthSpent -=  asset.units * asset.price_at_purchase
//       }
//     }
//   });
//   lastMonthSpent = centsToDollars(lastMonthSpent);
//   lastMonthProfit = lastMonthValue - lastMonthSpent;
//   useEffect(() => {
//     setState(prev => {
//       let setHasStocks = false;
//       let currentProfit;
//       let makeLoad = false;

//       if (assetOrders.length > 0) {
//         setHasStocks = true;
//       }
//       console.log("IN SETSTATE currentValue: ", currentValue)
//       console.log("IN SETSTATE totalInvested: ", totalInvested)

//       if (currentValue !== 0) {
//         let currentProfit = niceMoney(currentValue - centsToDollars(dashboardState.total_stock_assets));
//       } else {
//         makeLoad = true;
//       }
//       return {
//         ...prev,
//         lastMonthProfit: lastMonthProfit,
//         profitChange: getProfitChange(state.profit, state.lastMonthProfit),
//         hasStocks: setHasStocks,
//         profit: currentProfit,
//         loading: false
//       }
//     });

//         // console.log("last month value: ", lastMonthValue)
//         // console.log("Current profit: ", currentProfit)

//         // console.log("stock assets: ", assetOrders)
//         // console.log("total invested: ", totalInvested)
//         // console.log("current evaluation: ", currentValue)
//         // console.log("props Data", props)
//         // console.log("state data: ", state)
//         // console.log("last month spent: ", lastMonthSpent)
//         // console.log("last month profit: ", lastMonthProfit)
//         // console.log("Change in profit from last month: ", lastMonthProfit)
//         // console.log(state)

//   }, [props.activeStat]);
// console.log(state)
  const handleClick = (e) => {
    e.preventDefault();
    props.setActiveStat("stock-profit")
  };

//   const getProfitChange = (thisMonth, lastMonth) => {
//     if (thisMonth < 0 && lastMonth < 0) {
//       return (thisMonth - lastMonth).toFixed(2);
//     }
//     if (thisMonth > 0 && lastMonth < 0) {
//       return -1 * ((thisMonth - lastMonth).toFixed(2));
//     }
//     if (thisMonth < 0 && lastMonth > 0) {
//       return -1 * (thisMonth - lastMonth).toFixed(2);
//     }
//   };

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
              className={state.profit < 0 && classes.custom}
              color="textSecoundary"
              variant="h4"
            >
            <CircularProgress />
              {/* {state.loading ? <CircularProgress /> : state.profit} */}
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
          {(state.profitChange < 0 ? <ArrowDownwardIcon color="error" /> : <ArrowUpwardIcon color="primary" />)}
          <Typography
            color="error"
            sx={{
              mr: 1
            }}
            variant="body2"
          >
            {/* {state.hasStocks && state.profitChange} */}
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
