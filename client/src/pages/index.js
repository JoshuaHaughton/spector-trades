import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { PortfolioTabs } from '../components/spector-dashboard/portfolio-tabs';
import { PortfolioStats } from '../components/spector-dashboard/portfolio-stats';
import { HeroGraph } from '../components/spector-dashboard/hero-graph';
import { GroupedAssets } from '../components/spector-dashboard/grouped-assets';
import { IndividualAssets } from '../components/spector-dashboard/individual-assets';
import {centsToDollars, niceMoney} from '../utils/toHumanDollars';
import { DashboardLayout } from '../components/dashboard-layout';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import api from "../apis/api";

import axios from 'axios';
import { SpectorSpeedDial } from 'src/components/spector-dashboard/speed-dial';
const Dashboard = () => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardState, setDashboardState] = useState({});
  const [activePortfolio, setActivePortfolio] = useState(0);
  const [activeGraphData, setActiveGraphData] = useState({
    options: {},
    series: []
  });
  const [activeStat, setActiveStat] = useState("crypto_profit");
  const [assetPerformanceCrypto, setAssetPerformanceCrypto] = useState({
  });
  const [assetPerformanceStocks, setAssetPerformanceStocks] = useState({
  });
  const [currencyConversion, setCurrencyConversion] = useState({});
  const [statsData, setStatsData] = useState({});
  console.log("activeStat: ", activeStat)
  // console.log("asset performance: ", assetPerformanceStocks, assetPerformanceCrypto);
  // console.log("active graph: ", activeGraphData);
  // console.log("activePortfolio: ", activePortfolio);
  console.log("dashboardState: ", dashboardState);
  // console.log("assetPerformance: ", assetPerformance)
  // console.log("activeDashboard: ", dashboardState[activePortfolio]);
  // TODO: REFACTOR!
  const refreshDashboardState = () => {
    const fetchData = async () => {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        const response = await api.get('/dashboard', config).then(response => {
          // console.log("auth data", response.data)
          if (response.status === 200) {
            setDashboardState(response.data);
          }
        })
    };
    fetchData();
  };
  const assetData = {};

  const getAssetPerformanceData = () => {
    const cryptoAssets = [];
    const stockAssets = [];
    const portfolioData = Object.values(dashboardState);
    const portfolioCreatedAt = [];

    portfolioData.forEach(portfolio => {
      portfolioCreatedAt.push(portfolio.portfolioInfo.created_at)
      const assets = Object.values(portfolio.assets);

      assets.forEach(asset => {
        if (asset.type === 'Cryptocurrency') {
          cryptoAssets.push({
            name: asset.name,
            units: asset.units,
            price_at_purchase: asset.price_at_purchase,
            sold: asset.sold,
            start_date: asset.created_at
          });
        }

        if (asset.type === 'Stocks') {
          stockAssets.push({
            name: asset.symbol,
            units: asset.units,
            price_at_purchase: asset.price_at_purchase,
            sold: asset.sold
          });
        }
      });
    });
    portfolioCreatedAt.sort(function(a, b) {
      return Date.parse(a) - Date.parse(b);
    });

    const oldestDate = new Date(new Date(portfolioCreatedAt[0]).setHours(0, 0, 0, 0));
    const stockNames = [];
    if (stockAssets.length > 0) {
      stockAssets.forEach((stock) => {
        stockNames.push(stock.name);
      });
    }
    axios.post('api/stockHistorical', {id: stockNames})
      .then(res => {
        if (assetData.stocks === undefined) {
          assetData['stocks'] = {};
        }
        const stockData = res.data;
        const stockDataKeys = Object.keys(stockData);
        stockDataKeys.forEach(key => {
          if (stockNames.includes(key)) {
            if (stockNames.length === 1) {
              const stockPriceValues = stockData[key];
              assetData.stocks[key] = [];
              stockPriceValues.forEach(price => {
                price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
                price.close = currencyConversion.CAD * price.close;
                price.high = currencyConversion.CAD * price.high;
                price.low = currencyConversion.CAD * price.low;
                price.open = currencyConversion.CAD * price.open;
                assetData.stocks[key].push(price);
              });
            } else {
              const stockPriceValues = stockData[key].values;
              assetData.stocks[key] = [];
              stockPriceValues.forEach(price => {
                price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
                price.close = currencyConversion.CAD * price.close;
                price.high = currencyConversion.CAD * price.high;
                price.low = currencyConversion.CAD * price.low;
                price.open = currencyConversion.CAD * price.open;
                assetData.stocks[key].push(price);
              });

            }
          }
        });
        setAssetPerformanceStocks({...assetPerformanceStocks, stocks: assetData['stocks']})
      })
      .catch(err => {console.log("ERR IN STOCKS HISTORICAL: ", err)})
      cryptoAssets.forEach(asset => {
      axios.post('api/cryptoHistorical', {id: asset.name}).then(res => {
        if (assetData.crypto === undefined) {
          assetData['crypto'] = {};
        }
        const cryptoData = res.data;
        assetData.crypto[asset.name] = [];
        cryptoData.forEach((day, index) => {
          const currentDay = new Date(new Date(day[0]).setHours(0, 0, 0, 0));
          if (currentDay.getTime() >= oldestDate.getTime()) {
            assetData.crypto[asset.name].push({date: new Date(new Date(day[0]).setHours(0, 0, 0, 0)), data: day[1]});
          }
        });
        setAssetPerformanceCrypto(prev => {
          return {crypto: assetData.crypto}
        })
      }).catch(err => console.log("ERROR in getHistoricalCrypto: ", err));

    })
    // console.log("assetData: ", assetData)
    // setAssetPerformance(assetData);
      // console.log("assetPerformance: ", assetPerformance)
      // console.log("dashboardState: ", dashboardState)
      // console.log("assetPerformance: ", assetPerformance)
    };

    useEffect(() => {
        if (assetPerformanceStocks.stocks !== undefined && assetPerformanceCrypto.crypto !== undefined) {
          parseStats(assetPerformanceStocks, assetPerformanceCrypto, dashboardState);
        }
    }, [assetPerformanceStocks, assetPerformanceCrypto]);


  const parseStats = (assetPerformanceStocks, assetPerformanceCrypto, dashboardState) => {

    // console.log("______________________________________________________")

    if (assetPerformanceStocks.stocks === undefined || assetPerformanceCrypto.crypto === undefined) {
      return;
    }
    console.log("assetPerformanceStocks to parseStats: ", assetPerformanceStocks)
    console.log("assetPerformanceCrypto to parseStats: ", assetPerformanceCrypto)
    // console.log("dashboardState to parseStats: ", dashboardState)
    const dashboardWithStats = {};
    const monthAgo = new Date(new Date().setHours(0, 0, 0, 0))
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setDate(monthAgo.getDate() - 2);

    const dashboards = Object.values(dashboardState);
    dashboards.forEach(dashboard => {
      const assetOrdersStocks = [];
      const assetOrdersCrypto = [];

      let noAssets = false;
      let totalInvestedStocks = 0;
      let currentValueStocks = 0;
      let lastMonthValueStocks = 0;
      let lastMonthSpentStocks = 0;
      let lastMonthProfitStocks = 0;
      let totalInvestedCrypto = 0;
      let currentValueCrypto = 0;
      let lastMonthValueCrypto = 0;
      let lastMonthSpentCrypto = 0;
      let lastMonthProfitCrypto = 0;
      let existedLastMonth = false;
      let currentProfit;
      // console.log("dashboard: ", dashboard)
      // console.log("HERE: ", dashboard.total_stock_assets)
      totalInvestedStocks = centsToDollars(dashboard.total_stock_assets)
      dashboardWithStats[dashboard.portfolioInfo.id] = dashboard;

      dashboard.assets.forEach(asset => {
        //console.log("asset symbol: ", assetPerformance["stocks"]['BLNK'])
        //console.log("asset performance: ", assetPerformance.stocks)

        // console.log("asset performance: ", assetPerformance.stocks.BLNK)
        if (asset.type === 'Stocks' && Object.keys(assetPerformanceStocks.stocks).length > 0) {

          // console.log("_______________HERE: ", assetPerformanceStocks.stocks[asset.symbol][20])
          assetOrdersStocks.push({
            ...asset,
            initialCostDollars: centsToDollars((asset.price_at_purchase) * asset.units),
            currentPrice: assetPerformanceStocks.stocks[asset.symbol][0].close
          });
          if (asset.sold) {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthValueStocks -= assetPerformanceStocks.stocks[asset.symbol][20].close * asset.units;
            }
            currentValueStocks -= (assetPerformanceStocks.stocks[asset.symbol][0].close) * asset.units;
          } else {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthValueStocks += assetPerformanceStocks.stocks[asset.symbol][20].close * asset.units;
            }
            currentValueStocks += (assetPerformanceStocks.stocks[asset.symbol][0].close) * asset.units;
          }
        }
        if (asset.type === 'Cryptocurrency' && assetPerformanceCrypto.crypto[asset.name] !== undefined) {
          assetPerformanceCrypto.crypto[asset.name].reverse()
          // console.log("lastMonthValueCrypto in calc: ",  assetPerformanceCrypto.crypto[asset.name][0])
          assetOrdersCrypto.push({
            ...asset,
            initialCostDollars: centsToDollars((asset.price_at_purchase) * asset.units),
            currentPrice: assetPerformanceCrypto.crypto[asset.name][0].data
          });
          if (asset.sold) {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthValueCrypto -= assetPerformanceCrypto.crypto[asset.name][20].data * asset.units;
            }
            currentValueCrypto -= (assetPerformanceCrypto.crypto[asset.name][0].data) * asset.units;
          } else {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthValueCrypto += assetPerformanceCrypto.crypto[asset.name][20].data * asset.units;
            }
            currentValueCrypto += (assetPerformanceCrypto.crypto[asset.name][0].data) * asset.units;
          }
        }
        // console.log(lastMonthValue)
      });
      assetOrdersStocks.forEach(asset => {
        if (!asset.sold) {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthSpentStocks +=  asset.units * asset.price_at_purchase
          }
        } else {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthSpentStocks -=  asset.units * asset.price_at_purchase
          }
        }
      });
      assetOrdersCrypto.forEach(asset => {
        if (!asset.sold) {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthSpentCrypto +=  asset.units * asset.price_at_purchase
          }
        } else {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthSpentCrypto -=  asset.units * asset.price_at_purchase
          }
        }
      });
      lastMonthSpentStocks = (lastMonthSpentStocks / 100).toFixed(2);
      lastMonthSpentCrypto = (lastMonthSpentCrypto / 100).toFixed(2);

      dashboardWithStats[dashboard.portfolioInfo.id]["current_stocks_value"] = Number(currentValueStocks.toFixed(2));
      dashboardWithStats[dashboard.portfolioInfo.id]["last_month_growth_stocks"] = Number((lastMonthValueStocks - lastMonthSpentStocks));
      dashboardWithStats[dashboard.portfolioInfo.id]["this_month_growth_stocks"] = Number((currentValueStocks - (dashboard.total_stock_assets / 100)));
      dashboardWithStats[dashboard.portfolioInfo.id]["current_crypto_value"] = Number(currentValueCrypto.toFixed(2));
      dashboardWithStats[dashboard.portfolioInfo.id]["last_month_growth_crypto"] = Number((lastMonthValueCrypto - lastMonthSpentCrypto));
      dashboardWithStats[dashboard.portfolioInfo.id]["this_month_growth_crypto"] = Number((currentValueCrypto - (dashboard.total_crypto_assets / 100)));
      // console.log("FOR DASHBOARD: ", dashboard.portfolioInfo.name)
      // console.log("monthAgo: ", monthAgo)
      // console.log("assetOrdersCrypto: ", assetOrdersCrypto)
      // console.log("totalInvestedCrypto: ", totalInvestedCrypto)
      // console.log("currentValueCrypto: ", currentValueCrypto)
      // console.log("lastMonthValueCrypto: ", lastMonthValueCrypto)
      // console.log("lastMonthSpentCrypto: ", lastMonthSpentCrypto)
      // console.log("lastMonthProfitCrypto: ", lastMonthProfitCrypto)
      console.log("dashboardWithStats: ", dashboardWithStats)
      setStatsData(dashboardWithStats, () => {console.log(setStatsData)});
    })
  };


  useEffect(() => {
    const data = [];
    const xData = [];
    let tmp = [];
    let yMax, yMin;
    let graphName, graphType, xAxis, yAxis, chartSettings;
    if (activeStat === 'spec_money') {
      chartSettings = {
        type: graphType,
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      }
      xAxis =  {
        type: 'datetime',
        name: 'date',
        categories: xData
      }
      yAxis = {
        max: yMax,
        labels: {
          formatter: function (val) {
            return val.toFixed();
          },
        },
        title: {
          text: 'Price'
        },
        min: yMin
      }
      graphType = 'area';
      graphName = "Speculative money"
      yMin = 0;
      yMax = (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) + (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) * 0.1)) / 100
      // dashboardState[activePortfolio]
      data.push((Number(dashboardState[activePortfolio].portfolioInfo.spec_money)) / 100)
      xData.push(dashboardState[activePortfolio].portfolioInfo.created_at)
      dashboardState[activePortfolio].assets.forEach((item, i) => {
        if (!item.sold) {
          data.push((data[i] - ((item.price_at_purchase * item.units) / 100)))
        }

        if (item.sold) {
          data.push((data[i] + ((item.price_at_purchase * item.units) / 100)))
        }
        xData.push(item.created_at)
      });
      // console.log("data: ", data)
      // console.log("Xdata: ", xData)
      // console.log("Y max: ", yMax);
    }

    if (activeStat === "stock_profit"  &&
    dashboardState[activePortfolio] !== undefined &&
    statsData[activePortfolio] !== undefined &&
    Object.keys(assetPerformanceStocks.stocks).length > 0
    ) {
      yAxis = {
        labels: {
          formatter: function (val) {
            return val.toFixed();
          },
        },
        title: {
          text: 'Profit'
        },
        tooltip: {
          enabled: true
        }
      }
      xAxis =  {
        type: 'datetime',
      }
      graphType = 'candlestick';
      graphName = "Stock profit by day"
      chartSettings = {
        type: graphType,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      }
      // console.log("Asset performance (stocks): ", assetPerformanceStocks)
      // console.log("statsData activeStat: ", statsData)
      let portfolioData = statsData[activePortfolio]
      let portfolioStartedOn = new Date(new Date(dashboardState[activePortfolio].portfolioInfo.created_at).setHours(0, 0, 0, 0))
      let earliestInvestment;
      console.log("Portfolio Start date: ", portfolioStartedOn)
      const dates = [];
      portfolioData.assets.forEach(asset => {
        // console.log(asset)
        if (asset.type === "Stocks") {
          dates.push({symbol: asset.symbol, name: asset.name, date: asset.created_at})
        }
      })
      dates.sort(function(a, b) {
        return Date.parse(a.date) - Date.parse(b.date);
      });
      // console.log("DATES: ", dates)
      let graphStartDate;
      assetPerformanceStocks.stocks[dates[0].symbol].forEach((day, i) => {
        if (day.datetime.getTime() === new Date(dates[0].date).getTime()) {
          graphStartDate = i;
        }
      })
      // console.log("Graph start date: ", graphStartDate)
      const profitForAsset = {};
      portfolioData.assets.forEach(asset => {
        if (asset.type === 'Stocks') {
          profitForAsset[asset.symbol] = {};
          // console.log(asset)
          // console.log("HERE: ", assetPerformanceStocks.stocks[asset.symbol])
          assetPerformanceStocks.stocks[asset.symbol].forEach((day, i) => {
            let openValue = 0;
            let closeValue = 0;
            let amountSpent = 0;
            if (i <= graphStartDate) {
              if (asset.sold) {
                openValue -= asset.units * day.open;
                closeValue -= asset.units * day.close;
                amountSpent -= asset.units * (asset.price_at_purchase / 100)
              } else {
                openValue += asset.units * day.open;
                closeValue += asset.units * day.close;
                amountSpent += asset.units * (asset.price_at_purchase / 100)
              }
            }
            profitForAsset[asset.symbol][(day.datetime)] = {
                openProfit: openValue - amountSpent,
                closeProfit: closeValue - amountSpent,
              }
          })
        }

      })
      // console.log("profitForAsset: ", profitForAsset);
      // console.log("length of profitForAsset: ", Object.values(profitForAsset.BLNK))

      const profitForAssetKeys = Object.keys(profitForAsset);
      // console.log("TEST: ", profitForAsset.BLNK[1636351200000])
      const overallProfit = [];
      assetPerformanceStocks.stocks[dates[0].symbol].forEach((day, i) => {
        let totalProfitOpen = 0;
        let totalProfitClose = 0;
        if (i <= graphStartDate) {
          profitForAssetKeys.forEach(asset => {
            // console.log(new Date(day.datetime).getTime())
            // console.log("LOOK HERE:", asset[new Date(day.datetime)])
            // console.log("LOOK HERE:", new Date(day.datetime))

            if (profitForAsset[asset][new Date(day.datetime)] !== undefined) {
              totalProfitOpen += profitForAsset[asset][new Date(day.datetime)].openProfit;
              totalProfitClose += profitForAsset[asset][new Date(day.datetime)].closeProfit;

            }
          })
        }
        overallProfit.push({
          date: day.datetime,
          totalProfitOpen,
          totalProfitClose
        });
      })
      // console.log("overallProfit: ", overallProfit)
      overallProfit.forEach(day => {

        data.push({
          x: day.date,
          y: [day.totalProfitOpen, day.totalProfitClose]
        })
      })

    }
    if (activeStat === "crypto_profit"  &&
    dashboardState[activePortfolio] !== undefined &&
    statsData[activePortfolio] !== undefined &&
    Object.keys(assetPerformanceCrypto.crypto).length > 0
    ) {
      yAxis = {
        labels: {
          formatter: function (val) {
            return val.toFixed();
          },
        },
        title: {
          text: 'Profit'
        },
        tooltip: {
          enabled: true
        }
      }
      xAxis =  {
        type: 'datetime',
      }
      graphType = 'candlestick';
      graphName = "Crypto profit by day"
      chartSettings = {
        type: graphType,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      }
      // console.log("Asset performance (crypto): ", assetPerformanceCrypto.crypto)
      let portfolioData = statsData[activePortfolio]
      let portfolioStartedOn = new Date(new Date(dashboardState[activePortfolio].portfolioInfo.created_at).setHours(0, 0, 0, 0))
      const dates = [];
      portfolioData.assets.forEach(asset => {
        // console.log(asset)
        if (asset.type === "Cryptocurrency") {
          dates.push({symbol: asset.symbol, name: asset.name, date: asset.created_at})
        }
      })
      dates.sort(function(a, b) {
        return Date.parse(a.date) - Date.parse(b.date);
      });
      let graphStartDate;
      assetPerformanceCrypto.crypto[dates[0].name] && assetPerformanceCrypto.crypto[dates[0].name].forEach((day, i) => {
        if (day.date.getTime() === new Date(dates[0].date).getTime()) {
          graphStartDate = i;
        }
      })
      const profitForAsset = {};
      portfolioData.assets.forEach(asset => {
        if (asset.type === 'Cryptocurrency') {
          profitForAsset[asset.name] = {};
          // console.log(asset)
          if (assetPerformanceCrypto.crypto[asset.name] !== undefined) {
            assetPerformanceCrypto.crypto[asset.name].reverse();
            assetPerformanceCrypto.crypto[asset.name].forEach((day, i) => {
              let openValue = 0;
              let amountSpent = 0;
              if (i <= graphStartDate) {
                if (asset.sold) {
                  openValue -= asset.units * day.data;
                  amountSpent -= asset.units * (asset.price_at_purchase / 100)
                } else {
                  openValue += asset.units * day.data;
                  amountSpent += asset.units * (asset.price_at_purchase / 100)
                }
              }
              profitForAsset[asset.name][(day.date)] = {
                  openProfit: openValue - amountSpent,
                }
            })
          } else {
            return;
          }
        }

      })
      console.log("profitForAsset: ", profitForAsset);
      // console.log("length of profitForAsset: ", Object.values(profitForAsset.BLNK))

      const profitForAssetKeys = Object.keys(profitForAsset);
      // console.log("TEST: ", profitForAsset.BLNK[1636351200000])
      const overallProfit = [];

      assetPerformanceCrypto.crypto[dates[0].name] && assetPerformanceCrypto.crypto[dates[0].name].forEach((day, i) => {
        let totalProfitOpen = 0;
        if (i <= graphStartDate) {
          profitForAssetKeys.forEach(asset => {

            if (profitForAsset[asset][new Date(day.date)] !== undefined) {
              totalProfitOpen += profitForAsset[asset][new Date(day.date)].openProfit;

            }
          })
        }
        overallProfit.push({
          date: day.date,
          totalProfitOpen,
        });
      })
      console.log("overallProfit: ", overallProfit)
      overallProfit.reverse()
      overallProfit.forEach((day, i) => {
        if (i % 2 === 0) {
          data.push({
            x: new Date(day.date),
            y: [day.totalProfitOpen]
          })

        }
      })

    }
    setActiveGraphData({
      series: [{
        name: graphName,
        data,
      }],
      options: {
        stroke: {
          show: true,
          curve: activeStat === 'spec_money' ? 'straight' : 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        chart: chartSettings,
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },

        yaxis: yAxis,
        xaxis: xAxis,
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val.toFixed(2))
            }
          }
        }
      }
    });
    // console.log(activeGraphData)
  }, [activeStat, assetPerformanceStocks, assetPerformanceCrypto]);
  // /auth endpoint returns {success: true, token}
  useEffect(() => {

    //originally async
    const fetchData = async () => {
      try {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        console.log( config )
        api.get('/dashboard', config).then(response => {
          // console.log("auth data", response.data)
          if (response.status === 200) {
            setDashboardState(response.data);
            // get id of first portfolio
            setActivePortfolio(Object.values(response.data).map(p => p.portfolioInfo)[0].id);
            setIsAuthorized(true);
            setLoading(false);
            parseGraphData(activePortfolio);
          }
        }).catch(() => {
          // Response rejected
          setTimeout(() => {setLoading(false)}, 1000);
        });
      } catch(err) {
      }
    };

    fetchData().then(res => {
      axios.get('/api/currencyConversion')
      .then((resp) => {
        setCurrencyConversion(resp.data);
      })
      .catch(err => {
        console.log("ERROR in currencyConversion call: ", err)
      });
    });
  }, []);

  useEffect(() => {
    getAssetPerformanceData();
  }, [dashboardState])

  // useEffect, use axios to call the auth endpoint using our jwt token
  // auth endpoint validates the token, if returns true.. setIsAuthorized to true
  //
    // if (!isAuthorized) {
    //   console.log("is authed: ", isAuthorized)
    //   console.log("has authorized token");
    //   return <div>Unauthorized user</div>
    // }



  const authorizedDashboard = () => {
    if (loading) {
      return(
      <Container
        t="2"
      >
        <LinearProgress />
      </Container>
      )
    }
    if (isAuthorized) {
      return (
        <>
          {/* THIS IS THE SPEED DIAL ACTION BUTTON */}
          <SpectorSpeedDial
            refreshDashboardState={refreshDashboardState}
            portfolios={
              Object.values(dashboardState).map(portfolio => portfolio.portfolioInfo)
            }
          />

          {/* THIS IS THE PORTFOLIO TAB */}
          <Container maxWidth={false}>
            <PortfolioTabs
              portfolios={
                Object.values(dashboardState).map(portfolio => portfolio.portfolioInfo)
              }
              {...{activePortfolio, setActivePortfolio}}
              />
          </Container>

          <Container maxWidth={false}>
            <Grid
              container
              spacing={3}
            >
              {/* THIS IS THE PORTFOLIO STATS COMPONENT */}
              <Grid item
                lg={4}
                md={6}
                xl={3}
                xs={12}>
                  <PortfolioStats
                    activePortfolio={activePortfolio}
                    dashboardState={dashboardState[activePortfolio]}
                    setActiveStat={setActiveStat}
                    statsData={statsData}/>
              </Grid>

              {/* THIS IS THE HERO GRAPH COMPONENT */}
              <Grid item
                lg={8}
                md={6}
                xl={9}
                xs={12}>
                  <HeroGraph
                    {...activeGraphData}
                    activeStat={activeStat}
                    setActiveStat={setActiveStat}
                  />
              </Grid>

              {/* THIS IS THE GROUPED ASSET STATS COMPONENT */}
              <Grid item
                lg={5}
                md={6}
                xl={4}
                xs={12}>
                  {activePortfolio !== 0 && <GroupedAssets assets={dashboardState[activePortfolio].assets} />}
              </Grid>

              {/* THIS IS THE INDIVIDUAL ASSET STATS COMPONENT */}
              <Grid item
                lg={7}
                md={6}
                xl={8}
                xs={12}>
                  {activePortfolio !== 0 && <IndividualAssets assets={dashboardState[activePortfolio].assets} />}
              </Grid>
            </Grid>
          </Container>
        </>
      );
    }

    return (<div>Unauthorized user</div>);
  };


  return (
  <>
    <Head>
      <title>
        Dashboard | Spector Trades
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >


        {authorizedDashboard()}
    </Box>
  </>
);};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
