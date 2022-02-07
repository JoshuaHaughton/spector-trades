import { centsToDollars } from "src/utils/toHumanDollars";

/**
 * 
 * @param {*} assetPerformanceStocks Historical performance of stocks, symbol as key performance as values
 * @param {*} assetPerformanceCrypto Historical performance of crypto, symbol as key performance as values
 * @param {*} portfolios All portfolios of the current user
 * @returns 
 */
const parseProfitStats = (assetPerformanceStocks, assetPerformanceCrypto, portfolios) => {
  const dashboardWithStats = {};
  const monthAgo = new Date(new Date().setHours(0, 0, 0, 0))
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  monthAgo.setDate(monthAgo.getDate() - 2);

  const dashboards = Object.values(portfolios);
  dashboards.forEach(dashboard => {

    const assetOrdersStocks = [];
    const assetOrdersCrypto = [];
    let totalInvestedStocks = centsToDollars(dashboard.total_stock_assets);
    let currentValueStocks = 0;
    let lastMonthValueStocks = 0;
    let lastMonthSpentStocks = 0;
    let currentValueCrypto = 0;
    let lastMonthValueCrypto = 0;
    let lastMonthSpentCrypto = 0;
    dashboardWithStats[dashboard.portfolioInfo.id] = dashboard;
    dashboard.assets.forEach(asset => {
      if (asset.type === 'Stocks') {
        if (!assetPerformanceStocks[asset.symbol]) {
          return false;
        }
        assetOrdersStocks.push({
          ...asset,
          initialCostDollars: centsToDollars((asset.price_at_purchase) * asset.units),
          currentPrice: assetPerformanceStocks[asset.symbol][0].close
        });
        if (asset.sold) {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthValueStocks -= assetPerformanceStocks[asset.symbol][20].close * asset.units;
          }
          currentValueStocks -= (assetPerformanceStocks[asset.symbol][0].close) * asset.units;
        } else {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthValueStocks += assetPerformanceStocks[asset.symbol][20].close * asset.units;
          }
          currentValueStocks += (assetPerformanceStocks[asset.symbol][0].close) * asset.units;
        }
      }
      if (asset.type === 'Cryptocurrency') {
        if (!assetPerformanceCrypto[asset.name]) {
          return false;
        }
        // console.log("TROUBLE: ", assetPerformanceCrypto[asset.name])
        // console.log("TROUBLE ASSETDATA: ", assetPerformanceCrypto)
        // console.log("TROUBLE ASSET NAME: ", asset.name)
        assetOrdersCrypto.push({
          ...asset,
          initialCostDollars: centsToDollars((asset.price_at_purchase) * asset.units),
          currentPrice: assetPerformanceCrypto[asset.name][0].data
        });
        if (asset.sold) {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthValueCrypto -= assetPerformanceCrypto[asset.name][20].data * asset.units;
          }
          currentValueCrypto -= (assetPerformanceCrypto[asset.name][0].data) * asset.units;
        } else {
          if (new Date(asset.created_at) <= monthAgo.getTime()) {
            lastMonthValueCrypto += assetPerformanceCrypto[asset.name][20].data * asset.units;
          }
          currentValueCrypto += (assetPerformanceCrypto[asset.name][0].data) * asset.units;
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
  })
  return dashboardWithStats;
};

module.exports = {
  parseProfitStats
};
