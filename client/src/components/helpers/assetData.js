import axios from 'axios';

const getCryptoData = (dashboardState) => {

  if (Object.keys(dashboardState).length === 0) {
    return;
  }

  return new Promise(function(res, rej) {
    const portfolioData = Object.values(dashboardState);
    const allAssets = new Set();
    const assetData = {};
    const portfolioCreationDates = [];

    portfolioData.forEach(portfolio => {
      portfolioCreationDates.push(portfolio.portfolioInfo.created_at)
      const assets = Object.values(portfolio.assets);

      assets.forEach(asset => {
        if (asset.type === 'Cryptocurrency') {
          allAssets.add(asset.name);
        }
      });
    });


    portfolioCreationDates.sort(function(a, b) {
      return Date.parse(a) - Date.parse(b);
    });

    const oldestDate = new Date(new Date(portfolioCreationDates[0]).setHours(0, 0, 0, 0));

    Array.from(allAssets).forEach(asset => {
      axios.post('api/cryptoHistorical', {id: asset}).then(res => {
        if (!res.data) {
          rej();
        }
        const cryptoData = res.data.reverse();
        assetData[asset] = [];
        cryptoData.forEach((day, index) => {
          const currentDay = new Date(new Date(day[0]).setHours(0, 0, 0, 0));
          if (currentDay.getTime() >= oldestDate.getTime()) {
            assetData[asset].push({date: new Date(new Date(day[0]).setHours(0, 0, 0, 0)), data: day[1]});
          }
        });
      }).catch(err => console.log("ERROR in getHistoricalCrypto: ", err));
    })

    res(assetData);
  })
};

const getStocksData = (dashboardState, currencyConversion) => {
  if (Object.keys(dashboardState).length === 0) {
    return;
  }

  return new Promise(function(res, rej){
    const portfolioData = Object.values(dashboardState);
    const allAssets = new Set();
    const assetData = {};
    const portfolioCreationDates = [];

    portfolioData.forEach(portfolio => {
      portfolioCreationDates.push(portfolio.portfolioInfo.created_at)
      const assets = Object.values(portfolio.assets);

      assets.forEach(asset => {
        if (asset.type === 'Stocks') {
          allAssets.add(asset.symbol);
        }
      });
    });

    portfolioCreationDates.sort(function(a, b) {
      return Date.parse(a) - Date.parse(b);
    });

    const oldestDate = new Date(new Date(portfolioCreationDates[0]).setHours(0, 0, 0, 0));
    const stockNames = Array.from(allAssets);
    axios.post('api/stockHistorical', {id: stockNames})
    .then(res => {

      const stockData = res.data;
      const stockDataKeys = Object.keys(stockData);
      stockDataKeys.forEach(key => {
        if (stockNames.includes(key)) {
          if (stockNames.length === 1) {
            const stockPriceValues = stockData[key];
            assetData[key] = [];
            stockPriceValues.forEach(price => {
              price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
              price.close = currencyConversion.CAD * Number(price.close);
              price.high = currencyConversion.CAD * Number(price.high);
              price.low = currencyConversion.CAD * Number(price.low);
              price.open = currencyConversion.CAD * Number(price.open);
              assetData[key].push(price);
            });
          } else {
            const stockPriceValues = stockData[key].values;
            assetData[key] = [];
            stockPriceValues.forEach(price => {
              price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
              price.close = currencyConversion.CAD * price.close;
              price.high = currencyConversion.CAD * price.high;
              price.low = currencyConversion.CAD * price.low;
              price.open = currencyConversion.CAD * price.open;
              assetData[key].push(price);
            });

          }
        }
      });

    })
    .catch(err => {
      console.log("ERR IN STOCKS HISTORICAL: ", err)
      rej("ERR IN STOCKS HISTORICAL: ", err)
    });
    res(assetData)
  });
};

module.exports = {
  getCryptoData, getStocksData
};
