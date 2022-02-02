import Head from 'next/head';

import { useRouter } from 'next/router';

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
import { parseCryptoStats } from '../components/helpers/graphDataProfit'
import { SpectorSpeedDial } from 'src/components/spector-dashboard/speed-dial';
const Dashboard = () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

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
  const [plusMinus, setPlusMinus] = useState({stock: {}, crypto: {}});

  // TODO: REFACTOR!
  const refreshDashboardState = () => {
    const fetchData = async () => {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        const response = await api.get('/dashboard', config).then(response => {
          if (response.status === 200) {
            setDashboardState(response.data);
            if (!activePortfolio) {
              // Set activePortfolio to the first one
              setActivePortfolio(Object.values(response.data).map(p => p.portfolioInfo)[0].id);
            }
            return response.data;
          }
        }).then(response => {
          // Check if need to make plusMinus update
          const cryptoAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Cryptocurrency")).flat();
          const stockAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Stocks")).flat();

          const cryptoReduce = cryptoAssets.reduce((prev, curr) => {
            const newObj = {...prev};
            newObj[curr.name] = 0;
            return newObj;
          }, {});

          const stockReduce = stockAssets.reduce((prev, curr) => {
            const newObj = {...prev};
            newObj[curr.symbol] = 0;
            return newObj;
          }, {});

          const cryptoDifference = Object.keys(cryptoReduce).filter(x => Object.keys(plusMinus.crypto).indexOf(x) === -1);
          const stockDifference = Object.keys(stockReduce).filter(x => Object.keys(plusMinus.stock).indexOf(x) === -1);
          console.log('cryptoDifference', cryptoDifference, 'stockDifference', stockDifference);

          if (cryptoDifference.length > 0) {
            // axios.post('/api/crypto-plus-minus', {id: cryptoDifference}).
            // then(res => setPlusMinus(prev => {
            //   const newCopy = {...prev};
            //   for (const name in res.data) {
            //     newCopy.crypto[name] = res.data[name];
            //   }
            //   return newCopy;
            // }));
            cryptoDifference.forEach(name => {
              setPlusMinus(prev => {
                const newCopy = {...prev};
                newCopy.crypto[name] = (-1 * Math.random() * 10 + 1).toPrecision(5);
                return newCopy;
              });
            })

          }

          if (stockDifference.length > 0) {
            axios.post('/api/stock-plus-minus', {id: stockDifference}).
            then(res => setPlusMinus(prev => {
              const newCopy = {...prev};
              for (const symbol in res.data) {
                newCopy.stock[symbol] = res.data[symbol];
              }
              return newCopy;
            }));
          }

        });
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
    // axios.post('api/stockHistorical', {id: stockNames})
    //   .then(res => {
    //     if (assetData.stocks === undefined) {
    //       assetData['stocks'] = {};
    //     }
    //     const stockData = res.data;
    //     const stockDataKeys = Object.keys(stockData);
    //     stockDataKeys.forEach(key => {
    //       if (stockNames.includes(key)) {
    //         if (stockNames.length === 1) {
    //           const stockPriceValues = stockData[key];
    //           assetData.stocks[key] = [];
    //           stockPriceValues.forEach(price => {
    //             price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
    //             price.close = currencyConversion.CAD * Number(price.close);
    //             price.high = currencyConversion.CAD * Number(price.high);
    //             price.low = currencyConversion.CAD * Number(price.low);
    //             price.open = currencyConversion.CAD * Number(price.open);
    //             assetData.stocks[key].push(price);
    //           });
    //         } else {
    //           const stockPriceValues = stockData[key].values;
    //           assetData.stocks[key] = [];
    //           stockPriceValues.forEach(price => {
    //             price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
    //             price.close = currencyConversion.CAD * price.close;
    //             price.high = currencyConversion.CAD * price.high;
    //             price.low = currencyConversion.CAD * price.low;
    //             price.open = currencyConversion.CAD * price.open;
    //             assetData.stocks[key].push(price);
    //           });

    //         }
    //       }
    //     });
    //     setAssetPerformanceStocks({stocks: assetData['stocks']})
    //   })
    //   .catch(err => {console.log("ERR IN STOCKS HISTORICAL: ", err)})
      cryptoAssets.forEach(asset => {
      axios.post('api/cryptoHistorical', {id: asset.name}).then(res => {
        if (assetData.crypto === undefined) {
          assetData['crypto'] = {};
        }
        const cryptoData = res.data.reverse();
        assetData.crypto[asset.name] = [];
        cryptoData.forEach((day, index) => {
          const currentDay = new Date(new Date(day[0]).setHours(0, 0, 0, 0));
          if (currentDay.getTime() >= oldestDate.getTime()) {
            assetData.crypto[asset.name].push({date: new Date(new Date(day[0]).setHours(0, 0, 0, 0)), data: day[1]});
          }
        });
        console.log(assetData)
        const parsedAssetData = parseCryptoStats(assetData.crypto, dashboardState);
        setAssetPerformanceCrypto(prev => {
          return {crypto: assetData.crypto}
        })
      }).catch(err => console.log("ERROR in getHistoricalCrypto: ", err));

    })
    };

    useEffect(() => {
        if (assetPerformanceStocks.stocks !== undefined && assetPerformanceCrypto.crypto !== undefined) {
          parseStats(assetPerformanceStocks, assetPerformanceCrypto, dashboardState);
        }
    }, [assetPerformanceStocks, assetPerformanceCrypto]);


  const parseStats = (assetPerformanceStocks, assetPerformanceCrypto, dashboardState) => {

    if (assetPerformanceStocks.stocks === undefined || assetPerformanceCrypto.crypto === undefined) {
      return;
    }
    const dashboardWithStats = {};
    const monthAgo = new Date(new Date().setHours(0, 0, 0, 0))
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setDate(monthAgo.getDate() - 2);

    const dashboards = Object.values(dashboardState);
    dashboards.forEach(dashboard => {
      const assetOrdersStocks = [];
      const assetOrdersCrypto = [];


      let totalInvestedStocks = 0;
      let currentValueStocks = 0;
      let lastMonthValueStocks = 0;
      let lastMonthSpentStocks = 0;
      let currentValueCrypto = 0;
      let lastMonthValueCrypto = 0;
      let lastMonthSpentCrypto = 0;
      totalInvestedStocks = centsToDollars(dashboard.total_stock_assets)
      dashboardWithStats[dashboard.portfolioInfo.id] = dashboard;

      dashboard.assets.forEach(asset => {

        if (asset.type === 'Stocks' && Object.keys(assetPerformanceStocks.stocks).length > 0) {

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

      setStatsData(dashboardWithStats);
    })
  };
  useEffect(() => {
    if (activeStat === 'stock_profit' && Object.keys(assetPerformanceStocks.stocks).length === 0) {
      getAssetPerformanceData();
      return;
    }
    const data = [];
    const xData = [];
    let tmp = [];
    let yMax, yMin;
    let graphName, graphType, xAxis, yAxis, chartSettings;
    if (activeStat === 'spec_money') {
      graphType = 'area';
      graphName = "Speculative money"
      yMin = 0;
      yMax = (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) + (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) * 0.1)) / 100
      data.push((Number(dashboardState[activePortfolio].portfolioInfo.spec_money)) / 100)
      xData.push(dashboardState[activePortfolio].portfolioInfo.created_at)
      const purchasedAssets = dashboardState[activePortfolio].assets;
      purchasedAssets.sort(function(a, b) {
        return Date.parse(a.created_at) - Date.parse(b.created_at);
      });
      purchasedAssets.forEach((item, i) => {
        if (!item.sold) {
          data.push((data[i] - ((item.price_at_purchase * item.units) / 100)))
        }

        if (item.sold) {
          data.push((data[i] - ((item.price_at_purchase * item.units) / 100)))
        }
        xData.push(item.created_at)
      });
      xData.sort(function(a, b) {
        return Date.parse(a) - Date.parse(b);
      });
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
        labels: {
          formatter: function (val) {
            return val.toFixed();
          },
        },
        title: {
          text: 'Mount of Spec money'
        },
      }
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
      graphType = 'area';
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
      let portfolioData = statsData[activePortfolio]
      let portfolioStartedOn = new Date(new Date(dashboardState[activePortfolio].portfolioInfo.created_at).setHours(0, 0, 0, 0))
      let earliestInvestment;
      const dates = [];
      portfolioData.assets.forEach(asset => {

        if (asset.type === "Stocks") {
          dates.push({symbol: asset.symbol, name: asset.name, date: asset.created_at})
        }
      })
      dates.sort(function(a, b) {
        return Date.parse(a.date) - Date.parse(b.date);
      });
      if (!dates[0]) return;
      let graphStartDate;
      assetPerformanceStocks.stocks[dates[0].symbol].forEach((day, i) => {
        let testDate = new Date(new Date(dates[0].date).setHours(0, 0, 0, 0))
        if (day.datetime.getTime() === testDate.getTime()) {
          graphStartDate = i;
        }
      })

      const profitForAsset = {};
      portfolioData.assets.forEach(asset => {
        if (asset.type === 'Stocks') {
          profitForAsset[asset.symbol] = {};
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

      const profitForAssetKeys = Object.keys(profitForAsset);
      const overallProfit = [];
      assetPerformanceStocks.stocks[dates[0].symbol].forEach((day, i) => {
        let totalProfitOpen = 0;
        let totalProfitClose = 0;
        if (i <= graphStartDate) {
          profitForAssetKeys.forEach(asset => {

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
      graphType = 'area';
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
      // console.log("ACTIVEPORTFOLIO: ", activePortfolio)
      // console.log("DASHBOARDSTATE: ", dashboardState)
      let portfolioData = statsData[activePortfolio]
      // console.log("CHECH HERE: ", portfolioData)
      let portfolioStartedOn = new Date(new Date(dashboardState[activePortfolio].portfolioInfo.created_at).setHours(0, 0, 0, 0))
      const dates = [];
      portfolioData.assets.forEach(asset => {
        if (asset.type === "Cryptocurrency") {
          dates.push({symbol: asset.symbol, name: asset.name, date: asset.created_at})
        }
      })
      dates.sort(function(a, b) {
        return Date.parse(a.date) - Date.parse(b.date);
      });
      let graphStartDate;
      assetPerformanceCrypto.crypto[dates[0].name] && assetPerformanceCrypto.crypto[dates[0].name].forEach((day, i) => {
        let testDate = new Date(new Date(dates[0].date).setHours(0, 0, 0, 0))
        // testDate.setDate(testDate.getDate() - 1)
        if (day.date.getTime() === testDate.getTime()) {
          graphStartDate = i;
        }
      })
      const profitForAsset = {};
      portfolioData.assets.forEach(asset => {
        if (asset.type === 'Cryptocurrency') {
          profitForAsset[asset.name] = {};
          if (assetPerformanceCrypto.crypto[asset.name] !== undefined) {
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
      const profitForAssetKeys = Object.keys(profitForAsset);
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

      overallProfit.forEach((day, i) => {
        if (i % 2 === 0) {
          data.push({
            x: new Date(day.date),
            y: [day.totalProfitOpen]
          })

        }
      })
    }
    data.length !== 0 && setActiveGraphData({
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
              return (val.toFixed(2));
            }
          }
        }
      }
    });
    setTimeout(() => {setStatsLoading(false)}, 1500)
  }, [activeStat, assetPerformanceCrypto, assetPerformanceStocks, activePortfolio, statsData]);
  // /auth endpoint returns {success: true, token}
  useEffect(() => {

    //originally async
    const fetchData = async () => {
      try {
        const token = cookies.spector_jwt;
        const config = {
          headers: { Authorization: `Bearer ${token}`}
        };
        api.get('/dashboard', config).then(response => {
          if (response.status === 200) {



            setDashboardState(response.data);
            setIsAuthorized(true);
            // get id of first portfolio
            setActivePortfolio(Object.values(response.data).map(p => p.portfolioInfo)[0].id);

            setLoading(false);
            parseGraphData(activePortfolio);




            return response.data;
          }
        }).then(response => {

          if (response) {

            console.log('why dont u work');
            // START OF GET + / - DATA
            const cryptoAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Cryptocurrency")).flat();
            const stockAssets = Object.values(response).map(p => p.assets.filter(a => a.type === "Stocks")).flat();

            const cryptoReduce = cryptoAssets.reduce((prev, curr) => {
              const newObj = {...prev};
              newObj[curr.name] = 0;
              return newObj;
            }, {});

            const stockReduce = stockAssets.reduce((prev, curr) => {
              const newObj = {...prev};
              newObj[curr.symbol] = 0;
              return newObj;
            }, {});

            // console.log('plus minus: ', cryptoAssets, stockAssets, Object.keys(cryptoReduce));

            if (Object.keys(cryptoReduce).length > 0) {
              console.log("SHOULD FAKE THE DATA here");
              Object.keys(cryptoReduce).forEach(id => {
                // axios.post('/api/crypto-plus-minus', {id}).
                // then(res => setPlusMinus(prev => {
                //   const newCopy = {...prev};
                //   newCopy.crypto[id] = res.data.plusMinus;
                //   return newCopy;
                // }));
                setPlusMinus(prev => {
                    const newCopy = {...prev};
                    newCopy.crypto[id] = (-1 * Math.random() * 10 + 1).toPrecision(5);
                    return newCopy;
                  });

              })

            }

            if (Object.keys(stockReduce).length > 0) {
              axios.post('/api/stock-plus-minus', {id: Object.keys(stockReduce)}).
              then(res => setPlusMinus(prev => {
                const newCopy = {...prev};
                newCopy.stock = res.data;
                return newCopy;
              }));
            }
            // END OF GET + / - DATA

          }

        }).catch(() => {
          // Response rejected

          // router.push('/home');
          setTimeout(() => {setLoading(false)}, 1000);
        });
      } catch(err) {
      }
    };

    fetchData().then(res => {
      axios.get('/api/currencyConversion')
      .then((resp) => {
        setCurrencyConversion(resp.data);
        getAssetPerformanceData();
      })
      .catch(err => {
        console.log("ERROR in currencyConversion call: ", err)
      });
    });

    refreshDashboardState(); // THIS IS FOR PLUS MINUS DEMO, WILL REMOVE LATER
  }, []);

  useEffect(() => {
    getAssetPerformanceData();
  }, [dashboardState])


  const createAssetGraphData = (data, name, exitPoint) => {
    let nameLabel = 'Asset';
    if (name) {
      nameLabel = name;
    }

    const seriesOptions = {
      series: [{
        name: "price",
        data: data,
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
          text: `${nameLabel} Price Movement`,
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
              if (val < 1) {
                return val.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
              }
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
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMM \'yy',
              day: 'dd MMM',
              hour: 'HH:mm'
            }
          }
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return val
            }
          }
        }
      }
    };


    if (exitPoint && exitPoint > 0) {
      console.log('there is an exit point');
      seriesOptions.options['annotations'] = {
        yaxis: [
          {
            y: (exitPoint / 100),
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                color: '#fff',
                background: '#00E396'
              },
              text: `Exit point @ ${exitPoint / 100}`
            }
          }
        ]
      }
    }
    //const dataDates = data.map(d => [new Date(d[0]), d[1]]);
    setActiveGraphData(seriesOptions);
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

    if (isAuthorized && Object.keys(dashboardState).length === 0) {
      return (
        <SpectorSpeedDial
          refreshDashboardState={refreshDashboardState}
        />
      );

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
            unsoldAssets={
              Object.values(dashboardState).map(p => p.assets).flat(1).filter(a => a.sold === false)
            }
          />

          {/* THIS IS THE PORTFOLIO TAB */}
          <Container maxWidth={false}>
            <PortfolioTabs
              portfolios={
                Object.values(dashboardState).map(portfolio => portfolio.portfolioInfo)
              }
              {...{activePortfolio, setActivePortfolio, getAssetPerformanceData}}
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
                    graphData={activeGraphData}
                    activePortfolio={activePortfolio}
                    dashboardState={dashboardState[activePortfolio]}
                    setActiveStat={setActiveStat}
                    statsData={statsData}
                    statsLoading={statsLoading}
                    {...activeGraphData}
                  />
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
                    statsLoading={statsLoading}
                  />
              </Grid>

              {/* THIS IS THE GROUPED ASSET STATS COMPONENT */}
              <Grid item
                lg={5}
                md={6}
                xl={4}
                xs={12}>
                  {activePortfolio !== 0 && <GroupedAssets assets={dashboardState[activePortfolio].assets} createAssetGraphData={createAssetGraphData} />}
              </Grid>

              {/* THIS IS THE INDIVIDUAL ASSET STATS COMPONENT */}
              <Grid item
                lg={7}
                md={6}
                xl={8}
                xs={12}>
                  {activePortfolio !== 0 && <IndividualAssets assets={dashboardState[activePortfolio].assets} createAssetGraphData={createAssetGraphData} plusMinus={plusMinus} />}
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
