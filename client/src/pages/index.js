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
  const [activeStat, setActiveStat] = useState("");
  const [assetPerformance, setAssetPerformance] = useState(null);
  const [currencyConversion, setCurrencyConversion] = useState({});
  // console.log("activeStat: ", activeStat)
  // console.log("asset performance: ", assetPerformance);
  // console.log("active graph: ", activeGraphData);
  // console.log("activePortfolio: ", activePortfolio);
  // console.log("dashboardState: ", dashboardState);
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

  const getAssetPerformanceData = () => {
    const cryptoAssets = [];
    const stockAssets = [];
    const portfolioData = Object.values(dashboardState);
    const portfolioCreatedAt = [];
    const assetData = {stocks: {}, crypto: {}};

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
    console.log("STOCK ASSETS: ", stockAssets)
    portfolioCreatedAt.sort(function(a, b) {
      return Date.parse(a) - Date.parse(b);
    });

    const oldestDate = new Date(new Date(portfolioCreatedAt[0]).setHours(0, 0, 0, 0));
    if (stockAssets.length > 0) {
      const stockNames = [];
      stockAssets.forEach((stock) => {
        stockNames.push(stock.name);
      });
    }
    axios.post('api/stockHistorical', {id: stockNames})
      .then(res => {
        const stockData = res.data;
        const stockDataKeys = Object.keys(stockData);
        stockDataKeys.forEach(key => {
          if (stockNames.includes(key)) {
            if (stockNames.length === 1) {
              const stockPriceValues = stockData[key];
              assetData.stocks[key] = [];
              stockPriceValues.forEach(price => {
                price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
                price.close = currencyConversion.CAD * Number(price.close);
                price.high = currencyConversion.CAD * Number(price.high);
                price.low = currencyConversion.CAD * Number(price.low);
                price.open = currencyConversion.CAD * Number(price.open);
                assetData.stocks[key].push(price);
              });
            } else {
              const stockPriceValues = stockData[key].values;
              assetData.stocks[key] = [];
              stockPriceValues.forEach(price => {
                price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
                price.close = currencyConversion.CAD * Number(price.close);
                price.high = currencyConversion.CAD * Number(price.high);
                price.low = currencyConversion.CAD * Number(price.low);
                price.open = currencyConversion.CAD * Number(price.open);
                assetData.stocks[key].push(price);
              });

            }
          }
        });
      })
      .catch(err => {console.log("ERR IN STOCKS HISTORICAL: ", err)})
    cryptoAssets.forEach(asset => {
      axios.post('api/cryptoHistorical', {id: asset.name}).then(res => {

        assetData.crypto[asset.name] = [];
        res.data.forEach((day, index) => {
          const currentDay = new Date(new Date(day[0]).setHours(0, 0, 0, 0));
          if (currentDay.getTime() >= oldestDate.getTime()) {
            assetData.crypto[asset.name].push({date: new Date(new Date(day[0]).setHours(0, 0, 0, 0)), data: day[1]});
          }
        });

      }).catch(err => console.log("ERROR in getHistoricalCrypto: ", err));
    })
    setAssetPerformance(assetData);
      console.log("assetData: ", assetData)
      console.log("dashboardState: ", dashboardState)
      console.log("assetPerformance: ", assetPerformance)
    };

    useEffect(() => {


        assetPerformance && parseStats(assetPerformance, dashboardState);
    }, [assetPerformance]);


  const parseStats = (assetPerformance, dashboardState) => {
    const assetData = assetPerformance;
    console.log("______________________________________________________")
    console.log("assetPerformance to parseStats: ", assetPerformance['stocks']['BLNK'])
    console.log("dashboardState to parseStats: ", dashboardState)
    const dashboardWithStats = {};
    const monthAgo = new Date(new Date().setHours(0, 0, 0, 0))
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setDate(monthAgo.getDate() - 2);

    const dashboards = Object.values(dashboardState);
    dashboards.forEach(dashboard => {
      const assetOrders = [];
      let totalInvested = 0;
      let currentValue = 0;
      let noAssets = false;
      let lastMonthValue = 0;
      let lastMonthSpent = 0;
      let lastMonthProfit = 0;
      let existedLastMonth = false;
      let currentProfit;
      console.log("dashboard: ", dashboard)
      // console.log("HERE: ", dashboard.total_stock_assets)
      totalInvested = centsToDollars(dashboard.total_stock_assets)
      dashboardWithStats[dashboard.portfolioInfo.id] = dashboard;

      assetPerformance && dashboard.assets.forEach(asset => {
        console.log("asset symbol: ", assetPerformance["stocks"]['BLNK'])
        console.log("asset performance: ", assetPerformance.stocks)

        console.log("asset performance: ", assetPerformance.stocks.BLNK)
        if (asset.type === 'Stocks') {
          assetOrders.push({
            ...asset,
            initialCostDollars: centsToDollars((asset.price_at_purchase) * asset.units),
            currentPrice: assetPerformance.stocks[asset.symbol][0].close
          });
          if (asset.sold) {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthValue -= assetPerformance.stocks[asset.symbol][20].close * asset.units;
            }
            currentValue -= (assetPerformance.stocks[asset.symbol][0].close) * asset.units;
          } else {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthValue += assetPerformance.stocks[asset.symbol][20].close * asset.units;
            }
            currentValue += (assetPerformance.stocks[asset.symbol][0].close) * asset.units;
          }
        }
        assetOrders.forEach(asset => {
          if (!asset.sold) {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthSpent +=  asset.units * asset.price_at_purchase
            }
          } else {
            if (new Date(asset.created_at) <= monthAgo.getTime()) {
              lastMonthSpent -=  asset.units * asset.price_at_purchase
            }
          }
        });
        console.log(lastMonthValue)
      });
      lastMonthSpent = (lastMonthSpent / 100).toFixed(2);
      dashboardWithStats[dashboard.portfolioInfo.id]["last_month_growth_stocks"] = lastMonthSpent - lastMonthValue;
      console.log("FOR DASHBOARD: ", dashboard.portfolioInfo.name)
      console.log("monthAgo: ", monthAgo)
      console.log("assetOrders: ", assetOrders)
      console.log("totalInvested: ", totalInvested)
      console.log("currentValue: ", currentValue)
      console.log("lastMonthValue: ", lastMonthValue)
      console.log("lastMonthSpent: ", lastMonthSpent)
      console.log("lastMonthProfit: ", lastMonthProfit)
      console.log("currentProfit: ", currentProfit)
      console.log("dashboardWithStats: ", dashboardWithStats)
    })
  };


  useEffect(() => {
    const data = [];
    const xData = [];
    let tmp = [];
    let yMax;
    if (activeStat === 'spec_money') {
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

    if (activeStat === "growth") {

    }
    setActiveGraphData({
      series: [{
        name: "Spec money",
        data,
      }],
      options: {
        stroke: {
          show: true,
          curve: activeStat ? 'straight' : 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        chart: {
          type: 'area',
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
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          max: yMax,
          labels: {
            formatter: function (val) {
              return val.toFixed();
            },
          },
          title: {
            text: 'Price'
          },
        },
        xaxis: {
          type: 'datetime',
          name: 'date',
          categories: xData
        },
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
  }, [activeStat, assetPerformance]);
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
  }, [currencyConversion])

  // useEffect, use axios to call the auth endpoint using our jwt token
  // auth endpoint validates the token, if returns true.. setIsAuthorized to true
  //
    // if (!isAuthorized) {
    //   console.log("is authed: ", isAuthorized)
    //   console.log("has authorized token");
    //   return <div>Unauthorized user</div>
    // }

  const parseGraphData = (activePortfolio) => {
    setActiveGraphData({
      series: [{
        name: "price",
        data: [6629.81, 6632.01]
      }],
      options: {
        chart: {
          type: 'area',
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
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val;
            },
          },
          title: {
            text: 'Price'
          },
        },
        xaxis: {
          type: 'datetime',
          name: 'date',
          categories: ['01-02-2020', '02-01-2022']
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0)
            }
          }
        }
      }
    });
  };

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
                  <PortfolioStats activePortfolio={activePortfolio} dashboardState={dashboardState[activePortfolio]} setActiveStat={setActiveStat} assetPerformance={assetPerformance}/>
              </Grid>

              {/* THIS IS THE HERO GRAPH COMPONENT */}
              <Grid item
                lg={8}
                md={6}
                xl={9}
                xs={12}>
                  <HeroGraph {...activeGraphData} />
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
