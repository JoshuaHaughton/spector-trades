import axios from 'axios';
import { resolveHref } from 'next/dist/shared/lib/router/router';

const getCryptoData = (dashboardState) => {

  if (Object.keys(dashboardState).length === 0) {
    return;
  }

  return new Promise(function(res, rej) {
    const portfolioData = Object.values(dashboardState);
  const allAssets = new Set();
  const assetData = {};
  const portfolioCreationDates = [];
  console.log(portfolioData)

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

const getStocksData = (dashboardState) => {

};

module.exports = {
  getCryptoData, getStocksData
};
