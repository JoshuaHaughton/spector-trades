import axios from 'axios';
/**
 * 
 * @param {*} dashboardState Portfolio data for the logged in User
 * @returns object containing all crypto assets as keys with their performance overtime as values
 */
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
        const cryptoData = res.data.reverse();
        if (cryptoData.length === 0) {
          rej("Error in receiving data from cryptoHistorical")
          return;
        }
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

/**
 * 
 * @param {*} dashboardState Portfolio data for the logged in User
 * @param {*} currencyConversion Object containing conversion data
 * @returns object containing all stock assets as keys with their performance overtime as values
 */

const getStocksData = (dashboardState, currencyConversion) => {

  if (Object.keys(dashboardState).length === 0) {
    return;
  }

  return new Promise(function(res, rej){
    const portfolioData = Object.values(dashboardState);
    const allAssets = new Set();
    const assetData = {};
    const portfolioCreationDates = [];
    const adjustedtoCDN = {};

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
    .then(result => {
      adjustedtoCDN = convertStocksPerformanceToX(currencyConversion, result.data, stockNames);
      res(adjustedtoCDN)
    })
    .catch(err => {
      console.log("ERR IN STOCKS HISTORICAL: ", err)
      rej("ERR IN STOCKS HISTORICAL: ", err)
    });
  });
};

/**
 * 
 * @param {*} currencyConversion Object with keys as country codes values as conversion to CDN dollars
 * @param {*} stockData Data to be converted in object with key as symbol values as performance in USD
 * @param {*} stockNames list of stock names that were searched
 * @returns stockData converted to CDN dollars
 */
const convertStocksPerformanceToX = (currencyConversion, stockData, stockNames) => {
  const output = JSON.parse(JSON.stringify(stockData))
  const stockDataKeys = Object.keys(stockData);
  stockDataKeys.forEach(key => {
    if (stockNames.includes(key)) {
      if (stockNames.length === 1) {
        const stockPriceValues = output[key];
        output[key] = [];
        stockPriceValues.forEach(price => {
          price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
          price.close = currencyConversion.CAD * Number(price.close);
          price.high = currencyConversion.CAD * Number(price.high);
          price.low = currencyConversion.CAD * Number(price.low);
          price.open = currencyConversion.CAD * Number(price.open);
          output[key].push(price);
        });
      } else {
        const stockPriceValues = output[key].values;
        output[key] = [];
        stockPriceValues.forEach(price => {
          price.datetime = new Date(new Date(price.datetime).setHours(0, 0, 0, 0))
          price.close = currencyConversion.CAD * price.close;
          price.high = currencyConversion.CAD * price.high;
          price.low = currencyConversion.CAD * price.low;
          price.open = currencyConversion.CAD * price.open;
          output[key].push(price);
        });

      }
    }
  });
  return output;
};

module.exports = {
  getCryptoData, getStocksData
};
