import React, { useEffect, useState } from "react";


const useBadgeGraphDataHook = (activeStat, setStatsLoading, dashboardState, activePortfolio, statsData, assetPerformance, loading) => {
  const [activeGraphData, setActiveGraphData] = useState({
    options: {},
    series: []
  });
  useEffect(() => {
    const data = [];
    const xData = [];
    let tmp = [];
    let yMax, yMin;
    let graphName, graphType, xAxis, yAxis, chartSettings;
    if (activeStat === 'spec_money') {
      graphType = 'area';
      graphName = "Speculative money"
      yMin = 0;
      yMax = (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) + (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) * 0.1)) / 100;

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
  
      const startIndex = data.find(value => {
        value === (Number(dashboardState[activePortfolio].portfolioInfo.spec_money) / 100);
      })
      if (startIndex !== 0) {
        data.reverse()
      }
      console.log("FIRST: ", data)

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
    Object.keys(assetPerformance.stocks).length > 0
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
      assetPerformance.stocks[dates[0].symbol].forEach((day, i) => {
        let testDate = new Date(new Date(dates[0].date).setHours(0, 0, 0, 0))
        if (day.datetime.getTime() === testDate.getTime()) {
          graphStartDate = i;
        }
      })

      const profitForAsset = {};
      portfolioData.assets.forEach(asset => {
        if (asset.type === 'Stocks') {
          profitForAsset[asset.symbol] = {};
          assetPerformance.stocks[asset.symbol].forEach((day, i) => {
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
      assetPerformance.stocks[dates[0].symbol].forEach((day, i) => {
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
      data.length !== 0 && data.reverse();
    }
    if (activeStat === "crypto_profit"  &&
    dashboardState[activePortfolio] !== undefined &&
    statsData[activePortfolio] !== undefined &&
    Object.keys(assetPerformance.crypto).length > 0
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
      let portfolioData = statsData[activePortfolio]
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
      if (dates[0] === undefined) {
        return;
      }
      assetPerformance.crypto[dates[0].name] && assetPerformance.crypto[dates[0].name].forEach((day, i) => {
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
          if (assetPerformance.crypto[asset.name] !== undefined) {
            assetPerformance.crypto[asset.name].forEach((day, i) => {
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
      assetPerformance.crypto[dates[0].name] && assetPerformance.crypto[dates[0].name].forEach((day, i) => {
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
    data.length !== 0 && data.reverse();
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
  }, [activeStat, loading, activePortfolio]);

  return {activeGraphData, setActiveGraphData}
};

module.exports = {useBadgeGraphDataHook};
