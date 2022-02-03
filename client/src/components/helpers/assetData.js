const getCryptoData = (dashboardState) => {

  const portfolioData = Object.values(dashboardState);
  const allAssets = new Set();
  console.log(portfolioData)

  portfolioData.forEach(portfolio => {
    const assets = Object.values(portfolio.assets);

    assets.forEach(asset => {
      if (asset.type === 'Cryptocurrency') {
        allAssets.add(asset.name);
      }
    });
  });
  console.log("assets: ", Array.from(allAssets))
  // cryptoAssets.forEach(asset => {
  //   axios.post('api/cryptoHistorical', {id: asset.name}).then(res => {
  //     if (assetData.crypto === undefined) {
  //       assetData['crypto'] = {};
  //     }
  //     const cryptoData = res.data.reverse();
  //     assetData.crypto[asset.name] = [];
  //     cryptoData.forEach((day, index) => {
  //       const currentDay = new Date(new Date(day[0]).setHours(0, 0, 0, 0));
  //       if (currentDay.getTime() >= oldestDate.getTime()) {
  //         assetData.crypto[asset.name].push({date: new Date(new Date(day[0]).setHours(0, 0, 0, 0)), data: day[1]});
  //       }
  //     });
  //     setAssetPerformanceCrypto(prev => {
  //       return {crypto: assetData.crypto}
  //     })
  //   }).catch(err => console.log("ERROR in getHistoricalCrypto: ", err));

  // })
};


module.exports = {
  getCryptoData
};
