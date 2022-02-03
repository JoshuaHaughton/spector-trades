import axios from 'axios';

const getCryptoData = (dashboardState) => {

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
  console.log("assets: ", Array.from(allAssets))

  portfolioCreationDates.sort(function(a, b) {
    return Date.parse(a) - Date.parse(b);
  });
  console.log("portfolio creation dates: ", portfolioCreationDates)
  const oldestDate = new Date(new Date(portfolioCreationDates[0]).setHours(0, 0, 0, 0));
  console.log("oldest date: ", oldestDate)

  Array.from(allAssets).forEach(asset => {
    axios.post('api/cryptoHistorical', {id: asset}).then(res => {
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
  console.log("completed Data: ", assetData)
};


module.exports = {
  getCryptoData
};
